import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from "@/lib/auth";

// GET all portfolio holdings for the user
export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const holdings = await prisma.portfolioHolding.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    // --- START LIVE PRICE FETCHING ---
    const holdingsToUpdate = holdings.filter(h => h.isApiLinked && h.category === 'crypto' && h.ticker);
    if (holdingsToUpdate.length > 0) {
      // NOTE: This is a simplification. Mapping ticker to a robust coingecko_id would be better.
      // We are using the full asset name (e.g., "Bitcoin") to look up the ID.
      const coinIds = holdingsToUpdate.map(h => h.assetName.toLowerCase()).join(',');
      try {
        const priceResponse = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=usd`);
        if (priceResponse.ok) {
          const priceData = await priceResponse.json();
          
          const priceUpdates = holdingsToUpdate.map(holding => {
            const price = priceData[holding.assetName.toLowerCase()]?.usd;
            if (price) {
              // Update in-memory object for immediate response
              holding.priceUsd = price;
              // Return a promise to update the database
              return prisma.portfolioHolding.update({
                where: { id: holding.id },
                data: { priceUsd: price },
              });
            }
            return null;
          }).filter(Boolean);

          // Asynchronously update all prices in the database
          if (priceUpdates.length > 0) {
            Promise.all(priceUpdates).catch(err => console.error("Error updating prices in DB:", err));
          }
        }
      } catch (apiError) {
        console.error("Error fetching from CoinGecko API:", apiError);
        // Non-fatal: proceed with stale data from DB
      }
    }
    // --- END LIVE PRICE FETCHING ---

    // Calculate summary
    const totalValue = holdings.reduce((sum, h) => sum + (h.quantity * h.priceUsd), 0);
    const totalAssets = holdings.length;
    const categoryBreakdown: Record<string, number> = {};
    
    holdings.forEach(h => {
      const value = h.quantity * h.priceUsd;
      categoryBreakdown[h.category] = (categoryBreakdown[h.category] || 0) + value;
    });

    const summary = {
      totalValue,
      totalAssets,
      categoryBreakdown
    };

    return NextResponse.json({ success: true, holdings, summary });
  } catch (error) {
    console.error('Error fetching portfolio holdings:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST a new portfolio holding
export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { 
      assetName, 
      ticker, 
      quantity, 
      priceUsd, 
      category, 
      notes,
      yieldRate,
      isApiLinked,
      currency
    } = body;

    if (!assetName || quantity === undefined || (priceUsd === undefined && !isApiLinked) || !category) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    let finalPriceUsd = Number(priceUsd);

    // --- START LIVE PRICE ON CREATE ---
    if (isApiLinked && category === 'crypto' && ticker) {
        try {
            // NOTE: Simplification, assuming assetName is a valid coingecko ID
            const priceResponse = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${assetName.toLowerCase()}&vs_currencies=usd`);
            if (priceResponse.ok) {
                const priceData = await priceResponse.json();
                const price = priceData[assetName.toLowerCase()]?.usd;
                if (price) {
                    finalPriceUsd = price;
                } else {
                  // Don't block creation, but log that price couldn't be fetched
                  console.warn(`Could not fetch live price for ${assetName}. Using user-provided price or default.`);
                }
            }
        } catch (apiError) {
            console.error(`Error fetching from CoinGecko API for ${assetName}:`, apiError);
            // Non-fatal: proceed with user-provided price
        }
    }
    // --- END LIVE PRICE ON CREATE ---

    const newHolding = await prisma.portfolioHolding.create({
      data: {
        userId: user.id,
        assetName,
        ticker: ticker ? ticker.toUpperCase() : null,
        quantity: Number(quantity),
        priceUsd: finalPriceUsd,
        category,
        notes,
        yieldRate: yieldRate ? Number(yieldRate) : null,
        isApiLinked: Boolean(isApiLinked),
        currency: currency || 'USD'
      },
    });

    return NextResponse.json({ success: true, data: newHolding }, { status: 201 });
  } catch (error) {
    console.error('Error creating portfolio holding:', error);
    if (error instanceof Error && error.name === 'PrismaClientValidationError') {
        return NextResponse.json({ success: false, error: 'Invalid data provided.' }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

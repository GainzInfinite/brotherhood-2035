import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from "@/lib/auth";


export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    let userSettings = await prisma.userSettings.findUnique({
      where: { userId: user.id },
    });

    // If no settings exist, create them with default values
    if (!userSettings) {
      userSettings = await prisma.userSettings.create({
        data: {
          userId: user.id,
          enableFatherhoodModule: false, // Default value
          // Add other default settings here
        },
      });
    }

    return NextResponse.json({ success: true, data: userSettings });
  } catch (error) {
    console.error('Error fetching or creating user settings:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
    const user = await getCurrentUser();

    if (!user) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { 
          enableFatherhoodModule, 
          currency, 
          weightUnit, 
          volumeUnit, 
          timezone 
        } = body;

        // Update UserSettings
        const updatedSettings = await prisma.userSettings.upsert({
            where: { userId: user.id },
            update: {
                enableFatherhoodModule,
                currency,
                weightUnit,
                volumeUnit,
            },
            create: {
                userId: user.id,
                enableFatherhoodModule: enableFatherhoodModule ?? false,
                currency: currency ?? "USD",
                weightUnit: weightUnit ?? "lbs",
                volumeUnit: volumeUnit ?? "liters",
            }
        });

        // Update User timezone if provided
        if (timezone) {
          await prisma.user.update({
            where: { id: user.id },
            data: { timezone }
          });
        }

        return NextResponse.json({ success: true, data: updatedSettings });
    } catch (error) {
        console.error('Error updating user settings:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}

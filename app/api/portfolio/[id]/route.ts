import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const holding = await prisma.portfolioHolding.findUnique({
      where: { id: parseInt(params.id) }
    })

    if (!holding) {
      return NextResponse.json({ success: false, error: 'Holding not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, holding })
  } catch (error) {
    console.error('Error fetching holding:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch holding' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { assetName, ticker, quantity, priceUsd, category, notes } = body

    const holding = await prisma.portfolioHolding.update({
      where: { id: parseInt(params.id) },
      data: {
        assetName,
        ticker,
        quantity: quantity ? parseFloat(quantity) : undefined,
        priceUsd: priceUsd ? parseFloat(priceUsd) : undefined,
        category,
        notes
      }
    })

    return NextResponse.json({ success: true, holding })
  } catch (error) {
    console.error('Error updating holding:', error)
    return NextResponse.json({ success: false, error: 'Failed to update holding' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.portfolioHolding.delete({
      where: { id: parseInt(params.id) }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting holding:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete holding' }, { status: 500 })
  }
}
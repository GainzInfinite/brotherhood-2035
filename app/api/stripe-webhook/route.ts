import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover',
})

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET not configured')
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    )
  }

  let event: Stripe.Event

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  // Handle the event
  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session

      // Extract userId from metadata
      const userId = session.metadata?.userId

      if (!userId) {
        console.error('No userId in session metadata')
        return NextResponse.json(
          { error: 'Missing userId in metadata' },
          { status: 400 }
        )
      }

      // Update user settings to activate membership
      await prisma.userSettings.upsert({
        where: { userId },
        update: {
          isMember: true,
          trialEndDate: null, // Clear trial end date
        },
        create: {
          userId,
          isMember: true,
          trialEndDate: null,
        },
      })

      console.log(`Membership activated for user: ${userId}`)
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Error processing webhook:', err)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

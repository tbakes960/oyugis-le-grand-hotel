import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY
  const webhookSecret   = process.env.STRIPE_WEBHOOK_SECRET

  if (!stripeSecretKey || stripeSecretKey === 'sk_test_placeholder') {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 })
  }
  if (!webhookSecret || webhookSecret === 'whsec_placeholder') {
    console.error('[stripe/webhook] STRIPE_WEBHOOK_SECRET is not set')
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 })
  }

  const signature = request.headers.get('stripe-signature')
  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event
  try {
    const Stripe  = (await import('stripe')).default
    const stripe  = new Stripe(stripeSecretKey, { apiVersion: '2024-06-20' })
    const rawBody = await request.text()
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
  } catch (err) {
    console.warn('[stripe/webhook] Signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    if (event.type === 'payment_intent.succeeded') {
      const intent     = event.data.object
      const bookingRef = intent.metadata?.bookingRef
      if (bookingRef) {
        const booking = await prisma.booking.findFirst({ where: { bookingRef } })
        if (booking) {
          await prisma.booking.update({
            where: { id: booking.id },
            data: {
              paymentStatus: 'PAID',
              status:        'CONFIRMED',
              paymentRef:    intent.id.slice(0, 30),
              paidAt:        new Date(),
              paidAmount:    intent.amount_received / 100,
            },
          })
        }
      }
    }

    if (event.type === 'payment_intent.payment_failed') {
      const intent     = event.data.object
      const bookingRef = intent.metadata?.bookingRef
      if (bookingRef) {
        const booking = await prisma.booking.findFirst({ where: { bookingRef } })
        if (booking) {
          await prisma.booking.update({
            where: { id: booking.id },
            data:  { paymentStatus: 'FAILED' },
          })
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('[stripe/webhook]', err)
    return NextResponse.json({ error: 'Webhook handler error' }, { status: 500 })
  }
}

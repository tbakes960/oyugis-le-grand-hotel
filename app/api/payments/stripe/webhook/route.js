import { NextResponse } from 'next/server'
import { findWhere, updateById } from '@/lib/store'

export const dynamic = 'force-dynamic'

/**
 * POST /api/payments/stripe/webhook
 *
 * Stripe calls this after a payment event (payment_intent.succeeded, etc.).
 * Signature verification via STRIPE_WEBHOOK_SECRET is MANDATORY — without it
 * any attacker can forge a payment confirmation.
 *
 * Setup:
 *   1. In Stripe Dashboard → Developers → Webhooks → Add endpoint
 *   2. URL: https://yourdomain.com/api/payments/stripe/webhook
 *   3. Events: payment_intent.succeeded, payment_intent.payment_failed
 *   4. Copy the signing secret → set STRIPE_WEBHOOK_SECRET in Vercel env vars
 */
export async function POST(request) {
  const stripeSecretKey   = process.env.STRIPE_SECRET_KEY
  const webhookSecret     = process.env.STRIPE_WEBHOOK_SECRET

  if (!stripeSecretKey || stripeSecretKey === 'sk_test_placeholder') {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 })
  }
  if (!webhookSecret) {
    console.error('[stripe/webhook] STRIPE_WEBHOOK_SECRET is not set — rejecting all webhooks')
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 })
  }

  const signature = request.headers.get('stripe-signature')
  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event
  try {
    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(stripeSecretKey, { apiVersion: '2024-06-20' })

    // Raw body is required for signature verification — do NOT parse as JSON first
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
        const [booking] = await findWhere('bookings', b => b.bookingRef === bookingRef)
        if (booking) {
          await updateById('bookings', booking.id, {
            paymentStatus: 'PAID',
            status:        'CONFIRMED',
            paymentRef:    intent.id.slice(0, 30),
            paidAt:        new Date().toISOString(),
            paidAmount:    intent.amount_received / 100, // convert from cents
          })
        }
      }
    }

    if (event.type === 'payment_intent.payment_failed') {
      const intent     = event.data.object
      const bookingRef = intent.metadata?.bookingRef

      if (bookingRef) {
        const [booking] = await findWhere('bookings', b => b.bookingRef === bookingRef)
        if (booking) {
          await updateById('bookings', booking.id, { paymentStatus: 'FAILED' })
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('[stripe/webhook]', err)
    return NextResponse.json({ error: 'Webhook handler error' }, { status: 500 })
  }
}

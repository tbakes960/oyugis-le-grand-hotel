import { NextResponse } from 'next/server'
import { rateLimit, getClientIp } from '@/lib/rateLimit'
import { findWhere } from '@/lib/store'

export const dynamic = 'force-dynamic'

// Rate-limit: 3 payment intent creations per IP per 5 minutes
const intentLimiter = rateLimit({ limit: 3, windowMs: 5 * 60_000 })

/**
 * POST /api/payments/stripe/create-intent
 *
 * PCI DSS COMPLIANCE NOTE:
 * This server NEVER receives, stores, or logs raw card data.
 * The flow is:
 *   1. Client calls this endpoint with a bookingRef to get a PaymentIntent client_secret
 *   2. Client passes client_secret to Stripe.js / Stripe Elements
 *   3. Stripe.js collects card data directly (card data goes Stripe ↔ browser only)
 *   4. Stripe calls /api/payments/stripe/webhook to notify of payment success
 *
 * This server is therefore out of PCI DSS scope for cardholder data.
 */
export async function POST(request) {
  const ip = getClientIp(request)
  if (!intentLimiter.check(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY
  if (!stripeSecretKey || stripeSecretKey === 'sk_test_placeholder') {
    return NextResponse.json({ error: 'Card payments are not configured' }, { status: 503 })
  }

  try {
    const body = await request.json()
    const { bookingRef } = body

    if (!bookingRef || typeof bookingRef !== 'string' || !/^LG-[A-Z0-9]{6}$/.test(bookingRef)) {
      return NextResponse.json({ error: 'Invalid booking reference' }, { status: 400 })
    }

    // Look up the booking to get the correct amount (never trust client-supplied amount)
    const [booking] = await findWhere('bookings', b => b.bookingRef === bookingRef)
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }
    if (booking.paymentStatus === 'PAID') {
      return NextResponse.json({ error: 'Booking is already paid' }, { status: 409 })
    }

    // Amount in KES smallest unit (Stripe uses cents; KES has no sub-unit so ×100)
    const amountCents = Math.round(Number(booking.totalAmount) * 100)
    if (!amountCents || amountCents < 100) {
      return NextResponse.json({ error: 'Invalid booking amount' }, { status: 400 })
    }

    // Dynamic import so Stripe SDK is only loaded when card payments are active
    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(stripeSecretKey, { apiVersion: '2024-06-20' })

    const intent = await stripe.paymentIntents.create({
      amount:   amountCents,
      currency: 'kes',
      metadata: {
        bookingRef:   booking.bookingRef,
        guestName:    booking.guestName,
        roomType:     booking.roomType,
      },
      // Descriptor shown on cardholder's bank statement
      statement_descriptor_suffix: 'OYUGIS HOTEL',
    })

    // Return only the client_secret — never the full intent object
    return NextResponse.json({ clientSecret: intent.client_secret })
  } catch (err) {
    console.error('[stripe/create-intent]', err.message)
    return NextResponse.json({ error: 'Payment setup failed. Please try again.' }, { status: 500 })
  }
}

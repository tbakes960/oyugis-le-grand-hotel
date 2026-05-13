import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { rateLimit, getClientIp } from '@/lib/rateLimit'

export const dynamic = 'force-dynamic'

const intentLimiter = rateLimit({ limit: 3, windowMs: 5 * 60_000 })

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

    const booking = await prisma.booking.findFirst({ where: { bookingRef } })
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }
    if (booking.paymentStatus === 'PAID') {
      return NextResponse.json({ error: 'Booking is already paid' }, { status: 409 })
    }

    const amountCents = Math.round(Number(booking.totalAmount) * 100)
    if (!amountCents || amountCents < 100) {
      return NextResponse.json({ error: 'Invalid booking amount' }, { status: 400 })
    }

    const Stripe = (await import('stripe')).default
    const stripe  = new Stripe(stripeSecretKey, { apiVersion: '2024-06-20' })

    const intent = await stripe.paymentIntents.create({
      amount:   amountCents,
      currency: 'kes',
      metadata: { bookingRef: booking.bookingRef, guestName: booking.guestName, roomType: booking.roomType },
      statement_descriptor_suffix: 'OYUGIS HOTEL',
    })

    return NextResponse.json({ clientSecret: intent.client_secret })
  } catch (err) {
    console.error('[stripe/create-intent]', err.message)
    return NextResponse.json({ error: 'Payment setup failed. Please try again.' }, { status: 500 })
  }
}

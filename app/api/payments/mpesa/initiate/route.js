import { NextResponse } from 'next/server'
import { updateById, findWhere } from '@/lib/store'
import { rateLimit, getClientIp } from '@/lib/rateLimit'

/**
 * POST /api/payments/mpesa/initiate
 *
 * Triggers a Safaricom Daraja STK Push (Lipa na M-Pesa — Buy Goods).
 * Till Number: 944443
 *
 * Required env vars:
 *   MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET,
 *   MPESA_TILL_NUMBER (944443), MPESA_PASSKEY,
 *   MPESA_ENVIRONMENT (sandbox | live), MPESA_CALLBACK_URL
 *
 * Body: { bookingRef, phone, amount }
 */

// Strict rate limit: 3 payment initiations per IP per 5 minutes
const payLimiter = rateLimit({ limit: 3, windowMs: 5 * 60_000 })

const PHONE_RE     = /^\+?[0-9]{9,15}$/
const BOOKING_RE   = /^LG-[A-Z0-9]{6}$/

export async function POST(request) {
  const ip = getClientIp(request)
  if (!payLimiter.check(ip)) {
    return NextResponse.json({ error: 'Too many payment requests. Please wait a few minutes.' }, { status: 429 })
  }

  try {
    const body = await request.json()
    const { bookingRef, phone, amount } = body

    if (!bookingRef || !phone || !amount) {
      return NextResponse.json(
        { error: 'bookingRef, phone and amount are required' },
        { status: 400 }
      )
    }

    // Validate booking reference format to prevent store enumeration
    if (!BOOKING_RE.test(bookingRef)) {
      return NextResponse.json({ error: 'Invalid booking reference format' }, { status: 400 })
    }

    // Validate phone
    const cleanPhone = String(phone).replace(/[\s\-()]/g, '')
    if (!PHONE_RE.test(cleanPhone)) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 })
    }

    // Validate amount
    const parsedAmount = Number(amount)
    if (isNaN(parsedAmount) || parsedAmount < 1 || parsedAmount > 500_000) {
      return NextResponse.json({ error: 'Invalid payment amount' }, { status: 400 })
    }

    const {
      MPESA_CONSUMER_KEY,
      MPESA_CONSUMER_SECRET,
      MPESA_TILL_NUMBER,
      MPESA_PASSKEY,
      MPESA_ENVIRONMENT = 'sandbox',
      MPESA_CALLBACK_URL,
    } = process.env

    // Return graceful message when credentials are not yet configured
    if (!MPESA_CONSUMER_KEY || MPESA_CONSUMER_KEY.startsWith('REPLACE_')) {
      return NextResponse.json(
        {
          error:   'M-Pesa credentials not yet configured.',
          message: 'Please pay via M-Pesa Send Money to Till Number 944443 and present your transaction ID at check-in.',
          till:    '944443',
        },
        { status: 503 }
      )
    }

    const baseUrl = MPESA_ENVIRONMENT === 'live'
      ? 'https://api.safaricom.co.ke'
      : 'https://sandbox.safaricom.co.ke'

    // 1. Get OAuth access token
    const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString('base64')
    const tokenRes = await fetch(
      `${baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
      { headers: { Authorization: `Basic ${auth}` } }
    )
    if (!tokenRes.ok) {
      throw new Error(`M-Pesa OAuth failed: ${tokenRes.status}`)
    }
    const { access_token } = await tokenRes.json()

    // 2. Build STK Push payload for Buy Goods (Till Number)
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:T.Z]/g, '')
      .slice(0, 14)

    const password = Buffer.from(
      `${MPESA_TILL_NUMBER}${MPESA_PASSKEY}${timestamp}`
    ).toString('base64')

    // Normalise phone: strip all non-digits, ensure 254 prefix
    const normalizedPhone = cleanPhone
      .replace(/\D/g, '')
      .replace(/^0/, '254')
      .replace(/^\+/, '')

    const stkPayload = {
      BusinessShortCode: MPESA_TILL_NUMBER,
      Password:          password,
      Timestamp:         timestamp,
      TransactionType:   'CustomerBuyGoodsOnline',  // Buy Goods (Till)
      Amount:            Math.ceil(parsedAmount),
      PartyA:            normalizedPhone,
      PartyB:            MPESA_TILL_NUMBER,
      PhoneNumber:       normalizedPhone,
      CallBackURL:       MPESA_CALLBACK_URL,
      AccountReference:  bookingRef,
      TransactionDesc:   `Room booking ${bookingRef}`,
    }

    // 3. Initiate STK Push
    const stkRes = await fetch(
      `${baseUrl}/mpesa/stkpush/v1/processrequest`,
      {
        method:  'POST',
        headers: {
          Authorization:  `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stkPayload),
      }
    )

    const stkData = await stkRes.json()

    if (stkData.ResponseCode !== '0') {
      return NextResponse.json(
        { error: stkData.CustomerMessage || 'STK Push failed. Please try again.' },
        { status: 400 }
      )
    }

    // 4. Store CheckoutRequestID against the booking for callback matching
    const [booking] = await findWhere('bookings', b => b.bookingRef === bookingRef)
    if (booking) {
      await updateById('bookings', booking.id, {
        mpesaCheckoutId: stkData.CheckoutRequestID,
        paymentStatus:   'AWAITING',
      })
    }

    return NextResponse.json({
      message:           'STK Push sent. Please check your phone and enter your M-Pesa PIN.',
      checkoutRequestId: stkData.CheckoutRequestID,
      till:              MPESA_TILL_NUMBER,
    })
  } catch (err) {
    console.error('[mpesa/initiate POST]', err)
    return NextResponse.json(
      { error: 'Payment initiation failed. Please try again.' },
      { status: 500 }
    )
  }
}

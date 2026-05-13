import { NextResponse } from 'next/server'
import { findWhere, updateById } from '@/lib/store'

/**
 * POST /api/payments/mpesa/callback
 *
 * Safaricom Daraja calls this URL after an STK Push completes.
 * Set MPESA_CALLBACK_URL=https://yourdomain.com/api/payments/mpesa/callback
 * in your production environment variables.
 *
 * Security note: Safaricom does not provide HMAC signatures on callbacks.
 * In production, restrict this endpoint to Safaricom IP ranges at the
 * reverse-proxy / firewall level (see Daraja docs for the current IP list).
 * A shared secret appended to the MPESA_CALLBACK_URL path is also recommended:
 *   MPESA_CALLBACK_URL=https://yourdomain.com/api/payments/mpesa/callback/YOUR_SECRET
 */

// Result codes that Safaricom considers successful
const MPESA_SUCCESS_CODE = 0

export async function POST(request) {
  // Enforce shared secret — MPESA_CALLBACK_SECRET must be configured.
  // Set MPESA_CALLBACK_URL=https://yourdomain.com/api/payments/mpesa/callback?secret=YOUR_SECRET
  const expectedSecret = process.env.MPESA_CALLBACK_SECRET
  if (!expectedSecret || expectedSecret === 'REPLACE_WITH_RANDOM_32_CHAR_STRING') {
    console.error('[mpesa/callback] MPESA_CALLBACK_SECRET not configured — rejecting all callbacks')
    return NextResponse.json({ ResultCode: 1, ResultDesc: 'Rejected' }, { status: 503 })
  }
  const { searchParams } = new URL(request.url)
  const providedSecret = searchParams.get('secret')
  if (!providedSecret || providedSecret !== expectedSecret) {
    console.warn('[mpesa/callback] Rejected callback — invalid or missing secret')
    return NextResponse.json({ ResultCode: 1, ResultDesc: 'Rejected' }, { status: 401 })
  }

  try {
    let body
    try {
      body = await request.json()
    } catch {
      // Malformed JSON from Safaricom — still respond 200 to stop retries
      return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })
    }

    const callbackData = body?.Body?.stkCallback
    if (!callbackData || typeof callbackData !== 'object') {
      return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })
    }

    const { ResultCode, CallbackMetadata, CheckoutRequestID } = callbackData

    // Validate CheckoutRequestID is a non-empty string to avoid store enumeration
    if (!CheckoutRequestID || typeof CheckoutRequestID !== 'string' ||
        CheckoutRequestID.length > 200) {
      return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })
    }

    // Find the booking by the checkout request ID stored during initiation
    const [booking] = await findWhere(
      'bookings',
      b => b.mpesaCheckoutId === CheckoutRequestID
    )

    if (!booking) {
      // No matching booking — still acknowledge so Safaricom doesn't retry
      return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })
    }

    if (ResultCode === MPESA_SUCCESS_CODE) {
      // Payment successful — extract transaction details from metadata
      const meta = {}
      const items = CallbackMetadata?.Item
      if (Array.isArray(items)) {
        for (const item of items) {
          if (item && typeof item.Name === 'string') {
            meta[item.Name] = item.Value ?? null
          }
        }
      }

      // Sanity-check the paid amount matches the booking total (±1 KES for rounding)
      const paidAmount   = Number(meta.Amount)
      const bookedAmount = Number(booking.totalAmount)
      if (!isNaN(paidAmount) && !isNaN(bookedAmount) &&
          Math.abs(paidAmount - bookedAmount) > 1) {
        console.warn(
          `[mpesa/callback] Amount mismatch: paid ${paidAmount}, booked ${bookedAmount} — booking ${booking.bookingRef}`
        )
      }

      await updateById('bookings', booking.id, {
        paymentStatus: 'PAID',
        status:        'CONFIRMED',
        paymentRef:    typeof meta.MpesaReceiptNumber === 'string'
                         ? meta.MpesaReceiptNumber.slice(0, 30)
                         : '',
        paidAt:        new Date().toISOString(),
        paidAmount:    isNaN(paidAmount) ? null : paidAmount,
      })
    } else {
      // Payment failed or was cancelled by the user
      await updateById('bookings', booking.id, {
        paymentStatus: 'FAILED',
      })
    }

    // Always respond 200 to Safaricom to prevent retries
    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })
  } catch (err) {
    console.error('[mpesa/callback POST]', err)
    // Still respond 200 to prevent Safaricom from flooding retries
    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })
  }
}

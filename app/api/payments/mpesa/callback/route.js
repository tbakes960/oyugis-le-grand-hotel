import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const MPESA_SUCCESS_CODE = 0

export async function POST(request) {
  const expectedSecret = process.env.MPESA_CALLBACK_SECRET
  if (!expectedSecret || expectedSecret === 'REPLACE_WITH_RANDOM_32_CHAR_STRING') {
    console.error('[mpesa/callback] MPESA_CALLBACK_SECRET not configured')
    return NextResponse.json({ ResultCode: 1, ResultDesc: 'Rejected' }, { status: 503 })
  }
  const { searchParams } = new URL(request.url)
  const providedSecret = searchParams.get('secret')
  if (!providedSecret || providedSecret !== expectedSecret) {
    console.warn('[mpesa/callback] Rejected — invalid or missing secret')
    return NextResponse.json({ ResultCode: 1, ResultDesc: 'Rejected' }, { status: 401 })
  }

  try {
    let body
    try { body = await request.json() } catch {
      return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })
    }

    const callbackData = body?.Body?.stkCallback
    if (!callbackData || typeof callbackData !== 'object') {
      return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })
    }

    const { ResultCode, CallbackMetadata, CheckoutRequestID } = callbackData

    if (!CheckoutRequestID || typeof CheckoutRequestID !== 'string' || CheckoutRequestID.length > 200) {
      return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })
    }

    const booking = await prisma.booking.findFirst({
      where: { mpesaCheckoutId: CheckoutRequestID },
    })

    if (!booking) {
      return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })
    }

    if (ResultCode === MPESA_SUCCESS_CODE) {
      const meta = {}
      const items = CallbackMetadata?.Item
      if (Array.isArray(items)) {
        for (const item of items) {
          if (item && typeof item.Name === 'string') meta[item.Name] = item.Value ?? null
        }
      }

      const paidAmount   = Number(meta.Amount)
      const bookedAmount = Number(booking.totalAmount)
      if (!isNaN(paidAmount) && !isNaN(bookedAmount) && Math.abs(paidAmount - bookedAmount) > 1) {
        console.warn(`[mpesa/callback] Amount mismatch: paid ${paidAmount}, booked ${bookedAmount} for ${booking.bookingRef}`)
      }

      await prisma.booking.update({
        where: { id: booking.id },
        data: {
          paymentStatus: 'PAID',
          status:        'CONFIRMED',
          paymentRef:    typeof meta.MpesaReceiptNumber === 'string'
                           ? meta.MpesaReceiptNumber.slice(0, 30)
                           : null,
          paidAt:        new Date(),
          paidAmount:    isNaN(paidAmount) ? null : paidAmount,
        },
      })
    } else {
      await prisma.booking.update({
        where: { id: booking.id },
        data:  { paymentStatus: 'FAILED' },
      })
    }

    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })
  } catch (err) {
    console.error('[mpesa/callback POST]', err)
    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })
  }
}

import { NextResponse } from 'next/server'
import { append, getAll } from '@/lib/store'
import { sendBookingConfirmation } from '@/lib/email'
import { requireRole } from '@/lib/auth'
import { rateLimit, getClientIp } from '@/lib/rateLimit'

/** Generate a short, readable booking reference like LG-A3F9K2 */
function generateRef() {
  return 'LG-' + Math.random().toString(36).slice(2, 8).toUpperCase()
}

// Rate-limiter: max 5 booking submissions per IP per 10 minutes
const bookingLimiter = rateLimit({ limit: 5, windowMs: 10 * 60_000 })

// Simple email format check
const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,253}\.[^\s@]{2,}$/
// E.164-ish phone (digits, optional leading +, 7–15 chars total)
const PHONE_RE = /^\+?[0-9]{7,15}$/
// YYYY-MM-DD
const DATE_RE  = /^\d{4}-\d{2}-\d{2}$/

/** GET /api/bookings — return all bookings (admin/staff only) */
export async function GET(request) {
  const auth = await requireRole(request, ['ADMIN', 'STAFF'])
  if (auth.error) return auth.error

  const bookings = await getAll('bookings')
  return NextResponse.json(bookings)
}

/** POST /api/bookings — submit a new room booking */
export async function POST(request) {
  // Rate-limit public submissions
  const ip = getClientIp(request)
  if (!bookingLimiter.check(ip)) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
  }

  try {
    const body = await request.json()

    const {
      guestName, guestEmail, guestPhone,
      roomType, checkIn, checkOut,
      nights, totalAmount,
      adults, children,
      paymentMethod, mpesaPhone,
      specialRequests,
    } = body

    // ── Required field presence ─────────────────────────────────────
    if (!guestName || !guestEmail || !guestPhone || !roomType || !checkIn || !checkOut) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // ── Format / type validation ─────────────────────────────────────
    if (typeof guestName !== 'string' || guestName.trim().length < 2 || guestName.trim().length > 100) {
      return NextResponse.json({ error: 'Guest name must be 2–100 characters' }, { status: 400 })
    }

    if (!EMAIL_RE.test(guestEmail)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    if (!PHONE_RE.test(guestPhone.replace(/[\s\-()]/g, ''))) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 })
    }

    if (!DATE_RE.test(checkIn) || !DATE_RE.test(checkOut)) {
      return NextResponse.json({ error: 'Invalid date format (expected YYYY-MM-DD)' }, { status: 400 })
    }

    const checkInDate  = new Date(checkIn)
    const checkOutDate = new Date(checkOut)
    const today        = new Date(); today.setHours(0, 0, 0, 0)

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return NextResponse.json({ error: 'Invalid dates' }, { status: 400 })
    }
    if (checkInDate < today) {
      return NextResponse.json({ error: 'Check-in date cannot be in the past' }, { status: 400 })
    }
    if (checkOutDate <= checkInDate) {
      return NextResponse.json({ error: 'Check-out must be after check-in' }, { status: 400 })
    }

    const parsedNights = Number(nights)
    if (!Number.isInteger(parsedNights) || parsedNights < 1 || parsedNights > 365) {
      return NextResponse.json({ error: 'Invalid stay duration' }, { status: 400 })
    }

    const parsedAmount = Number(totalAmount)
    if (isNaN(parsedAmount) || parsedAmount < 0 || parsedAmount > 10_000_000) {
      return NextResponse.json({ error: 'Invalid total amount' }, { status: 400 })
    }

    // Values must match the booking form and rooms page (STANDARD, DELUXE, TWIN, EXECUTIVE)
    const VALID_ROOM_TYPES = ['STANDARD', 'DELUXE', 'TWIN', 'EXECUTIVE']
    if (!VALID_ROOM_TYPES.includes(roomType)) {
      return NextResponse.json({ error: 'Invalid room type' }, { status: 400 })
    }

    const VALID_PAYMENTS = ['MPESA', 'CARD', 'CASH', 'BANK']
    const parsedPayment = paymentMethod && VALID_PAYMENTS.includes(paymentMethod)
      ? paymentMethod
      : 'MPESA'

    const booking = {
      id:              crypto.randomUUID(),
      bookingRef:      generateRef(),
      guestName:       guestName.trim().slice(0, 100),
      guestEmail:      guestEmail.toLowerCase().trim().slice(0, 254),
      guestPhone:      guestPhone.trim().slice(0, 20),
      roomType,
      checkIn,
      checkOut,
      nights:          parsedNights,
      adults:          Math.min(Math.max(Number(adults) || 1, 1), 10),
      children:        Math.min(Math.max(Number(children) || 0, 0), 10),
      totalAmount:     parsedAmount,
      paymentMethod:   parsedPayment,
      mpesaPhone:      mpesaPhone   ? mpesaPhone.trim().slice(0, 20)  : '',
      specialRequests: specialRequests ? specialRequests.trim().slice(0, 500) : '',
      status:          'PENDING',
      paymentStatus:   'PENDING',
      createdAt:       new Date().toISOString(),
    }

    await append('bookings', booking)

    // Send confirmation emails (non-blocking)
    sendBookingConfirmation(booking).catch(() => {})

    return NextResponse.json({ bookingRef: booking.bookingRef }, { status: 201 })
  } catch (err) {
    console.error('[bookings POST]', err)
    return NextResponse.json({ error: 'Booking failed. Please try again.' }, { status: 500 })
  }
}

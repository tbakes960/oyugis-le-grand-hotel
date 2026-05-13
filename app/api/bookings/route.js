import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { sendBookingConfirmation } from '@/lib/email'
import { requireRole } from '@/lib/auth'
import { rateLimit, getClientIp } from '@/lib/rateLimit'
import { sanitize, assertSafe } from '@/lib/sanitize'

export const dynamic = 'force-dynamic'

function generateRef() {
  return 'LG-' + Math.random().toString(36).slice(2, 8).toUpperCase()
}

const bookingLimiter = rateLimit({ limit: 5, windowMs: 10 * 60_000 })

const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,253}\.[^\s@]{2,}$/
const PHONE_RE = /^\+?[0-9]{7,15}$/
const DATE_RE  = /^\d{4}-\d{2}-\d{2}$/
const VALID_ROOM_TYPES  = ['STANDARD', 'DELUXE', 'TWIN', 'EXECUTIVE']
const VALID_PAYMENTS    = ['MPESA', 'CARD', 'CASH', 'BANK']

export async function GET(request) {
  const auth = await requireRole(request, ['ADMIN', 'STAFF'])
  if (auth.error) return auth.error

  const bookings = await prisma.booking.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(bookings)
}

export async function POST(request) {
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

    if (!guestName || !guestEmail || !guestPhone || !roomType || !checkIn || !checkOut) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    try {
      assertSafe(guestName, 'name')
      assertSafe(specialRequests, 'special requests')
    } catch {
      return NextResponse.json({ error: 'Invalid input detected' }, { status: 400 })
    }

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
    const today = new Date(); today.setHours(0, 0, 0, 0)

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

    if (!VALID_ROOM_TYPES.includes(roomType)) {
      return NextResponse.json({ error: 'Invalid room type' }, { status: 400 })
    }

    const bookingRef = generateRef()

    const booking = await prisma.booking.create({
      data: {
        bookingRef,
        guestName:       sanitize(guestName, 100, 'name'),
        guestEmail:      guestEmail.toLowerCase().trim().slice(0, 254),
        guestPhone:      guestPhone.trim().slice(0, 20),
        roomType,
        checkIn:         checkInDate,
        checkOut:        checkOutDate,
        nights:          parsedNights,
        adults:          Math.min(Math.max(Number(adults) || 1, 1), 10),
        children:        Math.min(Math.max(Number(children) || 0, 0), 10),
        totalAmount:     parsedAmount,
        paymentMethod:   VALID_PAYMENTS.includes(paymentMethod) ? paymentMethod : 'MPESA',
        specialRequests: specialRequests ? sanitize(specialRequests, 500, 'special requests') : null,
        status:          'PENDING',
        paymentStatus:   'UNPAID',
      },
    })

    sendBookingConfirmation({
      bookingRef:      booking.bookingRef,
      guestName:       booking.guestName,
      guestEmail:      booking.guestEmail,
      guestPhone:      booking.guestPhone,
      roomType:        booking.roomType,
      checkIn:         booking.checkIn.toISOString().slice(0, 10),
      checkOut:        booking.checkOut.toISOString().slice(0, 10),
      nights:          booking.nights,
      totalAmount:     booking.totalAmount,
      specialRequests: booking.specialRequests,
    }).catch(() => {})

    return NextResponse.json({ bookingRef: booking.bookingRef }, { status: 201 })
  } catch (err) {
    console.error('[bookings POST]', err)
    return NextResponse.json({ error: 'Booking failed. Please try again.' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { sendConferenceConfirmation } from '@/lib/email'
import { requireRole } from '@/lib/auth'
import { rateLimit, getClientIp } from '@/lib/rateLimit'
import { sanitize, assertSafe } from '@/lib/sanitize'

export const dynamic = 'force-dynamic'

const conferenceLimiter = rateLimit({ limit: 5, windowMs: 15 * 60_000 })
const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,253}\.[^\s@]{2,}$/
const PHONE_RE = /^\+?[0-9]{7,15}$/
const DATE_RE  = /^\d{4}-\d{2}-\d{2}$/
const VALID_EVENT_TYPES = [
  'Conference', 'Wedding', 'Birthday Party', 'Meeting',
  'Training / Workshop', 'Product Launch', 'Graduation', 'Other',
]

export async function GET(request) {
  const auth = await requireRole(request, ['ADMIN', 'STAFF'])
  if (auth.error) return auth.error
  const bookings = await prisma.conferenceBooking.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(bookings)
}

export async function POST(request) {
  const ip = getClientIp(request)
  if (!conferenceLimiter.check(ip)) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
  }
  try {
    const body = await request.json()
    const {
      organizerName, email, phone, organization,
      eventType, hallSize, attendees,
      date, startTime, endTime,
      cateringNeeded, cateringNotes, equipment, specialNeeds,
    } = body

    if (!organizerName || !email || !phone || !eventType || !date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    try {
      assertSafe(organizerName, 'organizer name')
      assertSafe(organization,  'organization')
      assertSafe(cateringNotes, 'catering notes')
      assertSafe(specialNeeds,  'special needs')
    } catch {
      return NextResponse.json({ error: 'Invalid input detected' }, { status: 400 })
    }
    if (typeof organizerName !== 'string' || organizerName.trim().length < 2 || organizerName.trim().length > 100) {
      return NextResponse.json({ error: 'Organizer name must be 2-100 characters' }, { status: 400 })
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }
    if (!PHONE_RE.test(phone.replace(/[\s\-()]/g, ''))) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 })
    }
    if (!DATE_RE.test(date)) {
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 })
    }
    const eventDate = new Date(date)
    const today = new Date(); today.setHours(0, 0, 0, 0)
    if (isNaN(eventDate.getTime()) || eventDate < today) {
      return NextResponse.json({ error: 'Event date must be today or in the future' }, { status: 400 })
    }
    if (eventType && !VALID_EVENT_TYPES.includes(eventType)) {
      return NextResponse.json({ error: 'Invalid event type' }, { status: 400 })
    }
    const parsedAttendees = attendees ? Number(attendees) : null
    if (parsedAttendees !== null && (isNaN(parsedAttendees) || parsedAttendees < 1 || parsedAttendees > 5000)) {
      return NextResponse.json({ error: 'Attendees must be between 1 and 5000' }, { status: 400 })
    }
    const safeEquipment = Array.isArray(equipment)
      ? equipment.filter(e => typeof e === 'string').slice(0, 20).map(e => e.trim().slice(0, 100))
      : []

    const ref = 'CONF-' + Math.random().toString(36).slice(2, 8).toUpperCase()
    const booking = await prisma.conferenceBooking.create({
      data: {
        ref,
        organizerName:  sanitize(organizerName, 100, 'organizer name'),
        email:          email.toLowerCase().trim().slice(0, 254),
        phone:          phone.trim().slice(0, 20),
        organization:   organization  ? sanitize(organization, 200, 'organization') : null,
        eventType,
        hallSize:       hallSize ? String(hallSize).trim().slice(0, 100) : '',
        attendees:      parsedAttendees,
        date:           eventDate,
        startTime:      startTime ? String(startTime).trim().slice(0, 10) : '',
        endTime:        endTime   ? String(endTime).trim().slice(0, 10)   : '',
        cateringNeeded: Boolean(cateringNeeded),
        cateringNotes:  cateringNotes ? sanitize(cateringNotes, 500, 'catering notes') : null,
        equipment:      JSON.stringify(safeEquipment),
        specialNeeds:   specialNeeds  ? sanitize(specialNeeds, 500, 'special needs')   : null,
        status:         'ENQUIRY',
      },
    })
    sendConferenceConfirmation({
      ref:           booking.ref,
      organizerName: booking.organizerName,
      email:         booking.email,
      phone:         booking.phone,
      eventType:     booking.eventType,
      hallSize:      booking.hallSize,
      attendees:     booking.attendees,
      date:          booking.date.toISOString().slice(0, 10),
      startTime:     booking.startTime,
      endTime:       booking.endTime,
    }).catch(() => {})
    return NextResponse.json({ ref: booking.ref }, { status: 201 })
  } catch (err) {
    console.error('[conferences POST]', err)
    return NextResponse.json({ error: 'Failed to submit enquiry.' }, { status: 500 })
  }
}

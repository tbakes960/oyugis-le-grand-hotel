import { NextResponse } from 'next/server'
import { append, getAll } from '@/lib/store'
import { sendConferenceConfirmation } from '@/lib/email'
import { requireRole } from '@/lib/auth'
import { rateLimit, getClientIp } from '@/lib/rateLimit'

// Rate-limiter: max 5 enquiries per IP per 15 minutes
const conferenceLimiter = rateLimit({ limit: 5, windowMs: 15 * 60_000 })

const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,253}\.[^\s@]{2,}$/
const PHONE_RE = /^\+?[0-9]{7,15}$/
const DATE_RE  = /^\d{4}-\d{2}-\d{2}$/

// Must match the event type options in app/conferences/page.jsx
const VALID_EVENT_TYPES = [
  'Conference', 'Wedding', 'Birthday Party', 'Meeting',
  'Training / Workshop', 'Product Launch', 'Graduation', 'Other',
]

/** GET /api/conferences — return all conference enquiries (admin/staff only) */
export async function GET(request) {
  const auth = await requireRole(request, ['ADMIN', 'STAFF'])
  if (auth.error) return auth.error

  const bookings = await getAll('conferences')
  return NextResponse.json([...bookings].reverse())
}

/** POST /api/conferences — submit a conference / event hall enquiry */
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
      cateringNeeded, cateringNotes,
      equipment, specialNeeds,
    } = body

    if (!organizerName || !email || !phone || !eventType || !date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (typeof organizerName !== 'string' || organizerName.trim().length < 2 || organizerName.trim().length > 100) {
      return NextResponse.json({ error: 'Organizer name must be 2–100 characters' }, { status: 400 })
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
    const today     = new Date(); today.setHours(0, 0, 0, 0)
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

    // Validate equipment array (no-op if not provided, limit size)
    const safeEquipment = Array.isArray(equipment)
      ? equipment.filter(e => typeof e === 'string').slice(0, 20).map(e => e.trim().slice(0, 100))
      : []

    const booking = {
      id:             crypto.randomUUID(),
      ref:            'CONF-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
      organizerName:  organizerName.trim().slice(0, 100),
      email:          email.toLowerCase().trim().slice(0, 254),
      phone:          phone.trim().slice(0, 20),
      organization:   organization   ? String(organization).trim().slice(0, 200)   : '',
      eventType,
      hallSize:       hallSize       ? String(hallSize).trim().slice(0, 100)       : '',
      attendees:      parsedAttendees,
      date,
      startTime:      startTime      ? String(startTime).trim().slice(0, 10)       : '',
      endTime:        endTime        ? String(endTime).trim().slice(0, 10)         : '',
      cateringNeeded: Boolean(cateringNeeded),
      cateringNotes:  cateringNotes  ? String(cateringNotes).trim().slice(0, 500)  : '',
      equipment:      safeEquipment,
      specialNeeds:   specialNeeds   ? String(specialNeeds).trim().slice(0, 500)   : '',
      status:         'ENQUIRY',
      createdAt:      new Date().toISOString(),
    }

    await append('conferences', booking)

    // Send confirmation emails (non-blocking)
    sendConferenceConfirmation(booking).catch(() => {})

    return NextResponse.json({ ref: booking.ref }, { status: 201 })
  } catch (err) {
    console.error('[conferences POST]', err)
    return NextResponse.json({ error: 'Failed to submit enquiry.' }, { status: 500 })
  }
}

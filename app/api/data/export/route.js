import { NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth'
import { findWhere } from '@/lib/store'

export const dynamic = 'force-dynamic'

/**
 * GET /api/data/export?email=...
 * GDPR Right to Access — returns all data held for a given email address.
 * Requires ADMIN role.
 */
export async function GET(request) {
  const auth = await requireRole(request, ['ADMIN'])
  if (auth.error) return auth.error

  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')?.trim().toLowerCase()

  if (!email || !/^[^\s@]{1,64}@[^\s@]{1,253}\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
  }

  const [bookings, contacts, conferences] = await Promise.all([
    findWhere('bookings',    r => r.guestEmail?.toLowerCase() === email),
    findWhere('contacts',    r => r.email?.toLowerCase()      === email),
    findWhere('conferences', r => r.email?.toLowerCase()      === email),
  ])

  const exportData = {
    email,
    exportedAt: new Date().toISOString(),
    bookings: bookings.map(b => ({
      bookingRef:    b.bookingRef,
      roomType:      b.roomType,
      checkIn:       b.checkIn,
      checkOut:      b.checkOut,
      status:        b.status,
      paymentStatus: b.paymentStatus,
      createdAt:     b.createdAt,
    })),
    contactMessages: contacts.map(c => ({
      subject:   c.subject,
      createdAt: c.createdAt,
    })),
    conferenceEnquiries: conferences.map(c => ({
      eventType:  c.eventType,
      eventDate:  c.eventDate,
      attendees:  c.attendees,
      createdAt:  c.createdAt,
    })),
  }

  return NextResponse.json(exportData, {
    headers: {
      'Content-Disposition': `attachment; filename="data-export-${Date.now()}.json"`,
      'Content-Type': 'application/json',
    },
  })
}

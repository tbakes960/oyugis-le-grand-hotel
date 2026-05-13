import { NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth'
import { getAll } from '@/lib/store'
import { promises as fs } from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

const DATA_DIR = path.join(process.cwd(), 'data')

async function deleteByEmail(collection, emailLower) {
  const filePath = path.join(DATA_DIR, `${collection}.json`)
  try {
    const raw  = await fs.readFile(filePath, 'utf-8')
    const items = JSON.parse(raw)
    const kept  = items.filter(r => {
      const e = (r.email || r.guestEmail || '').toLowerCase()
      return e !== emailLower
    })
    const deleted = items.length - kept.length
    if (deleted > 0) {
      const tmp = filePath + '.tmp'
      await fs.writeFile(tmp, JSON.stringify(kept, null, 2), 'utf-8')
      await fs.rename(tmp, filePath)
    }
    return deleted
  } catch {
    return 0
  }
}

/**
 * DELETE /api/data/delete?email=...
 * GDPR Right to Erasure — removes all records for a given email address.
 * Requires ADMIN role. Does NOT delete the admin/staff account itself.
 */
export async function DELETE(request) {
  const auth = await requireRole(request, ['ADMIN'])
  if (auth.error) return auth.error

  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')?.trim().toLowerCase()

  if (!email || !/^[^\s@]{1,64}@[^\s@]{1,253}\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
  }

  // Prevent deleting admin accounts (staff data is in accounts.json — don't touch it)
  const adminEmails = ['admin@oyugislegrand.co.ke', 'staff@oyugislegrand.co.ke']
  if (adminEmails.includes(email)) {
    return NextResponse.json({ error: 'Cannot delete system accounts via this endpoint' }, { status: 403 })
  }

  const [bookingsDeleted, contactsDeleted, conferencesDeleted] = await Promise.all([
    deleteByEmail('bookings',    email),
    deleteByEmail('contacts',    email),
    deleteByEmail('conferences', email),
  ])

  return NextResponse.json({
    message: 'Data deletion complete',
    deletedAt: new Date().toISOString(),
    counts: { bookings: bookingsDeleted, contacts: contactsDeleted, conferences: conferencesDeleted },
  })
}

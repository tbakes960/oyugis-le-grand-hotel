import { NextResponse } from 'next/server'
import { append, getAll } from '@/lib/store'
import { sendContactAcknowledgement } from '@/lib/email'
import { requireRole } from '@/lib/auth'
import { rateLimit, getClientIp } from '@/lib/rateLimit'

// Rate-limiter: max 5 messages per IP per 15 minutes
const contactLimiter = rateLimit({ limit: 5, windowMs: 15 * 60_000 })

const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,253}\.[^\s@]{2,}$/

/** GET /api/contact — return all messages (admin only) */
export async function GET(request) {
  const auth = await requireRole(request, ['ADMIN'])
  if (auth.error) return auth.error

  const messages = await getAll('contacts')
  return NextResponse.json(messages)
}

/** POST /api/contact — save a new contact message */
export async function POST(request) {
  const ip = getClientIp(request)
  if (!contactLimiter.check(ip)) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
  }

  try {
    const body = await request.json()
    const { name, email, phone, subject, message } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
      return NextResponse.json({ error: 'Name must be 2–100 characters' }, { status: 400 })
    }

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    if (typeof subject !== 'string' || subject.trim().length < 2 || subject.trim().length > 200) {
      return NextResponse.json({ error: 'Subject must be 2–200 characters' }, { status: 400 })
    }

    if (typeof message !== 'string' || message.trim().length < 10 || message.trim().length > 2000) {
      return NextResponse.json({ error: 'Message must be 10–2000 characters' }, { status: 400 })
    }

    const entry = {
      id:        crypto.randomUUID(),
      name:      name.trim().slice(0, 100),
      email:     email.toLowerCase().trim().slice(0, 254),
      phone:     phone ? String(phone).trim().slice(0, 20) : '',
      subject:   subject.trim().slice(0, 200),
      message:   message.trim().slice(0, 2000),
      isRead:    false,
      createdAt: new Date().toISOString(),
    }

    await append('contacts', entry)

    // Send acknowledgement emails (non-blocking)
    sendContactAcknowledgement(entry).catch(() => {})

    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (err) {
    console.error('[contact POST]', err)
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 })
  }
}

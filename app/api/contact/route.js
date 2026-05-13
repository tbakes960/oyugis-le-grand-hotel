import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { sendContactAcknowledgement } from '@/lib/email'
import { requireRole } from '@/lib/auth'
import { rateLimit, getClientIp } from '@/lib/rateLimit'
import { sanitize, assertSafe } from '@/lib/sanitize'

export const dynamic = 'force-dynamic'

const contactLimiter = rateLimit({ limit: 5, windowMs: 15 * 60_000 })
const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,253}\.[^\s@]{2,}$/

export async function GET(request) {
  const auth = await requireRole(request, ['ADMIN'])
  if (auth.error) return auth.error
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(messages)
}

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
    try {
      assertSafe(name,    'name')
      assertSafe(subject, 'subject')
      assertSafe(message, 'message')
    } catch {
      return NextResponse.json({ error: 'Invalid input detected' }, { status: 400 })
    }
    if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
      return NextResponse.json({ error: 'Name must be 2-100 characters' }, { status: 400 })
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }
    if (typeof subject !== 'string' || subject.trim().length < 2 || subject.trim().length > 200) {
      return NextResponse.json({ error: 'Subject must be 2-200 characters' }, { status: 400 })
    }
    if (typeof message !== 'string' || message.trim().length < 10 || message.trim().length > 2000) {
      return NextResponse.json({ error: 'Message must be 10-2000 characters' }, { status: 400 })
    }

    const entry = await prisma.contactMessage.create({
      data: {
        name:    sanitize(name, 100, 'name'),
        email:   email.toLowerCase().trim().slice(0, 254),
        phone:   phone ? String(phone).trim().slice(0, 20) : null,
        subject: sanitize(subject, 200, 'subject'),
        message: sanitize(message, 2000, 'message'),
        isRead:  false,
      },
    })

    sendContactAcknowledgement(entry).catch(() => {})
    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (err) {
    console.error('[contact POST]', err)
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 })
  }
}

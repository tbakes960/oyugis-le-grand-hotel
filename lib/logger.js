import { createHash } from 'crypto'

/**
 * lib/logger.js
 * Structured JSON logger for production observability.
 * PII is automatically stripped before output.
 *
 * Usage:
 *   import { logger } from '@/lib/logger'
 *   logger.info('booking.created', { bookingRef: 'LG-ABC123', roomType: 'DELUXE' })
 *   logger.warn('auth.failed', { ip: '1.2.3.4' })
 *   logger.error('payment.error', { bookingRef: 'LG-XYZ', error: err.message })
 */

function hashPii(value) {
  if (typeof value !== 'string') return value
  return createHash('sha256').update(value).digest('hex').slice(0, 12) + '***'
}

function maskPhone(phone) {
  if (typeof phone !== 'string') return phone
  return phone.slice(0, -4).replace(/\d/g, '*') + phone.slice(-4)
}

const PII_KEYS = new Set(['email', 'password', 'currentPassword', 'newPassword', 'token', 'secret'])
const PHONE_KEYS = new Set(['phone', 'phoneNumber', 'mpesaPhone'])

function sanitize(obj, depth = 0) {
  if (depth > 5 || obj === null || typeof obj !== 'object') return obj
  if (Array.isArray(obj)) return obj.map(v => sanitize(v, depth + 1))

  const out = {}
  for (const [k, v] of Object.entries(obj)) {
    if (PII_KEYS.has(k)) {
      out[k] = '[redacted]'
    } else if (PHONE_KEYS.has(k) && typeof v === 'string') {
      out[k] = maskPhone(v)
    } else if (k === 'userEmail' && typeof v === 'string') {
      out[k] = hashPii(v)
    } else if (typeof v === 'object') {
      out[k] = sanitize(v, depth + 1)
    } else {
      out[k] = v
    }
  }
  return out
}

function emit(level, event, data = {}) {
  const entry = {
    ts: new Date().toISOString(),
    level,
    event,
    ...sanitize(data),
  }
  const line = JSON.stringify(entry)
  if (level === 'error') {
    console.error(line)
  } else if (level === 'warn') {
    console.warn(line)
  } else {
    console.log(line)
  }
}

export const logger = {
  info:  (event, data) => emit('info',  event, data),
  warn:  (event, data) => emit('warn',  event, data),
  error: (event, data) => emit('error', event, data),
  debug: (event, data) => {
    if (process.env.NODE_ENV === 'development') emit('debug', event, data)
  },
}

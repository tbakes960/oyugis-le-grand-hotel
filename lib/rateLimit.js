/**
 * lib/rateLimit.js
 * In-memory sliding-window rate limiter for Next.js API routes.
 *
 * Usage:
 *   import { rateLimit } from '@/lib/rateLimit'
 *
 *   const limiter = rateLimit({ limit: 10, windowMs: 60_000 })
 *
 *   export async function POST(request) {
 *     const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
 *     if (!limiter.check(ip)) {
 *       return Response.json({ error: 'Too many requests' }, { status: 429 })
 *     }
 *     ...
 *   }
 *
 * Note: This is a per-process store — on multi-instance deployments use
 * Redis or Upstash instead. For a single-server hotel site it is sufficient.
 */

/**
 * @param {{ limit: number, windowMs: number }} options
 *   limit    – max requests allowed in the window
 *   windowMs – sliding window length in milliseconds
 */
export function rateLimit({ limit = 10, windowMs = 60_000 } = {}) {
  // key → sorted array of request timestamps (ms)
  const store = new Map()

  // Periodically purge stale entries so the Map doesn't grow unbounded.
  const GC_INTERVAL = Math.max(windowMs, 60_000)
  let gcTimer = null

  function gc() {
    const cutoff = Date.now() - windowMs
    for (const [key, timestamps] of store) {
      const trimmed = timestamps.filter(t => t > cutoff)
      if (trimmed.length === 0) store.delete(key)
      else store.set(key, trimmed)
    }
  }

  function startGc() {
    if (gcTimer) return
    gcTimer = setInterval(gc, GC_INTERVAL)
    // Don't block Node.js exit
    if (typeof gcTimer.unref === 'function') gcTimer.unref()
  }

  return {
    /**
     * Returns true if the request is allowed, false if it should be blocked.
     * @param {string} key  Usually the client IP address.
     */
    check(key) {
      startGc()
      const now = Date.now()
      const cutoff = now - windowMs
      const timestamps = (store.get(key) || []).filter(t => t > cutoff)
      if (timestamps.length >= limit) return false
      timestamps.push(now)
      store.set(key, timestamps)
      return true
    },
  }
}

/** Helper: extract the real client IP from a Next.js Request object. */
export function getClientIp(request) {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  )
}

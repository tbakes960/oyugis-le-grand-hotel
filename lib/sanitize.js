/**
 * lib/sanitize.js
 * Server-side input sanitization — strips HTML, null bytes, and rejects
 * blatant injection attempts before data is stored or processed.
 *
 * Usage:
 *   import { cleanText, assertSafe } from '@/lib/sanitize'
 *   const safeName = cleanText(body.name, 100)
 *   assertSafe(body.message)   // throws 400-friendly error on attack patterns
 */

// ── Strip dangerous characters ─────────────────────────────────────────────

/** Remove HTML/XML tags, null bytes, and non-printable control chars. */
function stripDangerous(str) {
  return String(str ?? '')
    .replace(/\0/g, '')                   // null bytes
    .replace(/[\x01-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // control chars (keep \t \n \r)
    .replace(/<[^>]*>/g, '')              // HTML tags
    .replace(/&(?:lt|gt|amp|quot|#\d+|#x[\da-f]+);/gi, '') // HTML entities that bypass tag strip
}

// ── Injection pattern detection ────────────────────────────────────────────

const XSS_PATTERNS = [
  /javascript\s*:/i,
  /on\w+\s*=/i,           // onerror=, onclick=, onload=, etc.
  /<\s*script/i,
  /<\s*iframe/i,
  /<\s*object/i,
  /<\s*embed/i,
  /eval\s*\(/i,
  /expression\s*\(/i,     // CSS expression()
  /vbscript\s*:/i,
  /data\s*:\s*text\/html/i,
]

const SQLI_PATTERNS = [
  /'\s*(or|and)\s+['"\d]/i,              // ' OR '1'='1
  /\bUNION\b.{0,20}\bSELECT\b/i,
  /;\s*(DROP|DELETE|INSERT|UPDATE|CREATE|ALTER|EXEC|EXECUTE)\b/i,
  /--\s*$/m,                              // SQL comment at end of line
  /\/\*.*\*\//s,                          // block comments
  /\bEXEC\s*\(/i,
  /\bxp_\w+/i,                            // SQL Server extended procs
]

const PATH_TRAVERSAL = /(\.\.[/\\]|%2e%2e[%2f%5c])/i
const NULL_BYTE      = /%00|\x00/

/** Returns true if the string contains a recognised attack pattern. */
function isDangerous(str) {
  const s = String(str ?? '')
  return (
    NULL_BYTE.test(s) ||
    PATH_TRAVERSAL.test(s) ||
    XSS_PATTERNS.some(re => re.test(s)) ||
    SQLI_PATTERNS.some(re => re.test(s))
  )
}

// ── Public API ─────────────────────────────────────────────────────────────

/**
 * Clean a free-text string: strip tags, trim, enforce max length.
 * Does NOT throw — use assertSafe() separately when you want to reject requests.
 */
export function cleanText(str, maxLen = 500) {
  return stripDangerous(String(str ?? '')).trim().slice(0, maxLen)
}

/**
 * Throw a structured error if the value contains attack patterns.
 * Catch this in the route handler and return 400.
 */
export function assertSafe(str, fieldName = 'input') {
  if (isDangerous(String(str ?? ''))) {
    const err = new Error(`Potentially unsafe ${fieldName} rejected`)
    err.status = 400
    err.safe   = true
    throw err
  }
}

/**
 * Convenience: clean + assert in one call.
 * Returns the cleaned string; throws if patterns are detected on the original.
 */
export function sanitize(str, maxLen = 500, fieldName = 'input') {
  assertSafe(str, fieldName)
  return cleanText(str, maxLen)
}

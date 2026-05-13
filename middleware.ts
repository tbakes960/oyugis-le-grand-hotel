import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ── WAF: patterns that indicate common attacks ────────────────────────────
// Checked against the raw request URL (pathname + querystring).

const WAF_RULES: Array<{ name: string; pattern: RegExp }> = [
  // SQL injection
  { name: 'sqli-union',    pattern: /union\s+(all\s+)?select/i },
  { name: 'sqli-comment',  pattern: /('|")\s*(--|#|\/\*)/i },
  { name: 'sqli-or',       pattern: /'\s*or\s+'?\d/i },
  { name: 'sqli-drop',     pattern: /;\s*(drop|delete|truncate|alter)\s+/i },
  { name: 'sqli-exec',     pattern: /\bexec(\s|\()+(xp_|sp_)/i },
  // XSS
  { name: 'xss-script',    pattern: /<\s*script[\s>]/i },
  { name: 'xss-on-event',  pattern: /\bon\w{2,20}\s*=/i },
  { name: 'xss-js-proto',  pattern: /javascript\s*:/i },
  { name: 'xss-vbs',       pattern: /vbscript\s*:/i },
  { name: 'xss-data-html', pattern: /data\s*:\s*text\/html/i },
  // Path traversal
  { name: 'traversal',     pattern: /(\.\.[/\\]|%2e%2e[%2f%5c])/i },
  // Null byte injection
  { name: 'null-byte',     pattern: /%00|\x00/ },
  // Remote file inclusion
  { name: 'rfi',           pattern: /https?:\/\/[^/]+\/(etc\/passwd|wp-config|\.git)/ },
  // Common scanner probes
  { name: 'scanner-path',  pattern: /\/(wp-admin|phpmyadmin|\.env|\.git\/config|etc\/passwd|xmlrpc\.php|eval-stdin)/i },
]

// Known malicious / scanner user-agent fragments
const BAD_UA_PATTERNS = [
  /sqlmap/i, /nikto/i, /nmap/i, /masscan/i, /zgrab/i,
  /python-requests\/[01]\./i,  // old automated scripts
  /go-http-client\/1\./i,      // common scanner runtime
  /curl\/[0-5]\./i,            // very old curl (often scanners)
  /libwww-perl/i, /lwp-trivial/i, /Wget\/[01]\./i,
]

function isBlockedByWAF(request: NextRequest): string | null {
  const rawUrl = request.nextUrl.pathname + request.nextUrl.search
  // Decode percent-encoding so UNION%20SELECT matches same as UNION SELECT
  let url = rawUrl
  try { url = decodeURIComponent(rawUrl) } catch { /* malformed encoding — use raw */ }

  const ua      = request.headers.get('user-agent') ?? ''
  const referer = request.headers.get('referer') ?? ''

  // Check URL against WAF rules (check both decoded and raw to catch double-encoding)
  for (const rule of WAF_RULES) {
    if (rule.pattern.test(url) || rule.pattern.test(rawUrl) || rule.pattern.test(referer)) {
      return rule.name
    }
  }

  // Block scanners by User-Agent
  for (const pat of BAD_UA_PATTERNS) {
    if (pat.test(ua)) return 'bad-ua'
  }

  return null
}

// ── Security headers added at middleware level ────────────────────────────
// These supplement the headers in next.config.js and are applied on every
// response (next.config.js headers only fire on matched routes, middleware
// runs on all edge requests).

function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('Cross-Origin-Opener-Policy',   'same-origin')
  response.headers.set('Cross-Origin-Resource-Policy', 'same-site')
  // Prevent browsers caching sensitive admin/API responses
  const path = response.headers.get('x-middleware-next') ?? ''
  if (path.includes('/api/') || path.includes('/admin')) {
    response.headers.set('Cache-Control', 'no-store, max-age=0')
  }
  return response
}

export async function middleware(request: NextRequest) {
  // ── WAF check (runs before auth) ──────────────────────────────────
  const blocked = isBlockedByWAF(request)
  if (blocked) {
    console.warn(`[WAF] Blocked request (${blocked}): ${request.nextUrl.pathname}`)
    return new NextResponse('Forbidden', { status: 403 })
  }

  // ── Enforce HTTPS in production ───────────────────────────────────
  if (
    process.env.NODE_ENV === 'production' &&
    request.headers.get('x-forwarded-proto') === 'http'
  ) {
    const httpsUrl = request.nextUrl.clone()
    httpsUrl.protocol = 'https'
    return NextResponse.redirect(httpsUrl, 301)
  }

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  const { pathname } = request.nextUrl

  // ── Route protection ──────────────────────────────────────────────
  if (pathname.startsWith('/admin')) {
    if (token?.role !== 'ADMIN') {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  if (pathname.startsWith('/staff')) {
    const role = token?.role as string | undefined
    if (!role || !['ADMIN', 'STAFF'].includes(role)) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  const response = NextResponse.next()
  return addSecurityHeaders(response)
}

export const config = {
  matcher: [
    // Run on all routes except Next.js internals and static files
    '/((?!_next/static|_next/image|favicon|images|icons|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|otf|css|js)$).*)',
  ],
}

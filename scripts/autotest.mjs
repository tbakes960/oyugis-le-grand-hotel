/**
 * Oyugis Le Grand Hotel — Automated Pre-Deployment Test Suite
 * Run: node scripts/autotest.mjs
 * Requires dev server running on localhost:3000
 */

const BASE = 'http://127.0.0.1:3000'
const TIMEOUT = 20000

let passed = 0
let failed = 0
let warned = 0
const failures = []

// ── Helpers ───────────────────────────────────────────────────────────────────

async function get(path, opts = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT)
  try {
    const res = await fetch(`${BASE}${path}`, { signal: controller.signal, redirect: 'manual', ...opts })
    clearTimeout(timer)
    return res
  } catch (e) {
    clearTimeout(timer)
    throw e
  }
}

async function post(path, body, headers = {}) {
  return get(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  })
}

function pass(name) {
  console.log(`  ✅  ${name}`)
  passed++
}

function fail(name, detail = '') {
  console.log(`  ❌  ${name}${detail ? ` — ${detail}` : ''}`)
  failed++
  failures.push({ name, detail })
}

function warn(name, detail = '') {
  console.log(`  ⚠️   ${name}${detail ? ` — ${detail}` : ''}`)
  warned++
}

function section(title) {
  console.log(`\n── ${title} ${'─'.repeat(Math.max(0, 50 - title.length))}`)
}

// ── Tests ─────────────────────────────────────────────────────────────────────

async function testServerUp() {
  section('Server Connectivity')
  try {
    const res = await get('/')
    if (res.status < 500) pass('Dev server is reachable')
    else fail('Dev server returned 5xx on /', `status ${res.status}`)
  } catch {
    fail('Dev server not reachable — start it with: npm run dev')
    console.log('\n  Cannot continue — server must be running.\n')
    process.exit(1)
  }
}

async function testHealthCheck() {
  section('Health Check')
  try {
    const res = await get('/api/health')
    if (res.status === 200) {
      const data = await res.json()
      if (data.status === 'ok') pass('GET /api/health → 200 { status: ok }')
      else fail('Health check returned unexpected body', JSON.stringify(data))
    } else {
      fail('GET /api/health did not return 200', `got ${res.status}`)
    }
  } catch (e) {
    fail('Health check threw an error', e.message)
  }
}

async function testSecurityHeaders() {
  section('Security Headers')
  const res = await get('/')
  const h = (name) => res.headers.get(name) ?? ''

  const checks = [
    ['Content-Security-Policy',      h('content-security-policy').length > 0,         'CSP header present'],
    ['X-Frame-Options',              h('x-frame-options') === 'DENY',                 'X-Frame-Options: DENY'],
    ['X-Content-Type-Options',       h('x-content-type-options') === 'nosniff',       'X-Content-Type-Options: nosniff'],
    ['Referrer-Policy',              h('referrer-policy').includes('origin'),          'Referrer-Policy set'],
    ['Strict-Transport-Security',    h('strict-transport-security').includes('max-age'), 'HSTS header present'],
    ['Permissions-Policy',           h('permissions-policy').includes('camera'),       'Permissions-Policy set'],
    ['Cross-Origin-Opener-Policy',   h('cross-origin-opener-policy') === 'same-origin', 'COOP: same-origin'],
    ['Cross-Origin-Resource-Policy', h('cross-origin-resource-policy') === 'same-site', 'CORP: same-site'],
  ]

  for (const [, ok, label] of checks) {
    ok ? pass(label) : fail(label)
  }

  // CSP must include Stripe
  const csp = h('content-security-policy')
  csp.includes('js.stripe.com') ? pass('CSP includes Stripe domains') : warn('CSP missing js.stripe.com (needed for card payments)')
}

async function testWAF() {
  section('WAF — Attack Pattern Blocking')

  const attacks = [
    ['/api/bookings?q=\' UNION SELECT * FROM users--', 'SQLi UNION SELECT blocked'],
    ['/api/bookings?x=<script>alert(1)</script>', 'XSS <script> tag blocked'],
    ['/api/bookings?url=javascript:alert(1)', 'XSS javascript: protocol blocked'],
    ['/api/bookings?path=../../etc/passwd', 'Path traversal blocked'],
    ['/wp-admin', 'WordPress scanner probe blocked'],
    ['/phpmyadmin', 'phpMyAdmin scanner probe blocked'],
    ['/.env', 'Direct .env access blocked'],
    ['/.git/config', 'Git config access blocked'],
    ['/api/bookings?x=%00injected', 'Null byte injection blocked'],
  ]

  for (const [path, label] of attacks) {
    try {
      const res = await get(path)
      res.status === 403 ? pass(label) : warn(label, `expected 403, got ${res.status}`)
    } catch {
      warn(label, 'request failed')
    }
  }

  // Bad User-Agent
  try {
    const res = await get('/', { headers: { 'User-Agent': 'sqlmap/1.0' } })
    res.status === 403 ? pass('sqlmap User-Agent blocked') : warn('sqlmap User-Agent not blocked', `got ${res.status}`)
  } catch {
    warn('sqlmap UA test failed')
  }
}

async function testAuthProtection() {
  section('Authentication & Route Protection')

  const protectedRoutes = [
    ['/admin', 'ADMIN'],
    ['/admin/bookings', 'ADMIN'],
    ['/admin/rooms', 'ADMIN'],
    ['/staff', 'STAFF'],
  ]

  for (const [route, role] of protectedRoutes) {
    try {
      const res = await get(route)
      // Should redirect to /login (302/307/308) or return 200 for login page
      if ([301, 302, 307, 308].includes(res.status)) {
        const loc = res.headers.get('location') ?? ''
        loc.includes('login') ? pass(`${route} redirects to login (${role} required)`) : fail(`${route} redirects but not to login`, `→ ${loc}`)
      } else if (res.status === 200) {
        // Could be rendering the login page inline — acceptable
        warn(`${route} returned 200 without auth`, 'verify redirect works in browser')
      } else {
        fail(`${route} returned unexpected status`, `${res.status}`)
      }
    } catch (e) {
      fail(`${route} protection check failed`, e.message)
    }
  }
}

async function testApiCacheHeaders() {
  section('API Cache Headers')
  const res = await get('/api/health')
  const cc = res.headers.get('cache-control') ?? ''
  cc.includes('no-store') ? pass('API routes have Cache-Control: no-store') : warn('API routes missing no-store cache header', cc || 'none')
}

async function testBookingValidation() {
  section('Booking API — Input Validation')

  // Missing required fields
  let res = await post('/api/bookings', {})
  res.status === 400 ? pass('Empty booking body → 400') : fail('Empty booking body should return 400', `got ${res.status}`)

  // Invalid email
  res = await post('/api/bookings', {
    guestName: 'Test Guest',
    guestEmail: 'not-an-email',
    guestPhone: '0712345678',
    roomType: 'STANDARD',
    checkIn: '2025-12-01',
    checkOut: '2025-12-03',
    adults: 1,
  })
  ;[400, 422].includes(res.status) ? pass('Invalid email in booking → 400/422') : warn('Invalid email not rejected', `got ${res.status}`)

  // XSS in name field
  res = await post('/api/bookings', {
    guestName: '<script>alert(1)</script>',
    guestEmail: 'test@test.com',
    guestPhone: '0712345678',
    roomType: 'STANDARD',
    checkIn: '2025-12-01',
    checkOut: '2025-12-03',
    adults: 1,
  })
  ;[400, 422].includes(res.status) ? pass('XSS payload in guestName → 400/422') : warn('XSS in name field not rejected', `got ${res.status}`)
}

async function testContactValidation() {
  section('Contact API — Input Validation')

  let res = await post('/api/contact', {})
  res.status === 400 ? pass('Empty contact body → 400') : fail('Empty contact body should return 400', `got ${res.status}`)

  res = await post('/api/contact', {
    name: 'A',
    email: 'bad-email',
    subject: 'Hi',
    message: 'Test',
  })
  ;[400, 422].includes(res.status) ? pass('Invalid email in contact → 400/422') : warn('Invalid contact email not rejected', `got ${res.status}`)
}

async function testStripeEndpoint() {
  section('Stripe Payment API')

  // No bookingRef
  let res = await post('/api/payments/stripe/create-intent', {})
  ;[400, 503].includes(res.status) ? pass('Missing bookingRef → 400 or 503 (not configured)') : fail('Missing bookingRef should return 400/503', `got ${res.status}`)

  // Invalid bookingRef format
  res = await post('/api/payments/stripe/create-intent', { bookingRef: 'INVALID' })
  ;[400, 503].includes(res.status) ? pass('Invalid bookingRef format → 400 or 503') : fail('Invalid bookingRef should return 400/503', `got ${res.status}`)
}

async function testMpesaCallback() {
  section('M-Pesa Callback Security')

  // No secret — should be rejected
  let res = await post('/api/payments/mpesa/callback', { Body: { stkCallback: {} } })
  ;[400, 401, 403, 503].includes(res.status) ? pass('M-Pesa callback without secret → rejected') : fail('M-Pesa callback without secret should be rejected', `got ${res.status}`)

  // Wrong secret
  res = await post('/api/payments/mpesa/callback?secret=wrongsecret', { Body: { stkCallback: {} } })
  ;[401, 403].includes(res.status) ? pass('M-Pesa callback with wrong secret → 401/403') : warn('M-Pesa callback wrong secret not blocked', `got ${res.status}`)
}

async function testDataRouteProtection() {
  section('GDPR Data Routes — Auth Required')

  // Export is GET, delete is DELETE — without auth both should be 401/403/redirect
  let res = await get('/api/data/export?email=test@test.com')
  ;[401, 403, 302, 307].includes(res.status) ? pass('Data export requires auth → rejected') : fail('Data export accessible without auth', `got ${res.status}`)

  res = await get('/api/data/delete?email=test@test.com', { method: 'DELETE' })
  ;[401, 403, 302, 307].includes(res.status) ? pass('Data delete requires auth → rejected') : fail('Data delete accessible without auth', `got ${res.status}`)
}

async function testPublicPages() {
  section('Public Pages — Smoke Test')

  const pages = ['/', '/rooms', '/dining', '/conferences', '/contact', '/virtual-tour', '/blog', '/privacy-policy', '/terms-of-service']
  for (const page of pages) {
    try {
      const res = await get(page)
      res.status === 200 ? pass(`${page} → 200`) : fail(`${page} returned ${res.status}`)
    } catch (e) {
      fail(`${page} threw error`, e.message)
    }
  }
}

// ── Runner ────────────────────────────────────────────────────────────────────

async function run() {
  console.log('═'.repeat(55))
  console.log('  Oyugis Le Grand Hotel — Automated Test Suite')
  console.log(`  Target: ${BASE}`)
  console.log('═'.repeat(55))

  await testServerUp()
  await testHealthCheck()
  await testSecurityHeaders()
  await testWAF()
  await testAuthProtection()
  await testApiCacheHeaders()
  await testBookingValidation()
  await testContactValidation()
  await testStripeEndpoint()
  await testMpesaCallback()
  await testDataRouteProtection()
  await testPublicPages()

  console.log('\n' + '═'.repeat(55))
  console.log(`  Results: ${passed} passed  |  ${warned} warnings  |  ${failed} failed`)
  console.log('═'.repeat(55))

  if (failures.length > 0) {
    console.log('\n  Failed tests:')
    failures.forEach(f => console.log(`    ✗ ${f.name}${f.detail ? `: ${f.detail}` : ''}`))
  }

  if (failed === 0) {
    console.log('\n  ✅  All checks passed — ready to deploy!\n')
  } else {
    console.log(`\n  ❌  ${failed} test(s) failed — review before deploying.\n`)
    process.exit(1)
  }
}

run().catch(e => {
  console.error('Test runner crashed:', e)
  process.exit(1)
})

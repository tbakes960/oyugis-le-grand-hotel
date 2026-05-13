/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV === 'development'

// ── Content-Security-Policy ───────────────────────────────────────────────
// Stripe domains included for PCI DSS compliance:
//   js.stripe.com must be allowed in script-src and frame-src so Stripe.js
//   can tokenise card data client-side (card data never touches this server).
// 'unsafe-inline' for styles is required by Tailwind CSS.
// 'unsafe-eval' is only added in dev for Next.js HMR.
const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://js.stripe.com https://maps.googleapis.com`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https://images.unsplash.com https://lh3.googleusercontent.com https://maps.gstatic.com https://maps.googleapis.com https://q.stripe.com",
  "connect-src 'self' https://api.safaricom.co.ke https://sandbox.safaricom.co.ke https://maps.googleapis.com https://api.stripe.com",
  "frame-src https://maps.google.com https://www.google.com https://js.stripe.com https://hooks.stripe.com",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "worker-src 'self' blob:",
  // Report URI — set NEXT_PUBLIC_CSP_REPORT_URI in env to collect violations
  ...(process.env.NEXT_PUBLIC_CSP_REPORT_URI
    ? [`report-uri ${process.env.NEXT_PUBLIC_CSP_REPORT_URI}`]
    : []),
].join('; ')

const securityHeaders = [
  // Prevent clickjacking
  { key: 'X-Frame-Options',             value: 'DENY' },
  // Prevent MIME-type sniffing
  { key: 'X-Content-Type-Options',      value: 'nosniff' },
  // Limit referrer leakage
  { key: 'Referrer-Policy',             value: 'strict-origin-when-cross-origin' },
  // Restrict browser features; payment=() blocks browser Payment Request API
  // (all payments go through Stripe Elements / M-Pesa, not the browser API)
  { key: 'Permissions-Policy',          value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=()' },
  // Force HTTPS for 1 year (requires TLS terminator — Vercel handles this)
  { key: 'Strict-Transport-Security',   value: 'max-age=31536000; includeSubDomains; preload' },
  // Legacy XSS filter (still useful for older Android WebView)
  { key: 'X-XSS-Protection',            value: '1; mode=block' },
  // Prevent cross-origin window access (helps isolate payment frames)
  { key: 'Cross-Origin-Opener-Policy',  value: 'same-origin' },
  // Prevent other origins from loading this site's resources
  { key: 'Cross-Origin-Resource-Policy', value: 'same-site' },
  // CSP
  { key: 'Content-Security-Policy',     value: CSP },
]

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
    unoptimized: isDev,
  },

  eslint: {
    ignoreDuringBuilds: false,
  },

  experimental: {
    serverComponentsExternalPackages: ['bcryptjs', '@prisma/client', 'prisma'],
  },

  // Limit request body size (protects against payload-bomb DoS)
  // 1 MB is generous for all hotel forms; raise only if file uploads are added
  serverRuntimeConfig: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
      // Explicitly no-cache admin and API routes
      {
        source: '/api/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'no-store, max-age=0' },
          { key: 'Pragma',        value: 'no-cache' },
        ],
      },
      {
        source: '/admin/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'no-store, max-age=0' },
        ],
      },
    ]
  },
}

module.exports = nextConfig

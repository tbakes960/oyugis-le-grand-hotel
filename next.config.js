/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV === 'development'

// Content-Security-Policy
// – 'unsafe-inline' for styles is needed by Tailwind (inline style attributes)
// – 'unsafe-eval' is only added in dev for Next.js HMR/fast-refresh
const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https://images.unsplash.com https://lh3.googleusercontent.com https://maps.gstatic.com https://maps.googleapis.com",
  "connect-src 'self' https://api.safaricom.co.ke https://sandbox.safaricom.co.ke https://maps.googleapis.com",
  // Google Maps embeds need frame-src
  "frame-src https://maps.google.com https://www.google.com",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
].join('; ')

const securityHeaders = [
  // Block clickjacking
  { key: 'X-Frame-Options',           value: 'DENY' },
  // Prevent MIME-type sniffing
  { key: 'X-Content-Type-Options',    value: 'nosniff' },
  // Stop browsers leaking referrer to external sites
  { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
  // Restrict powerful browser features
  { key: 'Permissions-Policy',        value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  // Force HTTPS for 1 year (only meaningful behind a TLS terminator)
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
  // XSS filter (legacy browsers)
  { key: 'X-XSS-Protection',          value: '1; mode=block' },
  // CSP
  { key: 'Content-Security-Policy',   value: CSP },
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
    // Next.js 14.2 still uses this path for external packages
    serverComponentsExternalPackages: ['bcryptjs'],
  },

  async headers() {
    return [
      {
        // Apply security headers to every route
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}

module.exports = nextConfig

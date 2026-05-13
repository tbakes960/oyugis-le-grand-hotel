'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // Log to console in development; replace with Sentry.captureException(error) when integrated
    console.error('[GlobalError]', error)
  }, [error])

  return (
    <div className="min-h-screen bg-hotel-surface flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gold-50 flex items-center justify-center">
            <svg className="w-10 h-10 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <h1 className="font-heading text-3xl font-semibold text-hotel-dark mb-3">
            Something went wrong
          </h1>
          <p className="text-hotel-muted text-base leading-relaxed">
            We apologise for the inconvenience. Our team has been notified and is working to resolve the issue.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gold-gradient text-hotel-dark font-semibold text-sm shadow-gold hover:shadow-gold-hover transition-all duration-300"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-hotel-dark/20 text-hotel-dark font-semibold text-sm hover:bg-hotel-dark hover:text-white transition-all duration-300"
          >
            Return Home
          </Link>
        </div>

        <p className="mt-8 text-xs text-hotel-muted">
          If this problem persists, please contact us at{' '}
          <a href="mailto:hotellegrand619@gmail.com" className="text-gold-500 hover:underline">
            hotellegrand619@gmail.com
          </a>
        </p>
      </div>
    </div>
  )
}

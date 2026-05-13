import Link from 'next/link'

export const metadata = {
  title: 'Page Not Found',
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-hotel-surface flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="mb-8">
          <p className="font-heading text-8xl font-bold text-gold-400 mb-4" aria-hidden="true">404</p>
          <h1 className="font-heading text-3xl font-semibold text-hotel-dark mb-3">
            Page Not Found
          </h1>
          <p className="text-hotel-muted text-base leading-relaxed">
            The page you are looking for does not exist or may have been moved.
            Please check the URL or return to the homepage.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gold-gradient text-hotel-dark font-semibold text-sm shadow-gold hover:shadow-gold-hover transition-all duration-300"
          >
            Return Home
          </Link>
          <Link
            href="/booking"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-hotel-dark/20 text-hotel-dark font-semibold text-sm hover:bg-hotel-dark hover:text-white transition-all duration-300"
          >
            Book a Room
          </Link>
        </div>

        <nav className="mt-10" aria-label="Helpful links">
          <p className="text-xs text-hotel-muted mb-3 uppercase tracking-wider">You might be looking for</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { href: '/rooms', label: 'Rooms' },
              { href: '/dining', label: 'Dining' },
              { href: '/conferences', label: 'Conferences' },
              { href: '/gallery', label: 'Gallery' },
              { href: '/contact', label: 'Contact' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="px-3 py-1.5 rounded-full bg-white border border-hotel-dark/10 text-xs text-hotel-dark hover:border-gold-400 hover:text-gold-600 transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </div>
  )
}

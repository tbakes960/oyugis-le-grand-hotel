// External Booking Platforms section
// REPLACE: Add your real listing URLs for each platform

const PLATFORMS = [
  {
    name: 'Booking.com',
    desc: 'Best price guarantee',
    color: '#003580',
    /* REPLACE: href: 'https://www.booking.com/hotel/ke/oyugis-le-grand.html' */
    href: '#',
  },
  {
    name: 'Airbnb',
    desc: 'Unique stays',
    color: '#FF5A5F',
    /* REPLACE: href: 'https://www.airbnb.com/rooms/YOUR_ID' */
    href: '#',
  },
  {
    name: 'Expedia',
    desc: 'Bundle & save',
    color: '#fbcc33',
    textColor: '#003087',
    /* REPLACE: href: 'https://www.expedia.com/...' */
    href: '#',
  },
  {
    name: 'Trivago',
    desc: 'Compare prices',
    color: '#005ea2',
    /* REPLACE: href: 'https://www.trivago.com/...' */
    href: '#',
  },
  {
    name: 'Google Hotels',
    desc: 'Book via Google',
    color: '#4285F4',
    /* REPLACE: href: 'https://www.google.com/travel/hotels/...' */
    href: '#',
  },
]

export default function ExternalBooking() {
  return (
    <section className="py-16 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-xs font-semibold tracking-[0.16em] uppercase text-hotel-muted mb-8">
          Also Available On
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {PLATFORMS.map(({ name, desc, color, textColor, href }) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center px-6 py-4 rounded-lg border border-gray-200
                         hover:border-gray-300 hover:shadow-md transition-all duration-200 min-w-[120px]"
            >
              <span
                className="text-base font-bold mb-1"
                style={{ color: textColor || color }}
              >
                {name}
              </span>
              <span className="text-xs text-hotel-muted">{desc}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

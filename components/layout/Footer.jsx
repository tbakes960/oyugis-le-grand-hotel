import Link from 'next/link'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

const SOCIAL = [
  {
    label: 'Facebook', href: 'https://www.facebook.com/',
    path: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  },
  {
    label: 'Instagram', href: 'https://www.instagram.com/',
    path: (
      <>
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </>
    ),
  },
  {
    label: 'WhatsApp', href: 'https://wa.me/254799200050',
    path: <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />,
  },
]

const QUICK_LINKS = [
  { href: '/',            label: 'Home'                },
  { href: '/rooms',       label: 'Rooms & Suites'      },
  { href: '/dining',      label: 'Dining & Restaurant' },
  { href: '/conferences', label: 'Conferences & Events'},
  { href: '/experiences', label: 'Experiences'         },
  { href: '/gallery',     label: 'Gallery'             },
  { href: '/blog',        label: 'Blog & Stories'      },
  { href: '/booking',     label: 'Book a Room'         },
]

const SERVICES = [
  'Restaurant & Bar',
  'Conference Halls',
  'Fitness Centre / Gym',
  'Airport Transfer',
  'Event Hosting',
  '24/7 Room Service',
  'Free Wi-Fi',
  'Secure Parking',
]

export default function Footer() {
  return (
    <footer style={{ background: '#071e27' }}>

      {/* Gold top border */}
      <div className="h-[2px]"
           style={{ background: 'linear-gradient(90deg, transparent 0%, #D4AF37 30%, #E8C55A 50%, #D4AF37 70%, transparent 100%)' }} />

      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-6 py-16
                      grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand */}
        <div>
          <div className="mb-5">
            <span className="font-heading text-2xl font-bold text-white block leading-none">
              Oyugis Le Grand
            </span>
            <span className="text-[9px] tracking-[0.24em] uppercase font-body mt-0.5 block"
                  style={{ color: '#D4AF37' }}>
              Hotel · Est. Oyugis, Kenya
            </span>
          </div>
          <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Experience the pinnacle of luxury and authentic Kenyan hospitality
            in the heart of Oyugis, Homa Bay County.
          </p>

          {/* Social links */}
          <div className="flex gap-2.5">
            {SOCIAL.map(({ label, href, path }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl flex items-center justify-center
                           border border-white/10 text-white/45
                           hover:border-gold-400 hover:text-gold-400
                           transition-all duration-200"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {path}
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase mb-5"
              style={{ color: '#D4AF37' }}>
            Quick Links
          </h4>
          <ul className="space-y-3">
            {QUICK_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-sm transition-colors duration-200 flex items-center gap-2 group"
                  style={{ color: 'rgba(255,255,255,0.45)' }}
                >
                  <span className="w-1 h-1 rounded-full bg-gold-400/40 group-hover:bg-gold-400
                                   transition-colors duration-200 flex-shrink-0" />
                  <span className="hover:text-white transition-colors duration-200">{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase mb-5"
              style={{ color: '#D4AF37' }}>
            Our Services
          </h4>
          <ul className="space-y-3">
            {SERVICES.map(s => (
              <li key={s} className="flex items-center gap-2 text-sm"
                  style={{ color: 'rgba(255,255,255,0.45)' }}>
                <span className="w-1 h-1 rounded-full flex-shrink-0"
                      style={{ background: '#D4AF37', opacity: 0.4 }} />
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase mb-5"
              style={{ color: '#D4AF37' }}>
            Get In Touch
          </h4>
          <ul className="space-y-4">
            {[
              { Icon: MapPin, value: 'Kisumu-Kisii Road, Oyugis Town,\nHoma Bay County, Kenya' },
              { Icon: Phone,  value: '+254 799 200050', href: 'tel:+254799200050' },
              { Icon: Mail,   value: 'hotellegrand619@gmail.com', href: 'mailto:hotellegrand619@gmail.com' },
              { Icon: Clock,  value: 'Reception open 24 hours · 7 days' },
            ].map(({ Icon, value, href }) => (
              <li key={value} className="flex items-start gap-3 text-sm"
                  style={{ color: 'rgba(255,255,255,0.50)' }}>
                <Icon size={13} className="flex-shrink-0 mt-0.5" style={{ color: '#D4AF37' }} />
                {href ? (
                  <a href={href} className="hover:text-white transition-colors duration-200 whitespace-pre-line">
                    {value}
                  </a>
                ) : (
                  <span className="whitespace-pre-line">{value}</span>
                )}
              </li>
            ))}
          </ul>

          {/* Also book on */}
          <div className="mt-7">
            <p className="text-[9px] tracking-widest uppercase mb-3"
               style={{ color: 'rgba(255,255,255,0.25)' }}>
              Also Book On
            </p>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: 'Booking.com', href: 'https://www.booking.com/hotel/ke/le-grand-oyugis.html' },
                { label: 'Airbnb',      href: 'https://www.airbnb.com/s/Oyugis--Kenya/homes'          },
                { label: 'Expedia',     href: 'https://www.expedia.com'                               },
                { label: 'Google',      href: 'https://www.google.com/travel/hotels/Oyugis'           },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[9px] px-2.5 py-1 rounded-lg transition-all duration-200"
                  style={{
                    border: '1px solid rgba(255,255,255,0.10)',
                    color: 'rgba(255,255,255,0.35)',
                  }}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row
                        items-center justify-between gap-3">
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
            © {new Date().getFullYear()} Oyugis Le Grand Hotel. All rights reserved.
          </p>
          <div className="flex gap-5 text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
            <Link href="/privacy-policy" className="hover:text-white/60 transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-white/60 transition-colors">Terms of Service</Link>
            <Link href="/login" className="hover:text-white/60 transition-colors">Staff Login</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

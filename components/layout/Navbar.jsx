'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Phone } from 'lucide-react'

const NAV_LINKS = [
  { href: '/',            label: 'Home'        },
  { href: '/rooms',       label: 'Rooms'       },
  { href: '/dining',      label: 'Dining'      },
  { href: '/conferences', label: 'Conferences' },
  { href: '/experiences', label: 'Experiences' },
  { href: '/gallery',     label: 'Gallery'     },
  { href: '/blog',        label: 'Blog'        },
  { href: '/contact',     label: 'Contact'     },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [pathname])

  const isHome  = pathname === '/'
  const isSolid = scrolled || menuOpen || !isHome

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-400"
        style={{
          height: 80,
          background: isSolid
            ? 'rgba(10, 47, 60, 0.98)'
            : 'transparent',
          backdropFilter: isSolid ? 'blur(12px)' : 'none',
          boxShadow: isSolid ? '0 1px 0 rgba(255,255,255,0.06), 0 8px 32px rgba(10,47,60,0.3)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none group flex-shrink-0">
            <span className="font-heading text-[1.15rem] font-bold text-white
                             group-hover:text-sky-300 transition-colors duration-200 tracking-wide">
              Oyugis Le Grand
            </span>
            <span className="text-[9px] font-body tracking-[0.22em] uppercase text-gold-400 mt-0.5">
              Hotel · Oyugis, Kenya
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden xl:flex items-center gap-6">
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative text-[11px] font-semibold tracking-[0.16em] uppercase
                    transition-colors duration-200 py-1
                    after:absolute after:-bottom-0.5 after:left-0 after:h-[2px]
                    after:rounded-full after:bg-gold-400
                    after:transition-all after:duration-300
                    ${active
                      ? 'text-gold-400 after:w-full'
                      : 'text-white/75 hover:text-white after:w-0 hover:after:w-full'
                    }`}
                >
                  {label}
                </Link>
              )
            })}
          </nav>

          {/* Right side CTAs */}
          <div className="hidden xl:flex items-center gap-3">
            <a
              href="tel:+254799200050"
              className="flex items-center gap-1.5 text-white/60 hover:text-white
                         text-xs transition-colors duration-200"
            >
              <Phone size={12} />
              <span className="tracking-wide">+254 799 200050</span>
            </a>
            <div className="w-px h-4 bg-white/15" />
            <Link href="/booking" className="btn-gold text-[11px] py-2.5 px-5">
              Book Now
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="xl:hidden text-white p-1.5 rounded-lg hover:bg-white/10
                       transition-colors focus:outline-none"
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[80px] z-40 xl:hidden pb-6
                       border-t border-white/[0.08] shadow-deep"
            style={{ background: 'rgba(10,47,60,0.98)', backdropFilter: 'blur(12px)' }}
          >
            <nav className="flex flex-col px-6 pt-2 gap-0">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`py-4 border-b border-white/[0.06] text-sm font-semibold
                    tracking-[0.14em] uppercase transition-colors duration-200
                    ${pathname === href ? 'text-gold-400' : 'text-white/70 hover:text-gold-300'}`}
                >
                  {label}
                </Link>
              ))}
              <div className="pt-5 flex flex-col gap-3">
                <a
                  href="tel:+254799200050"
                  className="flex items-center gap-2 text-white/50 text-sm"
                >
                  <Phone size={14} />
                  +254 799 200050
                </a>
                <Link href="/booking" className="btn-gold justify-center">
                  Book Now
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'

const HIGHLIGHTS = [
  {
    href:  '/rooms',
    label: 'Rooms & Suites',
    desc:  'Elegant rooms from standard to executive — each designed for maximum comfort and rest.',
    src:   '/images/twin room.jpg',
    tag:   '4 Room Types',
    accent: '#5BBFD9',
  },
  {
    href:  '/dining',
    label: 'Dining & Restaurant',
    desc:  'A curated dining experience featuring Lake Victoria fish, Kenyan staples and international favourites.',
    src:   '/images/restaurant.jpg',
    tag:   'All-Day Dining',
    accent: '#D4AF37',
  },
  {
    href:  '/conferences',
    label: 'Conferences & Events',
    desc:  'Four versatile halls for corporate meetings, weddings, graduations and gala events.',
    src:   '/images/conference room.jpg',
    tag:   'Up to 150 Guests',
    accent: '#5BBFD9',
  },
  {
    href:  '/experiences',
    label: 'Local Experiences',
    desc:  'Explore Lake Victoria, Simbi Nyaima Crater Lake and the rich culture of Western Kenya.',
    src:   '/images/garden.jpg',
    tag:   'Day Trips',
    accent: '#D4AF37',
  },
]

export default function HotelHighlights() {
  return (
    <section className="py-28 bg-hotel-surface">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">
          <span className="eyebrow">Discover</span>
          <h2 className="section-title">Everything Under One Roof</h2>
          <div className="gold-divider" />
          <p className="section-desc">
            From luxurious rooms to world-class dining and unforgettable local experiences —
            Oyugis Le Grand has it all.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {HIGHLIGHTS.map(({ href, label, desc, src, tag, accent }, i) => (
            <motion.div
              key={href}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link href={href} className="group block h-full">
                <div className="bg-white rounded-2xl overflow-hidden shadow-card
                                hover:shadow-card-hover hover:-translate-y-1.5
                                transition-all duration-400 h-full flex flex-col">

                  {/* Image */}
                  <div className="relative h-52 overflow-hidden flex-shrink-0">
                    <Image
                      src={src}
                      alt={label}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover object-center group-hover:scale-107
                                 transition-transform duration-700 ease-out"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-hotel-dark/60
                                    via-transparent to-transparent" />

                    {/* Tag */}
                    <span className="absolute top-3 left-3 text-[10px] font-bold tracking-widest
                                     uppercase text-white px-3 py-1.5 rounded-full
                                     backdrop-blur-sm bg-hotel-dark/50 border border-white/15">
                      {tag}
                    </span>
                  </div>

                  {/* Text content */}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-heading text-[1.05rem] font-semibold text-hotel-dark mb-2.5
                                   group-hover:text-sky-500 transition-colors duration-300 leading-snug">
                      {label}
                    </h3>
                    <p className="text-sm text-hotel-muted leading-relaxed flex-1">{desc}</p>

                    {/* Arrow link */}
                    <div className="flex items-center gap-2 mt-5 pt-4 border-t border-gray-100">
                      <span className="text-xs font-bold text-sky-500 tracking-wide uppercase">
                        Explore
                      </span>
                      <div className="ml-auto w-7 h-7 rounded-full bg-sky-50 flex items-center
                                      justify-center text-sky-400 group-hover:bg-sky-400
                                      group-hover:text-white transition-all duration-300">
                        <ArrowUpRight size={13} />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

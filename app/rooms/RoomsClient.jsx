'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Users, Maximize2, Check, ArrowRight } from 'lucide-react'

const ROOMS = [
  {
    id: 'standard',
    type: 'STANDARD',
    name: 'Standard Room',
    sizeSqm: 20,
    capacity: 2,
    priceFrom: 3000,
    description:
      'A comfortable, well-appointed room perfect for solo travellers or couples seeking quality rest. Features a king or twin bed configuration with all essential amenities.',
    features: ['King or Twin Beds', 'Free Wi-Fi', 'Air Conditioning', 'En-suite Bathroom', 'Flat-screen TV', 'Daily Housekeeping'],
    tag: null,
    src: '/images/standard room.jpg',
  },
  {
    id: 'deluxe',
    type: 'DELUXE',
    name: 'Deluxe Room',
    sizeSqm: 30,
    capacity: 2,
    priceFrom: 3500,
    description:
      'Elevated comfort with premium furnishings and thoughtful in-room touches. The most popular choice among our returning guests.',
    features: ['King Bed', 'Free Wi-Fi', 'Air Conditioning', 'Smart TV', 'Premium Toiletries', 'Daily Housekeeping'],
    tag: 'Most Popular',
    src: '/images/twin room.jpg',
  },
  {
    id: 'twin',
    type: 'TWIN',
    name: 'Twin Room',
    sizeSqm: 25,
    capacity: 2,
    priceFrom: 3500,
    description:
      'Ideal for two guests travelling together. Features two comfortable single beds and all the modern conveniences you need for a relaxing stay.',
    features: ['Two Single Beds', 'Free Wi-Fi', 'Air Conditioning', 'En-suite Bathroom', 'Flat-screen TV', 'Daily Housekeeping'],
    tag: null,
    src: '/images/twin room window.jpg',
  },
  {
    id: 'executive',
    type: 'EXECUTIVE',
    name: 'Executive Room',
    sizeSqm: 40,
    capacity: 2,
    priceFrom: 4000,
    description:
      'Our finest room category — spacious and elegantly furnished with upgraded amenities and priority services for the discerning traveller.',
    features: ['King Bed', 'Free Wi-Fi', 'Air Conditioning', 'Smart TV', 'Premium Toiletries', 'Complimentary Breakfast'],
    tag: 'Best Value',
    src: '/images/executive room.jpg',
  },
]

const FILTERS = ['All', 'Standard', 'Deluxe', 'Twin', 'Executive']

export default function RoomsClient() {
  const [filter, setFilter] = useState('All')

  const filtered = filter === 'All'
    ? ROOMS
    : ROOMS.filter(r => r.type === filter.toUpperCase())

  return (
    <>
      {/* Page Hero */}
      <div className="page-hero" style={{ backgroundImage: "url('/images/twin%20room%20window.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <p className="text-xs tracking-[0.2em] uppercase text-gold-400 mb-2">Oyugis Le Grand Hotel</p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white">Rooms &amp; Suites</h1>
        </div>
      </div>

      <section className="py-20 bg-hotel-surface">
        <div className="max-w-7xl mx-auto px-6">

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 justify-center mb-14">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2.5 text-sm font-semibold tracking-widest uppercase rounded transition-all duration-200 border
                  ${filter === f
                    ? 'bg-sky-400 border-sky-400 text-white'
                    : 'border-gray-300 text-hotel-muted hover:border-sky-400 hover:text-sky-400 bg-white'
                  }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Rooms */}
          <AnimatePresence mode="wait">
            <motion.div
              key={filter}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {filtered.map((room, i) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                  className="card grid grid-cols-1 lg:grid-cols-2 overflow-hidden"
                >
                  {/* Image */}
                  <div className="relative h-72 lg:h-auto min-h-[280px]">
                    <Image
                      src={room.src}
                      alt={room.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover object-center"
                    />
                    {room.tag && (
                      <span className="absolute top-4 left-4 bg-gold-400 text-hotel-dark text-xs font-bold
                                       px-3 py-1 rounded tracking-wide uppercase">
                        {room.tag}
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-4 mb-3">
                        <span className="flex items-center gap-1 text-xs text-hotel-muted">
                          <Maximize2 size={12} /> {room.sizeSqm} m²
                        </span>
                        <span className="flex items-center gap-1 text-xs text-hotel-muted">
                          <Users size={12} /> Up to {room.capacity} guests
                        </span>
                      </div>
                      <h2 className="font-heading text-2xl font-semibold text-hotel-dark mb-3">
                        {room.name}
                      </h2>
                      <p className="text-hotel-muted text-sm leading-relaxed mb-5">
                        {room.description}
                      </p>

                      {/* Features grid */}
                      <ul className="grid grid-cols-2 gap-y-2 gap-x-4 mb-6">
                        {room.features.map(f => (
                          <li key={f} className="flex items-center gap-2 text-xs text-hotel-dark">
                            <Check size={12} className="text-sky-400 flex-shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between pt-5 border-t border-gray-100">
                      <div>
                        <span className="text-xs text-hotel-muted">from </span>
                        <span className="text-2xl font-bold text-hotel-dark font-heading">
                          KES {room.priceFrom.toLocaleString()}
                        </span>
                        <span className="text-xs text-hotel-muted"> /night</span>
                      </div>
                      <Link
                        href={`/booking?roomType=${room.type}`}
                        className="btn-gold text-xs py-2.5"
                      >
                        Book This Room <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Info Strip */}
      <div className="bg-sky-50 border-y border-sky-100 py-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { label: 'Check-in', value: 'From 14:00' },
            { label: 'Check-out', value: 'By 11:00' },
            { label: 'Cancellation', value: 'Free 24h before' },
            { label: 'Breakfast', value: 'Included' },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs font-semibold tracking-wider uppercase text-hotel-muted mb-1">{label}</p>
              <p className="text-sm font-semibold text-hotel-dark">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

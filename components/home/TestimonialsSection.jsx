'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const TESTIMONIALS = [
  {
    name:    'Achieng Otieno',
    role:    'Business Traveller',
    rating:  5,
    text:    'The staff were incredibly warm and professional. My room was immaculate and the breakfast was outstanding. Easily the best hotel in Oyugis.',
    initial: 'A',
    color:   '#5BBFD9',
  },
  {
    name:    'David Mwangi',
    role:    'Family Vacation',
    rating:  5,
    text:    'We had a wonderful family holiday here. The rooms were spacious, the garden beautiful, and every meal was delicious. We\'ll definitely be back.',
    initial: 'D',
    color:   '#D4AF37',
  },
  {
    name:    'Grace Wanjiru',
    role:    'Leisure Guest',
    rating:  5,
    text:    'A true gem in western Kenya. The service surpassed all my expectations — they remembered my preferences from day one. Truly grand!',
    initial: 'G',
    color:   '#5BBFD9',
  },
]

export default function TestimonialsSection() {
  return (
    <section className="py-28 bg-hotel-surface relative overflow-hidden">
      {/* Decorative rings */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-[0.04]
                      border-[48px] border-sky-400 pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full opacity-[0.05]
                      border-[40px] border-gold-400 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="eyebrow">Guest Reviews</span>
          <h2 className="section-title">What Our Guests Say</h2>
          <div className="gold-divider" />
          <div className="flex items-center justify-center gap-1 mt-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={15} className="text-gold-400 fill-gold-400" />
            ))}
            <span className="ml-2 text-sm text-hotel-muted font-medium">5.0 · Exceptional</span>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(({ name, role, rating, text, initial, color }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="relative bg-white rounded-2xl p-8 shadow-card
                         hover:shadow-card-hover hover:-translate-y-1
                         transition-all duration-300 group flex flex-col"
            >
              {/* Large background quote mark */}
              <Quote
                size={52}
                className="absolute top-5 right-5 transition-colors duration-300"
                style={{ color: `${color}18` }}
              />
              <Quote
                size={52}
                className="absolute top-5 right-5 opacity-0 group-hover:opacity-100
                           transition-opacity duration-300"
                style={{ color: `${color}30` }}
              />

              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {Array.from({ length: rating }).map((_, j) => (
                  <Star key={j} size={13} className="text-gold-400 fill-gold-400" />
                ))}
              </div>

              {/* Review */}
              <p className="text-hotel-dark text-sm leading-relaxed italic flex-1 relative z-10">
                &ldquo;{text}&rdquo;
              </p>

              {/* Gold accent rule */}
              <div className="w-10 h-[2px] my-5 rounded"
                   style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center
                             text-white font-bold text-base font-heading flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${color}, ${color}99)` }}
                >
                  {initial}
                </div>
                <div>
                  <span className="text-hotel-dark font-semibold text-sm block leading-tight">{name}</span>
                  <span className="text-hotel-muted text-xs">{role}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

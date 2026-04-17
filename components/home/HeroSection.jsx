'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, ChevronDown, MapPin, Star } from 'lucide-react'

const fadeUp = {
  hidden:  { opacity: 0, y: 36 },
  visible: (d = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.85, delay: d, ease: [0.22, 1, 0.36, 1] },
  }),
}

const STATS = [
  { value: '4',    label: 'Room Types'   },
  { value: '5★',   label: 'Guest Rating' },
  { value: '4',    label: 'Event Halls'  },
  { value: '24/7', label: 'Room Service' },
]

export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        backgroundImage: "url('/images/Side%20View.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center 40%',
      }}
    >
      {/* Deep layered overlay for legibility */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(10,47,60,0.45) 0%, rgba(10,47,60,0.55) 40%, rgba(10,47,60,0.90) 100%)',
        }}
      />

      {/* Subtle gold dot texture */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, #D4AF37 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      {/* Soft glow blob — top left */}
      <div
        className="absolute top-0 left-0 w-[600px] h-[500px] opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top left, #5BBFD9, transparent 70%)' }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center flex flex-col items-center">

        {/* Location pill */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2 glass rounded-full px-5 py-2.5 mb-8"
        >
          <MapPin size={12} className="text-gold-400 flex-shrink-0" />
          <span className="text-white/80 text-[11px] tracking-[0.18em] uppercase font-medium">
            Oyugis, Homa Bay County · Kenya
          </span>
        </motion.div>

        {/* Star rating strip */}
        <motion.div
          custom={0.1}
          initial="hidden" animate="visible" variants={fadeUp}
          className="flex items-center gap-1.5 mb-6"
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={13} className="text-gold-400 fill-gold-400" />
          ))}
          <span className="text-white/55 text-xs ml-1 tracking-wide">Top-Rated Hotel in Western Kenya</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          custom={0.25}
          initial="hidden" animate="visible" variants={fadeUp}
          className="font-heading font-bold text-white leading-none tracking-tight text-balance mb-5"
          style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)' }}
        >
          Oyugis Le Grand
          <span
            className="block"
            style={{
              backgroundImage: 'linear-gradient(105deg, #D4AF37 0%, #F5E18A 45%, #D4AF37 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Hotel
          </span>
        </motion.h1>

        {/* Gold rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.1, delay: 0.45, ease: 'easeOut' }}
          className="w-20 h-[2px] mx-auto mb-6 origin-center"
          style={{ background: 'linear-gradient(90deg, #D4AF37, #E8C55A, #D4AF37)' }}
        />

        {/* Tagline */}
        <motion.p
          custom={0.55}
          initial="hidden" animate="visible" variants={fadeUp}
          className="text-white/65 font-light leading-relaxed mb-10 max-w-2xl"
          style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)' }}
        >
          Luxury &amp; Comfort in the Heart of Oyugis — where authentic Kenyan
          hospitality meets contemporary elegance.
        </motion.p>

        {/* CTAs */}
        <motion.div
          custom={0.7}
          initial="hidden" animate="visible" variants={fadeUp}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-20"
        >
          <Link href="/booking" className="btn-gold text-sm px-8 py-4">
            Book Your Stay <ArrowRight size={16} />
          </Link>
          <Link href="/rooms" className="btn-outline text-sm px-8 py-4">
            Explore Rooms
          </Link>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          custom={0.85}
          initial="hidden" animate="visible" variants={fadeUp}
          className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/10 rounded-2xl overflow-hidden
                     max-w-lg mx-auto w-full shadow-glass"
        >
          {STATS.map(({ value, label }, i) => (
            <div
              key={label}
              className="bg-hotel-dark/50 backdrop-blur-sm px-6 py-4 text-center
                         hover:bg-white/10 transition-colors duration-300"
            >
              <p className="font-heading text-2xl font-bold text-gold-400 leading-none mb-1">{value}</p>
              <p className="text-[10px] tracking-[0.18em] uppercase text-white/45">{label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/30"
      >
        <span className="text-[9px] tracking-[0.28em] uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        >
          <ChevronDown size={16} />
        </motion.div>
      </motion.div>
    </section>
  )
}

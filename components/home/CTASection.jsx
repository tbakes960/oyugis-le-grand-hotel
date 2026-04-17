'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Phone, MessageCircle, ShieldCheck, BadgeCheck, Tag } from 'lucide-react'

const TRUST = [
  { Icon: Tag,         label: 'Best Rate Guarantee' },
  { Icon: ShieldCheck, label: 'Free Cancellation'   },
  { Icon: BadgeCheck,  label: 'Secure Booking'      },
]

export default function CTASection() {
  return (
    <section
      className="relative py-36 overflow-hidden"
      style={{
        backgroundImage: "url('/images/entrance.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Multi-layer overlay */}
      <div className="absolute inset-0"
           style={{ background: 'linear-gradient(to bottom, rgba(10,47,60,0.55) 0%, rgba(10,47,60,0.75) 100%)' }} />

      {/* Gold dot texture */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, #D4AF37 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                   w-[800px] h-[400px] opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #D4AF37, transparent 70%)' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-w-3xl mx-auto text-center px-6"
      >
        {/* Gold rule */}
        <div className="w-16 h-[2px] mx-auto mb-6"
             style={{ background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)' }} />

        <span className="block text-xs font-semibold tracking-[0.25em] uppercase text-gold-400 mb-4">
          Reserve Today
        </span>

        <h2
          className="font-heading font-bold text-white mb-5 leading-tight"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)' }}
        >
          Begin Your Grand
          <span
            className="block"
            style={{
              backgroundImage: 'linear-gradient(105deg, #D4AF37 0%, #F5E18A 45%, #D4AF37 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Experience
          </span>
        </h2>

        <p className="text-white/60 text-base md:text-lg font-light leading-relaxed mb-10 max-w-lg mx-auto">
          Book directly for the best rates and exclusive benefits.
          Our team is ready to make your stay truly unforgettable.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link href="/booking" className="btn-gold text-sm px-8 py-4">
            Book Your Stay <ArrowRight size={16} />
          </Link>
          <a href="tel:+254799200050" className="btn-outline text-sm px-7 py-4">
            <Phone size={15} /> +254 799 200050
          </a>
          <Link href="/contact" className="btn-outline text-sm px-7 py-4">
            <MessageCircle size={15} /> Get in Touch
          </Link>
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-8 flex-wrap">
          {TRUST.map(({ Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-white/45">
              <Icon size={13} className="text-gold-400" />
              <span className="text-xs font-medium">{label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

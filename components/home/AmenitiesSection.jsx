'use client'

import { motion } from 'framer-motion'
import {
  Wifi, Car, Utensils, Dumbbell,
  ConciergeBell, Coffee, Shield, UtensilsCrossed,
} from 'lucide-react'

const AMENITIES = [
  { Icon: Wifi,             label: 'Free High-Speed Wi-Fi',  desc: 'Seamless connectivity throughout the hotel'     },
  { Icon: Utensils,         label: 'Restaurant & Bar',       desc: 'Local and international cuisine, all day'       },
  { Icon: Dumbbell,         label: 'Fitness Centre',         desc: 'Fully equipped gym with modern equipment'       },
  { Icon: ConciergeBell,    label: '24/7 Room Service',      desc: 'Food and beverage delivered to your room'       },
  { Icon: Car,              label: 'Secure Parking',         desc: 'On-site parking for all guests'                 },
  { Icon: Coffee,           label: 'Conference Facilities',  desc: 'Rooftop, main hall, lounge & boardroom'         },
  { Icon: UtensilsCrossed,  label: 'BBQ & Events',           desc: 'Outdoor BBQ and curated event services'         },
  { Icon: Shield,           label: '24/7 Security',          desc: 'CCTV and trained security personnel'            },
]

export default function AmenitiesSection() {
  return (
    <section className="relative py-28 overflow-hidden" style={{ background: '#0A2F3C' }}>
      {/* Faint gold grid */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: 'radial-gradient(circle, #D4AF37 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />

      {/* Glow accent */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at bottom, #5BBFD9, transparent 70%)' }}
      />

      <div className="relative max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="block text-xs font-semibold tracking-[0.25em] uppercase text-gold-400 mb-3">
            Facilities
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-semibold text-white mb-4">
            World-Class Amenities
          </h2>
          <div className="w-14 h-[2px] mx-auto mb-6"
               style={{ background: 'linear-gradient(90deg, #D4AF37, #E8C55A, #D4AF37)' }} />
          <p className="text-white/50 text-base font-light max-w-xl mx-auto leading-relaxed">
            Everything you need for the perfect stay — all under one roof.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {AMENITIES.map(({ Icon, label, desc }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="group relative p-6 rounded-2xl text-center cursor-default
                         border border-white/[0.07] bg-white/[0.04]
                         hover:bg-white/[0.08] hover:border-gold-400/25
                         transition-all duration-300"
            >
              {/* Icon circle */}
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center
                              bg-sky-400/10 text-sky-400
                              group-hover:bg-gold-400/15 group-hover:text-gold-400
                              transition-all duration-300">
                <Icon size={24} />
              </div>
              <h4 className="font-heading text-[0.85rem] font-semibold text-white mb-2 leading-snug">
                {label}
              </h4>
              <p className="text-xs text-white/40 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, ArrowRight, Clock } from 'lucide-react'

const EXPERIENCES = [
  {
    id: 1,
    name: 'Lake Victoria',
    category: 'Nature',
    distance: '~15 km',
    duration: 'Half day',
    desc: "Africa's largest lake and the world's second-largest freshwater lake by surface area. Enjoy fishing excursions, boat rides, and stunning sunsets over the vast expanse of water.",
    highlights: ['Boat Excursions', 'Fresh Fish at the Lake', 'Bird Watching', 'Sunset Views'],
    gradient: 'from-sky-800 to-sky-600',
    image: '/images/20230206_083913.jpg',
  },
  {
    id: 2,
    name: 'Simbi Nyaima Crater Lake',
    category: 'Cultural Heritage',
    distance: '~25 km',
    duration: 'Half day',
    desc: 'A mysterious and sacred crater lake steeped in Luo legend. The lake is said to have swallowed a village — a site of cultural pilgrimage and natural wonder.',
    highlights: ['Local Legend Tour', 'Flamingo Watching', 'Nature Walk', 'Cultural Storytelling'],
    gradient: 'from-sky-900 to-sky-700',
    image: '/images/experiences/simbi-nyaima.jpg',
  },
  {
    id: 3,
    name: 'Kisii Cultural Experience',
    category: 'Culture',
    distance: '~50 km',
    duration: 'Full day',
    desc: 'Explore the vibrant Kisii region, famous for its soapstone carvings, thriving markets, and warm Gusii hospitality. Bring home authentic handcrafted keepsakes.',
    highlights: ['Soapstone Carving Workshops', 'Local Markets', 'Traditional Music', 'Gusii Cuisine'],
    gradient: 'from-gold-700 to-gold-500',
    image: '/images/experiences/kisii-cultural.jpg',
  },
  {
    id: 4,
    name: 'Rusinga Island',
    category: 'Nature & History',
    distance: '~60 km',
    duration: 'Full day',
    desc: 'An island on Lake Victoria rich in history and natural beauty. Home to the grave of Tom Mboya, ancient fossils, and pristine beaches.',
    highlights: ['Tom Mboya Mausoleum', 'Fossil Sites', 'Fishing Village', 'Beach Picnic'],
    gradient: 'from-sky-800 to-sky-600',
    image: '/images/experiences/rusinga-island.jpg',
  },
  {
    id: 5,
    name: 'Homa Hills',
    category: 'Adventure',
    distance: '~30 km',
    duration: 'Half day',
    desc: 'Hike the stunning Homa Hills for panoramic views over Lake Victoria and the surrounding landscape. A rewarding adventure for nature lovers.',
    highlights: ['Hiking Trails', 'Panoramic Views', 'Wildlife Spotting', 'Photography'],
    gradient: 'from-hotel-dark to-sky-800',
    image: '/images/experiences/homa-hills.jpg',
  },
  {
    id: 6,
    name: 'Local Market Tour',
    category: 'Culture',
    distance: 'In Oyugis',
    duration: '2–3 hours',
    desc: 'Explore the vibrant Oyugis market, a hub of local commerce, food, and culture. Sample local produce, street food, and interact with friendly locals.',
    highlights: ['Street Food Tasting', 'Fresh Produce', 'Local Crafts', 'Cultural Immersion'],
    gradient: 'from-gold-600 to-gold-400',
    image: '/images/experiences/local-market.jpg',
  },
]

export default function ExperiencesClient() {
  return (
    <>
      {/* Hero */}
      <div className="page-hero" style={{ backgroundImage: "url('/images/garden.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <p className="text-xs tracking-[0.2em] uppercase text-gold-400 mb-2">Beyond the Hotel</p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white">Experiences in Oyugis</h1>
          <p className="text-white/70 mt-3">Discover the wonders of western Kenya</p>
        </div>
      </div>

      <section className="py-20 bg-hotel-surface">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="eyebrow">Local Tourism</span>
            <h2 className="section-title">Explore Western Kenya</h2>
            <p className="section-desc">
              Oyugis is a gateway to some of Kenya's most beautiful and culturally rich destinations.
              Let us help you plan your perfect day trip.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {EXPERIENCES.map((exp, i) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.04 }}
                className="card overflow-hidden group"
              >
                <div className={`relative h-56 bg-gradient-to-br ${exp.gradient} overflow-hidden`}>
                  {exp.image && (
                    <Image
                      src={exp.image}
                      alt={exp.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <span className="absolute top-3 left-3 bg-white/90 text-hotel-dark text-xs font-semibold px-2 py-1 rounded z-10">
                    {exp.category}
                  </span>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3 text-xs text-hotel-muted">
                    <span className="flex items-center gap-1"><MapPin size={11} /> {exp.distance}</span>
                    <span className="flex items-center gap-1"><Clock size={11} /> {exp.duration}</span>
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-hotel-dark mb-2 group-hover:text-sky-400 transition-colors">
                    {exp.name}
                  </h3>
                  <p className="text-sm text-hotel-muted leading-relaxed mb-4">{exp.desc}</p>
                  <ul className="flex flex-wrap gap-2">
                    {exp.highlights.map(h => (
                      <span key={h} className="text-xs bg-sky-50 text-sky-600 px-2 py-1 rounded">
                        {h}
                      </span>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Concierge CTA */}
          <div className="mt-16 bg-hotel-dark rounded-xl p-10 text-center">
            <h3 className="font-heading text-2xl font-semibold text-white mb-3">
              Need Help Planning Your Excursion?
            </h3>
            <p className="text-white/55 text-sm mb-6 max-w-md mx-auto">
              Our concierge team can arrange transport, guides, and personalised itineraries for any of these experiences.
            </p>
            <Link href="/contact" className="btn-gold">
              Contact Concierge <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

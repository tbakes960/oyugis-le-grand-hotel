'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, Info } from 'lucide-react'

// 360° Virtual Tour using iframe embeds or pannellum viewer
// REPLACE: Add your real 360° photo equirectangular images under public/360/
// Each image should be a 2:1 equirectangular JPG (e.g. 4096×2048px)

const TOUR_SCENES = [
  {
    id: 'lobby',
    name: 'Hotel Lobby',
    desc: 'Welcome to the grand entrance of Oyugis Le Grand Hotel',
    /* REPLACE: panorama: '/360/lobby.jpg' */
    color: 'from-hotel-dark to-sky-800',
  },
  {
    id: 'deluxe-room',
    name: 'Deluxe Room',
    desc: 'Our elegantly furnished Deluxe Room with balcony view',
    /* REPLACE: panorama: '/360/deluxe-room.jpg' */
    color: 'from-sky-800 to-sky-600',
  },
  {
    id: 'restaurant',
    name: 'Restaurant',
    desc: 'Experience fine dining in our spacious restaurant',
    /* REPLACE: panorama: '/360/restaurant.jpg' */
    color: 'from-brown-700 to-brown-500',
  },
  {
    id: 'conference',
    name: 'Conference Hall',
    desc: 'State-of-the-art conference facilities for your events',
    /* REPLACE: panorama: '/360/conference.jpg' */
    color: 'from-sky-900 to-hotel-dark',
  },
  {
    id: 'pool',
    name: 'Swimming Pool',
    desc: 'Relax and unwind at our outdoor swimming pool',
    /* REPLACE: panorama: '/360/pool.jpg' */
    color: 'from-sky-700 to-sky-500',
  },
]

export default function VirtualTourPage() {
  const [activeScene, setActiveScene] = useState(TOUR_SCENES[0])

  return (
    <>
      {/* Hero */}
      <div className="page-hero" style={{ backgroundImage: "url('/images/entrance.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <p className="text-xs tracking-[0.2em] uppercase text-gold-400 mb-2">Oyugis Le Grand Hotel</p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white">360° Virtual Tour</h1>
          <p className="text-white/70 mt-3 text-sm">Explore our hotel from the comfort of your screen</p>
        </div>
      </div>

      <section className="py-16 bg-hotel-surface">
        <div className="max-w-7xl mx-auto px-6">

          {/* Scene Selector */}
          <div className="flex flex-wrap gap-3 justify-center mb-10">
            {TOUR_SCENES.map(scene => (
              <button
                key={scene.id}
                onClick={() => setActiveScene(scene)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border transition-all duration-200
                  ${activeScene.id === scene.id
                    ? 'bg-sky-400 text-white border-sky-400'
                    : 'border-gray-200 text-hotel-muted hover:border-sky-300 bg-white'
                  }`}
              >
                <Eye size={14} />
                {scene.name}
              </button>
            ))}
          </div>

          {/* Viewer */}
          <motion.div
            key={activeScene.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="relative rounded-xl overflow-hidden shadow-xl"
            style={{ height: '520px' }}
          >
            <div className={`w-full h-full bg-gradient-to-br ${activeScene.color} flex flex-col items-center justify-center gap-4`}>
              <div className="w-20 h-20 rounded-full border-4 border-white/20 flex items-center justify-center">
                <Eye size={36} className="text-white/50" />
              </div>
              <div className="text-center">
                <p className="text-white font-heading text-xl font-semibold mb-2">{activeScene.name}</p>
                <p className="text-white/50 text-sm max-w-xs">360° panoramic view coming soon</p>
              </div>
            </div>
          </motion.div>

          <p className="text-center text-hotel-muted text-sm mt-4 flex items-center justify-center gap-2">
            <Info size={14} />
            {activeScene.desc}
          </p>

          {/* Coming soon notice for visitors */}
          <div className="mt-10 bg-hotel-dark/5 border border-hotel-dark/10 rounded-lg p-6 max-w-xl mx-auto text-center">
            <p className="font-heading text-hotel-dark font-semibold mb-1">360° Tour Coming Soon</p>
            <p className="text-sm text-hotel-muted">
              Our immersive virtual tour is being prepared. In the meantime, browse our{' '}
              <a href="/gallery" className="text-sky-400 hover:underline">Photo Gallery</a> or{' '}
              <a href="/contact" className="text-sky-400 hover:underline">contact us</a> to arrange a visit.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

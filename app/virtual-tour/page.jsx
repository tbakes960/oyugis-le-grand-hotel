'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, X, ZoomIn, Info } from 'lucide-react'

const TOUR_SCENES = [
  {
    id: 'lobby',
    name: 'Hotel Lobby',
    desc: 'Welcome to the grand entrance of Oyugis Le Grand Hotel',
    image: '/images/tour/lobby.jpg',
  },
  {
    id: 'deluxe-room',
    name: 'Deluxe Room',
    desc: 'Our elegantly furnished Deluxe Room with balcony view',
    image: '/images/tour/deluxe-room.jpg',
  },
  {
    id: 'restaurant',
    name: 'Restaurant',
    desc: 'Experience fine dining in our spacious restaurant',
    image: '/images/tour/restaurant.jpg',
  },
  {
    id: 'conference',
    name: 'Conference Hall',
    desc: 'State-of-the-art conference facilities for your events',
    image: '/images/tour/conference.jpg',
  },
  {
    id: 'pool',
    name: 'Swimming Pool',
    desc: 'Relax and unwind at our outdoor swimming pool',
    image: '/images/tour/pool.jpg',
  },
]

export default function VirtualTourPage() {
  const [activeScene, setActiveScene] = useState(TOUR_SCENES[0])
  const [lightboxOpen, setLightboxOpen] = useState(false)

  return (
    <>
      {/* Hero */}
      <div className="page-hero" style={{ backgroundImage: "url('/images/entrance.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <p className="text-xs tracking-[0.2em] uppercase text-gold-400 mb-2">Oyugis Le Grand Hotel</p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white">Virtual Tour</h1>
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

          {/* Main Viewer */}
          <motion.div
            key={activeScene.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
            className="relative rounded-xl overflow-hidden shadow-xl cursor-zoom-in group"
            style={{ height: '520px' }}
            onClick={() => setLightboxOpen(true)}
          >
            <img
              src={activeScene.image}
              alt={activeScene.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                <ZoomIn size={28} className="text-white" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
              <p className="text-white font-heading text-xl font-semibold">{activeScene.name}</p>
            </div>
          </motion.div>

          <p className="text-center text-hotel-muted text-sm mt-4 flex items-center justify-center gap-2">
            <Info size={14} />
            {activeScene.desc} — click the image to view full screen
          </p>

          {/* Thumbnail Strip */}
          <div className="mt-8 grid grid-cols-5 gap-3">
            {TOUR_SCENES.map(scene => (
              <button
                key={scene.id}
                onClick={() => setActiveScene(scene)}
                className={`relative rounded-lg overflow-hidden h-20 transition-all duration-200 ${
                  activeScene.id === scene.id
                    ? 'ring-2 ring-sky-400 ring-offset-2'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={scene.image}
                  alt={scene.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-end p-1.5">
                  <span className="text-white text-[10px] font-semibold leading-tight">{scene.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
              onClick={() => setLightboxOpen(false)}
            >
              <X size={32} />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={activeScene.image}
              alt={activeScene.name}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={e => e.stopPropagation()}
            />
            <p className="absolute bottom-6 text-white/70 text-sm font-heading">{activeScene.name}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

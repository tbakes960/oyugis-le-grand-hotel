'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'

const PHOTOS = [
  // ── Rooms ────────────────────────────────────────────────
  { id: 1,  category: 'Rooms',       caption: 'Standard Room',              src: '/images/standard room.jpg'           },
  { id: 2,  category: 'Rooms',       caption: 'Twin Room',                  src: '/images/twin room.jpg'               },
  { id: 3,  category: 'Rooms',       caption: 'Room with a View',           src: '/images/twin room window.jpg'        },
  { id: 4,  category: 'Rooms',       caption: 'Executive Room',             src: '/images/executive room.jpg'          },
  // ── Dining ───────────────────────────────────────────────
  { id: 5,  category: 'Dining',      caption: 'Restaurant',                 src: '/images/restaurant.jpg'              },
  { id: 6,  category: 'Dining',      caption: 'Buffet Spread',              src: '/images/buffet.jpg'                  },
  { id: 7,  category: 'Dining',      caption: 'Outdoor Dining',             src: '/images/soft buffet.jpg'             },
  { id: 8,  category: 'Dining',      caption: 'Bar & Drinks',               src: '/images/bar.jpg'                     },
  { id: 9,  category: 'Dining',      caption: 'Our Tables',                 src: '/images/tables.jpg'                  },
  { id: 10, category: 'Dining',      caption: 'Fine Plating',               src: '/images/plates.jpg'                  },
  { id: 11, category: 'Dining',      caption: 'Kitchen Preparation',        src: '/images/DSC_0377.JPG'                },
  { id: 12, category: 'Dining',      caption: 'Signature Fried Tilapia',    src: '/images/fish.jpg'                    },
  { id: 13, category: 'Dining',      caption: 'Samosa',                     src: '/images/samosa.jpg'                  },
  // ── Events ───────────────────────────────────────────────
  { id: 14, category: 'Events',      caption: 'Conference Room',            src: '/images/conference room.jpg'         },
  { id: 15, category: 'Events',      caption: 'Conference in Session',      src: '/images/IMG-20230317-WA0004.jpg'     },
  { id: 16, category: 'Events',      caption: 'Event Setup',                src: '/images/setup.jpg'                   },
  { id: 17, category: 'Events',      caption: 'Conference Area',            src: '/images/conference area.jpg'         },
  // ── Exterior ─────────────────────────────────────────────
  { id: 18, category: 'Exterior',    caption: 'Hotel Exterior — Full View', src: '/images/Side View.jpg'               },
  { id: 19, category: 'Exterior',    caption: 'Main Entrance',              src: '/images/Main Entrance.jpg'           },
  { id: 20, category: 'Exterior',    caption: 'Hotel Gate',                 src: '/images/Main Gate.jpg'               },
  { id: 21, category: 'Exterior',    caption: 'Hotel Signage',              src: '/images/Main Entrance Logo.jpg'      },
  { id: 22, category: 'Exterior',    caption: 'Welcome Sign — Night',       src: '/images/Main Entrance Night.jpg'     },
  { id: 23, category: 'Exterior',    caption: 'Hotel Garden',               src: '/images/garden.jpg'                  },
  { id: 24, category: 'Exterior',    caption: 'Hotel Entrance',             src: '/images/entrance.jpg'                },
  { id: 25, category: 'Exterior',    caption: 'Secure Parking',             src: '/images/Parking lot.jpg'            },
  // ── Lobby ────────────────────────────────────────────────
  { id: 26, category: 'Lobby',       caption: 'Front Office',               src: '/images/front office.jpg'            },
  { id: 27, category: 'Lobby',       caption: 'Hotel Lounge',               src: '/images/Lounge.jpg'                  },
  { id: 28, category: 'Lobby',       caption: 'Service Staff',              src: '/images/service staff.png'           },
  // ── Fitness ──────────────────────────────────────────────
  { id: 29, category: 'Fitness',     caption: 'Gym',                        src: '/images/gym.jpg'                     },
  { id: 30, category: 'Fitness',     caption: 'Fitness Equipment',          src: '/images/dumbbells.jpg'               },
  // ── Experiences ──────────────────────────────────────────
  { id: 31, category: 'Experiences', caption: 'Lake Victoria at Dawn',      src: '/images/20230206_080821.jpg'         },
  { id: 32, category: 'Experiences', caption: 'Fishing Boats at the Lake',  src: '/images/20230206_083855.jpg'         },
  { id: 33, category: 'Experiences', caption: 'Lake Victoria Shore',        src: '/images/20230206_083913.jpg'         },
  { id: 34, category: 'Experiences', caption: 'Papyrus Island — Wildlife',  src: '/images/20230206_090347.jpg'         },
  { id: 35, category: 'Experiences', caption: 'Birds on the Lake',          src: '/images/FADW.jpg'                    },
]

const CATEGORIES = ['All', ...new Set(PHOTOS.map(p => p.category))]

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [lightbox, setLightbox] = useState(null) // index in filtered array

  const filtered = activeCategory === 'All' ? PHOTOS : PHOTOS.filter(p => p.category === activeCategory)

  const prev = () => setLightbox(l => (l - 1 + filtered.length) % filtered.length)
  const next = () => setLightbox(l => (l + 1) % filtered.length)

  return (
    <>
      {/* Hero */}
      <div className="page-hero" style={{ backgroundImage: "url('/images/Side%20View.jpg')", backgroundSize: 'cover', backgroundPosition: 'center 40%' }}>
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <p className="text-xs tracking-[0.2em] uppercase text-gold-400 mb-2">Oyugis Le Grand Hotel</p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white">Gallery</h1>
        </div>
      </div>

      <section className="py-20 bg-hotel-surface">
        <div className="max-w-7xl mx-auto px-6">

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 text-xs font-semibold tracking-wider uppercase rounded-full border transition-all duration-200
                  ${activeCategory === cat
                    ? 'bg-sky-400 border-sky-400 text-white'
                    : 'border-gray-200 text-hotel-muted hover:border-sky-300 bg-white'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
            >
              {filtered.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                  className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group"
                  onClick={() => setLightbox(index)}
                >
                  <Image src={photo.src} alt={photo.caption} fill sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-cover" />
                  <div className="absolute inset-0 bg-hotel-dark/0 group-hover:bg-hotel-dark/50 transition-all duration-300
                                  flex items-center justify-center">
                    <ZoomIn size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent
                                  translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-xs font-medium">{photo.caption}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/92 z-50 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button className="absolute top-5 right-5 text-white/70 hover:text-white" onClick={() => setLightbox(null)}>
              <X size={28} />
            </button>
            <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white" onClick={e => { e.stopPropagation(); prev() }}>
              <ChevronLeft size={36} />
            </button>
            <motion.div
              key={lightbox}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-4xl w-full max-h-[80vh] relative rounded-lg overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative w-full h-[70vh]">
                <Image src={filtered[lightbox].src} alt={filtered[lightbox].caption} fill sizes="100vw" className="object-contain" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-5">
                <p className="text-white font-medium">{filtered[lightbox].caption}</p>
                <p className="text-white/50 text-sm">{lightbox + 1} / {filtered.length}</p>
              </div>
            </motion.div>
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white" onClick={e => { e.stopPropagation(); next() }}>
              <ChevronRight size={36} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

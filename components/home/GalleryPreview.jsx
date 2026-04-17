'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Camera } from 'lucide-react'

const PHOTOS = [
  { id: 1, span: 'row-span-2 col-span-1', src: '/images/front office.jpg',    caption: 'Hotel Lobby',      priority: true },
  { id: 2, span: '',                       src: '/images/twin room.jpg',       caption: 'Twin Room'         },
  { id: 3, span: '',                       src: '/images/restaurant.jpg',      caption: 'Restaurant'        },
  { id: 4, span: '',                       src: '/images/conference room.jpg', caption: 'Conference Hall'   },
  { id: 5, span: '',                       src: '/images/garden.jpg',          caption: 'Hotel Garden'      },
]

export default function GalleryPreview() {
  return (
    <section className="py-28 bg-hotel-surface">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-14">
          <span className="eyebrow">Gallery</span>
          <h2 className="section-title">A Glimpse of Grand Living</h2>
          <div className="gold-divider" />
          <p className="section-desc">
            Every corner of Oyugis Le Grand is crafted to inspire — from the lobby to your room.
          </p>
        </div>

        {/* Asymmetric grid */}
        <div className="grid grid-cols-3 grid-rows-2 gap-3 h-[480px] md:h-[540px]">
          {PHOTOS.map(({ id, span, src, caption, priority }, i) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className={`relative overflow-hidden rounded-2xl group cursor-pointer ${span}`}
            >
              <Image
                src={src}
                alt={caption}
                fill
                priority={priority}
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover object-center group-hover:scale-105
                           transition-transform duration-700 ease-out"
              />

              {/* Dark vignette — always slightly visible */}
              <div className="absolute inset-0 bg-gradient-to-t from-hotel-dark/70 via-hotel-dark/10 to-transparent
                              opacity-50 group-hover:opacity-100 transition-all duration-400" />

              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2
                              group-hover:translate-y-0 opacity-0 group-hover:opacity-100
                              transition-all duration-300">
                <div className="flex items-center gap-2">
                  <Camera size={12} className="text-gold-400 flex-shrink-0" />
                  <span className="text-white text-sm font-semibold font-heading leading-tight">
                    {caption}
                  </span>
                </div>
              </div>

              {/* Gold ring on hover */}
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10
                              group-hover:ring-gold-400/40 transition-all duration-300" />
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/gallery" className="btn-outline-dark">
            View Full Gallery <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  )
}

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Users, Check } from 'lucide-react'
import toast from 'react-hot-toast'

const HALLS = [
  {
    id: 'boardroom',
    name: 'Boardroom',
    capacity: 10,
    size: '30 m²',
    pricePerDay: 2800,
    desc: 'Ideal for executive meetings, interviews, and small group sessions. Features a central boardroom table in a professional setting.',
    features: ['High-speed Wi-Fi', 'HD Projector & Screen', 'Whiteboard', 'Natural Lighting', 'Video Conferencing Setup'],
    src: '/images/conference room.jpg',
  },
  {
    id: 'lounge',
    name: 'Lounge Hall',
    capacity: 30,
    size: '60 m²',
    pricePerDay: 2800,
    desc: 'A versatile space perfect for workshops, training sessions, and mid-size meetings with flexible seating arrangements.',
    features: ['High-speed Wi-Fi', 'Projector & Screen', 'Whiteboard', 'Flexible Seating', 'Catering Station'],
    src: '/images/Lounge.jpg',
  },
  {
    id: 'main',
    name: 'Main Conference Hall',
    capacity: 50,
    size: '120 m²',
    pricePerDay: 3000,
    desc: 'Our main conference space — well-equipped for corporate events, seminars, product launches, and training programmes.',
    features: ['High-speed Wi-Fi', 'Projector & Screen', 'Sound System', 'Flexible Seating', 'Dedicated Coordinator', 'Catering Available'],
    src: '/images/IMG-20230317-WA0004.jpg',
    tag: 'Popular',
  },
  {
    id: 'rooftop',
    name: 'Rooftop Hall',
    capacity: 150,
    size: '300 m²',
    pricePerDay: 3000,
    desc: 'Our grandest venue for large conferences, weddings, graduations, and gala events — with stunning open-air ambience.',
    features: ['High-speed Wi-Fi', 'Sound System', 'Panoramic Views', 'Flexible Layout', 'Full Catering Available', 'Natural Ventilation'],
    src: '/images/setup.jpg',
    tag: 'Grand',
  },
]

const EVENT_TYPES = ['Conference', 'Wedding', 'Birthday Party', 'Meeting', 'Training / Workshop', 'Product Launch', 'Graduation', 'Other']

export default function ConferencesPage() {
  const [form, setForm] = useState({
    organizerName: '', email: '', phone: '', organization: '',
    eventType: '', hallSize: '', attendees: '', date: '',
    startTime: '', endTime: '', cateringNeeded: false, cateringNotes: '',
    equipment: [], specialNeeds: '',
  })
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/conferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        toast.success('Enquiry sent! We\'ll get back to you within 24 hours.')
        setForm({ organizerName: '', email: '', phone: '', organization: '', eventType: '', hallSize: '', attendees: '', date: '', startTime: '', endTime: '', cateringNeeded: false, cateringNotes: '', equipment: [], specialNeeds: '' })
      } else {
        toast.error('Something went wrong. Please try again.')
      }
    } catch {
      toast.error('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Hero */}
      <div className="page-hero" style={{ backgroundImage: "url('/images/conference%20area.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <p className="text-xs tracking-[0.2em] uppercase text-gold-400 mb-2">Oyugis Le Grand Hotel</p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white">Conferences &amp; Events</h1>
        </div>
      </div>

      {/* Halls Section */}
      <section className="py-20 bg-hotel-surface">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="eyebrow">Our Venues</span>
            <h2 className="section-title">World-Class Event Spaces</h2>
            <p className="section-desc">
              From intimate boardroom meetings to grand weddings — we have the perfect space for your event.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {HALLS.map((hall, i) => (
              <motion.div
                key={hall.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="card overflow-hidden"
              >
                <div className="relative h-52">
                  <Image
                    src={hall.src}
                    alt={hall.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover object-center"
                  />
                  {hall.tag && (
                    <span className="absolute top-3 right-3 bg-gold-400 text-hotel-dark text-xs font-bold px-2 py-0.5 rounded">
                      {hall.tag}
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex gap-4 mb-3 text-xs text-hotel-muted">
                    <span className="flex items-center gap-1"><Users size={12} /> Up to {hall.capacity} pax</span>
                    <span>{hall.size}</span>
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-hotel-dark mb-2">{hall.name}</h3>
                  <p className="text-sm text-hotel-muted leading-relaxed mb-4">{hall.desc}</p>
                  <ul className="space-y-1.5 mb-5">
                    {hall.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-xs text-hotel-dark">
                        <Check size={11} className="text-sky-400" /> {f}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <span className="text-xs text-hotel-muted">from </span>
                      <span className="font-bold text-hotel-dark">KES {hall.pricePerDay.toLocaleString()}</span>
                      <span className="text-xs text-hotel-muted"> /day</span>
                    </div>
                    <a href="#enquiry-form" className="btn-primary text-xs py-2 px-4">Enquire</a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Enquiry Form */}
          <div id="enquiry-form" className="max-w-2xl mx-auto bg-white rounded-xl shadow-card p-8">
            <h3 className="font-heading text-2xl font-semibold text-hotel-dark mb-2 text-center">
              Send an Enquiry
            </h3>
            <p className="text-hotel-muted text-sm text-center mb-8">
              Fill in the form below and our events team will respond within 24 hours.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Your Name *</label>
                  <input className="form-input" required value={form.organizerName} onChange={e => set('organizerName', e.target.value)} placeholder="Full name" />
                </div>
                <div>
                  <label className="form-label">Email *</label>
                  <input className="form-input" type="email" required value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@example.com" />
                </div>
                <div>
                  <label className="form-label">Phone *</label>
                  <input className="form-input" required value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+254 7XX XXX XXX" />
                </div>
                <div>
                  <label className="form-label">Organisation</label>
                  <input className="form-input" value={form.organization} onChange={e => set('organization', e.target.value)} placeholder="Company / NGO / Individual" />
                </div>
                <div>
                  <label className="form-label">Event Type *</label>
                  <select className="form-select" required value={form.eventType} onChange={e => set('eventType', e.target.value)}>
                    <option value="">Select event type</option>
                    {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Hall Size *</label>
                  <select className="form-select" required value={form.hallSize} onChange={e => set('hallSize', e.target.value)}>
                    <option value="">Select hall</option>
                    {HALLS.map(h => <option key={h.id} value={h.id}>{h.name} (up to {h.capacity} pax)</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Number of Attendees *</label>
                  <input className="form-input" type="number" min="1" required value={form.attendees} onChange={e => set('attendees', e.target.value)} placeholder="e.g. 40" />
                </div>
                <div>
                  <label className="form-label">Event Date *</label>
                  <input className="form-input" type="date" required value={form.date} onChange={e => set('date', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Start Time</label>
                  <input className="form-input" type="time" value={form.startTime} onChange={e => set('startTime', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">End Time</label>
                  <input className="form-input" type="time" value={form.endTime} onChange={e => set('endTime', e.target.value)} />
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-sky-400" checked={form.cateringNeeded} onChange={e => set('cateringNeeded', e.target.checked)} />
                <span className="text-sm text-hotel-dark">Catering required</span>
              </label>

              {form.cateringNeeded && (
                <div>
                  <label className="form-label">Catering Notes</label>
                  <textarea className="form-input" rows="2" value={form.cateringNotes} onChange={e => set('cateringNotes', e.target.value)} placeholder="Dietary requirements, preferred menu style..." />
                </div>
              )}

              <div>
                <label className="form-label">Special Requirements</label>
                <textarea className="form-input" rows="3" value={form.specialNeeds} onChange={e => set('specialNeeds', e.target.value)} placeholder="Any other requirements..." />
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-2">
                {loading ? 'Sending...' : 'Submit Enquiry'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}

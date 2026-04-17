'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [form, setForm]     = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        toast.success('Message sent! We\'ll respond within 24 hours.')
        setForm({ name: '', email: '', phone: '', subject: '', message: '' })
      } else {
        toast.error('Failed to send message. Please try again.')
      }
    } catch {
      toast.error('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const CONTACT_INFO = [
    { Icon: MapPin, label: 'Address',   value: 'Kisumu-Kisii Road, Oyugis Town, Homa Bay County, Kenya' },
    { Icon: Phone,  label: 'Phone',     value: '+254 799 200050' },
    { Icon: Mail,   label: 'Email',     value: 'hotellegrand619@gmail.com' },
    { Icon: Clock,  label: 'Reception', value: 'Open 24 hours, 7 days a week' },
  ]

  // REPLACE: Update with your real WhatsApp number
  const whatsappUrl = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '254799200050'}?text=${encodeURIComponent('Hello! I would like to enquire about your hotel.')}`

  return (
    <>
      {/* Hero */}
      <div className="page-hero" style={{ backgroundImage: "url('/images/front%20office.jpg')", backgroundSize: 'cover', backgroundPosition: 'center 30%' }}>
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <p className="text-xs tracking-[0.2em] uppercase text-gold-400 mb-2">We'd Love to Hear From You</p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white">Contact Us</h1>
        </div>
      </div>

      <section className="py-20 bg-hotel-surface">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">

            {/* Left — Info */}
            <div>
              <span className="eyebrow">Get In Touch</span>
              <h2 className="font-heading text-3xl font-semibold text-hotel-dark mb-4">
                We're Here to Help
              </h2>
              <p className="text-hotel-muted text-sm leading-relaxed mb-10">
                Whether you have a question, need help with a booking, or want to plan a special event —
                our team is always happy to assist.
              </p>

              {/* Contact cards */}
              <div className="space-y-5 mb-10">
                {CONTACT_INFO.map(({ Icon, label, value }) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100"
                  >
                    <div className="w-10 h-10 rounded-full bg-sky-50 flex items-center justify-center flex-shrink-0">
                      <Icon size={18} className="text-sky-400" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold tracking-wider uppercase text-hotel-muted mb-0.5">{label}</p>
                      <p className="text-hotel-dark text-sm font-medium">{value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* WhatsApp CTA */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-[#25D366] text-white font-semibold text-sm
                           px-6 py-3.5 rounded-lg hover:bg-[#20BD5A] transition-colors duration-200"
              >
                <MessageCircle size={18} />
                Chat on WhatsApp
              </a>
            </div>

            {/* Right — Form */}
            <div>
              <div className="bg-white rounded-xl shadow-card p-8">
                <h3 className="font-heading text-xl font-semibold text-hotel-dark mb-6">Send a Message</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Full Name *</label>
                      <input className="form-input" required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Your full name" />
                    </div>
                    <div>
                      <label className="form-label">Email *</label>
                      <input className="form-input" type="email" required value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@example.com" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Phone</label>
                      <input className="form-input" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+254 7XX XXX XXX" />
                    </div>
                    <div>
                      <label className="form-label">Subject *</label>
                      <select className="form-select" required value={form.subject} onChange={e => set('subject', e.target.value)}>
                        <option value="">Select subject</option>
                        <option>Room Reservation Enquiry</option>
                        <option>Conference / Event Booking</option>
                        <option>Restaurant Reservation</option>
                        <option>General Enquiry</option>
                        <option>Feedback / Complaint</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Message *</label>
                    <textarea className="form-input" rows="5" required value={form.message} onChange={e => set('message', e.target.value)} placeholder="How can we help you?" />
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                    {loading ? 'Sending...' : <><Send size={15} /> Send Message</>}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="mt-16 rounded-xl overflow-hidden shadow-lg h-80">
            <iframe
              src="https://maps.google.com/maps?q=Le+Grand+Hotel+Oyugis+Kenya&t=&z=17&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Le Grand Hotel Location — Kisumu-Kisii Road, Oyugis"
            />
          </div>
        </div>
      </section>
    </>
  )
}

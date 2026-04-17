'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Calendar, Users, BedDouble, Search } from 'lucide-react'

export default function BookingWidget() {
  const router = useRouter()
  const today  = new Date().toISOString().split('T')[0]

  const [form, setForm] = useState({
    checkIn:  today,
    checkOut: '',
    guests:   '2',
    roomType: '',
  })

  const set = (key, value) => setForm(f => ({ ...f, [key]: value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const params = new URLSearchParams(form).toString()
    router.push(`/booking?${params}`)
  }

  return (
    <div className="relative z-20 -mt-10 px-4 md:px-6 pb-2">
      <motion.div
        initial={{ y: 48, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.75, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-5xl mx-auto"
      >
        {/* Floating label */}
        <div className="flex items-center justify-center mb-3">
          <span className="glass-dark rounded-full px-5 py-1.5 text-[10px] tracking-[0.22em]
                           uppercase text-gold-400 font-semibold shadow-glass">
            Check Availability
          </span>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl overflow-hidden shadow-deep
                     grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1fr_auto]"
        >
          {/* Field component helper */}
          {[
            {
              id: 'checkIn', label: 'Check-in', Icon: Calendar,
              input: (
                <input
                  type="date" min={today} value={form.checkIn} required
                  onChange={e => set('checkIn', e.target.value)}
                  className="w-full border-0 p-0 text-hotel-dark font-semibold text-sm
                             bg-transparent focus:outline-none focus:ring-0 mt-1"
                />
              ),
            },
            {
              id: 'checkOut', label: 'Check-out', Icon: Calendar,
              input: (
                <input
                  type="date" min={form.checkIn || today} value={form.checkOut} required
                  onChange={e => set('checkOut', e.target.value)}
                  className="w-full border-0 p-0 text-hotel-dark font-semibold text-sm
                             bg-transparent focus:outline-none focus:ring-0 mt-1"
                />
              ),
            },
            {
              id: 'guests', label: 'Guests', Icon: Users,
              input: (
                <select
                  value={form.guests}
                  onChange={e => set('guests', e.target.value)}
                  className="w-full border-0 p-0 text-hotel-dark font-semibold text-sm
                             bg-transparent focus:outline-none focus:ring-0 mt-1 appearance-none"
                >
                  {[1, 2, 3, 4, '5+'].map(n => (
                    <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
              ),
            },
            {
              id: 'roomType', label: 'Room Type', Icon: BedDouble,
              input: (
                <select
                  value={form.roomType}
                  onChange={e => set('roomType', e.target.value)}
                  className="w-full border-0 p-0 text-hotel-dark font-semibold text-sm
                             bg-transparent focus:outline-none focus:ring-0 mt-1 appearance-none"
                >
                  <option value="">Any Room</option>
                  <option value="STANDARD">Standard Room</option>
                  <option value="DELUXE">Deluxe Room</option>
                  <option value="TWIN">Twin Room</option>
                  <option value="EXECUTIVE">Executive Room</option>
                </select>
              ),
            },
          ].map(({ id, label, Icon, input }) => (
            <div
              key={id}
              className="group px-6 py-5 border-b md:border-b-0 md:border-r border-gray-100
                         hover:bg-sky-50/60 transition-colors duration-200 cursor-text"
            >
              <label className="flex items-center gap-1.5 text-[10px] font-semibold tracking-widest
                                uppercase text-hotel-muted group-hover:text-sky-500 transition-colors mb-0.5"
                     htmlFor={id}>
                <Icon size={10} />
                {label}
              </label>
              {input}
            </div>
          ))}

          {/* Search button */}
          <button
            type="submit"
            className="flex items-center justify-center gap-2.5 px-8 py-5
                       font-bold text-xs tracking-[0.12em] uppercase text-white
                       transition-all duration-300 hover:opacity-90
                       rounded-b-2xl md:rounded-b-none md:rounded-r-2xl"
            style={{ background: 'linear-gradient(135deg, #0A2F3C 0%, #144F60 100%)' }}
          >
            <Search size={15} />
            <span className="hidden sm:inline">Check Availability</span>
            <span className="sm:hidden">Search</span>
          </button>
        </form>
      </motion.div>
    </div>
  )
}

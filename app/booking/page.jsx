'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { BedDouble, Users, Calendar, CreditCard, Smartphone, Check, ArrowRight, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

const ROOM_TYPES = [
  { value: 'STANDARD',  label: 'Standard Room',  price: 3000 },
  { value: 'DELUXE',    label: 'Deluxe Room',    price: 3500 },
  { value: 'TWIN',      label: 'Twin Room',      price: 3500 },
  { value: 'EXECUTIVE', label: 'Executive Room', price: 4000 },
]

const STEPS = ['Stay Details', 'Guest Info', 'Payment', 'Confirmation']

function BookingForm() {
  const searchParams = useSearchParams()
  const today = new Date().toISOString().split('T')[0]

  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [bookingRef, setBookingRef] = useState(null)

  const [form, setForm] = useState({
    // Step 1
    checkIn:   searchParams.get('checkIn')  || today,
    checkOut:  searchParams.get('checkOut') || '',
    adults:    Number(searchParams.get('guests')) || 2,
    children:  0,
    roomType:  searchParams.get('roomType') || 'STANDARD',
    // Step 2
    guestName:  '',
    guestEmail: '',
    guestPhone: '',
    specialRequests: '',
    // Step 3
    paymentMethod: 'MPESA',
    mpesaPhone: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc:    '',
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const selectedRoom = ROOM_TYPES.find(r => r.value === form.roomType) || ROOM_TYPES[1]

  const nights = (() => {
    if (!form.checkIn || !form.checkOut) return 0
    const diff = new Date(form.checkOut) - new Date(form.checkIn)
    return Math.max(0, Math.floor(diff / 86400000))
  })()

  const totalAmount = selectedRoom.price * nights

  const handleNextStep = () => {
    if (step === 0 && (!form.checkIn || !form.checkOut || nights < 1)) {
      toast.error('Please select valid check-in and check-out dates')
      return
    }
    if (step === 1 && (!form.guestName || !form.guestEmail || !form.guestPhone)) {
      toast.error('Please fill in all required guest details')
      return
    }
    setStep(s => s + 1)
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, nights, totalAmount }),
      })
      const data = await res.json()
      if (res.ok) {
        setBookingRef(data.bookingRef)
        setStep(3)
      } else {
        toast.error(data.error || 'Booking failed. Please try again.')
      }
    } catch {
      toast.error('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-12">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
              ${i < step  ? 'bg-sky-400 text-white' :
                i === step ? 'bg-hotel-dark text-white' :
                             'bg-gray-200 text-hotel-muted'}`}>
              {i < step ? <Check size={14} /> : i + 1}
            </div>
            <span className={`hidden md:block ml-2 mr-6 text-xs font-semibold tracking-wide
              ${i === step ? 'text-hotel-dark' : 'text-hotel-muted'}`}>
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <div className={`w-8 h-[2px] mx-2 ${i < step ? 'bg-sky-400' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Form Panel */}
        <div className="lg:col-span-2">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-card p-8"
          >

            {/* STEP 0 — Stay Details */}
            {step === 0 && (
              <div className="space-y-5">
                <h2 className="font-heading text-2xl font-semibold text-hotel-dark mb-6">Choose Your Stay</h2>
                <div>
                  <label className="form-label">Room Type</label>
                  <div className="space-y-3">
                    {ROOM_TYPES.map(rt => (
                      <label key={rt.value} className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all
                        ${form.roomType === rt.value ? 'border-sky-400 bg-sky-50' : 'border-gray-200 hover:border-gray-300'}`}>
                        <div className="flex items-center gap-3">
                          <input type="radio" name="roomType" value={rt.value} checked={form.roomType === rt.value} onChange={e => set('roomType', e.target.value)} className="accent-sky-400" />
                          <span className="font-medium text-hotel-dark text-sm">{rt.label}</span>
                        </div>
                        <span className="text-sm font-bold text-hotel-dark">KES {rt.price.toLocaleString()}<span className="text-xs text-hotel-muted font-normal">/night</span></span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Check-in Date *</label>
                    <input className="form-input" type="date" min={today} value={form.checkIn} onChange={e => set('checkIn', e.target.value)} required />
                  </div>
                  <div>
                    <label className="form-label">Check-out Date *</label>
                    <input className="form-input" type="date" min={form.checkIn || today} value={form.checkOut} onChange={e => set('checkOut', e.target.value)} required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Adults *</label>
                    <select className="form-select" value={form.adults} onChange={e => set('adults', Number(e.target.value))}>
                      {[1,2,3,4].map(n => <option key={n} value={n}>{n} Adult{n > 1 ? 's' : ''}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Children</label>
                    <select className="form-select" value={form.children} onChange={e => set('children', Number(e.target.value))}>
                      {[0,1,2,3].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Child' : 'Children'}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 1 — Guest Info */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="font-heading text-2xl font-semibold text-hotel-dark mb-6">Guest Information</h2>
                <div>
                  <label className="form-label">Full Name *</label>
                  <input className="form-input" required value={form.guestName} onChange={e => set('guestName', e.target.value)} placeholder="As on your ID" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Email *</label>
                    <input className="form-input" type="email" required value={form.guestEmail} onChange={e => set('guestEmail', e.target.value)} placeholder="For confirmation" />
                  </div>
                  <div>
                    <label className="form-label">Phone *</label>
                    <input className="form-input" required value={form.guestPhone} onChange={e => set('guestPhone', e.target.value)} placeholder="+254 7XX XXX XXX" />
                  </div>
                </div>
                <div>
                  <label className="form-label">Special Requests</label>
                  <textarea className="form-input" rows="3" value={form.specialRequests} onChange={e => set('specialRequests', e.target.value)} placeholder="Early check-in, dietary requirements, bed preferences..." />
                </div>
              </div>
            )}

            {/* STEP 2 — Payment */}
            {step === 2 && (
              <div className="space-y-5">
                <h2 className="font-heading text-2xl font-semibold text-hotel-dark mb-6">Payment</h2>
                <div className="flex gap-3">
                  {[
                    { value: 'MPESA', label: 'M-Pesa', Icon: Smartphone },
                    { value: 'CARD',  label: 'Card',   Icon: CreditCard },
                  ].map(({ value, label, Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => set('paymentMethod', value)}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border font-semibold text-sm transition-all
                        ${form.paymentMethod === value ? 'border-sky-400 bg-sky-50 text-sky-400' : 'border-gray-200 text-hotel-muted'}`}
                    >
                      <Icon size={16} /> {label}
                    </button>
                  ))}
                </div>

                {form.paymentMethod === 'MPESA' && (
                  <div>
                    <label className="form-label">M-Pesa Phone Number *</label>
                    <input className="form-input" required value={form.mpesaPhone} onChange={e => set('mpesaPhone', e.target.value)} placeholder="+254 7XX XXX XXX" />
                    <p className="text-xs text-hotel-muted mt-1.5">
                      You will receive an M-Pesa STK Push prompt on this number to complete payment.
                    </p>
                  </div>
                )}

                {form.paymentMethod === 'CARD' && (
                  <div className="space-y-4">
                    <div>
                      <label className="form-label">Card Number *</label>
                      <input className="form-input" maxLength="19" value={form.cardNumber} onChange={e => set('cardNumber', e.target.value)} placeholder="1234 5678 9012 3456" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="form-label">Expiry Date *</label>
                        <input className="form-input" maxLength="5" value={form.cardExpiry} onChange={e => set('cardExpiry', e.target.value)} placeholder="MM/YY" />
                      </div>
                      <div>
                        <label className="form-label">CVC *</label>
                        <input className="form-input" maxLength="3" value={form.cardCvc} onChange={e => set('cardCvc', e.target.value)} placeholder="123" />
                      </div>
                    </div>
                    <p className="text-xs text-hotel-muted">Payments processed securely via Stripe. Your card details are never stored on our servers.</p>
                  </div>
                )}
              </div>
            )}

            {/* STEP 3 — Confirmation */}
            {step === 3 && (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-5">
                  <Check size={28} className="text-sky-400" />
                </div>
                <h2 className="font-heading text-2xl font-semibold text-hotel-dark mb-3">Booking Confirmed!</h2>
                <p className="text-hotel-muted text-sm mb-4">
                  Your reservation has been received. A confirmation has been sent to <strong>{form.guestEmail}</strong>.
                </p>
                <div className="bg-sky-50 rounded-lg p-4 mb-6 inline-block">
                  <p className="text-xs text-hotel-muted mb-1">Booking Reference</p>
                  <p className="font-mono font-bold text-hotel-dark text-lg">{bookingRef || 'XXXXXXXX'}</p>
                </div>
                <p className="text-hotel-muted text-xs">
                  Please present this reference at check-in. Questions? Call us or WhatsApp.
                </p>
              </div>
            )}

            {/* Navigation */}
            {step < 3 && (
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                {step > 0 ? (
                  <button type="button" onClick={() => setStep(s => s - 1)} className="btn-outline-dark text-xs py-2.5 px-4">
                    <ArrowLeft size={14} /> Back
                  </button>
                ) : <div />}
                {step < 2 ? (
                  <button type="button" onClick={handleNextStep} className="btn-primary text-xs py-2.5">
                    Continue <ArrowRight size={14} />
                  </button>
                ) : (
                  <button type="button" onClick={handleSubmit} disabled={loading} className="btn-gold text-xs py-2.5">
                    {loading ? 'Processing...' : 'Confirm & Pay'}
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </div>

        {/* Summary Panel */}
        <div className="lg:col-span-1">
          <div className="bg-hotel-dark rounded-xl p-6 text-white sticky top-24">
            <h3 className="font-heading text-lg font-semibold mb-5">Booking Summary</h3>
            <div className="space-y-3 text-sm mb-5">
              <div className="flex justify-between">
                <span className="text-white/60">Room</span>
                <span className="font-medium">{selectedRoom.label}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Check-in</span>
                <span>{form.checkIn || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Check-out</span>
                <span>{form.checkOut || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Nights</span>
                <span>{nights || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Guests</span>
                <span>{form.adults} adult{form.adults > 1 ? 's' : ''}{form.children > 0 ? `, ${form.children} child${form.children > 1 ? 'ren' : ''}` : ''}</span>
              </div>
            </div>
            <div className="border-t border-white/15 pt-4">
              <div className="flex justify-between mb-1">
                <span className="text-white/60 text-sm">KES {selectedRoom.price.toLocaleString()} × {nights} night{nights !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex justify-between mt-3">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-xl text-gold-400">
                  KES {totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
            <p className="text-white/35 text-xs mt-4">Includes all taxes and fees. Breakfast included.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BookingPage() {
  return (
    <>
      <div className="bg-hotel-dark pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs tracking-[0.2em] uppercase text-gold-400 mb-2">Reserve Your Stay</p>
          <h1 className="font-heading text-4xl font-bold text-white">Book a Room</h1>
        </div>
      </div>
      <div className="bg-hotel-surface min-h-screen">
        <Suspense fallback={<div className="py-20 text-center text-hotel-muted">Loading booking form...</div>}>
          <BookingForm />
        </Suspense>
      </div>
    </>
  )
}

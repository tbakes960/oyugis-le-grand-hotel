'use client'

// Admin: Reservations Management
// View all bookings from the JSON store (bookings.json)

import { useState, useEffect } from 'react'
import { Calendar, Search } from 'lucide-react'

const STATUS_BADGE = {
  PENDING:     'badge badge-yellow',
  CONFIRMED:   'badge badge-blue',
  CHECKED_IN:  'badge badge-green',
  CHECKED_OUT: 'badge badge-gray',
  CANCELLED:   'badge badge-red',
}

export default function ReservationsPage() {
  const [bookings, setBookings] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    fetch('/api/bookings').then(r => r.json()).then(data => setBookings([...data].reverse())).catch(() => {})
  }, [])

  const filtered = bookings.filter(b => {
    const matchSearch = !search || [b.guestName, b.guestEmail, b.bookingRef].some(
      v => v?.toLowerCase().includes(search.toLowerCase())
    )
    const matchStatus = !statusFilter || b.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-hotel-dark">Reservations</h1>
          <p className="text-hotel-muted text-sm mt-1">Manage all room bookings</p>
        </div>
        <a href="/booking" target="_blank"
           className="btn-primary text-xs py-2.5">
          New Manual Booking
        </a>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Search size={15} className="text-hotel-muted" />
          <input
            className="flex-1 text-sm outline-none placeholder:text-gray-300"
            placeholder="Search by name, email, or booking ref..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="form-select text-sm w-auto"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option>PENDING</option>
          <option>CONFIRMED</option>
          <option>CHECKED_IN</option>
          <option>CHECKED_OUT</option>
          <option>CANCELLED</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Ref</th>
              <th>Guest</th>
              <th>Room</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Payment</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-16 text-hotel-muted">
                  <Calendar size={28} className="mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">{bookings.length === 0 ? 'No reservations yet.' : 'No results match your search.'}</p>
                  {bookings.length === 0 && <p className="text-xs mt-1">Bookings submitted via the website will appear here.</p>}
                </td>
              </tr>
            ) : (
              filtered.map(b => (
                <tr key={b.id}>
                  <td className="font-mono text-xs">{b.bookingRef}</td>
                  <td>
                    <div>
                      <p className="font-medium">{b.guestName}</p>
                      <p className="text-xs text-hotel-muted">{b.guestEmail}</p>
                    </div>
                  </td>
                  <td>{b.roomType}</td>
                  <td>{b.checkIn}</td>
                  <td>{b.checkOut}</td>
                  <td className="font-semibold">KES {Number(b.totalAmount).toLocaleString()}</td>
                  <td><span className={STATUS_BADGE[b.status] || 'badge badge-gray'}>{b.status}</span></td>
                  <td><span className={`badge ${b.paymentStatus === 'PAID' ? 'badge-green' : 'badge-yellow'}`}>{b.paymentStatus}</span></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

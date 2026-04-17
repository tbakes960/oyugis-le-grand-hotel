'use client'

import { useState } from 'react'
import { BedDouble, Plus, Pencil, Eye } from 'lucide-react'

export default function AdminRoomsPage() {
  // REPLACE: Fetch rooms from database
  const [rooms] = useState([])

  const STATUS_COLORS = {
    AVAILABLE:   'badge-green',
    OCCUPIED:    'badge-blue',
    MAINTENANCE: 'badge-red',
    CLEANING:    'badge-yellow',
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-hotel-dark">Rooms</h1>
          <p className="text-hotel-muted text-sm mt-1">Manage room availability and pricing</p>
        </div>
        <button className="btn-primary text-xs py-2.5">
          <Plus size={14} /> Add Room
        </button>
      </div>

      {/* Availability Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Available',   color: 'bg-emerald-50 text-emerald-600 border-emerald-100', count: 0 },
          { label: 'Occupied',    color: 'bg-sky-50 text-sky-600 border-sky-100',             count: 0 },
          { label: 'Cleaning',    color: 'bg-amber-50 text-amber-600 border-amber-100',       count: 0 },
          { label: 'Maintenance', color: 'bg-red-50 text-red-600 border-red-100',             count: 0 },
        ].map(({ label, color, count }) => (
          <div key={label} className={`rounded-xl p-5 border ${color} text-center`}>
            <p className="text-2xl font-bold font-heading">{count}</p>
            <p className="text-xs font-semibold tracking-wider uppercase mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Rooms Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Room No.</th>
              <th>Type</th>
              <th>Name</th>
              <th>Capacity</th>
              <th>Price/Night</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-16 text-hotel-muted">
                  <BedDouble size={28} className="mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">No rooms added yet.</p>
                  <p className="text-xs mt-1">Click "Add Room" to create your first room, or run the database seed.</p>
                </td>
              </tr>
            ) : (
              rooms.map(room => (
                <tr key={room.id}>
                  <td className="font-mono font-semibold">{room.number}</td>
                  <td>{room.type}</td>
                  <td>{room.name}</td>
                  <td>{room.capacity} guests</td>
                  <td>KES {Number(room.pricePerNight).toLocaleString()}</td>
                  <td><span className={`badge ${STATUS_COLORS[room.status]}`}>{room.status}</span></td>
                  <td className="flex gap-2">
                    <button className="text-sky-400 hover:text-sky-600"><Eye size={14} /></button>
                    <button className="text-hotel-muted hover:text-hotel-dark"><Pencil size={14} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

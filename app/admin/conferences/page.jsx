'use client'

import { useState, useEffect } from 'react'
import { Building2, Eye } from 'lucide-react'

const STATUS_BADGE = {
  ENQUIRY:   'badge badge-yellow',
  CONFIRMED: 'badge badge-blue',
  COMPLETED: 'badge badge-green',
  CANCELLED: 'badge badge-red',
}

export default function AdminConferencesPage() {
  const [enquiries, setEnquiries] = useState([])
  const [active, setActive] = useState(null)

  useEffect(() => {
    fetch('/api/conferences').then(r => r.json()).then(setEnquiries).catch(() => {})
  }, [])

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-semibold text-hotel-dark">Conferences &amp; Events</h1>
        <p className="text-hotel-muted text-sm mt-1">All event hall enquiries and bookings</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Ref</th>
              <th>Organiser</th>
              <th>Event Type</th>
              <th>Hall</th>
              <th>Date</th>
              <th>Attendees</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-16 text-hotel-muted">
                  <Building2 size={28} className="mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">No conference enquiries yet.</p>
                  <p className="text-xs mt-1">
                    Enquiries submitted via the{' '}
                    <a href="/conferences" className="text-sky-400 underline">Conferences page</a>{' '}
                    will appear here.
                  </p>
                </td>
              </tr>
            ) : (
              enquiries.map(e => (
                <tr key={e.id}>
                  <td className="font-mono text-xs">{e.ref}</td>
                  <td>
                    <div>
                      <p className="font-medium">{e.organizerName}</p>
                      <p className="text-xs text-hotel-muted">{e.email}</p>
                    </div>
                  </td>
                  <td>{e.eventType}</td>
                  <td className="capitalize">{e.hallSize}</td>
                  <td>{e.date}</td>
                  <td>{e.attendees ?? '—'}</td>
                  <td><span className={STATUS_BADGE[e.status] || 'badge badge-gray'}>{e.status}</span></td>
                  <td>
                    <button
                      onClick={() => setActive(e)}
                      className="text-sky-400 hover:text-sky-600 text-xs flex items-center gap-1"
                    >
                      <Eye size={13} /> View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Detail modal */}
      {active && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setActive(null)}>
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-8" onClick={e => e.stopPropagation()}>
            <h3 className="font-heading text-xl font-semibold text-hotel-dark mb-1">{active.eventType}</h3>
            <p className="text-hotel-muted text-xs mb-5 font-mono">{active.ref}</p>
            <div className="space-y-2 text-sm">
              {[
                ['Organiser', active.organizerName],
                ['Email', active.email],
                ['Phone', active.phone],
                ['Organisation', active.organization || '—'],
                ['Hall', active.hallSize],
                ['Date', active.date],
                ['Time', active.startTime && active.endTime ? `${active.startTime} – ${active.endTime}` : '—'],
                ['Attendees', active.attendees ?? '—'],
                ['Catering', active.cateringNeeded ? `Yes — ${active.cateringNotes || 'no notes'}` : 'No'],
                ['Special needs', active.specialNeeds || '—'],
              ].map(([label, val]) => (
                <div key={label} className="flex gap-3">
                  <span className="text-hotel-muted w-32 flex-shrink-0">{label}</span>
                  <span className="text-hotel-dark">{val}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <a
                href={`mailto:${active.email}?subject=Re: Conference Enquiry ${active.ref}`}
                className="btn-primary text-xs py-2.5"
              >
                Reply via Email
              </a>
              <button onClick={() => setActive(null)} className="btn-outline-dark text-xs py-2.5">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

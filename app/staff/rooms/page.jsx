'use client'

import { BedDouble, CheckCircle, Wrench, Wind } from 'lucide-react'

const ROOM_TYPES = [
  { name: 'Standard Rooms',  count: 8,  type: 'STANDARD'  },
  { name: 'Deluxe Rooms',    count: 6,  type: 'DELUXE'    },
  { name: 'Twin Rooms',      count: 4,  type: 'TWIN'      },
  { name: 'Executive Rooms', count: 2,  type: 'EXECUTIVE' },
]

const STATUS_ICONS = {
  available:   { Icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50', label: 'Available'    },
  cleaning:    { Icon: Wind,        color: 'text-amber-500',   bg: 'bg-amber-50',   label: 'Cleaning'     },
  maintenance: { Icon: Wrench,      color: 'text-red-500',     bg: 'bg-red-50',     label: 'Maintenance'  },
  occupied:    { Icon: BedDouble,   color: 'text-sky-500',     bg: 'bg-sky-50',     label: 'Occupied'     },
}

export default function StaffRoomsPage() {
  // REPLACE: Fetch real room statuses from database
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-semibold text-hotel-dark">Housekeeping</h1>
        <p className="text-hotel-muted text-sm mt-1">Room status and cleaning tasks</p>
      </div>

      {/* Status legend */}
      <div className="flex flex-wrap gap-3 mb-8">
        {Object.values(STATUS_ICONS).map(({ Icon, color, bg, label }) => (
          <div key={label} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${bg} text-xs font-semibold`}>
            <Icon size={13} className={color} /> {label}
          </div>
        ))}
      </div>

      {/* Room type cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {ROOM_TYPES.map(({ name, count, type }) => (
          <div key={type} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-hotel-dark mb-4 flex items-center gap-2">
              <BedDouble size={15} className="text-sky-400" /> {name}
              <span className="ml-auto text-xs text-hotel-muted">{count} rooms</span>
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: count }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg bg-emerald-50 flex items-center justify-center
                             text-emerald-600 text-xs font-bold border border-emerald-100"
                >
                  {i + 1}
                </div>
              ))}
            </div>
            <p className="text-xs text-hotel-muted mt-4">
              Connect the database to see live room statuses and assign cleaning tasks.
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

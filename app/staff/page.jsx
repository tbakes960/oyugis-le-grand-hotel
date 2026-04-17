// Staff Dashboard — simplified overview for hotel staff
// Shows today's check-ins/check-outs, pending restaurant orders, housekeeping tasks

import { Calendar, UtensilsCrossed, BedDouble, CheckCircle } from 'lucide-react'

export default function StaffDashboard() {
  // REPLACE: Fetch today's data from database
  const todayDate = new Date().toLocaleDateString('en-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-semibold text-hotel-dark">Staff Dashboard</h1>
        <p className="text-hotel-muted text-sm mt-1">{todayDate}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {[
          { label: "Today's Check-ins",  value: 0, Icon: Calendar,       color: 'text-sky-400',   bg: 'bg-sky-50' },
          { label: "Today's Check-outs", value: 0, Icon: CheckCircle,    color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Pending Orders',     value: 0, Icon: UtensilsCrossed, color: 'text-orange-400', bg: 'bg-orange-50' },
        ].map(({ label, value, Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-hotel-muted">{label}</span>
              <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center`}>
                <Icon size={17} className={color} />
              </div>
            </div>
            <p className="text-3xl font-bold font-heading text-hotel-dark">{value}</p>
          </div>
        ))}
      </div>

      {/* Today's Check-in List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-hotel-dark mb-4 text-sm flex items-center gap-2">
            <Calendar size={15} className="text-sky-400" /> Today's Check-ins
          </h3>
          <p className="text-hotel-muted text-sm text-center py-8">
            Check-in list will appear here once the database is connected.
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-hotel-dark mb-4 text-sm flex items-center gap-2">
            <BedDouble size={15} className="text-sky-400" /> Housekeeping Tasks
          </h3>
          <p className="text-hotel-muted text-sm text-center py-8">
            Room status and cleaning tasks will appear here.
          </p>
        </div>
      </div>
    </div>
  )
}

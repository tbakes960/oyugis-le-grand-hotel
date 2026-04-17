// Admin Dashboard — Main overview page
// Shows key stats: today's bookings, revenue, occupancy, pending orders, unread messages

import { BedDouble, Calendar, DollarSign, MessageSquare, UtensilsCrossed, TrendingUp, Users } from 'lucide-react'

export const metadata = { title: 'Dashboard' }

// In production, fetch real data from your database using Prisma
// Example: const stats = await prisma.booking.aggregate(...)
async function getDashboardStats() {
  // REPLACE: Fetch real stats from database
  return {
    todayBookings:    0,
    pendingBookings:  0,
    monthlyRevenue:   0,
    occupancyRate:    0,
    pendingOrders:    0,
    unreadMessages:   0,
    totalRooms:       20,
    occupiedRooms:    0,
  }
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats()

  const STAT_CARDS = [
    { label: "Today's Bookings",    value: stats.todayBookings,   sub: `${stats.pendingBookings} pending`,     Icon: Calendar,       color: 'text-sky-400',   bg: 'bg-sky-50' },
    { label: 'Monthly Revenue',     value: `KES ${stats.monthlyRevenue.toLocaleString()}`, sub: 'This month', Icon: DollarSign,     color: 'text-gold-500',  bg: 'bg-gold-50' },
    { label: 'Occupancy Rate',      value: `${stats.occupancyRate}%`,  sub: `${stats.occupiedRooms}/${stats.totalRooms} rooms`, Icon: BedDouble,  color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Pending Orders',      value: stats.pendingOrders,   sub: 'Restaurant orders',                    Icon: UtensilsCrossed,color: 'text-orange-400',bg: 'bg-orange-50' },
    { label: 'Unread Messages',     value: stats.unreadMessages,  sub: 'Contact inquiries',                    Icon: MessageSquare,  color: 'text-violet-400',bg: 'bg-violet-50' },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-semibold text-hotel-dark">Dashboard</h1>
        <p className="text-hotel-muted text-sm mt-1">
          Welcome back. Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5 mb-10">
        {STAT_CARDS.map(({ label, value, sub, Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold tracking-wider uppercase text-hotel-muted">{label}</span>
              <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center`}>
                <Icon size={17} className={color} />
              </div>
            </div>
            <p className="font-heading text-2xl font-bold text-hotel-dark">{value}</p>
            <p className="text-xs text-hotel-muted mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-hotel-dark mb-4 text-sm">Quick Actions</h3>
          <div className="space-y-2">
            {[
              { href: '/admin/reservations?new=1', label: 'New Reservation' },
              { href: '/admin/restaurant',         label: 'View Orders' },
              { href: '/admin/messages',           label: 'Read Messages' },
              { href: '/admin/rooms',              label: 'Update Rooms' },
            ].map(({ href, label }) => (
              <a key={href} href={href} className="block px-4 py-2.5 rounded-lg text-sm text-hotel-dark
                             hover:bg-sky-50 hover:text-sky-400 transition-colors border border-gray-100">
                {label}
              </a>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-hotel-dark mb-4 text-sm">Recent Reservations</h3>
          <div className="text-center py-8 text-hotel-muted text-sm">
            <Calendar size={28} className="mx-auto mb-3 text-gray-300" />
            <p>Reservations will appear here.</p>
            <p className="text-xs mt-1">Connect your database to see live data.</p>
          </div>
        </div>
      </div>

      {/* DB Connection Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
        <strong>Setup Required:</strong> Connect your PostgreSQL database and run{' '}
        <code className="bg-amber-100 px-1 rounded">npm run db:push</code> to activate live data in this dashboard.
        See <code className="bg-amber-100 px-1 rounded">.env.example</code> for configuration.
      </div>
    </div>
  )
}

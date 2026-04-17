// Staff Panel Layout — for hotel staff (not admin)
// Staff can see: their assigned orders, housekeeping tasks, check-in/out list

import Link from 'next/link'
import { ClipboardList, UtensilsCrossed, BedDouble, LogOut } from 'lucide-react'

export const metadata = { title: 'Staff Portal | Oyugis Le Grand' }

export default function StaffLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Staff Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-56 bg-hotel-dark text-white flex flex-col z-40">
        <div className="px-5 py-5 border-b border-white/10">
          <span className="font-heading text-base font-bold text-white block">Le Grand Hotel</span>
          <span className="text-[10px] tracking-widest uppercase text-sky-400">Staff Portal</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {[
            { href: '/staff',        label: 'Overview',         Icon: ClipboardList },
            { href: '/staff/orders', label: 'Restaurant Orders', Icon: UtensilsCrossed },
            { href: '/staff/rooms',  label: 'Housekeeping',     Icon: BedDouble },
          ].map(({ href, label, Icon }) => (
            <Link key={href} href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/65 hover:text-white hover:bg-white/8 transition-all">
              <Icon size={16} /> {label}
            </Link>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-white/10">
          <Link href="/api/auth/signout" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400/70 hover:text-red-400 transition-all">
            <LogOut size={16} /> Sign Out
          </Link>
        </div>
      </aside>

      <div className="flex-1 ml-56 min-h-screen">
        {children}
      </div>
    </div>
  )
}

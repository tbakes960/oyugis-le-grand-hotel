'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, BedDouble, Calendar, UtensilsCrossed,
  MessageSquare, FileText, Settings, LogOut, Users, Building2
} from 'lucide-react'

const NAV = [
  { href: '/admin',                 label: 'Dashboard',       Icon: LayoutDashboard },
  { href: '/admin/reservations',    label: 'Reservations',    Icon: Calendar },
  { href: '/admin/rooms',           label: 'Rooms',           Icon: BedDouble },
  { href: '/admin/restaurant',      label: 'Restaurant',      Icon: UtensilsCrossed },
  { href: '/admin/conferences',     label: 'Conferences',     Icon: Building2 },
  { href: '/admin/messages',        label: 'Messages',        Icon: MessageSquare },
  { href: '/admin/blog',            label: 'Blog',            Icon: FileText },
  { href: '/admin/staff',           label: 'Staff',           Icon: Users },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-hotel-dark text-white flex flex-col z-40">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <span className="font-heading text-lg font-bold text-white block">Oyugis Le Grand</span>
        <span className="text-[10px] tracking-widest uppercase text-gold-400">Admin Panel</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ href, label, Icon }) => {
          const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                ${isActive
                  ? 'bg-sky-400/20 text-sky-400'
                  : 'text-white/60 hover:text-white hover:bg-white/8'
                }`}
            >
              <Icon size={17} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-white/10 space-y-0.5">
        <Link href="/admin/settings" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${pathname.startsWith('/admin/settings') ? 'bg-sky-400/20 text-sky-400' : 'text-white/60 hover:text-white hover:bg-white/8'}`}>
          <Settings size={17} /> Accounts &amp; Settings
        </Link>
        <Link href="/api/auth/signout" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400/80 hover:text-red-400 hover:bg-red-400/10 transition-all">
          <LogOut size={17} /> Sign Out
        </Link>
      </div>
    </aside>
  )
}

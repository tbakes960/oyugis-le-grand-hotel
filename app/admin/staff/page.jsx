'use client'

import { Users, Mail, Shield } from 'lucide-react'

export default function AdminStaffPage() {
  const STAFF_ACCOUNTS = [
    {
      name:  'Administrator',
      email: 'admin@oyugislegrand.co.ke',
      role:  'ADMIN',
      desc:  'Full access to all admin features, reservations, and settings.',
      color: '#D4AF37',
    },
    {
      name:  'Staff',
      email: 'staff@oyugislegrand.co.ke',
      role:  'STAFF',
      desc:  'Access to restaurant orders, housekeeping, and daily operations.',
      color: '#5BBFD9',
    },
  ]

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-semibold text-hotel-dark">Staff Accounts</h1>
        <p className="text-hotel-muted text-sm mt-1">
          Manage staff login accounts. To change passwords, go to{' '}
          <a href="/admin/settings" className="text-sky-400 underline">Accounts &amp; Settings</a>.
        </p>
      </div>

      <div className="space-y-4 mb-10">
        {STAFF_ACCOUNTS.map(({ name, email, role, desc, color }) => (
          <div key={email} className="bg-white rounded-xl shadow-card p-6 flex items-start gap-5">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${color}22` }}
            >
              <Users size={20} style={{ color }} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-heading font-semibold text-hotel-dark">{name}</h3>
                <span
                  className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded"
                  style={{ background: `${color}22`, color }}
                >
                  {role}
                </span>
              </div>
              <p className="text-xs text-hotel-muted flex items-center gap-1 mb-1">
                <Mail size={11} /> {email}
              </p>
              <p className="text-xs text-hotel-muted">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-sky-50 border border-sky-100 rounded-xl p-5 flex gap-4">
        <Shield size={18} className="text-sky-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-hotel-dark">
          <strong>Login URL:</strong>{' '}
          <a href="/login" target="_blank" className="text-sky-400 underline">/login</a>
          <p className="text-hotel-muted mt-1 text-xs">
            Staff members sign in at <code>/login</code>. Admin users are redirected to the admin panel;
            staff users are redirected to the staff portal.
          </p>
        </div>
      </div>
    </div>
  )
}

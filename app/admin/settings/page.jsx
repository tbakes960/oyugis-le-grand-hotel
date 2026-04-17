'use client'

import { useState } from 'react'
import { Shield, Key, User, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const ACCOUNTS = [
  {
    key: 'admin',
    label: 'Administrator Account',
    email: 'admin@oyugislegrand.co.ke',
    description: 'Full access to all admin features, settings, and data.',
    color: '#D4AF37',
  },
  {
    key: 'staff',
    label: 'Staff Account',
    email: 'staff@oyugislegrand.co.ke',
    description: 'Access to restaurant orders, reservations, and messages.',
    color: '#5BBFD9',
  },
]

function PasswordForm({ accountKey, label }) {
  const [form, setForm]       = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [show, setShow]       = useState({ current: false, new: false, confirm: false })
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.newPassword !== form.confirm) {
      toast.error('New passwords do not match')
      return
    }
    if (form.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/admin/accounts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          account: accountKey,
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success(`${label} password updated successfully!`)
        setForm({ currentPassword: '', newPassword: '', confirm: '' })
      } else {
        toast.error(data.error || 'Failed to update password')
      }
    } catch {
      toast.error('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      {[
        { key: 'currentPassword', label: 'Current Password', showKey: 'current' },
        { key: 'newPassword',     label: 'New Password',     showKey: 'new'     },
        { key: 'confirm',         label: 'Confirm New Password', showKey: 'confirm' },
      ].map(({ key, label: fieldLabel, showKey }) => (
        <div key={key}>
          <label className="form-label">{fieldLabel}</label>
          <div className="relative">
            <input
              type={show[showKey] ? 'text' : 'password'}
              required
              minLength={key === 'currentPassword' ? 1 : 8}
              className="form-input pr-10"
              placeholder="••••••••"
              value={form[key]}
              onChange={e => set(key, e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShow(s => ({ ...s, [showKey]: !s[showKey] }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-hotel-muted hover:text-hotel-dark"
            >
              {show[showKey] ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>
      ))}
      <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
        <Key size={15} /> {loading ? 'Updating...' : 'Update Password'}
      </button>
    </form>
  )
}

export default function AccountSettingsPage() {
  const [openForm, setOpenForm] = useState(null)

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-hotel-dark mb-1">Account Settings</h1>
        <p className="text-hotel-muted text-sm">Manage login credentials for admin and staff accounts.</p>
      </div>

      {/* Login Info Card */}
      <div className="bg-sky-50 border border-sky-100 rounded-xl p-5 mb-8 flex gap-4">
        <Shield size={20} className="text-sky-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-hotel-dark">
          <strong>Login URL:</strong>{' '}
          <a href="/login" target="_blank" className="text-sky-400 underline">/login</a>
          <p className="text-hotel-muted mt-1">
            Use the credentials below to sign in. The Admin account has full access;
            the Staff account has limited access to daily operations.
          </p>
        </div>
      </div>

      {/* Account Cards */}
      <div className="space-y-6">
        {ACCOUNTS.map(({ key, label, email, description, color }) => (
          <div key={key} className="bg-white rounded-xl shadow-card overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${color}22` }}
                  >
                    <User size={20} style={{ color }} />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-hotel-dark text-base">{label}</h3>
                    <p className="text-xs text-hotel-muted mt-0.5">{email}</p>
                    <p className="text-xs text-hotel-muted mt-1">{description}</p>
                  </div>
                </div>
                <button
                  onClick={() => setOpenForm(openForm === key ? null : key)}
                  className="btn-outline-dark text-xs px-4 py-2 whitespace-nowrap flex-shrink-0"
                  style={{ fontSize: '11px' }}
                >
                  {openForm === key ? 'Cancel' : 'Change Password'}
                </button>
              </div>

              {/* Credentials display */}
              <div className="mt-4 bg-gray-50 rounded-lg px-4 py-3 text-xs space-y-1.5">
                <div className="flex gap-2">
                  <span className="text-hotel-muted w-20 flex-shrink-0">Email:</span>
                  <span className="font-mono text-hotel-dark">{email}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-hotel-muted w-20 flex-shrink-0">Password:</span>
                  <span className="font-mono text-hotel-dark tracking-widest">••••••••</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-hotel-muted w-20 flex-shrink-0">Role:</span>
                  <span
                    className="font-semibold uppercase text-[10px] tracking-wider px-2 py-0.5 rounded"
                    style={{ background: `${color}22`, color }}
                  >
                    {key === 'admin' ? 'ADMIN' : 'STAFF'}
                  </span>
                </div>
              </div>

              {/* Password change form */}
              {openForm === key && (
                <div className="mt-4 border-t border-gray-100 pt-4">
                  <PasswordForm accountKey={key} label={label} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Security note */}
      <div className="mt-8 bg-amber-50 border border-amber-100 rounded-xl p-5 flex gap-4">
        <AlertCircle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <strong className="text-hotel-dark">Security reminder</strong>
          <ul className="text-hotel-muted mt-2 space-y-1 list-disc list-inside">
            <li>Change default passwords before the website goes live</li>
            <li>Use a strong password with letters, numbers, and symbols</li>
            <li>Do not share login credentials with unauthorised staff</li>
            <li>Credentials are stored in <code className="bg-gray-100 px-1 rounded text-xs">data/accounts.json</code></li>
          </ul>
        </div>
      </div>
    </div>
  )
}

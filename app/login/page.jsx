'use client'

import { Suspense, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Lock } from 'lucide-react'

function LoginForm() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const error        = searchParams.get('error')

  const [form, setForm]       = useState({ email: '', password: '' })
  const [showPw, setShowPw]   = useState(false)
  const [loading, setLoading] = useState(false)
  const [authError, setAuthError] = useState(
    error === 'unauthorized' ? 'You do not have permission to access that page.' : ''
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setAuthError('')

    const result = await signIn('credentials', {
      email:    form.email,
      password: form.password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setAuthError('Invalid email or password.')
      return
    }

    const session = await fetch('/api/auth/session').then(r => r.json())
    if (session?.user?.role === 'ADMIN')       router.push('/admin')
    else if (session?.user?.role === 'STAFF')  router.push('/staff')
    else                                        router.push('/')
  }

  return (
    <div className="min-h-screen bg-hotel-dark flex items-center justify-center px-4"
         style={{ backgroundImage: "url('/images/Side%20View.jpg')", backgroundSize: 'cover', backgroundPosition: 'center 40%' }}>
      <div className="absolute inset-0 bg-hotel-dark/75 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-gold-gradient mx-auto mb-4 flex items-center justify-center">
            <Lock size={22} className="text-hotel-dark" />
          </div>
          <span className="font-heading text-2xl font-bold text-white block">Oyugis Le Grand</span>
          <span className="text-xs tracking-widest uppercase text-gold-400">Staff &amp; Admin Portal</span>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
          <h1 className="font-heading text-xl font-semibold text-hotel-dark text-center mb-6">Sign In</h1>

          {authError && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 text-center">
              {authError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
                placeholder="your@email.com"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="form-label">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  className="form-input pr-10"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-hotel-muted hover:text-hotel-dark"
                  onClick={() => setShowPw(s => !s)}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          Oyugis Le Grand Hotel · Staff Portal
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-hotel-dark flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}

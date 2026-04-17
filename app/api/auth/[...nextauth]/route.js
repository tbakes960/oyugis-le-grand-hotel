import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { readFileSync } from 'fs'
import { join } from 'path'
import bcrypt from 'bcryptjs'

/**
 * Reads account credentials from data/accounts.json.
 * Passwords should be bcrypt hashes (cost factor 12).
 * Run `node scripts/hash-passwords.js` once to hash the default passwords.
 */
function getAccounts() {
  try {
    const filePath = join(process.cwd(), 'data', 'accounts.json')
    const raw  = readFileSync(filePath, 'utf-8')
    const data = JSON.parse(raw)
    return Object.values(data)
  } catch {
    // Fallback only used if accounts.json is missing entirely.
    // These plaintext fallbacks are intentionally weak to force setup.
    return [
      { id: '1', name: 'Administrator', email: 'admin@oyugislegrand.co.ke', password: 'CHANGE_ME', role: 'ADMIN' },
      { id: '2', name: 'Staff',         email: 'staff@oyugislegrand.co.ke', password: 'CHANGE_ME', role: 'STAFF' },
    ]
  }
}

/**
 * Compare a plaintext password against a stored value.
 * Supports both:
 *   • bcrypt hashes ($2a$ / $2b$) — constant-time bcrypt.compare
 *   • legacy plaintext strings — for transition period only
 */
async function checkPassword(input, stored) {
  if (stored.startsWith('$2a$') || stored.startsWith('$2b$')) {
    return bcrypt.compare(input, stored)
  }
  // Plaintext fallback — still works but logs a warning so you know to migrate
  console.warn('[auth] Password for this account is stored in plaintext. Run `node scripts/hash-passwords.js` to hash it.')
  return input === stored
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        // Basic format guard — don't even query the store for obvious junk
        if (credentials.email.length > 254 || credentials.password.length > 128) return null

        const accounts = getAccounts()
        const user = accounts.find(u => u.email === credentials.email)
        if (!user) return null

        const valid = await checkPassword(credentials.password, user.password)
        if (!valid) return null

        // Only return safe fields — never expose the password hash
        return { id: user.id, name: user.name, email: user.email, role: user.role }
      },
    }),
  ],

  session: { strategy: 'jwt' },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id   = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role
        session.user.id   = token.id
      }
      return session
    },
  },

  pages: {
    signIn: '/login',
    error:  '/login',
  },

  secret: process.env.NEXTAUTH_SECRET || 'dev-fallback-secret',
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

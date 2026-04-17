/**
 * lib/auth.js
 * Lightweight server-side auth helpers for Next.js App Router API routes.
 *
 * Uses next-auth/jwt (getToken) for a zero-overhead token check that
 * doesn't need to call getServerSession and avoids re-importing authOptions
 * into every route.
 *
 * Usage:
 *   import { requireAuth, requireRole } from '@/lib/auth'
 *
 *   export async function GET(request) {
 *     const auth = await requireAuth(request)
 *     if (auth.error) return auth.error    // 401 Response
 *     // auth.user → { id, email, role, name }
 *   }
 *
 *   export async function DELETE(request) {
 *     const auth = await requireRole(request, ['ADMIN'])
 *     if (auth.error) return auth.error    // 401 or 403 Response
 *   }
 */

import { getToken } from 'next-auth/jwt'

const SECRET = process.env.NEXTAUTH_SECRET || 'dev-fallback-secret'

/**
 * Verify the caller is authenticated.
 * Returns { user } on success, { error: Response } on failure.
 */
export async function requireAuth(request) {
  let token
  try {
    token = await getToken({ req: request, secret: SECRET })
  } catch {
    token = null
  }

  if (!token) {
    return {
      error: Response.json({ error: 'Authentication required' }, { status: 401 }),
    }
  }

  return {
    user: {
      id:    token.sub,
      email: token.email,
      role:  token.role,
      name:  token.name,
    },
  }
}

/**
 * Verify the caller has one of the specified roles.
 * Returns { user } on success, { error: Response } on failure.
 * @param {Request} request
 * @param {string[]} allowedRoles  e.g. ['ADMIN'] or ['ADMIN', 'STAFF']
 */
export async function requireRole(request, allowedRoles) {
  const result = await requireAuth(request)
  if (result.error) return result

  if (!allowedRoles.includes(result.user.role)) {
    return {
      error: Response.json({ error: 'Forbidden' }, { status: 403 }),
    }
  }

  return result
}

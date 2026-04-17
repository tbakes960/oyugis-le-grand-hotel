import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { getServerSession } from 'next-auth'
import bcrypt from 'bcryptjs'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

const FILE     = join(process.cwd(), 'data', 'accounts.json')
const BCRYPT_COST = 12
const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,253}\.[^\s@]{2,}$/

function readAccounts() {
  try {
    return JSON.parse(readFileSync(FILE, 'utf-8'))
  } catch {
    throw new Error('accounts.json not found or invalid')
  }
}

/** Compare input against a stored password (bcrypt or legacy plaintext). */
async function verifyPassword(input, stored) {
  if (stored.startsWith('$2a$') || stored.startsWith('$2b$')) {
    return bcrypt.compare(input, stored)
  }
  return input === stored
}

/** GET — return account info (passwords masked) */
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role !== 'ADMIN') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = readAccounts()
  const safe = {}
  for (const [key, acc] of Object.entries(data)) {
    safe[key] = { ...acc, password: '••••••••' }
  }
  return Response.json(safe)
}

/** PATCH — update email or password for a specific account */
export async function PATCH(req) {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role !== 'ADMIN') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { account, newEmail, newPassword, currentPassword } = body

  // Validate account key
  if (!account || !['admin', 'staff'].includes(account)) {
    return Response.json({ error: 'Invalid account key' }, { status: 400 })
  }

  // At least one change must be requested
  if (!newEmail && !newPassword) {
    return Response.json({ error: 'Provide newEmail or newPassword to update' }, { status: 400 })
  }

  // Validate new email if provided
  if (newEmail) {
    const cleanEmail = String(newEmail).trim().toLowerCase()
    if (!EMAIL_RE.test(cleanEmail) || cleanEmail.length > 254) {
      return Response.json({ error: 'Invalid email address' }, { status: 400 })
    }
  }

  // Validate new password if provided
  if (newPassword) {
    if (typeof newPassword !== 'string' || newPassword.length < 8 || newPassword.length > 128) {
      return Response.json({ error: 'Password must be 8–128 characters' }, { status: 400 })
    }
  }

  const data   = readAccounts()
  const target = data[account]

  if (!target) {
    return Response.json({ error: 'Account not found' }, { status: 404 })
  }

  // Require current password before allowing changes
  if (!currentPassword || typeof currentPassword !== 'string') {
    return Response.json({ error: 'Current password is required' }, { status: 400 })
  }

  const passwordOk = await verifyPassword(currentPassword, target.password)
  if (!passwordOk) {
    return Response.json({ error: 'Current password is incorrect' }, { status: 403 })
  }

  if (newEmail)    target.email    = String(newEmail).trim().toLowerCase()
  if (newPassword) target.password = await bcrypt.hash(newPassword, BCRYPT_COST)

  data[account] = target
  writeFileSync(FILE, JSON.stringify(data, null, 2))

  return Response.json({ success: true, message: `${account} account updated successfully` })
}

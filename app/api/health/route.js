import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const checks = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown',
  }

  // Check that critical env vars are set (values are not exposed)
  const requiredVars = ['NEXTAUTH_SECRET', 'NEXTAUTH_URL']
  const missingVars = requiredVars.filter(v => !process.env[v])
  if (missingVars.length > 0) {
    checks.status = 'degraded'
    checks.missingConfig = missingVars.length
  }

  const statusCode = checks.status === 'ok' ? 200 : 503
  return NextResponse.json(checks, { status: statusCode })
}

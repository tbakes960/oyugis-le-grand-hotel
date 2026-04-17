import { NextResponse } from 'next/server'
import { updateById } from '@/lib/store'
import { requireRole } from '@/lib/auth'

const VALID_STATUSES = ['PENDING', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED']

/** PATCH /api/restaurant/orders/[id] — update order status (admin/staff only) */
export async function PATCH(request, { params }) {
  const auth = await requireRole(request, ['ADMIN', 'STAFF'])
  if (auth.error) return auth.error

  try {
    const body = await request.json()
    const { status } = body

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    // Validate id is UUID-like to prevent store path traversal
    if (!params.id || !/^[0-9a-f-]{36}$/i.test(params.id)) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 })
    }

    const updated = await updateById('orders', params.id, {
      status,
      updatedAt: new Date().toISOString(),
    })

    if (!updated) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json(updated)
  } catch (err) {
    console.error('[restaurant/orders PATCH]', err)
    return NextResponse.json({ error: 'Failed to update order.' }, { status: 500 })
  }
}

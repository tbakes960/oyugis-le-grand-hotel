import { NextResponse } from 'next/server'
import { append, getAll } from '@/lib/store'
import { requireRole } from '@/lib/auth'

const VALID_ORDER_TYPES = ['DINE_IN', 'ROOM_SERVICE', 'TAKEAWAY']
const MAX_ITEMS = 50
const MAX_ITEM_NAME_LEN = 200

/** GET /api/restaurant/orders — return all orders (admin/staff only) */
export async function GET(request) {
  const auth = await requireRole(request, ['ADMIN', 'STAFF'])
  if (auth.error) return auth.error

  const orders = await getAll('orders')
  return NextResponse.json([...orders].reverse())
}

/** POST /api/restaurant/orders — place a new food/beverage order */
export async function POST(request) {
  try {
    const body = await request.json()
    const { type, tableNumber, roomNumber, items, totalAmount, guestName } = body

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No items in order' }, { status: 400 })
    }

    if (items.length > MAX_ITEMS) {
      return NextResponse.json({ error: `Order cannot exceed ${MAX_ITEMS} items` }, { status: 400 })
    }

    // Validate order type
    const parsedType = type && VALID_ORDER_TYPES.includes(type) ? type : 'DINE_IN'

    // Validate each item: must have a name and a positive numeric price/quantity
    for (const item of items) {
      if (typeof item !== 'object' || !item) {
        return NextResponse.json({ error: 'Invalid item format' }, { status: 400 })
      }
      if (!item.name || typeof item.name !== 'string' || item.name.trim().length === 0) {
        return NextResponse.json({ error: 'Each item must have a name' }, { status: 400 })
      }
      const qty   = Number(item.quantity)
      const price = Number(item.price)
      if (!Number.isInteger(qty) || qty < 1 || qty > 100) {
        return NextResponse.json({ error: 'Item quantity must be between 1 and 100' }, { status: 400 })
      }
      if (isNaN(price) || price < 0 || price > 1_000_000) {
        return NextResponse.json({ error: 'Invalid item price' }, { status: 400 })
      }
    }

    const parsedAmount = Number(totalAmount)
    if (isNaN(parsedAmount) || parsedAmount < 0 || parsedAmount > 10_000_000) {
      return NextResponse.json({ error: 'Invalid total amount' }, { status: 400 })
    }

    const safeItems = items.map(i => ({
      id:       crypto.randomUUID(),
      name:     String(i.name).trim().slice(0, MAX_ITEM_NAME_LEN),
      quantity: Math.min(Math.max(Number(i.quantity) || 1, 1), 100),
      price:    Number(i.price) || 0,
      notes:    i.notes ? String(i.notes).trim().slice(0, 200) : '',
    }))

    const order = {
      id:          crypto.randomUUID(),
      orderRef:    'ORD-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
      type:        parsedType,
      tableNumber: tableNumber ? String(tableNumber).trim().slice(0, 10) : null,
      roomNumber:  roomNumber  ? String(roomNumber).trim().slice(0, 10)  : null,
      guestName:   guestName   ? String(guestName).trim().slice(0, 100)  : 'Guest',
      items:       safeItems,
      totalAmount: parsedAmount,
      status:      'PENDING',
      createdAt:   new Date().toISOString(),
    }

    await append('orders', order)

    return NextResponse.json({ orderRef: order.orderRef }, { status: 201 })
  } catch (err) {
    console.error('[restaurant/orders POST]', err)
    return NextResponse.json({ error: 'Failed to place order.' }, { status: 500 })
  }
}

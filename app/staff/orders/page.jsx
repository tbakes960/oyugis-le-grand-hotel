'use client'

// Staff: Restaurant Orders — Real-time order management for kitchen/serving staff

import { useState } from 'react'
import { UtensilsCrossed, Check, ChevronRight } from 'lucide-react'

export default function StaffOrdersPage() {
  const [orders, setOrders] = useState([]) // REPLACE: fetch + poll from /api/restaurant/orders

  const updateStatus = async (id, newStatus) => {
    const res = await fetch(`/api/restaurant/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    if (res.ok) {
      setOrders(o => o.map(order => order.id === id ? { ...order, status: newStatus } : order))
    }
  }

  const NEXT_STATUS = {
    PENDING:   'PREPARING',
    PREPARING: 'READY',
    READY:     'DELIVERED',
  }

  const NEXT_LABEL = {
    PENDING:   'Start Preparing',
    PREPARING: 'Mark Ready',
    READY:     'Mark Delivered',
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-semibold text-hotel-dark">Restaurant Orders</h1>
        <p className="text-hotel-muted text-sm mt-1">Live order management — refresh to see new orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl p-16 text-center shadow-sm border border-gray-100">
          <UtensilsCrossed size={32} className="mx-auto mb-4 text-gray-300" />
          <p className="text-hotel-muted text-sm">No active orders.</p>
          <p className="text-xs text-gray-300 mt-1">Orders placed from the restaurant page will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.filter(o => o.status !== 'DELIVERED' && o.status !== 'CANCELLED').map(order => (
            <div key={order.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="font-mono text-xs text-hotel-muted">{order.orderRef.slice(0, 8)}</span>
                  <h3 className="font-semibold text-hotel-dark">
                    {order.type === 'DINE_IN' ? `Table ${order.tableNumber}` : `Room ${order.roomNumber} (Room Service)`}
                  </h3>
                </div>
                <span className={`badge ${
                  order.status === 'PENDING'   ? 'badge-yellow' :
                  order.status === 'PREPARING' ? 'badge-blue' :
                  order.status === 'READY'     ? 'badge-green' : 'badge-gray'
                }`}>
                  {order.status}
                </span>
              </div>

              <ul className="space-y-1.5 mb-5">
                {order.items?.map(item => (
                  <li key={item.id} className="flex justify-between text-sm">
                    <span className="text-hotel-dark">{item.quantity}× {item.menuItem?.name}</span>
                    <span className="text-hotel-muted text-xs">{item.notes}</span>
                  </li>
                ))}
              </ul>

              {NEXT_STATUS[order.status] && (
                <button
                  onClick={() => updateStatus(order.id, NEXT_STATUS[order.status])}
                  className="btn-primary text-xs py-2 px-4 flex items-center gap-2"
                >
                  <Check size={13} />
                  {NEXT_LABEL[order.status]}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

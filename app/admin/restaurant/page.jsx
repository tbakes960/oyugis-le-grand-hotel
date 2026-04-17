'use client'

import { useState, useEffect } from 'react'
import { UtensilsCrossed, Plus } from 'lucide-react'

const STATUS_COLORS = {
  PENDING:   'badge-yellow',
  PREPARING: 'badge-blue',
  READY:     'badge-green',
  DELIVERED: 'badge-gray',
  CANCELLED: 'badge-red',
}

export default function AdminRestaurantPage() {
  const [activeTab, setActiveTab] = useState('orders')
  const [orders, setOrders]       = useState([])
  const [menuItems]               = useState([])

  useEffect(() => {
    fetch('/api/restaurant/orders').then(r => r.json()).then(setOrders).catch(() => {})
  }, [])

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-hotel-dark">Restaurant</h1>
          <p className="text-hotel-muted text-sm mt-1">Manage orders and menu items</p>
        </div>
        <button className="btn-primary text-xs py-2.5"><Plus size={14} /> Add Menu Item</button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit mb-8">
        {[
          { key: 'orders', label: 'Live Orders' },
          { key: 'menu',   label: 'Menu Management' },
          { key: 'tables', label: 'Table Reservations' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-4 py-2 rounded text-sm font-semibold transition-all
              ${activeTab === key ? 'bg-white shadow-sm text-hotel-dark' : 'text-hotel-muted'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'orders' && (
        <div>
          {/* Order status columns */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {['PENDING', 'PREPARING', 'READY', 'DELIVERED'].map(status => (
              <div key={status} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold tracking-wider uppercase text-hotel-muted">{status}</h3>
                  <span className="w-5 h-5 rounded-full bg-gray-100 text-hotel-muted text-xs font-bold flex items-center justify-center">
                    {orders.filter(o => o.status === status).length}
                  </span>
                </div>
                {orders.filter(o => o.status === status).length === 0 ? (
                  <p className="text-xs text-gray-300 text-center py-6">No orders</p>
                ) : (
                  orders.filter(o => o.status === status).map(order => (
                    <div key={order.id} className="mb-3 p-3 bg-gray-50 rounded-lg text-xs">
                      <p className="font-semibold text-hotel-dark">{order.orderRef.slice(0, 8)}</p>
                      <p className="text-hotel-muted">{order.type === 'DINE_IN' ? `Table ${order.tableNumber}` : `Room ${order.roomNumber}`}</p>
                      <p className="font-semibold text-sky-400 mt-1">KES {Number(order.totalAmount).toLocaleString()}</p>
                    </div>
                  ))
                )}
              </div>
            ))}
          </div>

          {orders.length === 0 && (
            <div className="text-center py-16 text-hotel-muted">
              <UtensilsCrossed size={28} className="mx-auto mb-3 text-gray-300" />
              <p className="text-sm">No active orders. Orders from the restaurant page will appear here.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'menu' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Category</th>
                <th>Price (KES)</th>
                <th>Available</th>
                <th>Dietary</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-hotel-muted text-sm">
                    Menu items will appear here once your database is connected.
                  </td>
                </tr>
              ) : (
                menuItems.map(item => (
                  <tr key={item.id}>
                    <td className="font-medium">{item.name}</td>
                    <td>{item.category?.name}</td>
                    <td>{Number(item.price).toLocaleString()}</td>
                    <td>
                      <span className={`badge ${item.isAvailable ? 'badge-green' : 'badge-red'}`}>
                        {item.isAvailable ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="text-xs text-hotel-muted">
                      {[item.isVegetarian && 'V', item.isVegan && 'VG', item.isGlutenFree && 'GF'].filter(Boolean).join(', ') || '—'}
                    </td>
                    <td>
                      <button className="text-sky-400 text-xs hover:underline">Edit</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'tables' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Guest</th>
                <th>Date</th>
                <th>Time</th>
                <th>Party Size</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={6} className="text-center py-12 text-hotel-muted text-sm">
                  Table reservations will appear here once your database is connected.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

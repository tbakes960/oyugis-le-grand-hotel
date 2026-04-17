// Admin Panel Layout
// Accessible only to users with ADMIN role
// Protected by middleware (see middleware.js)

import AdminSidebar from '@/components/admin/AdminSidebar'

export const metadata = {
  title: { default: 'Admin Dashboard', template: '%s | Admin' },
}

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <div className="flex-1 ml-64 min-h-screen">
        {children}
      </div>
    </div>
  )
}

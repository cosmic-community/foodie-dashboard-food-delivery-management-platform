import Link from 'next/link'
import { cosmic } from '@/lib/cosmic'
import { Restaurant, Order, MenuItem, hasStatus } from '@/types'

async function getDashboardStats() {
  try {
    const [restaurantsRes, ordersRes, menuItemsRes] = await Promise.all([
      cosmic.objects.find({ type: 'restaurants' }).props(['id']),
      cosmic.objects.find({ type: 'orders' }).props(['id', 'metadata']),
      cosmic.objects.find({ type: 'menu-items' }).props(['id']),
    ])

    const restaurants = restaurantsRes.objects as Restaurant[]
    const orders = ordersRes.objects as Order[]
    const menuItems = menuItemsRes.objects as MenuItem[]

    // Calculate active orders
    const activeOrders = orders.filter(order => {
      const status = order.metadata?.order_status
      return status && ['Pending', 'Preparing', 'Ready', 'Out for Delivery'].includes(status)
    })

    // Calculate today's revenue
    const today = new Date().toISOString().split('T')[0]
    const todayOrders = orders.filter(order => {
      return order.created_at.startsWith(today || '') && order.metadata?.payment_status === 'Paid'
    })
    const todayRevenue = todayOrders.reduce((sum, order) => {
      return sum + parseFloat(order.metadata?.total || '0')
    }, 0)

    return {
      totalRestaurants: restaurants.length,
      activeOrders: activeOrders.length,
      totalMenuItems: menuItems.length,
      todayRevenue: todayRevenue.toFixed(2),
    }
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return {
        totalRestaurants: 0,
        activeOrders: 0,
        totalMenuItems: 0,
        todayRevenue: '0.00',
      }
    }
    throw error
  }
}

async function getRecentOrders() {
  try {
    const response = await cosmic.objects
      .find({ type: 'orders' })
      .props(['id', 'title', 'metadata', 'created_at'])
      .depth(1)

    const orders = response.objects as Order[]
    
    // Sort manually by created_at (newest first)
    return orders.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime()
      const dateB = new Date(b.created_at).getTime()
      return dateB - dateA
    }).slice(0, 5)
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw error
  }
}

export default async function DashboardPage() {
  const stats = await getDashboardStats()
  const recentOrders = await getRecentOrders()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-2xl">🍔</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Foodie Dashboard</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-gray-700 hover:text-primary font-medium">
                Dashboard
              </Link>
              <Link href="/restaurants" className="text-gray-600 hover:text-primary">
                Restaurants
              </Link>
              <Link href="/orders" className="text-gray-600 hover:text-primary">
                Orders
              </Link>
              <Link href="/menu-items" className="text-gray-600 hover:text-primary">
                Menu Items
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h2>
          <p className="text-gray-600">Here's what's happening with your food delivery platform today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Total Restaurants</span>
              <span className="text-2xl">🏪</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.totalRestaurants}</div>
            <Link href="/restaurants" className="text-sm text-primary hover:underline mt-2 inline-block">
              View all →
            </Link>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Active Orders</span>
              <span className="text-2xl">📦</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.activeOrders}</div>
            <Link href="/orders" className="text-sm text-primary hover:underline mt-2 inline-block">
              Manage orders →
            </Link>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Menu Items</span>
              <span className="text-2xl">🍕</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.totalMenuItems}</div>
            <Link href="/menu-items" className="text-sm text-primary hover:underline mt-2 inline-block">
              View menu →
            </Link>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Today's Revenue</span>
              <span className="text-2xl">💰</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">${stats.todayRevenue}</div>
            <p className="text-sm text-muted-foreground mt-2">From paid orders</p>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Recent Orders</h3>
            <Link href="/orders" className="text-sm text-primary hover:underline">
              View all orders →
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No orders yet</p>
              <p className="text-sm text-gray-400">Orders will appear here once customers start placing them</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Order #</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Customer</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Restaurant</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Total</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium">
                        {order.metadata?.order_number || order.title}
                      </td>
                      <td className="py-3 px-4 text-sm">{order.metadata?.customer_name || 'N/A'}</td>
                      <td className="py-3 px-4 text-sm">
                        {order.metadata?.restaurant?.title || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium">
                        ${order.metadata?.total || '0.00'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.metadata?.order_status === 'Delivered' ? 'bg-green-100 text-green-800' :
                          order.metadata?.order_status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                          order.metadata?.order_status === 'Out for Delivery' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.metadata?.order_status || 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/restaurants" className="card p-6 hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">🏪</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Manage Restaurants</h3>
            <p className="text-sm text-gray-600">Add, edit, or remove restaurants from the platform</p>
          </Link>

          <Link href="/menu-items" className="card p-6 hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">🍕</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Update Menus</h3>
            <p className="text-sm text-gray-600">Manage menu items, prices, and availability</p>
          </Link>

          <Link href="/orders" className="card p-6 hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">📦</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Process Orders</h3>
            <p className="text-sm text-gray-600">Track and update order statuses</p>
          </Link>
        </div>
      </main>
    </div>
  )
}
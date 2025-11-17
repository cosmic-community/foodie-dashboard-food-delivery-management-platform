import Link from 'next/link'
import { cosmic } from '@/lib/cosmic'
import { Order, hasStatus } from '@/types'

async function getOrders() {
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
    })
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw error
  }
}

export default async function OrdersPage() {
  const orders = await getOrders()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/" className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-2xl">🍔</span>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-gray-600 hover:text-primary">
                Dashboard
              </Link>
              <Link href="/restaurants" className="text-gray-600 hover:text-primary">
                Restaurants
              </Link>
              <Link href="/orders" className="text-gray-700 hover:text-primary font-medium">
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
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">All Orders</h2>
          <p className="text-gray-600">Track and manage customer orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-6">Orders will appear here once customers start placing them</p>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Order</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Customer</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Restaurant</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Items</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Total</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Status</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Payment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.metadata?.order_number || order.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(order.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.metadata?.customer_name || 'N/A'}
                          </div>
                          <div className="text-xs text-gray-500">{order.metadata?.customer_phone || 'N/A'}</div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-900">
                          {order.metadata?.restaurant?.title || 'N/A'}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-900">
                          {order.metadata?.order_items?.length || 0} items
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm font-medium text-gray-900">
                          ${order.metadata?.total || '0.00'}
                        </div>
                        {order.metadata?.delivery_fee && (
                          <div className="text-xs text-gray-500">
                            +${order.metadata.delivery_fee} delivery
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.metadata?.order_status === 'Delivered' ? 'bg-green-100 text-green-800' :
                          order.metadata?.order_status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                          order.metadata?.order_status === 'Out for Delivery' ? 'bg-blue-100 text-blue-800' :
                          order.metadata?.order_status === 'Ready' ? 'bg-purple-100 text-purple-800' :
                          order.metadata?.order_status === 'Preparing' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.metadata?.order_status || 'Pending'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.metadata?.payment_status === 'Paid' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {order.metadata?.payment_status || 'Not Paid'}
                        </span>
                        {order.metadata?.payment_method && (
                          <div className="text-xs text-gray-500 mt-1">
                            {order.metadata.payment_method}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
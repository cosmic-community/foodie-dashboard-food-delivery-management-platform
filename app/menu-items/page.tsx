import Link from 'next/link'
import { cosmic } from '@/lib/cosmic'
import { MenuItem, hasStatus } from '@/types'

async function getMenuItems() {
  try {
    const response = await cosmic.objects
      .find({ type: 'menu-items' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)

    return response.objects as MenuItem[]
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw error
  }
}

export default async function MenuItemsPage() {
  const menuItems = await getMenuItems()

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
              <h1 className="text-2xl font-bold text-gray-900">Menu Items</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-gray-600 hover:text-primary">
                Dashboard
              </Link>
              <Link href="/restaurants" className="text-gray-600 hover:text-primary">
                Restaurants
              </Link>
              <Link href="/orders" className="text-gray-600 hover:text-primary">
                Orders
              </Link>
              <Link href="/menu-items" className="text-gray-700 hover:text-primary font-medium">
                Menu Items
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">All Menu Items</h2>
          <p className="text-gray-600">Browse and manage menu items across all restaurants</p>
        </div>

        {menuItems.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-6xl mb-4">🍕</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No menu items yet</h3>
            <p className="text-gray-600 mb-6">Start by adding menu items to your restaurants</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {menuItems.map((item) => (
              <div key={item.id} className="card overflow-hidden hover:shadow-lg transition-shadow">
                {item.metadata?.photo && (
                  <div className="relative h-48 bg-gray-200">
                    <img
                      src={`${item.metadata.photo.imgix_url}?w=600&h=400&fit=crop&auto=format,compress`}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    {item.metadata?.available === false && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Unavailable
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div className="p-4">
                  <div className="mb-2">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{item.title}</h3>
                    {item.metadata?.restaurant && (
                      <p className="text-xs text-gray-500">{item.metadata.restaurant.title}</p>
                    )}
                  </div>

                  {item.metadata?.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {item.metadata.description}
                    </p>
                  )}

                  {item.metadata?.category && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 mb-3">
                      {item.metadata.category.title}
                    </span>
                  )}

                  {item.metadata?.tags && item.metadata.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.metadata.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-accent/20 text-accent-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div>
                      {item.metadata?.discounted_price ? (
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-primary">
                            ${item.metadata.discounted_price}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            ${item.metadata.price}
                          </span>
                        </div>
                      ) : (
                        <span className="text-lg font-bold text-gray-900">
                          ${item.metadata?.price || '0.00'}
                        </span>
                      )}
                    </div>
                    {item.metadata?.available !== false && (
                      <span className="text-xs text-green-600 font-medium">Available</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
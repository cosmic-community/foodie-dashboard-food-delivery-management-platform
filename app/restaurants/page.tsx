import Link from 'next/link'
import { cosmic } from '@/lib/cosmic'
import { Restaurant, hasStatus } from '@/types'

async function getRestaurants() {
  try {
    const response = await cosmic.objects
      .find({ type: 'restaurants' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)

    return response.objects as Restaurant[]
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw error
  }
}

export default async function RestaurantsPage() {
  const restaurants = await getRestaurants()

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
              <h1 className="text-2xl font-bold text-gray-900">Restaurants</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-gray-600 hover:text-primary">
                Dashboard
              </Link>
              <Link href="/restaurants" className="text-gray-700 hover:text-primary font-medium">
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
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">All Restaurants</h2>
          <p className="text-gray-600">Manage restaurants on the Foodie platform</p>
        </div>

        {restaurants.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-6xl mb-4">🏪</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No restaurants yet</h3>
            <p className="text-gray-600 mb-6">Get started by adding your first restaurant to the platform</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <div key={restaurant.id} className="card overflow-hidden hover:shadow-lg transition-shadow">
                {restaurant.metadata?.cover_image && (
                  <div className="relative h-48 bg-gray-200">
                    <img
                      src={`${restaurant.metadata.cover_image.imgix_url}?w=600&h=400&fit=crop&auto=format,compress`}
                      alt={restaurant.title}
                      className="w-full h-full object-cover"
                    />
                    {restaurant.metadata?.status === 'Active' ? (
                      <span className="absolute top-3 right-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    ) : (
                      <span className="absolute top-3 right-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Inactive
                      </span>
                    )}
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{restaurant.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {restaurant.metadata?.short_description || 'No description'}
                      </p>
                    </div>
                    {restaurant.metadata?.logo && (
                      <img
                        src={`${restaurant.metadata.logo.imgix_url}?w=80&h=80&fit=crop&auto=format,compress`}
                        alt={`${restaurant.title} logo`}
                        className="w-12 h-12 rounded-lg ml-3 object-cover border"
                      />
                    )}
                  </div>

                  {restaurant.metadata?.city && (
                    <p className="text-sm text-gray-500 mb-3">
                      📍 {restaurant.metadata.city}{restaurant.metadata?.country ? `, ${restaurant.metadata.country}` : ''}
                    </p>
                  )}

                  {restaurant.metadata?.cuisine_types && restaurant.metadata.cuisine_types.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {restaurant.metadata.cuisine_types.slice(0, 3).map((cuisine, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
                        >
                          {cuisine}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      {restaurant.metadata?.rating !== undefined && (
                        <span className="flex items-center">
                          ⭐ {restaurant.metadata.rating.toFixed(1)}
                        </span>
                      )}
                      {restaurant.metadata?.delivery_time && (
                        <span>🚚 {restaurant.metadata.delivery_time}</span>
                      )}
                    </div>
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
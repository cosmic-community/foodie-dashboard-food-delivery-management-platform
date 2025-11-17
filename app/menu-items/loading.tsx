export default function MenuItemsLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="h-10 w-64 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-6 w-96 bg-gray-200 rounded animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="card overflow-hidden">
              <div className="h-48 bg-gray-200 animate-pulse"></div>
              <div className="p-4">
                <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse mb-3"></div>
                <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
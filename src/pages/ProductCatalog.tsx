import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function ProductCatalog() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState([0, 100])

  const products = [
    {
      id: 1,
      name: "Serum Facial Premium",
      price: 49.99,
      category: "serums",
      image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop",
      rating: 4.8
    },
    {
      id: 2,
      name: "Crema Hidratante de Chocolate",
      price: 39.99,
      category: "cremas",
      image: "https://images.unsplash.com/photo-1521391573892-e44906baee46?w=400&h=400&fit=crop",
      rating: 4.9
    },
    {
      id: 3,
      name: "Máscara Facial Detox",
      price: 34.99,
      category: "mascaras",
      image: "https://images.unsplash.com/photo-1596462502278-af0220c04a16?w=400&h=400&fit=crop",
      rating: 4.7
    },
    {
      id: 4,
      name: "Aceite Corporal Aromático",
      price: 44.99,
      category: "aceites",
      image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop",
      rating: 4.6
    },
    {
      id: 5,
      name: "Limpiador Facial Suave",
      price: 29.99,
      category: "limpiadores",
      image: "https://images.unsplash.com/photo-1596462502278-af0220c04a16?w=400&h=400&fit=crop",
      rating: 4.8
    },
    {
      id: 6,
      name: "Tónico Equilibrante",
      price: 32.99,
      category: "tonicos",
      image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop",
      rating: 4.7
    }
  ]

  const categories = [
    { id: 'serums', name: 'Serums' },
    { id: 'cremas', name: 'Cremas' },
    { id: 'mascaras', name: 'Máscaras' },
    { id: 'aceites', name: 'Aceites' },
    { id: 'limpiadores', name: 'Limpiadores' },
    { id: 'tonicos', name: 'Tónicos' }
  ]

  const filteredProducts = products.filter(product => {
    const matchesCategory = !selectedCategory || product.category === selectedCategory
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
    return matchesCategory && matchesPrice
  })

  return (
    <div className="px-6 lg:px-20 py-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-cocoa-900 dark:text-white mb-8">
          Catálogo de Productos
        </h1>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-cocoa-800 rounded-xl p-6 sticky top-24">
              <h3 className="font-bold text-lg text-cocoa-900 dark:text-white mb-4">
                Filtros
              </h3>

              {/* Categories */}
              <div className="mb-8">
                <h4 className="font-semibold text-cocoa-900 dark:text-white mb-3">
                  Categorías
                </h4>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === null
                        ? 'bg-primary text-white'
                        : 'text-cocoa-700 dark:text-slate-300 hover:bg-cocoa-100 dark:hover:bg-cocoa-700'
                    }`}
                  >
                    Todos
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === cat.id
                          ? 'bg-primary text-white'
                          : 'text-cocoa-700 dark:text-slate-300 hover:bg-cocoa-100 dark:hover:bg-cocoa-700'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="font-semibold text-cocoa-900 dark:text-white mb-3">
                  Rango de Precio
                </h4>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="w-full"
                  />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full"
                  />
                  <p className="text-sm text-cocoa-700 dark:text-slate-300">
                    ${priceRange[0]} - ${priceRange[1]}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="bg-white dark:bg-cocoa-800 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative overflow-hidden h-48 bg-cocoa-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-cocoa-900 dark:text-white mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-bold text-primary">
                        ${product.price.toFixed(2)}
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-yellow-500 text-sm">star</span>
                        <span className="text-sm font-semibold text-cocoa-900 dark:text-white">
                          {product.rating}
                        </span>
                      </div>
                    </div>
                    <button className="w-full py-2 bg-primary text-white rounded-lg font-semibold hover:bg-red-600 transition-colors">
                      Añadir al Carrito
                    </button>
                  </div>
                </Link>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-4xl text-cocoa-400 mb-4 block">
                  search_off
                </span>
                <p className="text-cocoa-700 dark:text-slate-300 text-lg">
                  No se encontraron productos con los filtros seleccionados
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

import CartFeedbackToast from '../components/CartFeedbackToast'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

type Producto = {
  id: string
  nombre: string
  descripcion: string
  precio: string
  categoria: string
  imagen: string | null
  marca: string
  stock: number
}

export default function ProductCatalog() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState<Producto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [authError, setAuthError] = useState('')
  const [addedProductId, setAddedProductId] = useState<string | null>(null)
  const [addedProductName, setAddedProductName] = useState('')
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    let active = true
    const loadProducts = async () => {
      setIsLoading(true)
      try {
        const { data } = await axios.get<Producto[]>('/api/productos/')
        if (!active) return
        setProducts(data)
        if (data.length > 0) {
          const precios = data.map(item => Number(item.precio))
          const min = Math.floor(Math.min(...precios))
          const max = Math.ceil(Math.max(...precios))
          setPriceRange([min, max])
        }
      } catch {
        if (active) setError('No se pudo cargar el catálogo de productos.')
      } finally {
        if (active) setIsLoading(false)
      }
    }

    loadProducts()
    return () => {
      active = false
    }
  }, [])

  const categories = Array.from(
    new Set(products.map(item => item.categoria).filter(Boolean))
  ).sort()

  const query = searchParams.get('q')?.trim().toLowerCase() || ''

  const filteredProducts = products.filter(product => {
    const matchesCategory = !selectedCategory || product.categoria === selectedCategory
    const priceValue = Number(product.precio)
    const matchesPrice = priceValue >= priceRange[0] && priceValue <= priceRange[1]
    const searchable = [
      product.nombre,
      product.descripcion,
      product.marca,
      product.categoria,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    const matchesQuery = !query || searchable.includes(query)
    return matchesCategory && matchesPrice && matchesQuery
  })

  useEffect(() => {
    if (addedProductId === null) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      setAddedProductId(null)
      setAddedProductName('')
    }, 1800)

    return () => window.clearTimeout(timeoutId)
  }, [addedProductId])

  const handleAddToCart = (
    event: React.MouseEvent<HTMLButtonElement>,
    productId: string,
    productName: string
  ) => {
    event.preventDefault()
    event.stopPropagation()
    if (!isAuthenticated) {
      setAuthError('Debes iniciar sesión para agregar productos al carrito.')
      navigate('/login', { state: { from: location } })
      return
    }

    setAuthError('')
    const product = products.find((item) => item.id === productId)
    if (!product) {
      return
    }

    addToCart({
      id: product.id,
      name: product.nombre,
      price: Number(product.precio),
      image: product.imagen || '/images/products/default-product.png',
      quantity: 1,
    })
    setAddedProductId(productId)
    setAddedProductName(productName)
  }

  return (
    <div className="px-6 lg:px-20 py-12">
      <CartFeedbackToast
        visible={addedProductId !== null}
        message={addedProductName}
      />

      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-cocoa-900 dark:text-white mb-8">
          Catálogo de Productos
        </h1>

        {query && (
          <p className="mb-6 text-cocoa-600 dark:text-slate-300">
            Resultados para: <span className="font-semibold">"{query}"</span>
          </p>
        )}

        {authError && (
          <div className="mb-6 px-4 py-3 bg-amber-50 border border-amber-300 rounded-lg text-amber-700 text-sm">
            {authError}
          </div>
        )}

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
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === cat
                          ? 'bg-primary text-white'
                          : 'text-cocoa-700 dark:text-slate-300 hover:bg-cocoa-100 dark:hover:bg-cocoa-700'
                      }`}
                    >
                      {cat}
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
                    min={Math.min(...products.map(item => Number(item.precio)), 0)}
                    max={Math.max(...products.map(item => Number(item.precio)), 1000)}
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="w-full"
                  />
                  <input
                    type="range"
                    min={Math.min(...products.map(item => Number(item.precio)), 0)}
                    max={Math.max(...products.map(item => Number(item.precio)), 1000)}
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
            {isLoading && (
              <div className="text-center py-12 text-cocoa-500">
                <span className="material-symbols-outlined animate-spin text-4xl mb-4 block">progress_activity</span>
                Cargando productos...
              </div>
            )}

            {error && !isLoading && (
              <div className="text-center py-12 text-red-500">{error}</div>
            )}

            {!isLoading && !error && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="bg-white dark:bg-cocoa-800 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative overflow-hidden h-48 bg-cocoa-100">
                    <img
                      src={product.imagen || '/images/products/default-product.png'}
                      alt={product.nombre}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-cocoa-900 dark:text-white mb-2 line-clamp-2">
                      {product.nombre}
                    </h3>
                    <p className="text-sm text-cocoa-500 mb-2">{product.marca}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-bold text-primary">
                        ${Number(product.precio).toFixed(2)}
                      </span>
                      <span className="text-xs px-2 py-1 bg-cocoa-100 rounded-full text-cocoa-600">
                        {product.categoria || 'Sin categoría'}
                      </span>
                    </div>
                    <button
                      onClick={(event) => handleAddToCart(event, product.id, product.nombre)}
                      className={`w-full py-2 rounded-lg font-semibold text-white transition-all ${
                        addedProductId === product.id
                          ? 'bg-emerald-600 hover:bg-emerald-700 cart-button-pop'
                          : 'bg-primary hover:bg-red-600'
                      }`}
                    >
                      {addedProductId === product.id ? 'Agregado' : 'Añadir al Carrito'}
                    </button>
                  </div>
                </Link>
              ))}
            </div>
            )}

            {!isLoading && !error && filteredProducts.length === 0 && (
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

import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

import CartFeedbackToast from '../components/CartFeedbackToast'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated } = useAuth()
  const [product, setProduct] = useState<{
    id: string
    nombre: string
    precio: string
    descripcion: string
    imagen: string | null
    categoria: string
    marca: string
    stock: number
    tienda_nombre?: string
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [authError, setAuthError] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [showCartFeedback, setShowCartFeedback] = useState(false)
  const { addToCart } = useCart()

  useEffect(() => {
    let active = true
    const loadProduct = async () => {
      if (!id) return
      setIsLoading(true)
      try {
        const { data } = await axios.get(`/api/productos/${id}/`)
        if (!active) return
        setProduct(data)
      } catch {
        if (active) setError('No se pudo cargar el producto.')
      } finally {
        if (active) setIsLoading(false)
      }
    }
    loadProduct()
    return () => {
      active = false
    }
  }, [id])

  useEffect(() => {
    if (!showCartFeedback) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      setShowCartFeedback(false)
    }, 1800)

    return () => window.clearTimeout(timeoutId)
  }, [showCartFeedback])

  const handleAddToCart = () => {
    if (!product) return
    if (!isAuthenticated) {
      setAuthError('Debes iniciar sesión para agregar productos al carrito.')
      navigate('/login', { state: { from: location } })
      return
    }

    setAuthError('')
    addToCart({
      id: product.id,
      name: product.nombre,
      price: Number(product.precio),
      image: product.imagen || '/images/products/default-product.png',
      quantity,
    })
    setShowCartFeedback(true)
  }

  if (isLoading) {
    return (
      <div className="px-6 lg:px-20 py-12 text-center text-cocoa-500">
        <span className="material-symbols-outlined animate-spin text-4xl mb-4 block">progress_activity</span>
        Cargando producto...
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="px-6 lg:px-20 py-12 text-center text-red-500">
        {error || 'Producto no encontrado.'}
      </div>
    )
  }

  const infoItems = [
    { label: 'Marca', value: product.marca || 'N/A' },
    { label: 'Categoría', value: product.categoria || 'N/A' },
    { label: 'Tienda', value: product.tienda_nombre || 'N/A' },
  ]

  return (
    <div className="px-6 lg:px-20 py-12">
      <CartFeedbackToast
        visible={showCartFeedback}
        message={`${quantity} unidad${quantity > 1 ? 'es' : ''} de ${product.nombre}`}
      />

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="h-96 lg:h-[600px] rounded-xl overflow-hidden bg-cocoa-100">
            <img
              src={product.imagen || '/images/products/default-product.png'}
              alt={product.nombre}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-4xl font-bold text-cocoa-900 dark:text-white mb-4">
              {product.nombre}
            </h1>

            <div className="flex items-center gap-2 mb-6">
              <span className="px-2 py-1 bg-cocoa-100 rounded-full text-cocoa-600 text-sm">
                {product.categoria || 'Sin categoría'}
              </span>
              <span className={`px-2 py-1 rounded-full text-sm ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {product.stock > 0 ? `Stock: ${product.stock}` : 'Sin stock'}
              </span>
            </div>

            {/* Price */}
            <p className="text-4xl font-bold text-primary mb-6">
              ${Number(product.precio).toFixed(2)}
            </p>

            {/* Description */}
            <p className="text-lg text-cocoa-700 dark:text-slate-300 mb-8">
              {product.descripcion}
            </p>

            {authError && (
              <div className="mb-6 px-4 py-3 bg-amber-50 border border-amber-300 rounded-lg text-amber-700 text-sm">
                {authError}
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-3 border border-cocoa-200 dark:border-cocoa-700 rounded-lg p-2">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={product.stock <= 0}
                  className="w-8 h-8 flex items-center justify-center hover:bg-cocoa-100 dark:hover:bg-cocoa-700 rounded"
                >
                  −
                </button>
                <span className="w-8 text-center font-semibold">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(product.stock || 1, quantity + 1))}
                  disabled={product.stock <= quantity}
                  className="w-8 h-8 flex items-center justify-center hover:bg-cocoa-100 dark:hover:bg-cocoa-700 rounded"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`flex-1 py-3 rounded-lg font-semibold text-white transition-all ${
                  showCartFeedback
                    ? 'bg-emerald-600 hover:bg-emerald-700 cart-button-pop'
                    : product.stock > 0
                      ? 'bg-primary hover:bg-red-600'
                      : 'bg-cocoa-400 cursor-not-allowed'
                }`}
              >
                {showCartFeedback ? 'Agregado' : product.stock > 0 ? 'Añadir al Carrito' : 'Sin stock'}
              </button>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold text-cocoa-900 dark:text-white mb-4">
                Información del Producto
              </h3>
              <ul className="space-y-3">
                {infoItems.map((item) => (
                  <li key={item.label} className="flex items-center justify-between text-cocoa-700 dark:text-slate-300 border-b border-cocoa-100 pb-2">
                    <span className="font-semibold">{item.label}</span>
                    <span>{item.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

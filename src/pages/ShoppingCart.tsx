import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function ShoppingCart() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Serum Facial Premium",
      price: 49.99,
      quantity: 2,
      image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=200&h=200&fit=crop"
    },
    {
      id: 2,
      name: "Crema Hidratante",
      price: 39.99,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1521391573892-e44906baee46?w=200&h=200&fit=crop"
    }
  ])

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.08
  const total = subtotal + tax

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCartItems(items => items.filter(item => item.id !== id))
    } else {
      setCartItems(items =>
        items.map(item => item.id === id ? { ...item, quantity: newQuantity } : item)
      )
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="px-6 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <span className="material-symbols-outlined text-6xl text-cocoa-300 mb-4 block">
            shopping_cart
          </span>
          <h1 className="text-3xl font-bold text-cocoa-900 dark:text-white mb-4">
            Tu carrito está vacío
          </h1>
          <p className="text-cocoa-700 dark:text-slate-300 mb-8 text-lg">
            Explora nuestro catálogo y añade productos a tu carrito
          </p>
          <Link
            to="/products"
            className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-red-600 transition-colors inline-block"
          >
            Ir al Catálogo
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="px-6 lg:px-20 py-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-cocoa-900 dark:text-white mb-8">
          Carrito de Compras
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-cocoa-800 rounded-xl overflow-hidden">
              {cartItems.map(item => (
                <div key={item.id} className="flex gap-4 p-6 border-b border-cocoa-200 dark:border-cocoa-700 last:border-b-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-cocoa-900 dark:text-white mb-2">
                      {item.name}
                    </h3>
                    <p className="text-primary font-semibold mb-4">
                      ${item.price.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-cocoa-100 dark:hover:bg-cocoa-700 rounded"
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-cocoa-100 dark:hover:bg-cocoa-700 rounded"
                      >
                        +
                      </button>
                      <button
                        onClick={() => updateQuantity(item.id, 0)}
                        className="ml-auto text-red-600 hover:text-red-700 font-semibold text-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-cocoa-900 dark:text-white">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-cocoa-800 rounded-xl p-6 sticky top-24">
              <h2 className="text-xl font-bold text-cocoa-900 dark:text-white mb-6">
                Resumen del Pedido
              </h2>

              <div className="space-y-3 mb-6 pb-6 border-b border-cocoa-200 dark:border-cocoa-700">
                <div className="flex justify-between text-cocoa-700 dark:text-slate-300">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-cocoa-700 dark:text-slate-300">
                  <span>Impuestos (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-cocoa-700 dark:text-slate-300">
                  <span>Envío</span>
                  <span>Gratis</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-bold text-cocoa-900 dark:text-white mb-6">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <Link
                to="/checkout"
                className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-red-600 transition-colors block text-center mb-3"
              >
                Proceder al Checkout
              </Link>
              <Link
                to="/products"
                className="w-full py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors block text-center"
              >
                Continuar Comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

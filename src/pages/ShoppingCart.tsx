import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { useCart } from '../context/CartContext'

export default function ShoppingCart() {
  const { t } = useTranslation()
  const { cartItems, subtotal, updateQuantity, removeFromCart, clearCart } = useCart()
  const tax = subtotal * 0.08
  const total = subtotal + tax

  if (cartItems.length === 0) {
    return (
      <div className="px-6 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <span className="material-symbols-outlined text-6xl text-cocoa-300 mb-4 block">
            shopping_cart
          </span>
          <h1 className="text-3xl font-bold text-cocoa-900 dark:text-white mb-4">
            {t('cart.empty')}
          </h1>
          <p className="text-cocoa-700 dark:text-slate-300 mb-8 text-lg">
            {t('cart.emptySubtitle')}
          </p>
          <Link
            to="/products"
            className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-red-600 transition-colors inline-block"
          >
            {t('cart.goCatalog')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="px-6 lg:px-20 py-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-cocoa-900 dark:text-white mb-8">
          {t('cart.titleFull')}
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
                        onClick={() => removeFromCart(item.id)}
                        className="ml-auto text-red-600 hover:text-red-700 font-semibold text-sm"
                      >
                        {t('cart.remove')}
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
                {t('cart.orderSummary')}
              </h2>

              <div className="space-y-3 mb-6 pb-6 border-b border-cocoa-200 dark:border-cocoa-700">
                <div className="flex justify-between text-cocoa-700 dark:text-slate-300">
                  <span>{t('cart.subtotal')}</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-cocoa-700 dark:text-slate-300">
                  <span>{t('cart.tax')}</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-cocoa-700 dark:text-slate-300">
                  <span>{t('cart.shipping')}</span>
                  <span>{t('cart.free')}</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-bold text-cocoa-900 dark:text-white mb-6">
                <span>{t('cart.total')}</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <button
                onClick={clearCart}
                className="mb-3 w-full py-3 border border-cocoa-300 text-cocoa-800 rounded-lg font-semibold hover:bg-cocoa-100 transition-colors"
              >
                {t('cart.clear')}
              </button>

              <Link
                to="/checkout"
                className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-red-600 transition-colors block text-center mb-3"
              >
                {t('cart.checkoutNow')}
              </Link>
              <Link
                to="/products"
                className="w-full py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors block text-center"
              >
                {t('cart.continueShopping')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

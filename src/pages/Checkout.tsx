import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { loadStripe, type Stripe } from '@stripe/stripe-js'

type StripePaymentFormProps = {
  onBack: () => void
  onSuccess: (token: string) => void
  isSubmitting: boolean
}

function StripePaymentForm({ onBack, onSuccess, isSubmitting }: StripePaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!stripe || !elements || isSubmitting) {
      return
    }

    setLoading(true)
    setError(null)

    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {},
      redirect: 'if_required',
    })

    if (stripeError) {
      setError(stripeError.message || 'Error en el pago')
      setLoading(false)
      return
    }

    if (paymentIntent) {
      const paymentToken = paymentIntent.id || paymentIntent.client_secret || ''
      if (paymentIntent.status === 'succeeded' && paymentToken) {
        onSuccess(paymentToken)
      } else {
        setError('No se pudo confirmar el pago. Intenta con otro método.')
      }
    } else {
      setError('No se recibió confirmación de pago de Stripe.')
    }

    setLoading(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <PaymentElement />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex gap-4 mt-4">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3 border border-cafe text-cafe rounded-xl font-medium hover:bg-cafe/10 transition-colors"
        >
          Atrás
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || !stripe || isSubmitting}
          className="flex-1 py-3 bg-cafe text-white rounded-xl font-medium hover:bg-amber-800 transition-colors disabled:opacity-50"
        >
          {loading || isSubmitting ? 'Procesando...' : 'Confirmar Pedido'}
        </button>
      </div>
    </div>
  )
}

export default function Checkout() {
  const { cartItems, clearCart } = useCart()
  const { accessToken, isAuthenticated } = useAuth()
  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loadingPaymentIntent, setLoadingPaymentIntent] = useState(false)
  const [paymentError, setPaymentError] = useState('')
  const [invoiceUrl, setInvoiceUrl] = useState('')
  const [clientSecret, setClientSecret] = useState('')
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    phone: '',
    address: '',
    city: '',
    homeType: 'casa',
    tower: '',
    floor: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'homeType' && value === 'casa' ? { tower: '', floor: '' } : {})
    }))
  }

  const handleGoToPayment = async () => {
    if (!isAuthenticated || !accessToken) {
      setPaymentError('Debes iniciar sesión para completar la compra.')
      return
    }

    if (cartItems.length === 0) {
      setPaymentError('Tu carrito está vacío.')
      return
    }

    if (total <= 0) {
      setPaymentError('El total del carrito no es válido para procesar el pago.')
      return
    }

    setPaymentError('')
    setLoadingPaymentIntent(true)
    try {
      const { data } = await axios.post(
        '/api/pedidos/payment-intent/',
        { amount: total },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      )

      const receivedClientSecret = data?.client_secret || ''
      const receivedPublishableKey = data?.publishable_key || ''
      if (!receivedClientSecret || !receivedPublishableKey) {
        throw new Error('No se pudo inicializar Stripe para el pago.')
      }

      setClientSecret(receivedClientSecret)
      setStripePromise(loadStripe(receivedPublishableKey))
      setStep(2)
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { detail?: string } } }
      setPaymentError(
        axiosError.response?.data?.detail ||
        'No se pudo inicializar el pago con Stripe. Intenta de nuevo.',
      )
    } finally {
      setLoadingPaymentIntent(false)
    }
  }

  const completeCheckout = async (token: string) => {
    if (!isAuthenticated || !accessToken) {
      setPaymentError('Debes iniciar sesión para completar la compra.')
      return
    }

    if (cartItems.length === 0) {
      setPaymentError('Tu carrito está vacío.')
      return
    }

    if (!token) {
      setPaymentError('No se obtuvo el identificador del pago. Intenta de nuevo.')
      return
    }

    setIsSubmitting(true)
    setPaymentError('')
    try {
      const deliveryAddress = [
        formData.address,
        formData.city,
        formData.homeType === 'apartamento'
          ? `Torre ${formData.tower || '-'}, Piso ${formData.floor || '-'}`
          : '',
      ]
        .filter(Boolean)
        .join(', ')

      const response = await axios.post(
        '/api/pedidos/checkout/',
        {
          items: cartItems.map((item) => ({
            producto_id: item.id,
            cantidad: item.quantity,
          })),
          envio: {
            direccion_entrega: deliveryAddress,
          },
          perfil: {
            nombre: formData.fullName,
            telefono: formData.phone,
            direccion: deliveryAddress,
          },
          payment_data: {
            token,
            payment_intent_id: token,
            currency: 'usd',
          },
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      )

      setInvoiceUrl(response.data?.factura_pdf_url || '')
      clearCart()
      setStep(3)
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { detail?: string } }
      }
      setPaymentError(
        axiosError.response?.data?.detail ||
        'No se pudo completar la compra. Verifica disponibilidad e inténtalo de nuevo.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPaymentError('')

    if (step === 1) {
      await handleGoToPayment()
      return
    }
  }

  return (
    <div className="px-6 lg:px-20 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-cocoa-900 dark:text-white mb-8">
          Checkout
        </h1>

        {/* Progress Steps */}
        <div className="flex justify-between mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex flex-col items-center flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white mb-2 ${
                s <= step ? 'bg-primary' : 'bg-cocoa-300 dark:bg-cocoa-700'
              }`}>
                {s}
              </div>
              <span className="text-sm font-semibold text-cocoa-700 dark:text-slate-300">
                {s === 1 ? 'Envío' : s === 2 ? 'Pago' : 'Confirmación'}
              </span>
              {s < 3 && (
                <div className={`flex-1 h-1 mx-2 mt-4 ${
                  s < step ? 'bg-primary' : 'bg-cocoa-200 dark:bg-cocoa-700'
                }`} style={{ width: '100%' }}></div>
              )}
            </div>
          ))}
        </div>

        {paymentError && step < 3 && (
          <div className="mb-6 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
            {paymentError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Step 1: Shipping */}
          {step === 1 && (
            <div className="bg-white dark:bg-cocoa-800 rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-cocoa-900 dark:text-white mb-6">
                Información de Envío
              </h2>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-cocoa-900 dark:text-white mb-2">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-cocoa-200 dark:border-cocoa-700 rounded-lg focus:outline-none focus:border-primary dark:bg-cocoa-700 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-cocoa-900 dark:text-white mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-cocoa-200 dark:border-cocoa-700 rounded-lg focus:outline-none focus:border-primary dark:bg-cocoa-700 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-cocoa-900 dark:text-white mb-2">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-cocoa-200 dark:border-cocoa-700 rounded-lg focus:outline-none focus:border-primary dark:bg-cocoa-700 dark:text-white"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-cocoa-900 dark:text-white mb-2">
                  Dirección
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-cocoa-200 dark:border-cocoa-700 rounded-lg focus:outline-none focus:border-primary dark:bg-cocoa-700 dark:text-white"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-cocoa-900 dark:text-white mb-2">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-cocoa-200 dark:border-cocoa-700 rounded-lg focus:outline-none focus:border-primary dark:bg-cocoa-700 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-cocoa-900 dark:text-white mb-2">
                    Tipo de Vivienda
                  </label>
                  <select
                    name="homeType"
                    value={formData.homeType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-cocoa-200 dark:border-cocoa-700 rounded-lg focus:outline-none focus:border-primary dark:bg-cocoa-700 dark:text-white"
                    required
                  >
                    <option value="casa">Casa</option>
                    <option value="apartamento">Apartamento</option>
                  </select>
                </div>
              </div>

              {formData.homeType === 'apartamento' && (
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-semibold text-cocoa-900 dark:text-white mb-2">
                      Torre
                    </label>
                    <input
                      type="text"
                      name="tower"
                      value={formData.tower}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-cocoa-200 dark:border-cocoa-700 rounded-lg focus:outline-none focus:border-primary dark:bg-cocoa-700 dark:text-white"
                      required={formData.homeType === 'apartamento'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-cocoa-900 dark:text-white mb-2">
                      Piso
                    </label>
                    <input
                      type="text"
                      name="floor"
                      value={formData.floor}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-cocoa-200 dark:border-cocoa-700 rounded-lg focus:outline-none focus:border-primary dark:bg-cocoa-700 dark:text-white"
                      required={formData.homeType === 'apartamento'}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="bg-white dark:bg-cocoa-800 rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-cocoa-900 dark:text-white mb-6">
                Información de Pago
              </h2>

              {loadingPaymentIntent && (
                <div className="rounded-lg border border-cocoa-200 bg-cocoa-50 px-4 py-3 text-sm text-cocoa-700">
                  Inicializando pago con Stripe...
                </div>
              )}

              {!loadingPaymentIntent && clientSecret && stripePromise && (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <StripePaymentForm
                    onBack={() => setStep(1)}
                    onSuccess={completeCheckout}
                    isSubmitting={isSubmitting}
                  />
                </Elements>
              )}
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="bg-white dark:bg-cocoa-800 rounded-xl p-8 mb-8 text-center">
              <span className="material-symbols-outlined text-6xl text-green-500 mb-4 block">
                check_circle
              </span>
              <h2 className="text-2xl font-bold text-cocoa-900 dark:text-white mb-4">
                ¡Pedido Confirmado!
              </h2>
              <p className="text-cocoa-700 dark:text-slate-300 mb-6">
                Tu pedido ha sido procesado correctamente. Recibirás un correo de confirmación pronto.
              </p>
              {invoiceUrl && (
                <a
                  href={invoiceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mb-4 inline-block rounded-lg border-2 border-cocoa-900 px-6 py-2 font-semibold text-cocoa-900 transition-colors hover:bg-cocoa-900 hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-cocoa-900"
                >
                  Descargar factura PDF
                </a>
              )}
              <Link
                to="/"
                className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-red-600 transition-colors inline-block"
              >
                Volver al Inicio
              </Link>
            </div>
          )}

          {/* Navigation Buttons */}
          {step < 3 && step !== 2 && (
            <div className="flex gap-4">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="flex-1 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors"
                >
                  Atrás
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
              >
                Continuar
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

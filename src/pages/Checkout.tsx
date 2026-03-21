import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function Checkout() {
  const { cartItems, clearCart } = useCart()
  const { accessToken, isAuthenticated } = useAuth()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentError, setPaymentError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    phone: '',
    address: '',
    city: '',
    homeType: 'casa',
    tower: '',
    floor: '',
    paymentMethod: 'tarjeta',
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    pseBank: '',
    pseDocument: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'homeType' && value === 'casa' ? { tower: '', floor: '' } : {})
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPaymentError('')

    if (step === 1) {
      setStep(2)
      return
    }

    if (step === 2) {
      if (!isAuthenticated || !accessToken) {
        setPaymentError('Debes iniciar sesión para completar la compra.')
        return
      }

      if (cartItems.length === 0) {
        setPaymentError('Tu carrito está vacío.')
        return
      }

      setIsSubmitting(true)
      try {
        await axios.post(
          '/api/pedidos/checkout/',
          {
            items: cartItems.map((item) => ({
              producto_id: item.id,
              cantidad: item.quantity,
            })),
          },
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        )

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

              <div className="mb-6">
                <label className="block text-sm font-semibold text-cocoa-900 dark:text-white mb-2">
                  Método de Pago
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="w-full md:w-80 px-4 py-2 border border-cocoa-200 dark:border-cocoa-700 rounded-lg focus:outline-none focus:border-primary dark:bg-cocoa-700 dark:text-white"
                >
                  <option value="tarjeta">Tarjeta de crédito/débito</option>
                  <option value="pse">PSE</option>
                </select>
              </div>

              {formData.paymentMethod === 'tarjeta' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-cocoa-900 dark:text-white mb-2">
                      Nombre en la Tarjeta
                    </label>
                    <input
                      type="text"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-cocoa-200 dark:border-cocoa-700 rounded-lg focus:outline-none focus:border-primary dark:bg-cocoa-700 dark:text-white"
                      placeholder="Nombre como aparece en la tarjeta"
                      required={step === 2 && formData.paymentMethod === 'tarjeta'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-cocoa-900 dark:text-white mb-2">
                      Número de Tarjeta
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-cocoa-200 dark:border-cocoa-700 rounded-lg focus:outline-none focus:border-primary dark:bg-cocoa-700 dark:text-white"
                      placeholder="1234 5678 9012 3456"
                      required={step === 2 && formData.paymentMethod === 'tarjeta'}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-cocoa-900 dark:text-white mb-2">
                        Fecha de Expiración
                      </label>
                      <input
                        type="text"
                        name="cardExpiry"
                        value={formData.cardExpiry}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-cocoa-200 dark:border-cocoa-700 rounded-lg focus:outline-none focus:border-primary dark:bg-cocoa-700 dark:text-white"
                        placeholder="MM/AA"
                        required={step === 2 && formData.paymentMethod === 'tarjeta'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-cocoa-900 dark:text-white mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        name="cardCvv"
                        value={formData.cardCvv}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-cocoa-200 dark:border-cocoa-700 rounded-lg focus:outline-none focus:border-primary dark:bg-cocoa-700 dark:text-white"
                        placeholder="123"
                        required={step === 2 && formData.paymentMethod === 'tarjeta'}
                      />
                    </div>
                  </div>
                </div>
              )}

              {formData.paymentMethod === 'pse' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-cocoa-900 dark:text-white mb-2">
                      Banco
                    </label>
                    <select
                      name="pseBank"
                      value={formData.pseBank}
                      onChange={handleChange}
                      className="w-full md:w-96 px-4 py-2 border border-cocoa-200 dark:border-cocoa-700 rounded-lg focus:outline-none focus:border-primary dark:bg-cocoa-700 dark:text-white"
                      required={step === 2 && formData.paymentMethod === 'pse'}
                    >
                      <option value="">Selecciona un banco</option>
                      <option value="bancolombia">Bancolombia</option>
                      <option value="davivienda">Davivienda</option>
                      <option value="bbva">BBVA</option>
                      <option value="banco_de_bogota">Banco de Bogota</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-cocoa-900 dark:text-white mb-2">
                      Documento del Titular
                    </label>
                    <input
                      type="text"
                      name="pseDocument"
                      value={formData.pseDocument}
                      onChange={handleChange}
                      className="w-full md:w-96 px-4 py-2 border border-cocoa-200 dark:border-cocoa-700 rounded-lg focus:outline-none focus:border-primary dark:bg-cocoa-700 dark:text-white"
                      placeholder="Cédula o NIT"
                      required={step === 2 && formData.paymentMethod === 'pse'}
                    />
                  </div>

                  <div className="bg-cocoa-100 dark:bg-cocoa-700 p-4 rounded-lg text-sm text-cocoa-700 dark:text-slate-300">
                    Simulación PSE: al confirmar, se asume que la entidad bancaria aprobó el pago.
                  </div>
                </div>
              )}

              {paymentError && (
                <div className="mt-6 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {paymentError}
                </div>
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
              <Link
                to="/"
                className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-red-600 transition-colors inline-block"
              >
                Volver al Inicio
              </Link>
            </div>
          )}

          {/* Navigation Buttons */}
          {step < 3 && (
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
                {step === 2 ? (isSubmitting ? 'Procesando compra...' : 'Confirmar Pedido') : 'Continuar'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

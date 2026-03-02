import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Checkout() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step < 3) {
      setStep(step + 1)
    } else {
      console.log('Order placed', formData)
      // TODO: Procesar la orden
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

              <div className="grid md:grid-cols-3 gap-4">
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
                    Estado
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-cocoa-200 dark:border-cocoa-700 rounded-lg focus:outline-none focus:border-primary dark:bg-cocoa-700 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-cocoa-900 dark:text-white mb-2">
                    Código Postal
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-cocoa-200 dark:border-cocoa-700 rounded-lg focus:outline-none focus:border-primary dark:bg-cocoa-700 dark:text-white"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="bg-white dark:bg-cocoa-800 rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-cocoa-900 dark:text-white mb-6">
                Información de Pago
              </h2>
              <p className="text-cocoa-700 dark:text-slate-300 mb-4">
                En esta sección se integraría con Stripe, PayPal, etc.
              </p>
              <div className="bg-cocoa-100 dark:bg-cocoa-700 p-4 rounded-lg">
                <p className="text-cocoa-900 dark:text-white font-semibold">
                  Métodos de pago disponibles:
                </p>
                <ul className="mt-2 space-y-1 text-cocoa-700 dark:text-slate-300">
                  <li>• Tarjeta de crédito/débito</li>
                  <li>• PayPal</li>
                  <li>• Apple Pay / Google Pay</li>
                </ul>
              </div>
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
                className="flex-1 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
              >
                {step === 2 ? 'Confirmar Pedido' : 'Continuar'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

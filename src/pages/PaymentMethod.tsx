export default function PaymentMethod() {
  return (
    <div className="px-6 lg:px-20 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-cocoa-900 dark:text-white mb-8">
          Seleccionar Método de Pago
        </h1>

        <div className="space-y-4">
          {/* Credit Card */}
          <div className="bg-white dark:bg-cocoa-800 rounded-xl p-6 border-2 border-cocoa-200 dark:border-cocoa-700 hover:border-primary cursor-pointer transition-colors">
            <div className="flex items-start gap-4">
              <input
                type="radio"
                name="payment"
                id="card"
                defaultChecked
                className="mt-1"
              />
              <div className="flex-1">
                <label htmlFor="card" className="font-bold text-lg text-cocoa-900 dark:text-white block cursor-pointer mb-2">
                  Tarjeta de Crédito/Débito
                </label>
                <p className="text-cocoa-700 dark:text-slate-300 text-sm">
                  Visa, Mastercard, American Express
                </p>
              </div>
              <span className="material-symbols-outlined text-primary text-3xl">credit_card</span>
            </div>
          </div>

          {/* PayPal */}
          <div className="bg-white dark:bg-cocoa-800 rounded-xl p-6 border-2 border-cocoa-200 dark:border-cocoa-700 hover:border-primary cursor-pointer transition-colors">
            <div className="flex items-start gap-4">
              <input
                type="radio"
                name="payment"
                id="paypal"
                className="mt-1"
              />
              <div className="flex-1">
                <label htmlFor="paypal" className="font-bold text-lg text-cocoa-900 dark:text-white block cursor-pointer mb-2">
                  PayPal
                </label>
                <p className="text-cocoa-700 dark:text-slate-300 text-sm">
                  Compra rápida y segura con tu cuenta PayPal
                </p>
              </div>
              <span className="material-symbols-outlined text-blue-500 text-3xl">account_balance</span>
            </div>
          </div>

          {/* Apple Pay */}
          <div className="bg-white dark:bg-cocoa-800 rounded-xl p-6 border-2 border-cocoa-200 dark:border-cocoa-700 hover:border-primary cursor-pointer transition-colors">
            <div className="flex items-start gap-4">
              <input
                type="radio"
                name="payment"
                id="apple"
                className="mt-1"
              />
              <div className="flex-1">
                <label htmlFor="apple" className="font-bold text-lg text-cocoa-900 dark:text-white block cursor-pointer mb-2">
                  Apple Pay
                </label>
                <p className="text-cocoa-700 dark:text-slate-300 text-sm">
                  Disponible en dispositivos Apple
                </p>
              </div>
              <span className="material-symbols-outlined text-black dark:text-white text-3xl">phone_in_talk</span>
            </div>
          </div>

          {/* Google Pay */}
          <div className="bg-white dark:bg-cocoa-800 rounded-xl p-6 border-2 border-cocoa-200 dark:border-cocoa-700 hover:border-primary cursor-pointer transition-colors">
            <div className="flex items-start gap-4">
              <input
                type="radio"
                name="payment"
                id="google"
                className="mt-1"
              />
              <div className="flex-1">
                <label htmlFor="google" className="font-bold text-lg text-cocoa-900 dark:text-white block cursor-pointer mb-2">
                  Google Pay
                </label>
                <p className="text-cocoa-700 dark:text-slate-300 text-sm">
                  Disponible en dispositivos Android
                </p>
              </div>
              <span className="material-symbols-outlined text-red-500 text-3xl">payment</span>
            </div>
          </div>
        </div>

        <button className="w-full mt-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-red-600 transition-colors">
          Continuar
        </button>
      </div>
    </div>
  )
}

type CartFeedbackToastProps = {
  visible: boolean
  message: string
}

export default function CartFeedbackToast({ visible, message }: CartFeedbackToastProps) {
  return (
    <div
      aria-live="polite"
      className={[
        'pointer-events-none fixed right-6 top-24 z-50 flex items-center gap-3 rounded-2xl',
        'border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-950 shadow-lg shadow-emerald-900/10',
        'transition-all duration-300',
        visible ? 'translate-y-0 opacity-100 cart-toast-enter' : 'translate-y-2 opacity-0',
      ].join(' ')}
    >
      <span className="material-symbols-outlined text-emerald-600">check_circle</span>
      <div>
        <p className="text-sm font-semibold">Agregado al carrito</p>
        <p className="text-xs text-emerald-800">{message}</p>
      </div>
    </div>
  )
}
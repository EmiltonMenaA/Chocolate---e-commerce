import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

type ProductoAliado = {
  id: number
  title: string
  price: number
  description: string
  image: string
  category: string
}

export default function ProductosAliados() {
  const { t } = useTranslation()
  const [productos, setProductos] = useState<ProductoAliado[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/productos-aliados/')
      .then(r => r.json())
      .then(data => {
        setProductos(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => {
        setError(t('allies.error'))
        setLoading(false)
      })
  }, [t])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-cocoa-500">{t('allies.loading')}</p>
    </div>
  )

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-red-500">{error}</p>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-20 py-12">
      <h1 className="text-3xl font-bold text-cocoa-900 dark:text-white mb-2">
        {t('allies.title')}
      </h1>
      <p className="text-cocoa-500 dark:text-slate-400 mb-8">
        {t('allies.subtitle')}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {productos.map((p) => (
          <div
            key={p.id}
            className="bg-white dark:bg-cocoa-800 rounded-2xl border border-cocoa-100 dark:border-cocoa-700 p-4 flex flex-col gap-2"
          >
            <div className="w-full h-48 flex items-center justify-center bg-cocoa-50 dark:bg-cocoa-700 rounded-xl mb-2 overflow-hidden">
              <img
                src={p.image}
                alt={p.title}
                className="h-full object-contain p-4"
              />
            </div>
            <span className="text-xs text-cafe font-medium uppercase tracking-wide">
              {p.category}
            </span>
            <h2 className="font-semibold text-cocoa-900 dark:text-white text-sm line-clamp-2">
              {p.title}
            </h2>
            <p className="text-cocoa-500 dark:text-slate-400 text-xs line-clamp-3">
              {p.description}
            </p>
            <p className="text-cafe font-bold text-lg mt-auto">
              ${p.price.toFixed(2)}
            </p>
            <a
              href={`https://fakestoreapi.com/products/${p.id}`}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-cafe hover:text-amber-800 transition-colors"
            >
              {t('allies.viewProduct')}
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

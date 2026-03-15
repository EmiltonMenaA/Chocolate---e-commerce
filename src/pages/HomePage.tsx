import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getBackendHealth } from '../services/api'

export default function HomePage() {
  const [backendStatus, setBackendStatus] = useState<'loading' | 'online' | 'offline'>('loading')

  useEffect(() => {
    let active = true

    getBackendHealth()
      .then(() => {
        if (active) {
          setBackendStatus('online')
        }
      })
      .catch(() => {
        if (active) {
          setBackendStatus('offline')
        }
      })

    return () => {
      active = false
    }
  }, [])

  const featuredProducts = [
    {
      id: 1,
      name: "Serum Facial Premium",
      price: "$49.99",
      image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop",
      description: "Serum facial con ingredientes naturales"
    },
    {
      id: 2,
      name: "Crema Hidratante",
      price: "$39.99",
      image: "https://images.unsplash.com/photo-1521391573892-e44906baee46?w=400&h=400&fit=crop",
      description: "Crema hidratante de lujo"
    },
    {
      id: 3,
      name: "Máscara Facial",
      price: "$34.99",
      image: "https://images.unsplash.com/photo-1596462502278-af0220c04a16?w=400&h=400&fit=crop",
      description: "Máscara revitalizante natural"
    },
    {
      id: 4,
      name: "Aceite Corporal",
      price: "$44.99",
      image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop",
      description: "Aceite corporal aromático"
    }
  ]

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="px-6 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <span
              className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold ${
                backendStatus === 'online'
                  ? 'bg-green-100 text-green-700'
                  : backendStatus === 'offline'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              {backendStatus === 'online' && 'Backend Django conectado'}
              {backendStatus === 'offline' && 'Backend Django no disponible'}
              {backendStatus === 'loading' && 'Verificando conexión con Django...'}
            </span>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-cocoa-900 dark:text-white mb-6 leading-tight">
                Belleza Natural, Lujo Puro
              </h1>
              <p className="text-xl text-cocoa-700 dark:text-slate-300 mb-8">
                Descubre nuestra colección de productos de cuidado de la piel premium, formulados con ingredientes naturales de la más alta calidad.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/products"
                  className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-red-600 transition-colors text-center"
                >
                  Explorar Catálogo
                </Link>
                <Link 
                  to="/skin-quiz"
                  className="px-8 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors text-center"
                >
                  Descubrir Mi Tipo de Piel
                </Link>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden">
              <img 
                src="/images/banners/image.png"
                alt="Productos premium"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="px-6 lg:px-20 py-20 bg-cocoa-50 dark:bg-cocoa-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-cocoa-900 dark:text-white mb-4">
            Productos Destacados
          </h2>
          <p className="text-lg text-cocoa-700 dark:text-slate-300 mb-12">
            Nuestros artículos más populares de esta temporada
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="bg-white dark:bg-cocoa-800 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
              >
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg text-cocoa-900 dark:text-white mb-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-cocoa-700 dark:text-slate-300 mb-3">
                    {product.description}
                  </p>
                  <p className="text-xl font-bold text-primary">
                    {product.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              to="/products"
              className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-red-600 transition-colors inline-block"
            >
              Ver Todos los Productos
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-6 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-cocoa-900 dark:text-white text-center mb-12">
            ¿Por qué elegir Chocolat?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-white text-2xl">eco</span>
              </div>
              <h3 className="text-xl font-bold text-cocoa-900 dark:text-white mb-2">
                100% Natural
              </h3>
              <p className="text-cocoa-700 dark:text-slate-300">
                Ingredientes puros y naturales, sin químicos dañinos
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-white text-2xl">verified</span>
              </div>
              <h3 className="text-xl font-bold text-cocoa-900 dark:text-white mb-2">
                Probado Científicamente
              </h3>
              <p className="text-cocoa-700 dark:text-slate-300">
                Formulaciones desarrolladas en laboratorios certificados
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-white text-2xl">recommend</span>
              </div>
              <h3 className="text-xl font-bold text-cocoa-900 dark:text-white mb-2">
                Resultados Garantizados
              </h3>
              <p className="text-cocoa-700 dark:text-slate-300">
                Garantía de satisfacción o devolución del dinero
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

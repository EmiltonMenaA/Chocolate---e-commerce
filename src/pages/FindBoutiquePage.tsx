import { useState } from 'react'

interface Boutique {
  id: number
  name: string
  address: string
  hours: string
  distance: string
  isOpen: boolean
}

interface Review {
  id: number
  author: string
  role: string
  timeAgo: string
  rating: number
  title: string
  content: string
  helpful: number
  image: string
}

export default function FindBoutiquePage() {
  const [searchQuery, setSearchQuery] = useState('')

  const boutiques: Boutique[] = [
    {
      id: 1,
      name: 'Chocolate Soho Flagship',
      address: '321 5th Ave, New York, NY 10027',
      hours: 'Abierto hasta las 8 PM',
      distance: '0.5 km',
      isOpen: true
    },
    {
      id: 2,
      name: 'Madison Avenue Boutique',
      address: '852 Madison Ave, New York, NY 10022',
      hours: 'Cerrado - Abre a las 10 AM',
      distance: '1.2 km',
      isOpen: false
    },
    {
      id: 3,
      name: 'Brooklyn Heights Studio',
      address: '204 Myrtle St, Brooklyn, NY 11201',
      hours: 'Abierto hasta las 7 PM',
      distance: '3.1 km',
      isOpen: true
    }
  ]

  const reviews: Review[] = [
    {
      id: 1,
      author: 'Sarah J.',
      role: 'Experta en Cuidado de la Piel',
      timeAgo: 'Hace dos semanas',
      rating: 5,
      title: 'Cuidado de la piel que cambia vidas',
      content: 'La mascarilla de chocolate oscuro es un cambio de juego para mi rutina del domingo. Mi piel nunca se ha sentido tan hidratada y radiante. ¡Absolutamente amo el aroma!',
      helpful: 142,
      image: '/images/products/review1.jpg'
    },
    {
      id: 2,
      author: 'Elena M.',
      role: 'Entusiasta de la belleza',
      timeAgo: 'Hace una semana',
      rating: 5,
      title: 'Mejor de lo esperado',
      content: 'Al principio estaba indecisa debido a mi piel sensible, pero el limpiador de manteca de cacao es increíblemente suave. La lista de ingredientes es corta y sé qué contiene todo.',
      helpful: 98,
      image: '/images/products/review2.jpg'
    },
    {
      id: 3,
      author: 'Marissa K.',
      role: 'Bloguera de moda',
      timeAgo: 'Hace una semana',
      rating: 5,
      title: 'Producto de calidad premium',
      content: 'La textura de la crema de día es increíble. Se absorbe rápidamente y funciona bien bajo el maquillaje. Además huele como una trufa de chocolate – ¡10/10!',
      helpful: 187,
      image: '/images/products/review3.jpg'
    }
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Search for:', searchQuery)
  }

  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={i < rating ? 'text-pink-500' : 'text-gray-300'}>
            ★
          </span>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-100 to-pink-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl lg:text-5xl font-bold text-cocoa-900 mb-3">
            Encuentra una Boutique
          </h1>
          <p className="text-gray-600 text-lg">
            Visita nuestras tiendas insignia para una consulta personalizada de cuidado de la piel.
          </p>
        </div>
      </div>

      {/* Search and Map Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left Side - Search and Boutiques List */}
          <div>
            {/* Search */}
            <form onSubmit={handleSearch} className="mb-8">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-3 text-gray-400">
                  location_on
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ingresa un código postal o ciudad"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-cafe text-gray-900 placeholder-gray-500"
                />
              </div>
            </form>

            {/* Boutiques List */}
            <div className="space-y-4">
              {boutiques.map((boutique) => (
                <div
                  key={boutique.id}
                  className="border-l-4 border-cafe pl-4 py-4 hover:bg-pink-50 transition-colors cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-cocoa-900">{boutique.name}</h3>
                    <span className="text-pink-500 text-sm font-semibold">{boutique.distance}</span>
                  </div>
                  <p className="text-gray-700 text-sm mb-2">{boutique.address}</p>
                  <p className={`text-sm font-semibold ${boutique.isOpen ? 'text-green-600' : 'text-gray-600'}`}>
                    {boutique.isOpen ? '✓ ' : '✗ '}
                    {boutique.hours}
                  </p>
                  <button className="text-cafe font-semibold text-sm mt-2 hover:text-orange-700 transition-colors">
                    Obtener Direcciones →
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Map */}
          <div className="relative h-96 bg-gradient-to-br from-green-400 to-green-300 rounded-xl overflow-hidden shadow-lg">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-center">
                <span className="material-symbols-outlined text-6xl mb-4">map</span>
                <p className="text-lg font-semibold">Mapa Interactivo</p>
                <p className="text-sm">(Integración de mapa próximamente)</p>
              </div>
            </div>

            {/* Map Markers */}
            <div className="absolute top-1/3 left-1/2 transform -translate-x-full -translate-y-1/2">
              <div className="w-12 h-12 bg-cocoa-900 rounded-full flex items-center justify-center text-white shadow-lg">
                <span className="material-symbols-outlined text-xl">location_on</span>
              </div>
            </div>
            <div className="absolute top-1/4 right-1/4">
              <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center text-white shadow-lg">
                <span className="material-symbols-outlined text-lg">location_on</span>
              </div>
            </div>
            <div className="absolute top-1/2 right-1/3">
              <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center text-white shadow-lg">
                <span className="material-symbols-outlined text-lg">location_on</span>
              </div>
            </div>

            {/* Map Controls */}
            <div className="absolute right-4 bottom-4 space-y-2">
              <button className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-shadow text-gray-700 font-bold text-lg">
                +
              </button>
              <button className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-shadow text-gray-700 font-bold text-lg">
                −
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Experiences Section */}
      <div className="bg-gray-50 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-cocoa-900 mb-2">
                Experiencias de Clientes
              </h2>
              <div className="flex items-center gap-6">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-pink-500 text-2xl">★</span>
                  ))}
                </div>
                <p className="text-gray-700">
                  <span className="font-bold text-cocoa-900">4.8/5.0</span>
                  <span className="text-gray-600"> • 12,000+ Reseñas</span>
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-6 py-2 border-2 border-cocoa-900 text-cocoa-900 rounded-full font-semibold hover:bg-cocoa-900 hover:text-white transition-colors">
                Escribir una Reseña
              </button>
              <button className="px-6 py-2 bg-cocoa-900 text-white rounded-full font-semibold hover:bg-cocoa-800 transition-colors">
                Más Reciente ▼
              </button>
            </div>
          </div>

          {/* Reviews Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={review.image}
                    alt={review.author}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-cocoa-900">{review.author}</h4>
                    <p className="text-xs text-gray-600">{review.role}</p>
                    <p className="text-xs text-gray-500">{review.timeAgo}</p>
                  </div>
                </div>

                <div className="mb-3">
                  <StarRating rating={review.rating} />
                </div>

                <h5 className="font-bold text-cocoa-900 mb-2">{review.title}</h5>
                <p className="text-gray-700 text-sm mb-4 leading-relaxed">{review.content}</p>

                <div className="flex items-center gap-2 text-sm text-gray-600 border-t pt-3">
                  <span className="material-symbols-outlined text-base">thumb_up</span>
                  <span>{review.helpful} personas encontraron esto útil</span>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          <div className="flex justify-center mt-12">
            <button className="px-12 py-3 border-2 border-cocoa-900 text-cocoa-900 rounded-full font-bold hover:bg-cocoa-900 hover:text-white transition-colors">
              Cargar Más Reseñas
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

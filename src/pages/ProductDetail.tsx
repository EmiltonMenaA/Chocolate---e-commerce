import { useParams } from 'react-router-dom'
import { useState } from 'react'

export default function ProductDetail() {
  const { id } = useParams()
  const [quantity, setQuantity] = useState(1)

  // Demo product
  const product = {
    id,
    name: "Serum Facial Premium de Chocolate",
    price: 49.99,
    rating: 4.8,
    reviews: 234,
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&h=800&fit=crop",
    description: "Un serum facial de lujo formulado con extractos de chocolate premium y vitaminas naturales. Proporciona una hidratación profunda y mejora la elasticidad de la piel.",
    ingredients: [
      "Extracto de Chocolate",
      "Vitamina C",
      "Ácido Hialurónico",
      "Aceite de Rosa Mosqueta",
      "Antioxidantes Naturales"
    ],
    benefits: [
      "Hidratación profunda",
      "Mejora la elasticidad",
      "Reduce líneas de expresión",
      "Brinda un resplandor natural"
    ]
  }

  return (
    <div className="px-6 lg:px-20 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="h-96 lg:h-[600px] rounded-xl overflow-hidden bg-cocoa-100">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-4xl font-bold text-cocoa-900 dark:text-white mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined text-yellow-500 text-sm">
                    {i < Math.floor(product.rating) ? 'star' : 'star_outline'}
                  </span>
                ))}
              </div>
              <span className="text-lg font-semibold text-cocoa-900 dark:text-white">
                {product.rating} ({product.reviews} reseñas)
              </span>
            </div>

            {/* Price */}
            <p className="text-4xl font-bold text-primary mb-6">
              ${product.price.toFixed(2)}
            </p>

            {/* Description */}
            <p className="text-lg text-cocoa-700 dark:text-slate-300 mb-8">
              {product.description}
            </p>

            {/* Quantity and Add to Cart */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-3 border border-cocoa-200 dark:border-cocoa-700 rounded-lg p-2">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center hover:bg-cocoa-100 dark:hover:bg-cocoa-700 rounded"
                >
                  −
                </button>
                <span className="w-8 text-center font-semibold">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-cocoa-100 dark:hover:bg-cocoa-700 rounded"
                >
                  +
                </button>
              </div>
              <button className="flex-1 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-red-600 transition-colors">
                Añadir al Carrito
              </button>
            </div>

            <button className="w-full py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors mb-8">
              Guardar para Después
            </button>

            {/* Benefits */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-cocoa-900 dark:text-white mb-4">
                Beneficios
              </h3>
              <ul className="space-y-2">
                {product.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-2 text-cocoa-700 dark:text-slate-300">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            {/* Ingredients */}
            <div>
              <h3 className="text-xl font-bold text-cocoa-900 dark:text-white mb-4">
                Ingredientes
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.ingredients.map((ingredient, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-cocoa-100 dark:bg-cocoa-700 text-cocoa-900 dark:text-white rounded-full text-sm"
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-20 pt-12 border-t border-cocoa-200 dark:border-cocoa-700">
          <h2 className="text-3xl font-bold text-cocoa-900 dark:text-white mb-8">
            Reseñas de Clientes
          </h2>
          <div className="bg-white dark:bg-cocoa-800 rounded-xl p-8 text-center">
            <p className="text-cocoa-700 dark:text-slate-300 text-lg">
              Las reseñas se mostrarán pronto
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

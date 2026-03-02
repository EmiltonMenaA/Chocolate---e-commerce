import { useState } from 'react'

export default function AddProduct() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    stock: '',
    ingredients: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Product added', formData)
    // TODO: Submit product to API
  }

  return (
    <div className="px-6 lg:px-20 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-cocoa-900 dark:text-white mb-8">
          Añadir Nuevo Producto
        </h1>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-cocoa-800 rounded-xl p-8">
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-semibold text-cocoa-900 dark:text-white mb-2">
              Nombre del Producto
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-cocoa-200 dark:border-cocoa-700 rounded-lg focus:outline-none focus:border-primary dark:bg-cocoa-700 dark:text-white"
              placeholder="Nombre del producto"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-semibold text-cocoa-900 dark:text-white mb-2">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-cocoa-200 dark:border-cocoa-700 rounded-lg focus:outline-none focus:border-primary dark:bg-cocoa-700 dark:text-white"
              placeholder="Describe tu producto"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="price" className="block text-sm font-semibold text-cocoa-900 dark:text-white mb-2">
                Precio ($)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                className="w-full px-4 py-2 border border-cocoa-200 dark:border-cocoa-700 rounded-lg focus:outline-none focus:border-primary dark:bg-cocoa-700 dark:text-white"
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label htmlFor="stock" className="block text-sm font-semibold text-cocoa-900 dark:text-white mb-2">
                Stock
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-cocoa-200 dark:border-cocoa-700 rounded-lg focus:outline-none focus:border-primary dark:bg-cocoa-700 dark:text-white"
                placeholder="100"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="category" className="block text-sm font-semibold text-cocoa-900 dark:text-white mb-2">
              Categoría
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-cocoa-200 dark:border-cocoa-700 rounded-lg focus:outline-none focus:border-primary dark:bg-cocoa-700 dark:text-white"
              required
            >
              <option value="">Selecciona una categoría</option>
              <option value="serums">Serums</option>
              <option value="cremas">Cremas</option>
              <option value="mascaras">Máscaras</option>
              <option value="aceites">Aceites</option>
              <option value="limpiadores">Limpiadores</option>
              <option value="tonicos">Tónicos</option>
            </select>
          </div>

          <div className="mb-6">
            <label htmlFor="image" className="block text-sm font-semibold text-cocoa-900 dark:text-white mb-2">
              URL de la Imagen
            </label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-cocoa-200 dark:border-cocoa-700 rounded-lg focus:outline-none focus:border-primary dark:bg-cocoa-700 dark:text-white"
              placeholder="https://ejemplo.com/imagen.jpg"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="ingredients" className="block text-sm font-semibold text-cocoa-900 dark:text-white mb-2">
              Ingredientes (separados por comas)
            </label>
            <textarea
              id="ingredients"
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-cocoa-200 dark:border-cocoa-700 rounded-lg focus:outline-none focus:border-primary dark:bg-cocoa-700 dark:text-white"
              placeholder="Ingrediente 1, Ingrediente 2, Ingrediente 3"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
          >
            Crear Producto
          </button>
        </form>
      </div>
    </div>
  )
}

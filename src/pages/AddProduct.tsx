import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const CATEGORIAS = [
  'Serums', 'Cremas', 'Máscaras', 'Aceites', 'Limpiadores',
  'Tónicos', 'Exfoliantes', 'Contorno de ojos', 'Protector solar', 'Otros',
]

export default function AddProduct() {
  const { accessToken } = useAuth()
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditMode = Boolean(id)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: '',
    marca: '',
    stock: '',
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(isEditMode)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    let ignore = false

    const loadProducto = async () => {
      if (!isEditMode || !id) return
      try {
        const { data } = await axios.get(`/api/productos/${id}/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        if (ignore) return
        setFormData({
          nombre: data.nombre ?? '',
          descripcion: data.descripcion ?? '',
          precio: String(data.precio ?? ''),
          categoria: data.categoria ?? '',
          marca: data.marca ?? '',
          stock: String(data.stock ?? ''),
        })
        if (data.imagen) setImagePreview(data.imagen)
      } catch {
        if (!ignore) setError('No se pudo cargar el producto para editar.')
      } finally {
        if (!ignore) setIsFetching(false)
      }
    }

    loadProducto()
    return () => {
      ignore = true
    }
  }, [accessToken, id, isEditMode])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      const body = new FormData()
      Object.entries(formData).forEach(([k, v]) => body.append(k, v))
      if (imageFile) body.append('imagen', imageFile)
      if (!isEditMode) body.append('activo', 'true')
      if (isEditMode && id) {
        await axios.patch(`/api/productos/${id}/`, body, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data',
          },
        })
      } else {
        await axios.post('/api/productos/', body, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data',
          },
        })
      }
      setSuccess(true)
      setTimeout(() => navigate('/panel/productos'), 1500)
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: Record<string, string[]> } }
      const data = axiosErr?.response?.data
      if (data) {
        const first = Object.values(data).flat()[0]
        setError(typeof first === 'string' ? first : isEditMode ? 'Error al actualizar el producto.' : 'Error al crear el producto.')
      } else {
        setError('Error de conexión. Intenta de nuevo.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-green-600 text-4xl">check_circle</span>
        </div>
        <h2 className="text-2xl font-bold text-cocoa-900 dark:text-white mb-2">
          {isEditMode ? '¡Producto actualizado!' : '¡Producto creado!'}
        </h2>
        <p className="text-cocoa-500">Redirigiendo al panel...</p>
      </div>
    )
  }

  if (isFetching) {
    return (
      <div className="flex items-center justify-center py-20 text-cocoa-500">
        <span className="material-symbols-outlined animate-spin text-2xl mr-2">progress_activity</span>
        Cargando producto...
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-cocoa-900 dark:text-white">
          {isEditMode ? 'Editar Producto' : 'Nuevo Producto'}
        </h1>
        <p className="text-cocoa-500 mt-1">
          {isEditMode
            ? 'Actualiza la información del producto en tu catálogo'
            : 'Completa la información para publicar tu producto en la tienda'}
        </p>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-xl text-red-600 dark:text-red-400 text-sm flex gap-2">
          <span className="material-symbols-outlined text-base flex-shrink-0">error</span>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-cocoa-800 rounded-2xl shadow-sm p-8 space-y-6">
        {/* Image upload */}
        <div>
          <p className="text-sm font-semibold text-cocoa-900 dark:text-white mb-3">
            FOTO DEL PRODUCTO
          </p>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative border-2 border-dashed border-cocoa-300 dark:border-cocoa-600 rounded-xl overflow-hidden cursor-pointer hover:border-cafe transition-colors group"
            style={{ minHeight: '200px' }}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Previsualización"
                className="w-full h-48 object-contain bg-cocoa-50 dark:bg-cocoa-700"
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-cocoa-400 group-hover:text-cafe transition-colors">
                <span className="material-symbols-outlined text-5xl mb-2">add_photo_alternate</span>
                <p className="font-semibold">Haz clic para subir una imagen</p>
                <p className="text-xs mt-1">JPG, PNG, WEBP — Máx. 5 MB</p>
              </div>
            )}
            {imagePreview && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-3xl">edit</span>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* Nombre */}
        <div>
          <label htmlFor="nombre" className="block text-sm font-semibold text-cocoa-900 dark:text-white mb-2">
            NOMBRE DEL PRODUCTO *
          </label>
          <input
            type="text" id="nombre" name="nombre"
            value={formData.nombre} onChange={handleChange}
            className="w-full px-4 py-3 border border-cocoa-200 dark:border-cocoa-600 rounded-xl focus:outline-none focus:border-cafe dark:bg-cocoa-700 dark:text-white placeholder-cocoa-400"
            placeholder="Ej: Sérum Vitamina C Premium"
            required
          />
        </div>

        {/* Descripción */}
        <div>
          <label htmlFor="descripcion" className="block text-sm font-semibold text-cocoa-900 dark:text-white mb-2">
            DESCRIPCIÓN *
          </label>
          <textarea
            id="descripcion" name="descripcion"
            value={formData.descripcion} onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 border border-cocoa-200 dark:border-cocoa-600 rounded-xl focus:outline-none focus:border-cafe dark:bg-cocoa-700 dark:text-white placeholder-cocoa-400 resize-none"
            placeholder="Describe los beneficios y características del producto..."
            required
          />
        </div>

        {/* Precio, Stock, Marca */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="precio" className="block text-sm font-semibold text-cocoa-900 dark:text-white mb-2">PRECIO ($) *</label>
            <input
              type="number" id="precio" name="precio"
              value={formData.precio} onChange={handleChange}
              step="0.01" min="0"
              className="w-full px-4 py-3 border border-cocoa-200 dark:border-cocoa-600 rounded-xl focus:outline-none focus:border-cafe dark:bg-cocoa-700 dark:text-white placeholder-cocoa-400"
              placeholder="0.00" required
            />
          </div>
          <div>
            <label htmlFor="stock" className="block text-sm font-semibold text-cocoa-900 dark:text-white mb-2">STOCK *</label>
            <input
              type="number" id="stock" name="stock"
              value={formData.stock} onChange={handleChange}
              min="0"
              className="w-full px-4 py-3 border border-cocoa-200 dark:border-cocoa-600 rounded-xl focus:outline-none focus:border-cafe dark:bg-cocoa-700 dark:text-white placeholder-cocoa-400"
              placeholder="100" required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="marca" className="block text-sm font-semibold text-cocoa-900 dark:text-white mb-2">MARCA *</label>
            <input
              type="text" id="marca" name="marca"
              value={formData.marca} onChange={handleChange}
              className="w-full px-4 py-3 border border-cocoa-200 dark:border-cocoa-600 rounded-xl focus:outline-none focus:border-cafe dark:bg-cocoa-700 dark:text-white placeholder-cocoa-400"
              placeholder="Ej: Chocolat" required
            />
          </div>
          <div>
            <label htmlFor="categoria" className="block text-sm font-semibold text-cocoa-900 dark:text-white mb-2">CATEGORÍA</label>
            <select
              id="categoria" name="categoria"
              value={formData.categoria} onChange={handleChange}
              className="w-full px-4 py-3 border border-cocoa-200 dark:border-cocoa-600 rounded-xl focus:outline-none focus:border-cafe dark:bg-cocoa-700 dark:text-white"
            >
              <option value="">Sin categoría</option>
              {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-2">
          <button
            type="button"
            onClick={() => navigate('/panel/dashboard')}
            className="flex-1 py-3 bg-cocoa-100 dark:bg-cocoa-700 text-cocoa-700 dark:text-white rounded-xl font-semibold hover:bg-cocoa-200 dark:hover:bg-cocoa-600 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 py-3 bg-cafe text-white rounded-xl font-semibold hover:bg-amber-800 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                {isEditMode ? 'Guardando...' : 'Publicando...'}
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-lg">publish</span>
                {isEditMode ? 'Guardar cambios' : 'Publicar producto'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

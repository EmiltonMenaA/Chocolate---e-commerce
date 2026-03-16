import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

type Producto = {
  id: string
  nombre: string
  precio: string
  stock: number
  activo: boolean
  imagen: string | null
  categoria: string
}

export default function VendorDashboard() {
  const { accessToken, user } = useAuth()
  const [productos, setProductos] = useState<Producto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchProductos = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/panel/productos/', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      setProductos(data)
    } catch {
      setError('No se pudieron cargar los productos.')
    } finally {
      setIsLoading(false)
    }
  }, [accessToken])

  useEffect(() => {
    if (accessToken) fetchProductos()
  }, [accessToken, fetchProductos])

  const handleToggleActivo = async (producto: Producto) => {
    try {
      const form = new FormData()
      form.append('activo', (!producto.activo).toString())
      await axios.patch(`/api/productos/${producto.id}/`, form, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      setProductos(prev =>
        prev.map(p => (p.id === producto.id ? { ...p, activo: !p.activo } : p))
      )
    } catch {
      alert('No se pudo actualizar el estado del producto.')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Esta siguro de eliminar este producto?')) return
    setDeletingId(id)
    try {
      await axios.delete(`/api/productos/${id}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      setProductos(prev => prev.filter(p => p.id !== id))
    } catch {
      alert('No se pudo eliminar el producto.')
    } finally {
      setDeletingId(null)
    }
  }

  const totalProductos = productos.length
  const productosActivos = productos.filter(p => p.activo).length
  const totalStock = productos.reduce((sum, p) => sum + p.stock, 0)

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-cocoa-900 dark:text-white">
            {user?.nombre_tienda || user?.nombre}
          </h1>
          <p className="text-cocoa-500 dark:text-cocoa-400 mt-1">Resumen de tu tienda</p>
        </div>
        <Link
          to="/panel/productos/nuevo"
          className="inline-flex items-center gap-2 px-6 py-3 bg-cafe text-white rounded-xl font-semibold hover:bg-amber-800 transition-colors"
        >
          <span className="material-symbols-outlined">add</span>
          Agregar Producto
        </Link>
      </div>

      <div className="grid sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-cocoa-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-blue-600 text-2xl">inventory_2</span>
            </div>
            <div>
              <p className="text-3xl font-bold text-cocoa-900 dark:text-white">{totalProductos}</p>
              <p className="text-sm text-cocoa-500">Productos totales</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-cocoa-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-green-600 text-2xl">check_circle</span>
            </div>
            <div>
              <p className="text-3xl font-bold text-cocoa-900 dark:text-white">{productosActivos}</p>
              <p className="text-sm text-cocoa-500">Productos activos</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-cocoa-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-amber-600 text-2xl">warehouse</span>
            </div>
            <div>
              <p className="text-3xl font-bold text-cocoa-900 dark:text-white">{totalStock}</p>
              <p className="text-sm text-cocoa-500">Unidades en stock</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-cocoa-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-cocoa-100 dark:border-cocoa-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-cocoa-900 dark:text-white">Mis Productos</h2>
          <Link to="/panel/productos/nuevo" className="text-sm text-cafe hover:text-amber-600 font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-base">add</span>
            Nuevo
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-cocoa-400">
            <span className="material-symbols-outlined animate-spin text-3xl mr-2">progress_activity</span>
            Cargando...
          </div>
        ) : error ? (
          <div className="p-6 text-red-500">{error}</div>
        ) : productos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-cocoa-400">
            <span className="material-symbols-outlined text-5xl mb-3">inventory_2</span>
            <p className="font-semibold text-lg">Sin productos aun</p>
            <Link to="/panel/productos/nuevo" className="mt-4 px-6 py-2 bg-cafe text-white rounded-xl text-sm font-semibold hover:bg-amber-800 transition-colors">
              Agregar producto
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-cocoa-50 dark:bg-cocoa-700/50 text-left text-xs font-bold uppercase tracking-wider text-cocoa-500">
                  <th className="px-6 py-4">Producto</th>
                  <th className="px-6 py-4">Precio</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cocoa-100 dark:divide-cocoa-700">
                {productos.map(producto => (
                  <tr key={producto.id} className="hover:bg-cocoa-50 dark:hover:bg-cocoa-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {producto.imagen ? (
                          <img src={producto.imagen} alt={producto.nombre} className="w-10 h-10 rounded-lg object-cover bg-cocoa-100" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-cocoa-100 dark:bg-cocoa-700 flex items-center justify-center">
                            <span className="material-symbols-outlined text-cocoa-400 text-base">image</span>
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-cocoa-900 dark:text-white text-sm">{producto.nombre}</p>
                          {producto.categoria && <p className="text-xs text-cocoa-400">{producto.categoria}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-cocoa-900 dark:text-white">
                      ${Number(producto.precio).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={producto.stock < 5 ? 'text-red-500 font-semibold' : 'text-cocoa-700 dark:text-slate-300'}>
                        {producto.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleActivo(producto)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${producto.activo ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-cocoa-100 text-cocoa-500 hover:bg-cocoa-200'}`}
                      >
                        <span className="material-symbols-outlined text-xs">{producto.activo ? 'check_circle' : 'cancel'}</span>
                        {producto.activo ? 'Activo' : 'Pausado'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Link to={`/panel/productos/${producto.id}/editar`} className="text-cafe hover:text-amber-600 text-sm font-semibold flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">edit</span>Editar
                        </Link>
                        <button
                          onClick={() => handleDelete(producto.id)}
                          disabled={deletingId === producto.id}
                          className="text-red-500 hover:text-red-700 text-sm font-semibold flex items-center gap-1 disabled:opacity-50"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                          {deletingId === producto.id ? 'Eliminando...' : 'Eliminar'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

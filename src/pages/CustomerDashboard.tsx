import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { getPedidoDetallado, type PedidoDetallado } from '../services/api'
import { useAuth } from '../context/AuthContext'

type Pedido = {
  id: string
  fecha: string
  estado: string
  total: string
  items_count: number
}

export default function CustomerDashboard() {
  const { accessToken, user } = useAuth()
  const [orders, setOrders] = useState<Pedido[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<PedidoDetallado | null>(null)
  const [loadingDetalle, setLoadingDetalle] = useState(false)

  useEffect(() => {
    let active = true
    const loadOrders = async () => {
      if (!accessToken) return
      setIsLoading(true)
      try {
        const { data } = await axios.get<Pedido[]>('/api/pedidos/mis/', {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        if (active) setOrders(data)
      } catch {
        if (active) setError('No se pudieron cargar tus pedidos.')
      } finally {
        if (active) setIsLoading(false)
      }
    }
    loadOrders()
    return () => {
      active = false
    }
  }, [accessToken])

  const stats = useMemo(() => {
    const totalOrders = orders.length
    const delivered = orders.filter(order => order.estado === 'entregado').length
    const totalSpent = orders.reduce((sum, order) => sum + Number(order.total), 0)
    return { totalOrders, delivered, totalSpent }
  }, [orders])

  const estadoLabel = (estado: string) => {
    const labels: Record<string, string> = {
      pendiente: 'Pendiente',
      confirmado: 'Confirmado',
      enviado: 'Enviado',
      entregado: 'Entregado',
      cancelado: 'Cancelado',
    }
    return labels[estado] || estado
  }
  const handleVerDetalle = async (pedidoId: string) => {
    if (!accessToken) return
    setLoadingDetalle(true)
    try {
      const detalle = await getPedidoDetallado(pedidoId, accessToken)
      setPedidoSeleccionado(detalle)
    } catch {
      // silencioso
    } finally {
      setLoadingDetalle(false)
    }
  }
  return (
    <div className="px-6 lg:px-20 py-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-cocoa-900 dark:text-white mb-8">
          Mi Cuenta
        </h1>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Welcome Card */}
          <div className="md:col-span-3 bg-white dark:bg-cocoa-800 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-cocoa-900 dark:text-white mb-2">
              ¡Bienvenida, {user?.nombre || 'Cliente'}!
            </h2>
            <p className="text-cocoa-700 dark:text-slate-300">
              Aquí puedes ver tu perfil, órdenes anteriores y preferencias
            </p>
          </div>

          {/* Stats */}
          <div className="bg-white dark:bg-cocoa-800 rounded-xl p-6 text-center">
            <span className="material-symbols-outlined text-4xl text-primary mb-2 block">
              shopping_bag
            </span>
            <p className="text-3xl font-bold text-cocoa-900 dark:text-white">{stats.totalOrders}</p>
            <p className="text-cocoa-700 dark:text-slate-300">Órdenes Total</p>
          </div>

          <div className="bg-white dark:bg-cocoa-800 rounded-xl p-6 text-center">
            <span className="material-symbols-outlined text-4xl text-green-500 mb-2 block">
              payments
            </span>
            <p className="text-3xl font-bold text-cocoa-900 dark:text-white">${stats.totalSpent.toFixed(2)}</p>
            <p className="text-cocoa-700 dark:text-slate-300">Total Gastado</p>
          </div>

          <div className="bg-white dark:bg-cocoa-800 rounded-xl p-6 text-center">
            <span className="material-symbols-outlined text-4xl text-blue-500 mb-2 block">
              local_shipping
            </span>
            <p className="text-3xl font-bold text-cocoa-900 dark:text-white">{stats.delivered}</p>
            <p className="text-cocoa-700 dark:text-slate-300">Pedidos Entregados</p>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white dark:bg-cocoa-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-cocoa-200 dark:border-cocoa-700">
            <h3 className="text-2xl font-bold text-cocoa-900 dark:text-white">
              Órdenes Recientes
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cocoa-200 dark:border-cocoa-700 bg-cocoa-50 dark:bg-cocoa-700">
                  <th className="px-6 py-3 text-left font-semibold text-cocoa-900 dark:text-white">
                    ID de Orden
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-cocoa-900 dark:text-white">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-cocoa-900 dark:text-white">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-cocoa-900 dark:text-white">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-cocoa-900 dark:text-white">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-cocoa-900 dark:text-white">
                    Detalle
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr>
                    <td className="px-6 py-6 text-center text-cocoa-500" colSpan={5}>
                      Cargando pedidos...
                    </td>
                  </tr>
                )}

                {!isLoading && error && (
                  <tr>
                    <td className="px-6 py-6 text-center text-red-500" colSpan={5}>
                      {error}
                    </td>
                  </tr>
                )}

                {!isLoading && !error && orders.length === 0 && (
                  <tr>
                    <td className="px-6 py-6 text-center text-cocoa-500" colSpan={5}>
                      Aún no tienes pedidos registrados.
                    </td>
                  </tr>
                )}

                {!isLoading && !error && orders.map(order => (
                  <tr key={order.id} className="border-b border-cocoa-200 dark:border-cocoa-700 hover:bg-cocoa-50 dark:hover:bg-cocoa-700">
                    <td className="px-6 py-4 font-semibold text-cocoa-900 dark:text-white">
                      #{order.id.slice(0, 8)}
                    </td>
                    <td className="px-6 py-4 text-cocoa-700 dark:text-slate-300">
                      {new Date(order.fecha).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-cocoa-700 dark:text-slate-300">
                      {order.items_count}
                    </td>
                    <td className="px-6 py-4 font-bold text-primary">
                      ${Number(order.total).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        order.estado === 'entregado'
                          ? "bg-green-100 text-green-700"
                          : order.estado === 'cancelado'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-blue-100 text-blue-700'
                      }`}>
                        {estadoLabel(order.estado)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleVerDetalle(order.id)}
                        className="text-primary hover:underline text-sm font-semibold"
                      >
                        {loadingDetalle ? '...' : 'Ver detalle'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      {pedidoSeleccionado && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-cocoa-800 rounded-xl p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-cocoa-900 dark:text-white">
                  Detalle del Pedido
                </h3>
                <button
                  onClick={() => setPedidoSeleccionado(null)}
                  className="text-cocoa-500 hover:text-cocoa-900 dark:hover:text-white text-2xl"
                >
                  ✕
                </button>
              </div>
              <p className="text-sm text-cocoa-500 mb-4">
                #{pedidoSeleccionado.id.slice(0, 8)} — {new Date(pedidoSeleccionado.fecha).toLocaleDateString()}
              </p>
              <div className="space-y-4">
                {pedidoSeleccionado.detalles.map(item => (
                  <div key={item.producto_id} className="flex items-center gap-4 border-b border-cocoa-100 pb-4">
                    {item.producto_imagen && (
                      <img
                        src={item.producto_imagen}
                        alt={item.producto_nombre}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-cocoa-900 dark:text-white">{item.producto_nombre}</p>
                      <p className="text-sm text-cocoa-500">{item.cantidad} x ${Number(item.precio_unitario).toFixed(2)}</p>
                    </div>
                    <p className="font-bold text-primary">${Number(item.subtotal).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-between items-center">
                <span className="font-bold text-cocoa-900 dark:text-white">Total</span>
                <span className="text-xl font-bold text-primary">${Number(pedidoSeleccionado.total).toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

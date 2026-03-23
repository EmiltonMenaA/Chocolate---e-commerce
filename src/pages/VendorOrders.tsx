import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

type VendorOrder = {
  id: string
  fecha: string
  estado: string
  total: string
  items_count: number
  cliente_nombre: string
  cliente_email: string
  envio: {
    estado: string
    direccion_entrega: string
  } | null
}

type ShippingState = 'pendiente' | 'preparando' | 'enviado' | 'entregado' | 'cancelado'

export default function VendorOrders() {
  const { accessToken } = useAuth()
  const [orders, setOrders] = useState<VendorOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [savingId, setSavingId] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  const loadOrders = useCallback(async () => {
    if (!accessToken) return
    setIsLoading(true)
    setError('')
    try {
      const { data } = await axios.get<VendorOrder[]>('/api/panel/pedidos/', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      setOrders(data)
    } catch {
      setError('No se pudieron cargar los pedidos.')
    } finally {
      setIsLoading(false)
    }
  }, [accessToken])

  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  const estadoLabel = (estado: string) => {
    const labels: Record<string, string> = {
      pendiente: 'Pendiente',
      preparando: 'Preparando',
      enviado: 'En camino',
      entregado: 'Entregado',
      cancelado: 'Cancelado',
    }
    return labels[estado] || estado
  }

  const updateOrderField = (id: string, field: 'estado', value: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id !== id || !order.envio) return order
      return {
        ...order,
        envio: {
          ...order.envio,
          [field]: value,
        },
      }
    }))
  }

  const applyEnvioToOrder = (orderId: string, envio: VendorOrder['envio']) => {
    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order
      return { ...order, envio }
    }))
  }

  const quickUpdateStatus = async (orderId: string, estado: ShippingState) => {
    if (!accessToken) return
    setSavingId(orderId)
    setMessage('')
    try {
      const { data } = await axios.patch(
        `/api/panel/pedidos/${orderId}/envio/`,
        { estado },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      )

      applyEnvioToOrder(orderId, data.envio)
      setMessage('Estado de envio actualizado.')
    } catch {
      setMessage('No se pudo actualizar el estado de envio.')
      await loadOrders()
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-cocoa-900 dark:text-white">Gestion de pedidos</h1>
        <p className="text-cocoa-500 dark:text-cocoa-400 mt-1">
          Cambia el estado de envio para que tu cliente vea si va en camino o ya fue entregado.
        </p>
        {message && <p className="mt-2 text-sm text-cocoa-600 dark:text-cocoa-300">{message}</p>}
      </div>

      <div className="bg-white dark:bg-cocoa-800 rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-cocoa-500">Cargando pedidos...</div>
        ) : error ? (
          <div className="p-8 text-red-500">{error}</div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-cocoa-500">No hay pedidos registrados para tu tienda.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-cocoa-50 dark:bg-cocoa-700/50 text-left text-xs font-bold uppercase tracking-wider text-cocoa-500">
                  <th className="px-6 py-4">Pedido</th>
                  <th className="px-6 py-4">Cliente</th>
                  <th className="px-6 py-4">Fecha</th>
                  <th className="px-6 py-4">Direccion</th>
                  <th className="px-6 py-4">Estado envio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cocoa-100 dark:divide-cocoa-700">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-cocoa-50 dark:hover:bg-cocoa-700/30 transition-colors align-top">
                    <td className="px-6 py-4 text-sm">
                      <p className="font-semibold text-cocoa-900 dark:text-white">#{order.id.slice(0, 8)}</p>
                      <p className="text-cocoa-500">{order.items_count} item(s) · ${Number(order.total).toFixed(2)}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-cocoa-700 dark:text-slate-300">
                      <p>{order.cliente_nombre}</p>
                      <p className="text-cocoa-500">{order.cliente_email}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-cocoa-700 dark:text-slate-300">
                      {new Date(order.fecha).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-cocoa-700 dark:text-slate-300 max-w-xs">
                      {order.envio?.direccion_entrega || 'Sin direccion'}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.envio?.estado || 'pendiente'}
                        onChange={async (e) => {
                          const nextStatus = e.target.value as ShippingState
                          updateOrderField(order.id, 'estado', nextStatus)
                          await quickUpdateStatus(order.id, nextStatus)
                        }}
                        disabled={savingId === order.id}
                        className="rounded-lg border border-cocoa-200 bg-white px-3 py-2 text-sm dark:border-cocoa-600 dark:bg-cocoa-900 dark:text-white"
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="preparando">Preparando</option>
                        <option value="enviado">En camino</option>
                        <option value="entregado">Entregado</option>
                        <option value="cancelado">Cancelado</option>
                      </select>
                      <p className="mt-2 text-xs text-cocoa-500">
                        Cliente ve: {order.envio ? estadoLabel(order.envio.estado) : 'Sin envio'}
                      </p>
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

import { useCallback, useEffect, useMemo, useState } from 'react'
import axios from 'axios'

import { useAuth } from '../context/AuthContext'

type Pedido = {
  id: string
  fecha: string
  estado: string
  total: string
  items_count: number
  factura_pdf_url: string | null
  envio: {
    estado: string
    direccion_entrega: string
    fecha_entrega: string | null
  } | null
}

export default function CustomerDashboard() {
  const { accessToken, user, updateUser } = useAuth()
  const [orders, setOrders] = useState<Pedido[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [profileMessage, setProfileMessage] = useState('')
  const [profileForm, setProfileForm] = useState({
    nombre: '',
    telefono: '',
    direccion: '',
  })

  useEffect(() => {
    setProfileForm({
      nombre: user?.nombre || '',
      telefono: user?.telefono || '',
      direccion: user?.direccion || '',
    })
  }, [user])

  const loadOrders = useCallback(async (showLoader = true) => {
    if (!accessToken) return
    if (showLoader) setIsLoading(true)
    try {
      const { data } = await axios.get<Pedido[]>('/api/pedidos/mis/', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      setOrders(data)
      setError('')
    } catch {
      setError('No se pudieron cargar tus pedidos.')
    } finally {
      if (showLoader) setIsLoading(false)
    }
  }, [accessToken])

  useEffect(() => {
    loadOrders(true)

    const intervalId = window.setInterval(() => {
      loadOrders(false)
    }, 10000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [loadOrders])

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

  const estadoEnvioLabel = (estado: string) => {
    const labels: Record<string, string> = {
      pendiente: 'Pendiente',
      preparando: 'Preparando',
      enviado: 'Enviado',
      entregado: 'Entregado',
      cancelado: 'Cancelado',
    }
    return labels[estado] || estado
  }

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!accessToken || !user) return

    setIsSavingProfile(true)
    setProfileMessage('')
    try {
      const { data } = await axios.patch(
        '/api/auth/me/',
        {
          nombre: profileForm.nombre,
          telefono: profileForm.telefono,
          direccion: profileForm.direccion,
        },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      )

      updateUser({
        ...user,
        nombre: data.nombre,
        telefono: data.telefono,
        direccion: data.direccion,
      })
      setProfileMessage('Perfil actualizado correctamente.')
    } catch {
      setProfileMessage('No se pudo actualizar el perfil. Intenta de nuevo.')
    } finally {
      setIsSavingProfile(false)
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

          {/* Profile */}
          <div className="md:col-span-3 bg-white dark:bg-cocoa-800 rounded-xl p-6">
            <h3 className="text-xl font-bold text-cocoa-900 dark:text-white mb-4">Perfil</h3>
            <form onSubmit={handleSaveProfile} className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="block text-cocoa-500 dark:text-slate-400 mb-1">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={profileForm.nombre}
                  onChange={handleProfileChange}
                  className="w-full rounded-lg border border-cocoa-200 bg-white px-3 py-2 text-cocoa-900 focus:outline-none focus:border-primary dark:border-cocoa-700 dark:bg-cocoa-900 dark:text-white"
                />
              </div>
              <div>
                <p className="text-cocoa-500 dark:text-slate-400 mb-1">Correo</p>
                <p className="font-semibold text-cocoa-900 dark:text-white">{user?.email || 'Sin dato'}</p>
              </div>
              <div>
                <label className="block text-cocoa-500 dark:text-slate-400 mb-1">Telefono</label>
                <input
                  type="text"
                  name="telefono"
                  value={profileForm.telefono}
                  onChange={handleProfileChange}
                  className="w-full rounded-lg border border-cocoa-200 bg-white px-3 py-2 text-cocoa-900 focus:outline-none focus:border-primary dark:border-cocoa-700 dark:bg-cocoa-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-cocoa-500 dark:text-slate-400 mb-1">Direccion</label>
                <input
                  type="text"
                  name="direccion"
                  value={profileForm.direccion}
                  onChange={handleProfileChange}
                  className="w-full rounded-lg border border-cocoa-200 bg-white px-3 py-2 text-cocoa-900 focus:outline-none focus:border-primary dark:border-cocoa-700 dark:bg-cocoa-900 dark:text-white"
                />
              </div>
              <div className="md:col-span-2 flex items-center gap-3 mt-2">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="rounded-lg bg-primary px-5 py-2 font-semibold text-white transition-colors hover:bg-red-600 disabled:opacity-60"
                >
                  {isSavingProfile ? 'Guardando...' : 'Guardar cambios'}
                </button>
                {profileMessage && (
                  <span className="text-sm text-cocoa-600 dark:text-slate-300">{profileMessage}</span>
                )}
              </div>
            </form>
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
          <div className="p-6 border-b border-cocoa-200 dark:border-cocoa-700 flex items-center justify-between gap-4">
            <h3 className="text-2xl font-bold text-cocoa-900 dark:text-white">
              Órdenes Recientes
            </h3>
            <button
              type="button"
              onClick={() => loadOrders(true)}
              className="rounded-lg border border-cocoa-300 px-4 py-2 text-sm font-semibold text-cocoa-700 hover:bg-cocoa-100 dark:border-cocoa-600 dark:text-cocoa-200 dark:hover:bg-cocoa-700"
            >
              Actualizar
            </button>
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
                    Envio
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-cocoa-900 dark:text-white">
                    Direccion
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-cocoa-900 dark:text-white">
                    Factura
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr>
                    <td className="px-6 py-6 text-center text-cocoa-500" colSpan={8}>
                      Cargando pedidos...
                    </td>
                  </tr>
                )}

                {!isLoading && error && (
                  <tr>
                    <td className="px-6 py-6 text-center text-red-500" colSpan={8}>
                      {error}
                    </td>
                  </tr>
                )}

                {!isLoading && !error && orders.length === 0 && (
                  <tr>
                    <td className="px-6 py-6 text-center text-cocoa-500" colSpan={8}>
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
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        order.envio?.estado === 'entregado'
                          ? 'bg-green-100 text-green-700'
                          : order.envio?.estado === 'cancelado'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-700'
                      }`}>
                        {order.envio ? estadoEnvioLabel(order.envio.estado) : 'Sin envio'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-cocoa-700 dark:text-slate-300 max-w-xs truncate" title={order.envio?.direccion_entrega || ''}>
                      {order.envio?.direccion_entrega || 'Sin direccion'}
                    </td>
                    <td className="px-6 py-4">
                      {order.factura_pdf_url ? (
                        <a
                          href={order.factura_pdf_url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-semibold text-primary hover:underline"
                        >
                          Ver PDF
                        </a>
                      ) : (
                        <span className="text-cocoa-500">No disponible</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

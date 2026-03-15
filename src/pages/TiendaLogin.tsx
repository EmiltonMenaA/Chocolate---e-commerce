import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function TiendaLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      const user = await login(email, password)
      if (user.rol !== 'tienda' && user.rol !== 'admin') {
        setError('Esta cuenta no tiene acceso al panel de vendedor. ¿Eres cliente? Usa el login de clientes.')
        return
      }
      navigate('/panel/dashboard', { replace: true })
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: string } } }
      setError(
        axiosErr?.response?.data?.detail ||
        'Correo o contraseña incorrectos. Intenta de nuevo.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cocoa-950 flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-cocoa-800 to-cocoa-900 p-12 flex-col justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cafe rounded-xl flex items-center justify-center font-bold text-xl text-white">
            C
          </div>
          <span className="text-2xl font-bold text-white">Chocolat</span>
        </div>

        <div>
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            Gestiona tu tienda
            <br />
            <span className="text-cafe">de belleza</span>
          </h2>
          <p className="text-cocoa-300 text-lg mb-8">
            Administra tus productos, revisa tus ventas y mantén tu catálogo actualizado desde un solo lugar.
          </p>
          <div className="space-y-4">
            {[
              { icon: 'inventory_2', text: 'Gestión completa de productos con fotos' },
              { icon: 'trending_up', text: 'Métricas de ventas en tiempo real' },
              { icon: 'receipt_long', text: 'Historial de pedidos detallado' },
            ].map(({ icon, text }) => (
              <div key={icon} className="flex items-center gap-3 text-cocoa-300">
                <span className="material-symbols-outlined text-cafe">{icon}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-cocoa-500 text-sm">
          © {new Date().getFullYear()} Chocolat · Panel de Vendedores
        </p>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-cafe rounded-xl flex items-center justify-center font-bold text-xl text-white">
              C
            </div>
            <span className="text-2xl font-bold text-white">Chocolat</span>
          </div>

          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cafe/20 text-cafe rounded-full text-xs font-semibold mb-4">
              <span className="material-symbols-outlined text-sm">store</span>
              Portal de Vendedores
            </div>
            <h1 className="text-3xl font-bold text-white">Acceso a tu tienda</h1>
            <p className="text-cocoa-400 mt-2">Ingresa con las credenciales de tu cuenta de vendedor</p>
          </div>

          {error && (
            <div className="mb-6 px-4 py-3 bg-red-600/20 border border-red-500/50 rounded-xl text-red-400 text-sm flex gap-2 items-start">
              <span className="material-symbols-outlined text-base flex-shrink-0 mt-0.5">error</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-cocoa-200 mb-2">
                CORREO ELECTRÓNICO
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-cocoa-800 border border-cocoa-700 rounded-xl focus:outline-none focus:border-cafe text-white placeholder-cocoa-500 transition-colors"
                placeholder="tu@tienda.com"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-cocoa-200 mb-2">
                CONTRASEÑA
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-cocoa-800 border border-cocoa-700 rounded-xl focus:outline-none focus:border-cafe text-white placeholder-cocoa-500 transition-colors"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-cafe text-white rounded-xl font-bold hover:bg-amber-800 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                  Accediendo...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">login</span>
                  Entrar al panel
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-cocoa-800 space-y-3 text-sm text-center">
            <p className="text-cocoa-400">
              ¿No tienes cuenta de vendedor?{' '}
              <Link to="/panel/register" className="text-cafe hover:text-amber-400 font-semibold">
                Registra tu tienda
              </Link>
            </p>
            <p className="text-cocoa-500">
              ¿Eres cliente?{' '}
              <Link to="/login" className="text-cocoa-400 hover:text-white">
                Ingresa aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

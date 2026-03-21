import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      const user = await login(email, password)
      if (user.rol === 'tienda' || user.rol === 'admin') {
        navigate('/panel/dashboard', { replace: true })
      } else {
        navigate(from, { replace: true })
      }
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
    <div className="min-h-[calc(100vh-80px)] grid lg:grid-cols-2">
      {/* Left Side - Content */}
      <div className="bg-gradient-to-br from-teal-400 to-teal-600 p-8 lg:p-12 flex flex-col justify-center text-white hidden lg:flex">
        <div>
          <div className="mb-8">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center font-bold text-xl mb-4">
              C
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
              The Essence of <span className="text-red-300">Chocolate</span>
            </h2>
          </div>
          <p className="text-lg text-white/80">
            Indulge in our curated collection of luxury skincare. Designed to unveil your natural radiance.
          </p>
        </div>
        <div className="mt-12">
          <img
            src="/images/banners/image.png"
            alt="Luxury Beauty"
            className="w-full h-auto rounded-xl object-cover"
          />
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="bg-cocoa-900 dark:bg-cocoa-900 p-8 lg:p-12 flex flex-col justify-center">
        <div className="max-w-md">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
            Bienvenido de nuevo
          </h1>
          <p className="text-cafe mb-2">
            Inicia sesión en tu cuenta de cliente
          </p>
          <p className="text-cocoa-400 text-sm mb-8">
            ¿Eres vendedor?{' '}
            <Link to="/panel/login" className="text-cafe hover:text-orange-400 font-semibold">
              Accede al panel de tienda
            </Link>
          </p>

          {error && (
            <div className="mb-6 px-4 py-3 bg-red-600/20 border border-red-500 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
                CORREO ELECTRÓNICO
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-cocoa-800 border border-cocoa-700 rounded-lg focus:outline-none focus:border-cafe text-white placeholder-cocoa-500"
                placeholder="tu@correo.com"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-sm font-semibold text-white">
                  CONTRASEÑA
                </label>
                <a href="#" className="text-cafe text-sm hover:text-orange-400 font-semibold">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-cocoa-800 border border-cocoa-700 rounded-lg focus:outline-none focus:border-cafe text-white placeholder-cocoa-500"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar sesión'
              )}
            </button>

            <div className="text-center text-cocoa-400">
              <p>
                ¿Nuevo en Chocolate?{' '}
                <Link to="/register" className="text-cafe hover:text-orange-400 font-semibold">
                  Crear cuenta
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

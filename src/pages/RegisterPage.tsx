import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password2: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (formData.password !== formData.password2) {
      setError('Las contraseñas no coinciden.')
      return
    }
    setIsLoading(true)
    try {
      await axios.post('/api/auth/registro/cliente/', formData)
      await login(formData.email, formData.password)
      navigate('/dashboard', { replace: true })
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: Record<string, string[]> } }
      const data = axiosErr?.response?.data
      if (data) {
        const first = Object.values(data).flat()[0]
        setError(typeof first === 'string' ? first : 'Error al crear la cuenta.')
      } else {
        setError('Error de conexión. Intenta de nuevo.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] grid lg:grid-cols-2">
      {/* Left Side - Promotional */}
      <div className="bg-gradient-to-br from-pink-200 to-pink-300 p-8 lg:p-12 flex flex-col justify-between hidden lg:flex">
        <div>
          <h2 className="text-4xl lg:text-5xl font-bold text-cocoa-900 leading-tight mb-4">
            Únete al mundo de <span className="text-cafe">Chocolat</span>
          </h2>
          <p className="text-lg text-cocoa-700 mb-8">
            Experimenta skincare y rituales de belleza premium a tu medida.
          </p>
        </div>
        <div className="space-y-6">
          {[
            { icon: '♡', title: 'Recompensas de lealtad exclusivas' },
            { icon: '✨', title: 'Rutinas de belleza personalizadas' },
            { icon: '↦', title: 'Envío prioritario en tus pedidos' },
          ].map(({ icon, title }) => (
            <div key={icon} className="flex items-start gap-4">
              <div className="w-12 h-12 bg-cafe rounded-full flex items-center justify-center text-white text-2xl flex-shrink-0">
                {icon}
              </div>
              <div>
                <h3 className="font-bold text-cocoa-900 text-lg">{title}</h3>
              </div>
            </div>
          ))}
        </div>
        <p className="text-cocoa-500 text-sm mt-6">
          ¿Tienes una tienda?{' '}
          <Link to="/panel/register" className="text-cafe font-semibold hover:text-orange-600">
            Registra tu negocio aquí
          </Link>
        </p>
      </div>

      {/* Right Side - Form */}
      <div className="bg-white p-8 lg:p-12 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <h1 className="text-3xl lg:text-4xl font-bold text-cocoa-900 mb-2">
            Crear cuenta
          </h1>
          <p className="text-gray-600 mb-8">
            Comienza tu viaje de belleza con Chocolat hoy
          </p>

          {error && (
            <div className="mb-6 px-4 py-3 bg-red-50 border border-red-300 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="block text-sm font-semibold text-cocoa-900 mb-2">
                  NOMBRE
                </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-cocoa-200 rounded-lg focus:outline-none focus:border-cafe text-cocoa-900"
                  placeholder="María"
                  required
                />
              </div>
              <div>
                <label htmlFor="last_name" className="block text-sm font-semibold text-cocoa-900 mb-2">
                  APELLIDO
                </label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-cocoa-200 rounded-lg focus:outline-none focus:border-cafe text-cocoa-900"
                  placeholder="García"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-cocoa-900 mb-2">
                CORREO ELECTRÓNICO
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-cocoa-200 rounded-lg focus:outline-none focus:border-cafe text-cocoa-900"
                placeholder="maria@correo.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-cocoa-900 mb-2">
                CONTRASEÑA
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-cocoa-200 rounded-lg focus:outline-none focus:border-cafe text-cocoa-900"
                placeholder="Mínimo 8 caracteres"
                required
                minLength={8}
              />
            </div>

            <div>
              <label htmlFor="password2" className="block text-sm font-semibold text-cocoa-900 mb-2">
                CONFIRMAR CONTRASEÑA
              </label>
              <input
                type="password"
                id="password2"
                name="password2"
                value={formData.password2}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-cocoa-200 rounded-lg focus:outline-none focus:border-cafe text-cocoa-900"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-start gap-2">
              <input type="checkbox" id="terms" className="w-5 h-5 mt-1 accent-cafe" required />
              <label htmlFor="terms" className="text-sm text-cocoa-700">
                Acepto los{' '}
                <a href="#" className="text-cafe font-semibold hover:text-orange-600">
                  Términos y Condiciones
                </a>{' '}
                y la{' '}
                <a href="#" className="text-cafe font-semibold hover:text-orange-600">
                  Política de Privacidad
                </a>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-cafe text-white rounded-lg font-bold hover:bg-amber-800 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                  Creando cuenta...
                </>
              ) : (
                'Crear mi cuenta'
              )}
            </button>

            <div className="text-center text-gray-600">
              <p>
                ¿Ya tienes cuenta?{' '}
                <Link to="/login" className="text-cafe font-semibold hover:text-orange-600">
                  Iniciar sesión
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
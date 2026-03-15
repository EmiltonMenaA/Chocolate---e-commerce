import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

export default function TiendaRegister() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password2: '',
    nombre_tienda: '',
    telefono: '',
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
      await axios.post('/api/auth/registro/tienda/', formData)
      await login(formData.email, formData.password)
      navigate('/panel/dashboard', { replace: true })
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: Record<string, string[]> } }
      const data = axiosErr?.response?.data
      if (data) {
        const first = Object.values(data).flat()[0]
        setError(typeof first === 'string' ? first : 'Error al registrar la tienda.')
      } else {
        setError('Error de conexión. Intenta de nuevo.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cocoa-950 flex">
      {/* Left branding */}
      <div className="hidden lg:flex w-5/12 bg-gradient-to-br from-cocoa-800 to-cocoa-900 p-12 flex-col justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cafe rounded-xl flex items-center justify-center font-bold text-xl text-white">C</div>
          <span className="text-2xl font-bold text-white">Chocolat</span>
        </div>
        <div>
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            Lleva tu tienda al <span className="text-cafe">siguiente nivel</span>
          </h2>
          <p className="text-cocoa-300 mb-8">
            Registra tu negocio y comienza a vender tus productos de belleza a miles de clientes.
          </p>
          <div className="space-y-4">
            {[
              { icon: 'storefront', text: 'Panel dedicado para tu tienda' },
              { icon: 'photo_library', text: 'Sube fotos y detalles de tus productos' },
              { icon: 'bar_chart', text: 'Estadísticas de ventas en tiempo real' },
              { icon: 'support_agent', text: 'Soporte prioritario para vendedores' },
            ].map(({ icon, text }) => (
              <div key={icon} className="flex items-center gap-3 text-cocoa-300">
                <span className="material-symbols-outlined text-cafe">{icon}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-cocoa-500 text-sm">© {new Date().getFullYear()} Chocolat · Programa de Vendedores</p>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-lg py-8">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-cafe rounded-xl flex items-center justify-center font-bold text-xl text-white">C</div>
            <span className="text-2xl font-bold text-white">Chocolat</span>
          </div>

          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cafe/20 text-cafe rounded-full text-xs font-semibold mb-4">
              <span className="material-symbols-outlined text-sm">store</span>
              Registro de Vendedores
            </div>
            <h1 className="text-3xl font-bold text-white">Crea tu cuenta de tienda</h1>
            <p className="text-cocoa-400 mt-2">Todos los campos son obligatorios a menos que se indique lo contrario</p>
          </div>

          {error && (
            <div className="mb-6 px-4 py-3 bg-red-600/20 border border-red-500/50 rounded-xl text-red-400 text-sm flex gap-2 items-start">
              <span className="material-symbols-outlined text-base flex-shrink-0 mt-0.5">error</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Store info section */}
            <div className="pb-2">
              <p className="text-xs font-bold uppercase tracking-wider text-cocoa-400 mb-3">
                Información de la tienda
              </p>
              <div>
                <label htmlFor="nombre_tienda" className="block text-sm font-semibold text-cocoa-200 mb-2">
                  NOMBRE DE LA TIENDA
                </label>
                <input
                  type="text"
                  id="nombre_tienda"
                  name="nombre_tienda"
                  value={formData.nombre_tienda}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-cocoa-800 border border-cocoa-700 rounded-xl focus:outline-none focus:border-cafe text-white placeholder-cocoa-500"
                  placeholder="Ej: Boutique Natura"
                  required
                />
              </div>
              <div className="mt-4">
                <label htmlFor="telefono" className="block text-sm font-semibold text-cocoa-200 mb-2">
                  TELÉFONO DE CONTACTO <span className="text-cocoa-500 font-normal">(opcional)</span>
                </label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-cocoa-800 border border-cocoa-700 rounded-xl focus:outline-none focus:border-cafe text-white placeholder-cocoa-500"
                  placeholder="+52 55 1234 5678"
                />
              </div>
            </div>

            {/* Account info section */}
            <div className="pt-2">
              <p className="text-xs font-bold uppercase tracking-wider text-cocoa-400 mb-3">
                Datos del responsable
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="first_name" className="block text-sm font-semibold text-cocoa-200 mb-2">NOMBRE</label>
                  <input
                    type="text" id="first_name" name="first_name"
                    value={formData.first_name} onChange={handleChange}
                    className="w-full px-4 py-3 bg-cocoa-800 border border-cocoa-700 rounded-xl focus:outline-none focus:border-cafe text-white placeholder-cocoa-500"
                    placeholder="Nombre" required
                  />
                </div>
                <div>
                  <label htmlFor="last_name" className="block text-sm font-semibold text-cocoa-200 mb-2">APELLIDO</label>
                  <input
                    type="text" id="last_name" name="last_name"
                    value={formData.last_name} onChange={handleChange}
                    className="w-full px-4 py-3 bg-cocoa-800 border border-cocoa-700 rounded-xl focus:outline-none focus:border-cafe text-white placeholder-cocoa-500"
                    placeholder="Apellido" required
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-cocoa-200 mb-2">CORREO ELECTRÓNICO</label>
              <input
                type="email" id="email" name="email"
                value={formData.email} onChange={handleChange}
                className="w-full px-4 py-3 bg-cocoa-800 border border-cocoa-700 rounded-xl focus:outline-none focus:border-cafe text-white placeholder-cocoa-500"
                placeholder="correo@tienda.com" required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-cocoa-200 mb-2">CONTRASEÑA</label>
                <input
                  type="password" id="password" name="password"
                  value={formData.password} onChange={handleChange}
                  className="w-full px-4 py-3 bg-cocoa-800 border border-cocoa-700 rounded-xl focus:outline-none focus:border-cafe text-white placeholder-cocoa-500"
                  placeholder="Mín. 8 caracteres" required minLength={8}
                />
              </div>
              <div>
                <label htmlFor="password2" className="block text-sm font-semibold text-cocoa-200 mb-2">CONFIRMAR</label>
                <input
                  type="password" id="password2" name="password2"
                  value={formData.password2} onChange={handleChange}
                  className="w-full px-4 py-3 bg-cocoa-800 border border-cocoa-700 rounded-xl focus:outline-none focus:border-cafe text-white placeholder-cocoa-500"
                  placeholder="••••••••" required
                />
              </div>
            </div>

            <div className="flex items-start gap-2 pt-1">
              <input type="checkbox" id="terms" className="w-5 h-5 mt-1 accent-cafe" required />
              <label htmlFor="terms" className="text-sm text-cocoa-400">
                Acepto los{' '}
                <a href="#" className="text-cafe hover:text-amber-400">Términos de Vendedor</a>{' '}
                y la{' '}
                <a href="#" className="text-cafe hover:text-amber-400">Política de Privacidad</a>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-cafe text-white rounded-xl font-bold hover:bg-amber-800 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                  Registrando tienda...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">store</span>
                  Crear cuenta de vendedor
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-cocoa-800 text-center text-sm space-y-2">
            <p className="text-cocoa-400">
              ¿Ya tienes cuenta de vendedor?{' '}
              <Link to="/panel/login" className="text-cafe hover:text-amber-400 font-semibold">
                Inicia sesión
              </Link>
            </p>
            <p className="text-cocoa-500">
              ¿Eres cliente?{' '}
              <Link to="/register" className="text-cocoa-400 hover:text-white">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

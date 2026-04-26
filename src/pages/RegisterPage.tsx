import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const { t } = useTranslation()
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
      setError(t('auth.passwordsNoMatch'))
      return
    }
    setIsLoading(true)
    try {
      await axios.post('/api/auth/registro/cliente/', formData)
      await login(formData.email, formData.password)
      navigate('/dashboard', { replace: true })
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { data?: Record<string, string[]> | string }
      }
      const data = axiosErr?.response?.data
      if (typeof data === 'string') {
        setError(data.trim().startsWith('<') ? t('auth.serverError') : data)
      } else if (data && typeof data === 'object') {
        const first = Object.values(data).flat()[0]
        setError(typeof first === 'string' ? first : t('auth.registerError'))
      } else {
        setError(t('auth.connectionError'))
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
            {t('auth.registerHeroTitle')}
          </h2>
          <p className="text-lg text-cocoa-700 mb-8">
            {t('auth.registerHeroSubtitle')}
          </p>
        </div>
        <div className="space-y-6">
          {[
            { icon: '♡', title: t('auth.registerPerk1') },
            { icon: '✨', title: t('auth.registerPerk2') },
            { icon: '↦', title: t('auth.registerPerk3') },
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
          {t('auth.vendorRegisterPrompt')}{' '}
          <Link to="/panel/register" className="text-cafe font-semibold hover:text-orange-600">
            {t('auth.vendorRegisterLink')}
          </Link>
        </p>
      </div>

      {/* Right Side - Form */}
      <div className="bg-white p-8 lg:p-12 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <h1 className="text-3xl lg:text-4xl font-bold text-cocoa-900 mb-2">
            {t('auth.registerTitle')}
          </h1>
          <p className="text-gray-600 mb-8">
            {t('auth.registerSubtitle')}
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
                  {t('auth.firstName').toUpperCase()}
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
                  {t('auth.lastName').toUpperCase()}
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
                {t('auth.email').toUpperCase()}
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
                {t('auth.password').toUpperCase()}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-cocoa-200 rounded-lg focus:outline-none focus:border-cafe text-cocoa-900"
                placeholder={t('auth.minChars')}
                required
                minLength={8}
              />
            </div>

            <div>
              <label htmlFor="password2" className="block text-sm font-semibold text-cocoa-900 mb-2">
                {t('auth.confirmPassword').toUpperCase()}
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
                {t('auth.termsPrefix')}{' '}
                <a href="#" className="text-cafe font-semibold hover:text-orange-600">
                  {t('auth.terms')}
                </a>{' '}
                {t('auth.and')}{' '}
                <a href="#" className="text-cafe font-semibold hover:text-orange-600">
                  {t('auth.privacy')}
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
                  {t('auth.creatingAccount')}
                </>
              ) : (
                t('auth.createMyAccount')
              )}
            </button>

            <div className="text-center text-gray-600">
              <p>
                {t('auth.hasAccount')}{' '}
                <Link to="/login" className="text-cafe font-semibold hover:text-orange-600">
                  {t('auth.loginTitle')}
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
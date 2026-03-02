import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    accountType: 'person',
    storeName: '',
    password: '',
    confirmPassword: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Register attempt', formData)
  }

  return (
    <div className="min-h-[calc(100vh-80px)] grid lg:grid-cols-2">
      {/* Left Side - Promotional */}
      <div className="bg-gradient-to-br from-pink-200 to-pink-300 p-8 lg:p-12 flex flex-col justify-between hidden lg:flex">
        <div>
          <h2 className="text-4xl lg:text-5xl font-bold text-cocoa-900 leading-tight mb-4">
            Join the world of <span className="text-cafe">Chocolate</span>
          </h2>
          <p className="text-lg text-cocoa-700 mb-8">
            Experience premium skincare and beauty rituals tailored to your unique elegance.
          </p>
        </div>

        {/* Benefits */}
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-cafe rounded-full flex items-center justify-center text-white text-2xl flex-shrink-0">
              ♡
            </div>
            <div>
              <h3 className="font-bold text-cocoa-900 text-lg">Exclusive loyalty rewards</h3>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-cafe rounded-full flex items-center justify-center text-white text-2xl flex-shrink-0">
              ✨
            </div>
            <div>
              <h3 className="font-bold text-cocoa-900 text-lg">Personalized beauty routines</h3>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-cafe rounded-full flex items-center justify-center text-white text-2xl flex-shrink-0">
              ↦
            </div>
            <div>
              <h3 className="font-bold text-cocoa-900 text-lg">Priority shipping on orders</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="bg-white p-8 lg:p-12 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <h1 className="text-3xl lg:text-4xl font-bold text-cocoa-900 mb-2">
            Create Account
          </h1>
          <p className="text-gray-600 mb-8">
            Start your beauty journey with Chocolate today
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="accountType" className="block text-sm font-semibold text-cocoa-900 mb-2">
                Account Type
              </label>
              <select
                id="accountType"
                name="accountType"
                value={formData.accountType}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-cocoa-200 rounded-lg focus:outline-none focus:border-cafe text-cocoa-900"
              >
                <option value="person">Persona - Comprador</option>
                <option value="store">Tienda - Vendedor</option>
              </select>
            </div>

            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-cocoa-900 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-cocoa-200 rounded-lg focus:outline-none focus:border-cafe text-cocoa-900 placeholder-gray-400"
                placeholder="Jane Doe"
                required
              />
            </div>

            {formData.accountType === 'store' && (
              <div>
                <label htmlFor="storeName" className="block text-sm font-semibold text-cocoa-900 mb-2">
                  Store Name
                </label>
                <input
                  type="text"
                  id="storeName"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-cocoa-200 rounded-lg focus:outline-none focus:border-cafe text-cocoa-900 placeholder-gray-400"
                  placeholder="Your Store Name"
                  required={formData.accountType === 'store'}
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-cocoa-900 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-cocoa-200 rounded-lg focus:outline-none focus:border-cafe text-cocoa-900 placeholder-gray-400"
                placeholder="jane@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-cocoa-900 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-cocoa-200 rounded-lg focus:outline-none focus:border-cafe text-cocoa-900 placeholder-gray-400"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-cocoa-900 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-cocoa-200 rounded-lg focus:outline-none focus:border-cafe text-cocoa-900 placeholder-gray-400"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-start gap-2">
              <input type="checkbox" id="terms" className="w-5 h-5 mt-1 accent-cafe" required />
              <label htmlFor="terms" className="text-sm text-cocoa-700">
                I agree to the{' '}
                <a href="#" className="text-cafe font-semibold hover:text-orange-600">
                  Terms and Conditions
                </a>{' '}
                and{' '}
                <a href="#" className="text-cafe font-semibold hover:text-orange-600">
                  Privacy Policy
                </a>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-cafe text-white rounded-lg font-bold hover:bg-amber-800 transition-colors"
            >
              Create My Account
            </button>

            <div className="text-center text-gray-600">
              <p>
                Already have an account?{' '}
                <Link to="/login" className="text-cafe font-semibold hover:text-orange-600">
                  Sign In
                </Link>
              </p>
            </div>
          </form>

          {/* Social Signup */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-center text-gray-600 text-sm mb-4">OR REGISTER WITH</p>
            <div className="flex justify-center gap-4">
              <button className="flex-1 py-2 border-2 border-gray-300 rounded-lg font-semibold text-gray-900 hover:bg-gray-50 transition-colors">
                Google
              </button>
              <button className="flex-1 py-2 border-2 border-gray-300 rounded-lg font-semibold text-gray-900 hover:bg-gray-50 transition-colors">
                Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Login attempt', { email, password })
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
              The Essence of <span className="text-red-500">BeautÿDy</span>
            </h2>
          </div>
          <p className="text-lg text-white/80">
            Indulge in our curated collection of luxury skincare. Designed to unveil your natural radiance.
          </p>
        </div>

        {/* Right Side Image */}
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
            Welcome Back
          </h1>
          <p className="text-cafe mb-8">
            Sign in to your account to continue your personal care journey
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-cocoa-800 border border-cocoa-700 rounded-lg focus:outline-none focus:border-cafe text-white placeholder-cocoa-500"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-sm font-semibold text-white">
                  PASSWORD
                </label>
                <a href="#" className="text-cafe text-sm hover:text-orange-400 font-semibold">
                  Forgot Password?
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

            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" className="w-4 h-4" />
              <label htmlFor="remember" className="text-sm text-cocoa-400">
                Remember this device
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors"
            >
              Sign In
            </button>

            <div className="text-center text-cocoa-400">
              <p>
                New to Chocolate?{' '}
                <Link to="/register" className="text-cafe hover:text-orange-400 font-semibold">
                  Create an account
                </Link>
              </p>
            </div>
          </form>

          {/* Social Login */}
          <div className="mt-8 pt-8 border-t border-cocoa-700">
            <p className="text-center text-cocoa-400 text-sm mb-4">OR LOGIN WITH</p>
            <div className="flex justify-center gap-4">
              <button className="w-10 h-10 bg-cocoa-800 rounded-lg flex items-center justify-center text-white hover:bg-cocoa-700 transition-colors">
                G
              </button>
              <button className="w-10 h-10 bg-cocoa-800 rounded-lg flex items-center justify-center text-white hover:bg-cocoa-700 transition-colors">
                f
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

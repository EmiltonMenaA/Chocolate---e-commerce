import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'

import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showUserMenu, setShowUserMenu] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { cartCount } = useCart()
  const { user, isAuthenticated, logout } = useAuth()

  const isActive = (path: string) => location.pathname === path

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      console.log('Buscando:', searchQuery)
    }
  }

  const handleLogout = async () => {
    setShowUserMenu(false)
    await logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-cocoa-100 dark:border-cocoa-800 px-6 lg:px-20 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group cursor-pointer">
          <div className="size-8 bg-cafe rounded-lg flex items-center justify-center text-white font-bold">
            C
          </div>
          <span className="text-xl font-bold text-cocoa-900 dark:text-white">Chocolat</span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md">
          <div className="w-full relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar productos..."
              className="w-full px-4 py-2 bg-cocoa-50 dark:bg-cocoa-800 border border-cocoa-200 dark:border-cocoa-700 rounded-lg focus:outline-none focus:border-cafe dark:text-white text-sm"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-cocoa-700 dark:text-slate-300 hover:text-cafe transition-colors"
            >
              <span className="material-symbols-outlined text-sm">search</span>
            </button>
          </div>
        </form>

        {/* Navigation Menu */}
        <nav className="hidden lg:flex items-center gap-8">
          <Link 
            to="/products" 
            className={`font-medium transition-colors ${
              isActive('/products') 
                ? 'text-cafe' 
                : 'text-cocoa-700 dark:text-slate-300 hover:text-cafe'
            }`}
          >
            Catálogo
          </Link>
          <Link 
            to="/skin-quiz" 
            className={`font-medium transition-colors ${
              isActive('/skin-quiz') 
                ? 'text-cafe' 
                : 'text-cocoa-700 dark:text-slate-300 hover:text-cafe'
            }`}
          >
            Skin Quiz
          </Link>
          <Link 
            to="/find-boutique" 
            className={`font-medium transition-colors ${
              isActive('/find-boutique') 
                ? 'text-cafe' 
                : 'text-cocoa-700 dark:text-slate-300 hover:text-cafe'
            }`}
          >
            Buscar Boutique
          </Link>
          <Link 
            to="/cart" 
            className={`relative font-medium transition-colors ${
              isActive('/cart') 
                ? 'text-cafe' 
                : 'text-cocoa-700 dark:text-slate-300 hover:text-cafe'
            }`}
          >
            Carrito
            {cartCount > 0 && (
              <span className="ml-2 inline-flex min-w-6 items-center justify-center rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>
        </nav>

        {/* CTA Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-cocoa-100 dark:hover:bg-cocoa-800 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-cafe flex items-center justify-center text-white font-bold text-sm">
                  {user.nombre.charAt(0).toUpperCase()}
                </div>
                <span className="text-cocoa-900 dark:text-white font-medium text-sm">
                  {user.nombre.split(' ')[0]}
                </span>
                <span className="material-symbols-outlined text-sm text-cocoa-400">expand_more</span>
              </button>
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-cocoa-800 rounded-xl shadow-xl border border-cocoa-100 dark:border-cocoa-700 py-2 z-50">
                  <div className="px-4 py-2 border-b border-cocoa-100 dark:border-cocoa-700">
                    <p className="text-sm font-semibold text-cocoa-900 dark:text-white">{user.nombre}</p>
                    <p className="text-xs text-cocoa-400">{user.email}</p>
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-cocoa-700 dark:text-slate-300 hover:bg-cocoa-50 dark:hover:bg-cocoa-700 transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">person</span>
                    Mi cuenta
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">logout</span>
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="px-6 py-2 text-cocoa-900 dark:text-white font-medium hover:text-cafe transition-colors"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="px-6 py-2 bg-cafe text-white rounded-lg font-medium hover:bg-amber-800 transition-colors"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden p-2 hover:bg-cocoa-100 dark:hover:bg-cocoa-800 rounded-lg transition-colors"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <nav className="lg:hidden mt-4 flex flex-col gap-4 pb-4">
          <Link to="/products" className="text-cocoa-700 dark:text-slate-300 font-medium">
            Catálogo
          </Link>
          <Link to="/skin-quiz" className="text-cocoa-700 dark:text-slate-300 font-medium">
            Skin Quiz
          </Link>
          <Link to="/find-boutique" className="text-cocoa-700 dark:text-slate-300 font-medium">
            Buscar Boutique
          </Link>
          <Link to="/cart" className="text-cocoa-700 dark:text-slate-300 font-medium">
            Carrito
            {cartCount > 0 && (
              <span className="ml-2 inline-flex min-w-6 items-center justify-center rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>
          <Link to="/login" className="text-cocoa-700 dark:text-slate-300 font-medium">
            Iniciar sesión
          </Link>
          {!isAuthenticated && (
            <Link to="/register" className="bg-cafe text-white px-4 py-2 rounded-lg font-medium">
              Registrarse
            </Link>
          )}
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="text-red-400 font-medium text-sm"
            >
              Cerrar sesión
            </button>
          )}
        </nav>
      )}
    </header>
  )
}

import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // TODO: Implementar búsqueda
      console.log('Buscando:', searchQuery)
    }
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
            className={`font-medium transition-colors ${
              isActive('/cart') 
                ? 'text-cafe' 
                : 'text-cocoa-700 dark:text-slate-300 hover:text-cafe'
            }`}
          >
            Carrito
          </Link>
        </nav>

        {/* CTA Buttons */}
        <div className="hidden lg:flex items-center gap-4">
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
          </Link>
          <Link to="/login" className="text-cocoa-700 dark:text-slate-300 font-medium">
            Iniciar sesión
          </Link>
          <Link to="/register" className="bg-cafe text-white px-4 py-2 rounded-lg font-medium">
            Registrarse
          </Link>
        </nav>
      )}
    </header>
  )
}

import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const NAV_ITEMS = [
  { to: '/panel/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { to: '/panel/productos', label: 'Mis Productos', icon: 'inventory_2' },
  { to: '/panel/pedidos', label: 'Pedidos', icon: 'local_shipping' },
  { to: '/panel/productos/nuevo', label: 'Agregar Producto', icon: 'add_box' },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const { clearCart } = useCart()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    clearCart()
    await logout()
    navigate('/panel/login')
  }

  const isActive = (to: string) =>
    to === '/panel/dashboard'
      ? location.pathname === to
      : location.pathname.startsWith(to)

  return (
    <div className="flex h-screen bg-cocoa-50 dark:bg-cocoa-950 overflow-hidden">
      {/* ── Sidebar ─────────────────────────────────────── */}
      <aside className="w-64 flex-shrink-0 bg-cocoa-900 text-white flex flex-col shadow-xl">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-cocoa-700 flex items-center gap-3">
          <img
            src="/images/banners/chocolate_beauty_favicon.svg"
            alt="Chocolate logo"
            className="brand-logo brand-logo-md"
          />
          <div>
            <p className="brand-wordmark text-white text-sm leading-tight">Chocolate</p>
            <p className="text-xs text-cocoa-400">Panel de Vendedor</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive(to)
                  ? 'bg-cafe text-white shadow-md'
                  : 'text-cocoa-300 hover:bg-cocoa-800 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-xl">{icon}</span>
              {label}
            </Link>
          ))}

          <div className="pt-4 border-t border-cocoa-700 mt-4">
            <p className="px-4 text-xs font-semibold uppercase tracking-wider text-cocoa-500 mb-2">
              Cliente
            </p>
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-cocoa-300 hover:bg-cocoa-800 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-xl">open_in_new</span>
              Ver tienda
            </Link>
          </div>
        </nav>

        {/* User footer */}
        <div className="p-4 border-t border-cocoa-700">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-9 h-9 rounded-full bg-cafe flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {(user?.nombre_tienda || user?.nombre || '?').charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {user?.nombre_tienda || user?.nombre}
              </p>
              <p className="text-xs text-cocoa-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-cocoa-300 hover:bg-red-600/20 hover:text-red-400 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ── Content Area ────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white dark:bg-cocoa-900 border-b border-cocoa-200 dark:border-cocoa-700 px-8 py-4 flex items-center gap-4 flex-shrink-0">
          <div className="flex-1">
            <p className="text-xs text-cocoa-500 uppercase tracking-wider font-semibold">
              Panel de Vendedor
            </p>
            {user?.nombre_tienda && (
              <p className="text-lg font-bold text-cocoa-900 dark:text-white leading-tight">
                {user.nombre_tienda}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-cocoa-500 dark:text-cocoa-400">
            <span className="material-symbols-outlined text-base">person</span>
            {user?.nombre}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-cocoa-50 dark:bg-cocoa-950 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

import { Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth, type UserRol } from '../context/AuthContext'

type Props = {
  children: ReactNode
  /** Required role. If omitted, only checks authentication. */
  rol?: UserRol | UserRol[]
  /** Where to redirect unauthenticated users (default: /login) */
  redirectTo?: string
}

export default function ProtectedRoute({ children, rol, redirectTo = '/login' }: Props) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-cafe text-4xl">
          progress_activity
        </span>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  if (rol) {
    const allowed = Array.isArray(rol) ? rol : [rol]
    if (!allowed.includes(user!.rol)) {
      // Wrong role: redirect to appropriate place
      if (user!.rol === 'tienda' || user!.rol === 'admin') {
        return <Navigate to="/panel/dashboard" replace />
      }
      return <Navigate to="/" replace />
    }
  }

  return <>{children}</>
}

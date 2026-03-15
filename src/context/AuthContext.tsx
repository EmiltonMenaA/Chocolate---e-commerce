import axios from 'axios'
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

const AUTH_STORAGE_KEY = 'chocolat-auth'

export type UserRol = 'cliente' | 'tienda' | 'admin'

export type AuthUser = {
  id: number
  email: string
  nombre: string
  rol: UserRol
  nombre_tienda: string
}

type AuthState = {
  user: AuthUser
  accessToken: string
  refreshToken: string
}

type AuthContextValue = {
  user: AuthUser | null
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<AuthUser>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (raw) {
      try {
        setState(JSON.parse(raw) as AuthState)
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY)
      }
    }
    setIsLoading(false)
  }, [])

  const persist = (user: AuthUser, accessToken: string, refreshToken: string) => {
    const next: AuthState = { user, accessToken, refreshToken }
    setState(next)
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(next))
  }

  const login = async (email: string, password: string): Promise<AuthUser> => {
    const { data } = await axios.post('/api/auth/token/', {
      username: email,
      password,
    })
    persist(data.user, data.access, data.refresh)
    return data.user as AuthUser
  }

  const logout = async (): Promise<void> => {
    try {
      if (state?.refreshToken && state?.accessToken) {
        await axios.post(
          '/api/auth/logout/',
          { refresh: state.refreshToken },
          { headers: { Authorization: `Bearer ${state.accessToken}` } },
        )
      }
    } catch {
      // ignore errors during logout
    }
    setState(null)
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }

  return (
    <AuthContext.Provider
      value={{
        user: state?.user ?? null,
        accessToken: state?.accessToken ?? null,
        isAuthenticated: !!state?.user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}

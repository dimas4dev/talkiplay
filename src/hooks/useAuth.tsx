import { useState, useEffect, createContext, useContext, type ReactNode } from 'react'
import { useLocation } from 'wouter'
// TODO: Importar tipos y servicios de autenticación cuando se implementen

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  user: string | null
  login: (credentials: { email: string; password: string }) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<string | null>(null)
  const [, setLocation] = useLocation()

  useEffect(() => {
    // TODO: Implementar verificación de autenticación
    const accessToken = localStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')
    
    if (!accessToken || !refreshToken) {
      setIsAuthenticated(false)
      setUser(null)
      setIsLoading(false)
      return
    }

    // TODO: Verificar token con el backend
    setIsLoading(false)
  }, [])

  const login = async (credentials: { email: string; password: string }): Promise<boolean> => {
    try {
      setIsLoading(true)
      // TODO: Implementar llamada a API de login
      // const response = await authService.login(credentials)
      
      // Placeholder - reemplazar con implementación real
      console.warn('Login no implementado aún')
      return false
    } catch (error) {
      console.error('Error en el login:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('username')
    setIsAuthenticated(false)
    setUser(null)
    setLocation('/login')
  }

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      isLoading,
      user,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
}

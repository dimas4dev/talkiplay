import { useState, useEffect, createContext, useContext, type ReactNode } from 'react'
import { authService } from '@/services/api'
import type { LoginRequest } from '@/types/api'
import { useLocation } from 'wouter'

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  user: string | null
  login: (credentials: LoginRequest) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<string | null>(null)
  const [, setLocation] = useLocation()

  // Función para verificar si el token está expirado
  const isTokenExpired = (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentTime = Date.now() / 1000
      return payload.exp < currentTime
    } catch {
      return true
    }
  }

  // Función para verificar y renovar token si es necesario
  const checkAndRefreshToken = async () => {
    const accessToken = authService.getAccessToken()
    const refreshToken = authService.getRefreshToken()
    
    if (!accessToken || !refreshToken) {
      return false
    }

    // Si el access token está expirado, intentar renovarlo
    if (isTokenExpired(accessToken)) {
      try {
        const response = await authService.refreshToken()
        if (response.success && response.data) {
          // Token renovado exitosamente
          return true
        } else {
          // No se pudo renovar, limpiar tokens
          authService.logout()
          return false
        }
      } catch (error) {
        console.error('Error al renovar token:', error)
        authService.logout()
        return false
      }
    }
    
    return true
  }

  // Función para obtener información del usuario
  const getUserInfo = async () => {
    try {
      const response = await authService.getUserProfile()
      if (response.success && response.data) {
        return response.data.username || response.data.email
      }
      return null
    } catch (error) {
      console.error('Error obteniendo información del usuario:', error)
      return null
    }
  }

  // Función para verificar autenticación con el backend
  const verifyAuthentication = async () => {
    try {
      const isValid = await checkAndRefreshToken()
      if (isValid) {
        setIsAuthenticated(true)
        // Obtener el nombre real del usuario
        const userName = await getUserInfo()
        if (userName) {
          setUser(userName)
          try {
            localStorage.setItem('username', userName)
          } catch {}
        } else {
          setUser(prev => prev ?? 'Usuario autenticado')
        }
      } else {
        setIsAuthenticated(false)
        setUser(null)
        setLocation('/login')
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error)
      setIsAuthenticated(false)
      setUser(null)
      setLocation('/login')
    }
  }

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true)
      
      // Hidratar el nombre de usuario desde localStorage inmediatamente
      try {
        const savedUsername = localStorage.getItem('username')
        if (savedUsername) {
          setUser(savedUsername)
        }
      } catch {}

      const accessToken = authService.getAccessToken()
      const refreshToken = authService.getRefreshToken()
      
      if (!accessToken || !refreshToken) {
        setIsAuthenticated(false)
        setUser(null)
        setIsLoading(false)
        return
      }

      // Verificar autenticación con el backend
      await verifyAuthentication()
      setIsLoading(false)
    }

    initializeAuth()

    // Verificar autenticación cada 5 minutos
    const interval = setInterval(verifyAuthentication, 5 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [])

  const login = async (credentials: LoginRequest): Promise<boolean> => {
    try {
      setIsLoading(true)
      const response = await authService.login(credentials)
      
      if (response.success && response.data) {
        setIsAuthenticated(true)
        // Usar el username del usuario
        const userName = response.data.user.username || response.data.user.email
        setUser(userName)
        try {
          localStorage.setItem('username', userName)
        } catch {}
        return true
      }
      return false
    } catch (error) {
      console.error('Error en el login:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    authService.logout()
    setIsAuthenticated(false)
    setUser(null)
    try {
      localStorage.removeItem('username')
    } catch {}
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
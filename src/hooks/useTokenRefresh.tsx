import { useEffect, useRef } from 'react'
import { authService } from '@/services/api'

// Hook para manejar la renovación automática de tokens
export function useTokenRefresh() {
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Función para renovar el token
    const refreshToken = async () => {
      try {
        await authService.refreshToken()
      } catch (error) {
        console.error('Error al renovar token:', error)
        // Si falla la renovación, limpiar todo y redirigir al login
        authService.logout()
        window.location.href = '/login'
      }
    }

    // Verificar si hay tokens válidos
    const accessToken = authService.getAccessToken()
    const refreshTokenValue = authService.getRefreshToken()

    if (accessToken && refreshTokenValue) {
      // Renovar el token cada 50 minutos (los tokens suelen durar 1 hora)
      intervalRef.current = setInterval(refreshToken, 50 * 60 * 1000)
    }

    // Cleanup al desmontar el componente
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  // Función para renovar manualmente el token
  const manualRefresh = async () => {
    try {
      await authService.refreshToken()
      return true
    } catch (error) {
      console.error('Error al renovar token manualmente:', error)
      return false
    }
  }

  return { manualRefresh }
}

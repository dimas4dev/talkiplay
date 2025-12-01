import { useState, useCallback } from 'react'
import { authService } from '@/services/api'
import type { LoginRequest, ApiResponse, LoginResponse } from '@/types/api'

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const login = useCallback(async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse> | null> => {
    setIsLoading(true)
    setError(null)
    setIsSuccess(false)

    try {
      const response = await authService.login(credentials)
      
      if (response.success) {
        setIsSuccess(true)
        return response
      } else {
        const errorMessage = response.message || 'Error al iniciar sesión'
        setError(errorMessage)
        return null
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error de conexión'
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setIsLoading(false)
    setError(null)
    setIsSuccess(false)
  }, [])

  return { login, isLoading, error, isSuccess, reset }
}


import { useState } from 'react'
import { userService } from '@/services/api'

export function useUserDelete() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteUser = async (userId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await userService.deleteUser(userId)
      
      if (response.success) {
        return { success: true, message: 'Usuario eliminado exitosamente' }
      } else {
        throw new Error(response.message || 'Error al eliminar el usuario')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al eliminar el usuario'
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    deleteUser,
    isLoading,
    error,
    clearError: () => setError(null)
  }
}

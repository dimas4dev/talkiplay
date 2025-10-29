import { useState } from 'react'
import { userService } from '@/services/api'

export function useUserStatus() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateUserStatus = async (userId: string, status: 'active' | 'suspended' | 'blocked', reason?: string) => {

    setIsLoading(true)
    setError(null)

    try {
      const statusData = {
        status,
        reason: reason || getDefaultReason(status)
      }

      const response = await userService.updateUserStatus(userId, statusData)

      if (response.success) {
        return { success: true, message: getSuccessMessage(status) }
      } else {
        throw new Error(response.message || 'Error al actualizar el estado del usuario')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al actualizar el estado'
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const getDefaultReason = (status: string) => {
    switch (status) {
      case 'suspended':
        return 'Violación de términos de servicio'
      case 'blocked':
        return 'Actividad sospechosa detectada'
      case 'active':
        return 'Usuario reactivado por administrador'
      default:
        return 'Cambio de estado realizado por administrador'
    }
  }

  const getSuccessMessage = (status: string) => {
    switch (status) {
      case 'suspended':
        return 'Usuario suspendido exitosamente'
      case 'blocked':
        return 'Usuario bloqueado exitosamente'
      case 'active':
        return 'Usuario activado exitosamente'
      default:
        return 'Estado del usuario actualizado exitosamente'
    }
  }

  return {
    updateUserStatus,
    isLoading,
    error,
    clearError: () => setError(null)
  }
}

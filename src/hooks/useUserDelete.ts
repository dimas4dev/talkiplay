import { useState, useCallback } from 'react'
import { adminFamilyService } from '@/services/api'

export function useUserDelete() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteUser = useCallback(async (familyId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      await adminFamilyService.delete(familyId)
      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar familia'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { deleteUser, isLoading, error }
}


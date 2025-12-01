import { useState, useCallback } from 'react'
// TODO: Implementar servicio de eliminación de usuario cuando esté disponible

export function useUserDelete() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteUser = useCallback(async (userId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      // TODO: Implementar llamada a API
      throw new Error('Servicio de eliminación de usuario no implementado aún')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar usuario'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { deleteUser, isLoading, error }
}


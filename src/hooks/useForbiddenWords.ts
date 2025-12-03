import { useState, useCallback } from 'react'
import { useApiData } from './useApiData'
import { forbiddenWordsService } from '@/services/api'
import type {
  ForbiddenWordsResponse,
  CreateForbiddenWordPayload,
  UpdateForbiddenWordPayload,
  ApiResponse,
  ForbiddenWord,
} from '@/types/api'

// Hook para listar palabras prohibidas
export function useForbiddenWords() {
  return useApiData<ForbiddenWordsResponse | ForbiddenWord[]>({
    fetchFn: async () => {
      const res = await forbiddenWordsService.getAll()
      // Normalizar la respuesta a ForbiddenWordsResponse
      if (Array.isArray(res)) {
        return {
          data: res,
          total: res.length,
        }
      }
      return res
    },
  })
}

// Hook para crear palabra prohibida
export function useCreateForbiddenWord() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const create = useCallback(async (payload: CreateForbiddenWordPayload): Promise<ApiResponse<ForbiddenWord> | null> => {
    setIsLoading(true)
    setError(null)
    setIsSuccess(false)

    try {
      const response = await forbiddenWordsService.create(payload)
      
      // Normalizar la respuesta: puede venir como ApiResponse o directamente como ForbiddenWord
      let normalizedResponse: ApiResponse<ForbiddenWord>
      
      if ('success' in response && response.success) {
        normalizedResponse = response as ApiResponse<ForbiddenWord>
      } else if ('word' in response && 'isStrong' in response) {
        // Es directamente un ForbiddenWord, envolverlo en ApiResponse
        normalizedResponse = {
          success: true,
          message: 'Palabra creada exitosamente',
          data: response as ForbiddenWord,
        }
      } else {
        // Formato desconocido, intentar tratarlo como éxito
        normalizedResponse = {
          success: true,
          message: 'Palabra creada exitosamente',
          data: response as any,
        }
      }
      
      setIsSuccess(true)
      return normalizedResponse
    } catch (err) {
      console.error('Error creating forbidden word:', err)
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

  return { create, isLoading, error, isSuccess, reset }
}

// Hook para actualizar palabra prohibida
export function useUpdateForbiddenWord() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const update = useCallback(async (id: string, payload: UpdateForbiddenWordPayload): Promise<ApiResponse<ForbiddenWord> | null> => {
    setIsLoading(true)
    setError(null)
    setIsSuccess(false)

    try {
      const response = await forbiddenWordsService.update(id, payload)
      
      // Normalizar la respuesta: puede venir como ApiResponse o directamente como ForbiddenWord
      let normalizedResponse: ApiResponse<ForbiddenWord>
      
      if ('success' in response && response.success) {
        normalizedResponse = response as ApiResponse<ForbiddenWord>
      } else if ('word' in response && 'isStrong' in response) {
        // Es directamente un ForbiddenWord, envolverlo en ApiResponse
        normalizedResponse = {
          success: true,
          message: 'Palabra actualizada exitosamente',
          data: response as ForbiddenWord,
        }
      } else {
        // Formato desconocido, intentar tratarlo como éxito
        normalizedResponse = {
          success: true,
          message: 'Palabra actualizada exitosamente',
          data: response as any,
        }
      }
      
      setIsSuccess(true)
      return normalizedResponse
    } catch (err) {
      console.error('Error updating forbidden word:', err)
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

  return { update, isLoading, error, isSuccess, reset }
}

// Hook para eliminar palabra prohibida
export function useDeleteForbiddenWord() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const deleteWord = useCallback(async (id: string): Promise<ApiResponse<{ message: string }> | null> => {
    setIsLoading(true)
    setError(null)
    setIsSuccess(false)

    try {
      const response = await forbiddenWordsService.delete(id)
      
      if (response.success) {
        setIsSuccess(true)
        return response
      } else {
        const errorMessage = response.message || 'Error al eliminar palabra prohibida'
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

  return { deleteWord, isLoading, error, isSuccess, reset }
}


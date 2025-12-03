import { useState, useCallback } from 'react'
import { useApiData } from './useApiData'
import { adminFamilyService } from '@/services/api'
import type {
  AdminFamiliesQueryParams,
  AdminFamiliesResponse,
  AdminFamilyDetail,
  WarnUserPayload,
  SuspendUserPayload,
  BlockUserPayload,
  ActivateUserPayload,
} from '@/types/api'

// Hook para listar familias con filtros y paginación
export function useAdminUsers(params: AdminFamiliesQueryParams) {
  return useApiData<AdminFamiliesResponse>({
    fetchFn: async () => {
      const res = await adminFamilyService.getFamilies(params)
      return res
    },
    dependencies: [
      params.status,
      params.search,
      params.hasWarnings,
      params.page,
      params.limit,
    ],
  })
}

// Hook para detalle de familia por ID
export function useAdminUserDetail(id: string | null) {
  return useApiData<AdminFamilyDetail>({
    fetchFn: async () => {
      if (!id) throw new Error('Family id is required')
      const res = await adminFamilyService.getById(id)
      return res
    },
    dependencies: [id],
    enabled: !!id,
  })
}

// Hook para advertir familia
export function useWarnAdminUser() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const warn = useCallback(async (id: string, payload: WarnUserPayload) => {
    setIsLoading(true)
    setError(null)
    setIsSuccess(false)

    try {
      await adminFamilyService.warn(id, payload)
      setIsSuccess(true)
      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al advertir familia'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setIsLoading(false)
    setError(null)
    setIsSuccess(false)
  }, [])

  return { warn, isLoading, error, isSuccess, reset }
}

// Hook para suspender familia
export function useSuspendAdminUser() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const suspend = useCallback(async (id: string, payload: SuspendUserPayload) => {
    setIsLoading(true)
    setError(null)
    setIsSuccess(false)

    try {
      await adminFamilyService.suspend(id, payload)
      setIsSuccess(true)
      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al suspender familia'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setIsLoading(false)
    setError(null)
    setIsSuccess(false)
  }, [])

  return { suspend, isLoading, error, isSuccess, reset }
}

// Hook para bloquear familia
export function useBlockAdminUser() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const block = useCallback(async (id: string, payload: BlockUserPayload) => {
    setIsLoading(true)
    setError(null)
    setIsSuccess(false)

    try {
      await adminFamilyService.block(id, payload)
      setIsSuccess(true)
      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al bloquear familia'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setIsLoading(false)
    setError(null)
    setIsSuccess(false)
  }, [])

  return { block, isLoading, error, isSuccess, reset }
}

// Hook para activar/reactivar familia
export function useActivateAdminUser() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const activate = useCallback(async (id: string, payload: ActivateUserPayload) => {
    setIsLoading(true)
    setError(null)
    setIsSuccess(false)

    try {
      await adminFamilyService.activate(id, payload)
      setIsSuccess(true)
      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al activar familia'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setIsLoading(false)
    setError(null)
    setIsSuccess(false)
  }, [])

  return { activate, isLoading, error, isSuccess, reset }
}


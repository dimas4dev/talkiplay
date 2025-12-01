import { useState, useCallback } from 'react'
import { useApiData } from './useApiData'
import { adminUserService } from '@/services/api'
import type {
  AdminUsersQueryParams,
  AdminUsersResponse,
  AdminUserStats,
  AdminUserDetail,
  WarnUserPayload,
  SuspendUserPayload,
  BlockUserPayload,
  ActivateUserPayload,
  BulkActionPayload,
} from '@/types/api'

// Hook para listar usuarios con filtros y paginación
export function useAdminUsers(params: AdminUsersQueryParams) {
  return useApiData<AdminUsersResponse>({
    fetchFn: async () => {
      const res = await adminUserService.getUsers(params)
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

// Hook para estadísticas de usuarios
export function useAdminUserStats() {
  return useApiData<AdminUserStats>({
    fetchFn: async () => {
      const res = await adminUserService.getStats()
      return res
    },
  })
}

// Hook para detalle de usuario por ID
export function useAdminUserDetail(id: string | null) {
  return useApiData<AdminUserDetail>({
    fetchFn: async () => {
      if (!id) throw new Error('User id is required')
      const res = await adminUserService.getById(id)
      return res
    },
    dependencies: [id],
    enabled: !!id,
  })
}

// Hook para advertir usuario
export function useWarnAdminUser() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const warn = useCallback(async (id: string, payload: WarnUserPayload) => {
    setIsLoading(true)
    setError(null)
    setIsSuccess(false)

    try {
      await adminUserService.warn(id, payload)
      setIsSuccess(true)
      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al advertir usuario'
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

// Hook para suspender usuario
export function useSuspendAdminUser() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const suspend = useCallback(async (id: string, payload: SuspendUserPayload) => {
    setIsLoading(true)
    setError(null)
    setIsSuccess(false)

    try {
      await adminUserService.suspend(id, payload)
      setIsSuccess(true)
      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al suspender usuario'
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

// Hook para bloquear usuario
export function useBlockAdminUser() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const block = useCallback(async (id: string, payload: BlockUserPayload) => {
    setIsLoading(true)
    setError(null)
    setIsSuccess(false)

    try {
      await adminUserService.block(id, payload)
      setIsSuccess(true)
      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al bloquear usuario'
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

// Hook para activar/reactivar usuario
export function useActivateAdminUser() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const activate = useCallback(async (id: string, payload: ActivateUserPayload) => {
    setIsLoading(true)
    setError(null)
    setIsSuccess(false)

    try {
      await adminUserService.activate(id, payload)
      setIsSuccess(true)
      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al activar usuario'
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

// Hook para acción masiva sobre usuarios
export function useBulkActionAdminUsers() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const bulkAction = useCallback(async (payload: BulkActionPayload) => {
    setIsLoading(true)
    setError(null)
    setIsSuccess(false)

    try {
      await adminUserService.bulkAction(payload)
      setIsSuccess(true)
      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al ejecutar acción masiva'
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

  return { bulkAction, isLoading, error, isSuccess, reset }
}


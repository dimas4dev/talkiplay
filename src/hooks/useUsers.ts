import { useApiData } from './useApiData'
import { adminFamilyService } from '@/services/api'
import type { AdminFamilyDetail } from '@/types/api'

export type UsersQuery = {
  page?: number
  limit?: number
  search?: string
  role?: string
  subscription_status?: string
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

export function useUsers(_params: UsersQuery) {
  return useApiData<any>({
    fetchFn: async () => {
      // TODO: Implementar llamada a API si es necesario
      throw new Error('Servicio de usuarios no implementado aún')
    },
    enabled: false, // Deshabilitado hasta que se implemente
  })
}

export function useUserById(userId: string) {
  return useApiData<AdminFamilyDetail>({
    fetchFn: async () => {
      return await adminFamilyService.getById(userId)
    },
    dependencies: [userId],
    enabled: !!userId,
  })
}


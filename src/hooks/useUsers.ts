import { useApiData } from './useApiData'
import { userService } from '@/services/api'

export type UsersQuery = {
  page?: number
  limit?: number
  search?: string
  role?: string
  subscription_status?: string
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

export function useUsers(params: UsersQuery) {
  return useApiData<any>({
    fetchFn: async () => {
      const res = await userService.getUsers(params)
      if (res.success && res.data) return res.data
      throw new Error('Error al cargar usuarios')
    },
    dependencies: [
      params.page,
      params.limit,
      params.search,
      params.role,
      params.subscription_status,
      params.sort_by,
      params.sort_order
    ]
  })
}

export function useUserById(userId: string) {
  return useApiData<any>({
    fetchFn: async () => {
      const res = await userService.getUserById(userId)
      if (res.success && res.data) return res.data
      throw new Error('Error al cargar usuario')
    },
    dependencies: [userId]
  })
}
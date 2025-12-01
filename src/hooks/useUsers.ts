import { useApiData } from './useApiData'
// TODO: Implementar servicio de usuarios cuando esté disponible

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
      // TODO: Implementar llamada a API
      throw new Error('Servicio de usuarios no implementado aún')
    },
    enabled: false, // Deshabilitado hasta que se implemente
  })
}

export function useUserById(userId: string) {
  return useApiData<any>({
    fetchFn: async () => {
      // TODO: Implementar llamada a API
      throw new Error('Servicio de usuario por ID no implementado aún')
    },
    dependencies: [userId],
    enabled: false, // Deshabilitado hasta que se implemente
  })
}


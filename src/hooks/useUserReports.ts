import { useApiData } from './useApiData'
// TODO: Implementar servicio de reportes de usuario cuando esté disponible

export function useUserReports(userId: string) {
  return useApiData<any>({
    fetchFn: async () => {
      // TODO: Implementar llamada a API
      throw new Error('Servicio de reportes de usuario no implementado aún')
    },
    dependencies: [userId],
    enabled: false, // Deshabilitado hasta que se implemente
  })
}

export function useUserReportsList(userId: string, params?: any) {
  return useApiData<any>({
    fetchFn: async () => {
      // TODO: Implementar llamada a API
      throw new Error('Servicio de lista de reportes no implementado aún')
    },
    dependencies: [userId, params],
    enabled: false, // Deshabilitado hasta que se implemente
  })
}


import { useApiData } from './useApiData'
// TODO: Implementar servicio de reportes cuando esté disponible

export type ReportsQuery = {
  page?: number
  limit?: number
  status?: string
  type?: string
  search?: string
}

export function useAdminReports(params: ReportsQuery) {
  return useApiData<any>({
    fetchFn: async () => {
      // TODO: Implementar llamada a API
      throw new Error('Servicio de reportes no implementado aún')
    },
    enabled: false, // Deshabilitado hasta que se implemente
  })
}

export function useAdminReportsSummary() {
  return useApiData<any>({
    fetchFn: async () => {
      // TODO: Implementar llamada a API
      throw new Error('Servicio de resumen de reportes no implementado aún')
    },
    enabled: false,
  })
}


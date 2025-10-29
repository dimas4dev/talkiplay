import { useApiData } from './useApiData'
import { adminReportsService } from '@/services/api'

export type ReportsQuery = {
  page?: number
  limit?: number
  status?: string
  subscription_type?: string
  search?: string
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

export function useAdminReports(params: ReportsQuery) {
  return useApiData<any>({
    fetchFn: async () => {
      const res = await adminReportsService.getReports(params)
      if (res.success && res.data) return res.data
      throw new Error('Error al cargar reportes')
    },
    dependencies: [JSON.stringify(params)]
  })
}

export function useAdminReportsSummary() {
  return useApiData<any>({
    fetchFn: async () => {
      const res = await adminReportsService.getReportsSummary()
      if (res.success && res.data) return res.data
      throw new Error('Error al cargar resumen de reportes')
    }
  })
}



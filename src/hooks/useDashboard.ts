import { useApiData } from './useApiData'
import { dashboardService } from '@/services/api'
import type { DashboardData } from '@/types/dashboard'

export function useDashboard() {
  return useApiData<DashboardData>({
    fetchFn: async () => {
      // Debug del estado del token antes de hacer la petición
      const response = await dashboardService.getStats()

      if (response.success && response.data) {
        return response.data
      } else {
        throw new Error('Error al cargar los datos del dashboard')
      }
    }
  })
}

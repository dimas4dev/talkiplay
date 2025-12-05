import { exportToCSV } from '@/components/ui/export-button'
import type { DashboardDataResponse } from './useDashboard'

export function useDashboardExport(data: DashboardDataResponse | null) {
  const exportDashboard = () => {
    if (!data) {
      console.warn('No hay datos para exportar')
      return
    }

    const exportData = [
      {
        'Métrica': 'Usuarios activos',
        'Valor': data.user_activity?.active_users || 0,
        'Período': 'Actual'
      },
      {
        'Métrica': 'Tasa de éxito de clicks',
        'Valor': data.click_success_rate?.success_rate || 0,
        'Período': 'Actual'
      },
      {
        'Métrica': 'Clicks promedio por familia',
        'Valor': data.averageClicksPerFamily?.average || 0,
        'Período': 'Actual'
      }
    ]

    exportToCSV(exportData, 'dashboard-metricas')
  }

  return { exportDashboard }
}

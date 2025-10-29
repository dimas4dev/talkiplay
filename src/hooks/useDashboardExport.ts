import { exportToCSV } from '@/components/ui/export-button'
import type { DashboardData } from '@/types/dashboard'

export function useDashboardExport(data: DashboardData | null) {
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
        'Métrica': 'Crecimiento de usuarios',
        'Valor': data.growth_rate?.new_subscriptions || 0,
        'Período': 'Último mes'
      },
      {
        'Métrica': 'Tasa de retención',
        'Valor': data.retention_rate?.average_retention || 0,
        'Período': 'Último mes'
      }
    ]

    exportToCSV(exportData, 'dashboard-metricas')
  }

  return { exportDashboard }
}

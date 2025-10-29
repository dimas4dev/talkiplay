import { exportToCSV } from '@/components/ui/export-button'
import type { AllMetricsData } from '@/types/metrics'

export function useMetricsExport(data: AllMetricsData | null) {
  const exportMetrics = () => {
    if (!data) {
      console.warn('No hay datos para exportar')
      return
    }

    const { clip_stats, clips_by_source, clips_by_month } = data

    const exportData = [
      // Resumen general
      {
        'Métrica': 'Total de clips guardados',
        'Valor': clip_stats.total_clips,
        'Período': 'Total'
      },
      {
        'Métrica': 'Total de usuarios',
        'Valor': clip_stats.total_users,
        'Período': 'Total'
      },
      {
        'Métrica': 'Clips por usuario promedio',
        'Valor': clip_stats.avg_clips_per_user,
        'Período': 'Total'
      },
      {
        'Métrica': 'Clips por usuario mediana',
        'Valor': clip_stats.median_clips_per_user,
        'Período': 'Total'
      },
      {
        'Métrica': 'Mínimo clips por usuario',
        'Valor': clip_stats.min_clips_per_user,
        'Período': 'Total'
      },
      {
        'Métrica': 'Máximo clips por usuario',
        'Valor': clip_stats.max_clips_per_user,
        'Período': 'Total'
      },
      // Clips por fuente
      ...clips_by_source.map(source => ({
        'Métrica': `Clips desde ${source.source_display_name}`,
        'Valor': source.total_clips,
        'Período': 'Total'
      })),
      // Datos mensuales
      ...clips_by_month.map(month => ({
        'Métrica': 'Clips guardados',
        'Valor': month.clips_saved,
        'Período': month.month_name
      }))
    ]

    exportToCSV(exportData, 'metricas-uso')
  }

  return { exportMetrics }
}

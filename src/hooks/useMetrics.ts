import { useApiData } from './useApiData'
import { metricsService } from '@/services/api'
import type { 
  AllMetricsData,
  ClipStatsData,
  ClipsBySourceData,
  ProFeaturesOverviewData,
  ProFeaturesLastMonthData,
  ClipsByMonthData,
  MetricsSummaryData
} from '@/types/metrics'

// Hook para obtener todas las métricas
export function useAllMetrics() {
  return useApiData<AllMetricsData>({
    fetchFn: async () => {
      const response = await metricsService.getAllMetrics()
      
      if (response.success && response.data) {
        return response.data
      } else {
        throw new Error('Error al cargar todas las métricas')
      }
    }
  })
}

// Hook para obtener estadísticas de clips
export function useClipStats() {
  return useApiData<ClipStatsData>({
    fetchFn: async () => {
      const response = await metricsService.getClipStats()
      
      if (response.success && response.data) {
        return response.data
      } else {
        throw new Error('Error al cargar las estadísticas de clips')
      }
    }
  })
}

// Hook para obtener clips por fuente
export function useClipsBySource() {
  return useApiData<ClipsBySourceData>({
    fetchFn: async () => {
      const response = await metricsService.getClipsBySource()
      
      if (response.success && response.data) {
        return response.data
      } else {
        throw new Error('Error al cargar los clips por fuente')
      }
    }
  })
}

// Hook para obtener resumen de características PRO
export function useProFeaturesOverview() {
  return useApiData<ProFeaturesOverviewData>({
    fetchFn: async () => {
      const response = await metricsService.getProFeaturesOverview()
      
      if (response.success && response.data) {
        return response.data
      } else {
        throw new Error('Error al cargar el resumen de características PRO')
      }
    }
  })
}

// Hook para obtener características PRO del último mes
export function useProFeaturesLastMonth() {
  return useApiData<ProFeaturesLastMonthData>({
    fetchFn: async () => {
      const response = await metricsService.getProFeaturesLastMonth()
      
      if (response.success && response.data) {
        return response.data
      } else {
        throw new Error('Error al cargar las características PRO del último mes')
      }
    }
  })
}

// Hook para obtener clips por mes
export function useClipsByMonth() {
  return useApiData<ClipsByMonthData>({
    fetchFn: async () => {
      const response = await metricsService.getClipsByMonth()
      
      if (response.success && response.data) {
        return response.data
      } else {
        throw new Error('Error al cargar los clips por mes')
      }
    }
  })
}

// Hook para obtener resumen de métricas
export function useMetricsSummary() {
  return useApiData<MetricsSummaryData>({
    fetchFn: async () => {
      const response = await metricsService.getMetricsSummary()
      
      if (response.success && response.data) {
        return response.data
      } else {
        throw new Error('Error al cargar el resumen de métricas')
      }
    }
  })
}

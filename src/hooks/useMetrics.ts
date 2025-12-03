import { useApiData } from './useApiData'
import { dashboardService } from '@/services/api'
import type { UsageMetricsResponse, MonthlyDataPoint, AgeGroupStat } from '@/types/api'

// Tipo mapeado a lo que realmente usa la UI de Métricas
export interface MetricsData {
  playdatesCreated: {
    average: number
    trendText: string
    monthlyData: Array<{ month: string; value: number }>
  }
  conversionTime: {
    averageDays: number
    description: string
  }
  clicksPerFamily: {
    average: number
    trendText: string
  }
  ageGroups: {
    stats: AgeGroupStat[]
    totalProfiles: number
  }
  clicksMonthly: {
    monthlyData: Array<{ month: string; value: number }>
    trendText: string
  }
}

function mapMonthlyData(data: MonthlyDataPoint[]) {
  return data.map((d) => ({
    month: d.month,
    value: d.value,
  }))
}

export function useAllMetrics() {
  return useApiData<MetricsData>({
    fetchFn: async () => {
      const apiData: UsageMetricsResponse = await dashboardService.getUsageMetrics()

      // Texto de tendencia para Playdates creados: "▲ +X vs ayer"
      const playdatesTrend = apiData.playdatesCreated.trend
      const playdatesSign = playdatesTrend.isUpward ? '▲ +' : '▼ '
      const playdatesTrendText = `${playdatesSign}${playdatesTrend.change} vs ayer`

      // Texto de tendencia para Clicks por familia: "▲ +X vs mes anterior"
      const clicksPerFamilyTrend = apiData.clicksPerFamily.trend
      const clicksPerFamilySign = clicksPerFamilyTrend.isUpward ? '▲ +' : '▼ '
      const clicksPerFamilyTrendText = `${clicksPerFamilySign}${clicksPerFamilyTrend.change} vs mes anterior`

      // Texto de tendencia para Clicks mensuales (por ahora no se muestra en UI, pero se deja preparado)
      const clicksMonthlyTrend = apiData.clicksMonthly.trend
      const clicksMonthlySign = clicksMonthlyTrend.isUpward ? '▲ +' : '▼ '
      const clicksMonthlyTrendText = `${clicksMonthlySign}${clicksMonthlyTrend.change} vs período anterior`

      return {
        playdatesCreated: {
          average: apiData.playdatesCreated.average,
          trendText: playdatesTrendText,
          monthlyData: mapMonthlyData(apiData.playdatesCreated.monthlyData),
        },
        conversionTime: {
          averageDays: apiData.conversionTime.averageDays,
          description: apiData.conversionTime.description,
        },
        clicksPerFamily: {
          average: apiData.clicksPerFamily.average,
          trendText: clicksPerFamilyTrendText,
        },
        ageGroups: {
          stats: apiData.ageGroups.stats,
          totalProfiles: apiData.ageGroups.totalProfiles,
        },
        clicksMonthly: {
          monthlyData: mapMonthlyData(apiData.clicksMonthly.monthlyData),
          trendText: clicksMonthlyTrendText,
        },
      }
    },
  })
}

export function useClipStats() {
  return useApiData<any>({
    fetchFn: async () => {
      // TODO: Implementar llamada a API
      throw new Error('Servicio de estadísticas de clips no implementado aún')
    },
    enabled: false,
  })
}

export function useClipsBySource() {
  return useApiData<any>({
    fetchFn: async () => {
      // TODO: Implementar llamada a API
      throw new Error('Servicio de clips por fuente no implementado aún')
    },
    enabled: false,
  })
}

export function useClipsByMonth() {
  return useApiData<any>({
    fetchFn: async () => {
      // TODO: Implementar llamada a API
      throw new Error('Servicio de clips por mes no implementado aún')
    },
    enabled: false,
  })
}

export function useMetricsSummary() {
  return useApiData<any>({
    fetchFn: async () => {
      // TODO: Implementar llamada a API
      throw new Error('Servicio de resumen de métricas no implementado aún')
    },
    enabled: false,
  })
}


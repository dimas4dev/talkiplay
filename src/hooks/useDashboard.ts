import { useApiData } from './useApiData'
import { dashboardService } from '@/services/api'
import type { DashboardAnalyticsResponse } from '@/types/api'
import type { LanguageStat } from '@/types/dashboard'

// Tipo específico para los datos del dashboard que realmente vienen del API
export interface DashboardDataResponse {
  user_activity: {
    active_users: number
  }
  click_success_rate: {
    success_rate: number
    trend: string
  }
  languages: {
    stats: LanguageStat[]
    trend: string
  }
  newUsers: {
    monthlyData: Array<{ month: string; value: number }>
    trendMessage: string
  }
  averageClicksPerFamily: {
    average: number
    trend: string
  }
  activeUsersTrend: string
}

// Función para mapear la respuesta del API a DashboardData
function mapDashboardResponse(apiData: DashboardAnalyticsResponse) {
  // Generar texto de tendencia para clickSuccessRate
  const clickSuccessTrend = apiData.clickSuccessRate.trend.isUpward
    ? `▲ +${apiData.clickSuccessRate.trend.percentageChange.toFixed(1)}% vs período anterior`
    : `▼ ${apiData.clickSuccessRate.trend.percentageChange.toFixed(1)}% vs período anterior`
  
  // Generar texto de tendencia para languages
  const languagesTrend = apiData.languages.trend.isUpward
    ? `▲ +${apiData.languages.trend.percentageChange.toFixed(1)}% vs período anterior`
    : `▼ ${apiData.languages.trend.percentageChange.toFixed(1)}% vs período anterior`
  
  // Generar texto de tendencia para averageClicksPerFamily
  const averageClicksTrend = apiData.averageClicksPerFamily.trend.isUpward
    ? `▲ +${apiData.averageClicksPerFamily.trend.change} vs período anterior`
    : `▼ ${apiData.averageClicksPerFamily.trend.change} vs período anterior`

  // Generar texto de tendencia para activeUsers
  const activeUsersTrend = apiData.activeUsers.trend.isUpward 
    ? `▲ +${apiData.activeUsers.trend.change} vs período anterior`
    : `▼ ${apiData.activeUsers.trend.change} vs período anterior`

  return {
    user_activity: {
      active_users: apiData.activeUsers.count,
    },
    click_success_rate: {
      success_rate: apiData.clickSuccessRate.percentage,
      trend: clickSuccessTrend,
    },
    languages: {
      stats: apiData.languages.stats,
      trend: languagesTrend,
    },
    newUsers: {
      monthlyData: apiData.newUsers.monthlyData.map(d => ({
        month: d.month,
        value: d.value,
      })),
      trendMessage: apiData.newUsers.trendMessage,
    },
    averageClicksPerFamily: {
      average: apiData.averageClicksPerFamily.average,
      trend: averageClicksTrend,
    },
    activeUsersTrend,
  }
}

export function useDashboard() {
  return useApiData<DashboardDataResponse>({
    fetchFn: async () => {
      const apiData = await dashboardService.getDashboard()
      return mapDashboardResponse(apiData)
    },
  })
}


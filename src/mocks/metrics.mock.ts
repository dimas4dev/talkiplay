import type { ApiResponse } from '@/types/api'
import type {
  AllMetricsData,
  ClipStatsData,
  ClipsBySourceData,
  ProFeaturesOverviewData,
  ProFeaturesLastMonthData,
  ClipsByMonthData,
  MetricsSummaryData,
} from '@/types/metrics'

export const mockMetrics = {
  getAllMetrics: (): Response => {
    const response: ApiResponse<AllMetricsData> = {
      success: true,
      message: 'Todas las métricas obtenidas exitosamente',
      data: {
        clip_stats: {
          avg_clips_per_user: 12.5,
          median_clips_per_user: 8,
          min_clips_per_user: 1,
          max_clips_per_user: 150,
          total_clips: 15000,
          total_users: 1200,
        },
        clips_by_source: [
          {
            source: 'youtube',
            source_display_name: 'YouTube',
            total_clips: 6000,
            percentage: 40,
          },
          {
            source: 'tiktok',
            source_display_name: 'TikTok',
            total_clips: 4500,
            percentage: 30,
          },
          {
            source: 'instagram',
            source_display_name: 'Instagram',
            total_clips: 3000,
            percentage: 20,
          },
          {
            source: 'other',
            source_display_name: 'Otros',
            total_clips: 1500,
            percentage: 10,
          },
        ],
        pro_feature_usage_overview: {
          total_users_with_pro_usage: 450,
          total_users: 1200,
          percentage_users_with_pro: 37.5,
          users_by_plan: [
            {
              plan_type: 'pro',
              total_users: 500,
              users_using_pro: 450,
              usage_percentage: 90,
            },
            {
              plan_type: 'premium',
              total_users: 650,
              users_using_pro: 0,
              usage_percentage: 0,
            },
            {
              plan_type: 'explorer',
              total_users: 50,
              users_using_pro: 0,
              usage_percentage: 0,
            },
          ],
        },
        pro_features_last_month: [
          {
            feature_type: 'export',
            feature_name: 'Exportar clips',
            total_usage: 2500,
            unique_users: 350,
            percentage: 35,
            avg_execution_time_ms: 1200,
            success_rate: 98.5,
          },
          {
            feature_type: 'batch',
            feature_name: 'Procesamiento por lotes',
            total_usage: 1800,
            unique_users: 280,
            percentage: 28,
            avg_execution_time_ms: 2500,
            success_rate: 97.2,
          },
          {
            feature_type: 'advanced',
            feature_name: 'Filtros avanzados',
            total_usage: 1200,
            unique_users: 200,
            percentage: 20,
            avg_execution_time_ms: 800,
            success_rate: 99.1,
          },
        ],
        clips_by_month: [
          {
            month: '2024-01',
            month_name: 'Enero',
            clips_saved: 1200,
            active_users: 1000,
            avg_size_mb: 5.2,
            total_storage_gb: 6.24,
            growth: 0,
            growth_percentage: 0,
          },
          {
            month: '2024-02',
            month_name: 'Febrero',
            clips_saved: 1350,
            active_users: 1100,
            avg_size_mb: 5.5,
            total_storage_gb: 7.43,
            growth: 150,
            growth_percentage: 12.5,
          },
          {
            month: '2024-03',
            month_name: 'Marzo',
            clips_saved: 1500,
            active_users: 1200,
            avg_size_mb: 5.8,
            total_storage_gb: 8.7,
            growth: 150,
            growth_percentage: 11.1,
          },
        ],
      },
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },

  getClipStats: (): Response => {
    const response: ApiResponse<ClipStatsData> = {
      success: true,
      message: 'Estadísticas de clips obtenidas exitosamente',
      data: {
        clip_stats: {
          avg_clips_per_user: 12.5,
          median_clips_per_user: 8,
          min_clips_per_user: 1,
          max_clips_per_user: 150,
          total_clips: 15000,
          total_users: 1200,
        },
      },
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },

  getClipsBySource: (): Response => {
    const response: ApiResponse<ClipsBySourceData> = {
      success: true,
      message: 'Clips por fuente obtenidos exitosamente',
      data: {
        clips_by_source: [
          {
            source: 'youtube',
            source_display_name: 'YouTube',
            total_clips: 6000,
            percentage: 40,
          },
          {
            source: 'tiktok',
            source_display_name: 'TikTok',
            total_clips: 4500,
            percentage: 30,
          },
          {
            source: 'instagram',
            source_display_name: 'Instagram',
            total_clips: 3000,
            percentage: 20,
          },
          {
            source: 'other',
            source_display_name: 'Otros',
            total_clips: 1500,
            percentage: 10,
          },
        ],
        total_sources: 4,
        total_clips: 15000,
      },
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },

  getProFeaturesOverview: (): Response => {
    const response: ApiResponse<ProFeaturesOverviewData> = {
      success: true,
      message: 'Resumen de características PRO obtenido exitosamente',
      data: {
        total_users_with_pro_usage: 450,
        total_users: 1200,
        percentage_users_with_pro: 37.5,
        users_by_plan: [
          {
            plan_type: 'pro',
            total_users: 500,
            users_using_pro: 450,
            usage_percentage: 90,
          },
          {
            plan_type: 'premium',
            total_users: 650,
            users_using_pro: 0,
            usage_percentage: 0,
          },
          {
            plan_type: 'explorer',
            total_users: 50,
            users_using_pro: 0,
            usage_percentage: 0,
          },
        ],
      },
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },

  getProFeaturesLastMonth: (): Response => {
    const response: ApiResponse<ProFeaturesLastMonthData> = {
      success: true,
      message: 'Características PRO del último mes obtenidas exitosamente',
      data: {
        pro_features: [
          {
            feature_type: 'export',
            feature_name: 'Exportar clips',
            total_usage: 2500,
            unique_users: 350,
            percentage: 35,
            avg_execution_time_ms: 1200,
            success_rate: 98.5,
          },
          {
            feature_type: 'batch',
            feature_name: 'Procesamiento por lotes',
            total_usage: 1800,
            unique_users: 280,
            percentage: 28,
            avg_execution_time_ms: 2500,
            success_rate: 97.2,
          },
        ],
        total_usage: 5500,
        total_features: 5,
        most_used_feature: {
          feature_type: 'export',
          feature_name: 'Exportar clips',
          total_usage: 2500,
          unique_users: 350,
          percentage: 35,
          avg_execution_time_ms: 1200,
          success_rate: 98.5,
        },
        period: 'Último mes',
      },
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },

  getClipsByMonth: (): Response => {
    const response: ApiResponse<ClipsByMonthData> = {
      success: true,
      message: 'Clips por mes obtenidos exitosamente',
      data: {
        clips_by_month: [
          {
            month: '2024-01',
            month_name: 'Enero',
            clips_saved: 1200,
            active_users: 1000,
            avg_size_mb: 5.2,
            total_storage_gb: 6.24,
            growth: 0,
            growth_percentage: 0,
          },
          {
            month: '2024-02',
            month_name: 'Febrero',
            clips_saved: 1350,
            active_users: 1100,
            avg_size_mb: 5.5,
            total_storage_gb: 7.43,
            growth: 150,
            growth_percentage: 12.5,
          },
        ],
        total_clips_period: 4050,
        avg_monthly_growth: 12.5,
        period: 'Últimos 3 meses',
      },
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },

  getMetricsSummary: (): Response => {
    const response: ApiResponse<MetricsSummaryData> = {
      success: true,
      message: 'Resumen de métricas obtenido exitosamente',
      data: {
        summary: {
          total_clips: 15000,
          total_users: 1200,
          avg_clips_per_user: 12.5,
          pro_users_percentage: 37.5,
          top_clip_source: {
            name: 'YouTube',
            percentage: 40,
          },
        },
      },
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },
}


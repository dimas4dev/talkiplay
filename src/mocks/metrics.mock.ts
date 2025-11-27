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
          avg_clips_per_user: 100, // Playdates creados en promedio
          median_clips_per_user: 85,
          min_clips_per_user: 1,
          max_clips_per_user: 500,
          total_clips: 3100, // Total playdates
          total_users: 31, // 31 Perfiles
        },
        clips_by_source: [
          {
            source: 'early_childhood',
            source_display_name: 'Primera infancia',
            total_clips: 1550, // ~50%
            percentage: 50,
          },
          {
            source: 'childhood',
            source_display_name: 'Infancia',
            total_clips: 775, // ~25%
            percentage: 25,
          },
          {
            source: 'adolescence',
            source_display_name: 'Adolescencia',
            total_clips: 775, // ~25%
            percentage: 25,
          },
        ],
        pro_feature_usage_overview: {
          total_users_with_pro_usage: 0,
          total_users: 31,
          percentage_users_with_pro: 0,
          users_by_plan: [],
        },
        pro_features_last_month: [],
        clips_by_month: [
          {
            month: '2024-08',
            month_name: 'Agosto',
            clips_saved: 200, // Playdates
            active_users: 31,
            avg_size_mb: 0,
            total_storage_gb: 0,
            growth: 0,
            growth_percentage: 0,
          },
          {
            month: '2024-04',
            month_name: 'Abril',
            clips_saved: 100,
            active_users: 31,
            avg_size_mb: 0,
            total_storage_gb: 0,
            growth: 0,
            growth_percentage: 0,
          },
          {
            month: '2024-03',
            month_name: 'Marzo',
            clips_saved: 80,
            active_users: 31,
            avg_size_mb: 0,
            total_storage_gb: 0,
            growth: 0,
            growth_percentage: 0,
          },
          {
            month: '2024-04',
            month_name: 'Abril',
            clips_saved: 90,
            active_users: 31,
            avg_size_mb: 0,
            total_storage_gb: 0,
            growth: 0,
            growth_percentage: 0,
          },
          {
            month: '2024-05',
            month_name: 'Mayo',
            clips_saved: 350,
            active_users: 31,
            avg_size_mb: 0,
            total_storage_gb: 0,
            growth: 0,
            growth_percentage: 0,
          },
          {
            month: '2024-06',
            month_name: 'Junio',
            clips_saved: 250,
            active_users: 31,
            avg_size_mb: 0,
            total_storage_gb: 0,
            growth: 0,
            growth_percentage: 0,
          },
          {
            month: '2024-07',
            month_name: 'Julio',
            clips_saved: 280,
            active_users: 31,
            avg_size_mb: 0,
            total_storage_gb: 0,
            growth: 0,
            growth_percentage: 0,
          },
          {
            month: '2024-08',
            month_name: 'Agosto',
            clips_saved: 200,
            active_users: 31,
            avg_size_mb: 0,
            total_storage_gb: 0,
            growth: 0,
            growth_percentage: 0,
          },
          {
            month: '2024-09',
            month_name: 'Septiembre',
            clips_saved: 180,
            active_users: 31,
            avg_size_mb: 0,
            total_storage_gb: 0,
            growth: 0,
            growth_percentage: 0,
          },
          {
            month: '2024-04',
            month_name: 'Abril',
            clips_saved: 120,
            active_users: 31,
            avg_size_mb: 0,
            total_storage_gb: 0,
            growth: 0,
            growth_percentage: 0,
          },
          {
            month: '2024-11',
            month_name: 'Noviembre',
            clips_saved: 150,
            active_users: 31,
            avg_size_mb: 0,
            total_storage_gb: 0,
            growth: 0,
            growth_percentage: 0,
          },
          {
            month: '2024-12',
            month_name: 'Diciembre',
            clips_saved: 300,
            active_users: 31,
            avg_size_mb: 0,
            total_storage_gb: 0,
            growth: 0,
            growth_percentage: 0,
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


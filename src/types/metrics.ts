// Tipos para Metrics
export interface ClipStats {
  avg_clips_per_user: number
  median_clips_per_user: number
  min_clips_per_user: number
  max_clips_per_user: number
  total_clips: number
  total_users: number
}

export interface ClipSource {
  source: string
  source_display_name: string
  total_clips: number
  percentage: number
}

export interface ProFeatureUsage {
  feature_type: string
  feature_name: string
  total_usage: number
  unique_users: number
  percentage: number
  avg_execution_time_ms: number
  success_rate: number
}

export interface ProFeatureOverview {
  total_users_with_pro_usage: number
  total_users: number
  percentage_users_with_pro: number
  users_by_plan: {
    plan_type: 'pro' | 'premium' | 'explorer'
    total_users: number
    users_using_pro: number
    usage_percentage: number
  }[]
}

export interface MonthlyClipData {
  month: string
  month_name: string
  clips_saved: number
  active_users: number
  avg_size_mb: number
  total_storage_gb: number
  growth: number
  growth_percentage: number
}

export interface MetricsSummary {
  total_clips: number
  total_users: number
  avg_clips_per_user: number
  pro_users_percentage: number
  top_clip_source: {
    name: string
    percentage: number
  }
}

export interface AllMetricsData {
  clip_stats: ClipStats
  clips_by_source: ClipSource[]
  pro_feature_usage_overview: ProFeatureOverview
  pro_features_last_month: ProFeatureUsage[]
  clips_by_month: MonthlyClipData[]
}

export interface ClipStatsData {
  clip_stats: ClipStats
}

export interface ClipsBySourceData {
  clips_by_source: ClipSource[]
  total_sources: number
  total_clips: number
}

export interface ProFeaturesOverviewData {
  total_users_with_pro_usage: number
  total_users: number
  percentage_users_with_pro: number
  users_by_plan: {
    plan_type: 'pro' | 'premium' | 'explorer'
    total_users: number
    users_using_pro: number
    usage_percentage: number
  }[]
}

export interface ProFeaturesLastMonthData {
  pro_features: ProFeatureUsage[]
  total_usage: number
  total_features: number
  most_used_feature: ProFeatureUsage
  period: string
}

export interface ClipsByMonthData {
  clips_by_month: MonthlyClipData[]
  total_clips_period: number
  avg_monthly_growth: number
  period: string
}

export interface MetricsSummaryData {
  summary: MetricsSummary
}

export interface SubscriptionOverviewData {
  overview: {
    total_subscriptions: number
    active: number
    trial: number
    suspended: number
  }
  trial_summary: {
    total: number
    potential_revenue: number
  }
  suspended_summary: {
    total: number
    cancelled: number
    payment_errors: number
    expired: number
  }
  renewals_summary: {
    total_renewals: number
    premium_renewals: number
    pro_renewals: number
    scheduled: number
  }
}

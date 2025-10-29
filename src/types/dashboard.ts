// Tipos para el dashboard
export interface UserActivity {
  active_users: number
  inactive_users: number
  active_percentage: number
  inactive_percentage: number
}

export interface FailedPayment {
  id: string
  user_id: string
  amount: number
  failure_reason: string
  payment_date: string
  user_email: string
}

export interface ExpiringSubscription {
  id: string
  user_id: string
  plan_name: string
  end_date: string
  user_email: string
}

export interface SubscriptionDistribution {
  explorer: number
  premium: number
  pro: number
  total_subscriptions: number
}

export interface GrowthRate {
  renewal_rate: number
  new_subscriptions: number
  churn_rate: number
}

export interface RetentionRate {
  month_1: number
  month_2: number
  month_3: number
  month_4: number
  month_5: number
  month_6: number
  average_retention: number
}

export interface DashboardData {
  user_activity: UserActivity
  failed_payments_24h: FailedPayment[]
  expiring_subscriptions_7d: ExpiringSubscription[]
  subscription_distribution: SubscriptionDistribution
  growth_rate: GrowthRate
  retention_rate: RetentionRate
}

export interface RevenueStats {
  net_amount: number
  october_projection: number
  annual_revenue: number
}

export interface PaymentMethod {
  name: string
  value: number
  color: string
}

export interface RevenueSeries {
  month: string
  premium: number
  pro: number
}

export interface RevenuePeriod {
  period: string
  premium: number
  pro: number
  total: string
}

export interface RevenueCharge {
  id: string
  user_name: string
  payment_method: string
  amount: string
  plan: 'Premium' | 'Pro'
  date: string
}

export interface RevenueData {
  stats: RevenueStats
  payment_methods: PaymentMethod[]
  series: RevenueSeries[]
  periods: RevenuePeriod[]
}

export interface RevenuePeriodDetail {
  period: string
  premium: number
  pro: number
  total: string
  charges: RevenueCharge[]
}

// Tipos para Settings
export type SectionType = 'terms_and_conditions' | 'privacy_policy'

export interface Section {
  id: string
  section_type: SectionType
  title: string
  description: string
  order_index: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface SectionCreateRequest {
  title: string
  description: string
  section_type: SectionType
}

export interface SectionUpdateRequest {
  title?: string
  description?: string
  is_active?: boolean
}

export interface SettingsData {
  terms_and_conditions: Section[]
  privacy_policy: Section[]
}

// Tipos para Memberships/Subscriptions
export interface SubscriptionUser {
  id: string
  email: string
  name: string
}

export interface SubscriptionPlan {
  id: string
  name: string
  type: 'explorer' | 'premium' | 'pro'
  price: string
}

export interface SubscriptionDates {
  start_date: string
  end_date: string
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  user: SubscriptionUser
  plan: SubscriptionPlan
  status: 'trial' | 'active' | 'suspended' | 'expired' | 'payment_error' | 'cancelled'
  status_label: string
  dates: SubscriptionDates
  auto_renew: boolean
  payment_method: string
  days_remaining: number
}

export interface SubscriptionTotals {
  total_subscriptions?: number
  active_count?: number
  suspended_count?: number
  trial_count?: number
  total_trial?: number
  total_suspended?: number
  total_cancelled?: number
  total_payment_errors?: number
  total_expired?: number
  total_all?: number
  total_renewals?: number
  premium_renewals_count?: number
  pro_renewals_count?: number
  scheduled_renewals_count?: number
}

export interface SubscriptionSummary {
  active_percentage?: number
  suspended_percentage?: number
  trial_percentage?: number
  cancelled_percentage?: number
  payment_errors_percentage?: number
  expired_percentage?: number
  premium_renewal_percentage?: number
  pro_renewal_percentage?: number
  scheduled_revenue?: string
}

export interface SubscriptionCategorized {
  active?: Subscription[]
  suspended?: Subscription[]
  trial?: Subscription[]
  cancelled?: Subscription[]
  payment_errors?: Subscription[]
  expired?: Subscription[]
  premium_renewals?: Subscription[]
  pro_renewals?: Subscription[]
  scheduled_renewals?: Subscription[]
}

export interface AllSubscriptionsData {
  all_subscriptions: Subscription[]
  categorized: SubscriptionCategorized
  totals: SubscriptionTotals
  summary: SubscriptionSummary
}

export interface TrialSubscriptionsData {
  trial_subscriptions: Subscription[]
  totals: {
    total_trial: number
    potential_premium_revenue: string
    potential_pro_revenue: string
    total_potential_revenue: string
  }
  breakdown: {
    premium_trials: number
    pro_trials: number
    explorer_trials: number
  }
}

export interface SuspendedSubscriptionsData {
  suspended_subscriptions: Subscription[]
  categorized: SubscriptionCategorized
  totals: SubscriptionTotals
  summary: SubscriptionSummary
}

export interface RenewalSubscriptionsData {
  renewed_subscriptions: Subscription[]
  categorized: SubscriptionCategorized
  totals: SubscriptionTotals
  summary: SubscriptionSummary
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

// Tipos para Reports/User
export interface UserReport {
  id: string
  date: string
  title: string
  author: string
  email: string
  body: string
  status: 'pending' | 'reviewed' | 'resolved'
  created_at: string
  updated_at: string
}

export interface UserHeader {
  id: number
  name: string
  email: string
  userId: string
  subscription: 'Explorador' | 'Premium' | 'Pro'
  status: 'Activo' | 'Bloqueado' | 'Inactivo'
  registrationDate: string
  reports: number
}

export interface UserReportsData {
  user: UserHeader
  reports: UserReport[]
}


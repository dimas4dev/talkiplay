// Tipos para la sección de Revenues/Income

export interface MonthlySubscriptionData {
  month: string
  month_name: string
  active_subscriptions: number
  premium_subscriptions: number
  pro_subscriptions: number
  growth: number
  growth_percentage: string
}

export interface ActiveSubscriptionsData {
  monthly_data: MonthlySubscriptionData[]
  totals: {
    total_active_subscriptions: number
    growth_rate: string
    premium_count: number
    pro_count: number
  }
}

export interface PaymentMethod {
  method: string
  method_name: string
  revenue: string
  transactions: number
  percentage: string
}

export interface PaymentMethodsData {
  payment_methods: PaymentMethod[]
  totals: {
    total_revenue: string
    total_transactions: number
  }
  summary: {
    average_transaction_value: string
    most_popular_method: string
  }
}

export interface RevenueBreakdown {
  gross_revenue: string
  refunds: string
  failed_payments: string
  net_revenue: string
}

export interface NetAmountData {
  revenue_breakdown: RevenueBreakdown
  metrics: {
    refund_rate: string
    success_rate: string
    period: string
  }
}

export interface ScheduledRenewal {
  subscription_id: string
  user_email: string
  plan_type: 'premium' | 'pro'
  plan_price: string
  renewal_date: string
  payment_method: string
}

export interface CurrentMonthProjectionData {
  current_month: string
  scheduled_renewals: ScheduledRenewal[]
  projection: {
    projected_revenue: string
    premium_renewals: number
    pro_renewals: number
    total_scheduled: number
    days_remaining: number
  }
}

export interface MonthlyRevenue {
  month: string
  month_name: string
  revenue: string
  transactions: number
  growth: string
  growth_percentage: string
}

export interface AnnualRevenueData {
  year: number
  monthly_revenue: MonthlyRevenue[]
  totals: {
    total_annual_revenue: string
    average_monthly_revenue: string
    growth_rate: string
    best_month: string
    worst_month: string
  }
}

export interface Period {
  period: string
  month: string
  year: number
  premium_subscriptions: number
  pro_subscriptions: number
  total_subscriptions: number
  revenue: string
}

export interface PeriodsData {
  periods: Period[]
  totals: {
    total_periods: number
    total_premium_subscriptions: number
    total_pro_subscriptions: number
    total_revenue: string
  }
}

export interface Payment {
  payment_id: string
  user_email: string
  plan_type: 'premium' | 'pro'
  amount: string
  payment_method: string
  payment_date: string
  status: 'success' | 'failed' | 'pending'
  transaction_id: string
}

export interface PeriodDetailData {
  period: string
  month: string
  year: number
  payments: Payment[]
  totals: {
    premium_total: string
    pro_total: string
    total_revenue: string
    total_transactions: number
  }
  breakdown?: {
    premium_transactions: number
    pro_transactions: number
    refunded_transactions: number
    average_transaction_value: string
  }
}

export interface RevenueSummaryData {
  active_subscriptions_summary: {
    total_active: number
    growth_rate: string
  }
  payment_methods_summary: {
    total_revenue: string
    most_popular_method: string
  }
  net_amount_summary: {
    net_revenue: string
    success_rate: string
  }
  current_month_summary: {
    projected_revenue: string
    scheduled_renewals: number
  }
  annual_summary: {
    total_annual_revenue: string
    growth_rate: string
  }
}

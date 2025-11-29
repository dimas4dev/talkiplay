import type { ApiResponse } from '@/types/api'
import type { RevenueData, RevenuePeriodDetail } from '@/types/dashboard'
import type {
  ActiveSubscriptionsData,
  PaymentMethodsData,
  NetAmountData,
  CurrentMonthProjectionData,
  AnnualRevenueData,
  PeriodsData,
  PeriodDetailData,
  RevenueSummaryData,
} from '@/types/revenues'
import { getRevenueDetail } from './revenues'

export const mockRevenues = {
  getRevenues: (): Response => {
    const response: ApiResponse<RevenueData> = {
      success: true,
      message: 'Datos de ingresos obtenidos exitosamente',
      data: {
        stats: {
          net_amount: 125000.50,
          october_projection: 15000.00,
          annual_revenue: 1500000.00,
        },
        payment_methods: [
          { name: 'GPay', value: 45, color: '#006874' },
          { name: 'Apple Pay', value: 30, color: '#82D3E0' },
          { name: 'Stripe', value: 25, color: '#9EEFFD' },
        ],
        series: [
          { month: 'Jan', premium: 12, pro: 8 },
          { month: 'Feb', premium: 18, pro: 12 },
          { month: 'Mar', premium: 30, pro: 25 },
          { month: 'Abr', premium: 20, pro: 25 },
          { month: 'May', premium: 12, pro: 8 },
        ],
        periods: [
          { period: 'Feb 2025', premium: 66, pro: 0, total: '3,647.11 €' },
          { period: 'Mar 2025', premium: 43, pro: 0, total: '2,588.44 €' },
          { period: 'Abr 2025', premium: 49, pro: 0, total: '8,944.65 €' },
        ],
      },
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },

  getRevenueByPeriod: (period: string): Response => {
    const detail = getRevenueDetail(period)
    const response: ApiResponse<RevenuePeriodDetail> = {
      success: true,
      message: 'Detalles del período obtenidos exitosamente',
      data: {
        period: detail.period,
        premium: detail.premium,
        pro: detail.pro,
        total: detail.total,
        charges: detail.charges.map((charge, index) => ({
          id: `charge_${index + 1}`,
          user_name: charge.name,
          payment_method: charge.method,
          amount: charge.amount,
          plan: charge.plan,
          date: new Date().toISOString(),
        })),
      },
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },

  getRevenueStats: (): Response => {
    const response: ApiResponse = {
      success: true,
      message: 'Estadísticas de ingresos obtenidas exitosamente',
      data: {
        net_amount: 125000.50,
        october_projection: 15000.00,
        annual_revenue: 1500000.00,
      },
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },

  getPaymentMethods: (): Response => {
    const response: ApiResponse = {
      success: true,
      message: 'Métodos de pago obtenidos exitosamente',
      data: [
        { name: 'GPay', value: 45, color: '#006874' },
        { name: 'Apple Pay', value: 30, color: '#82D3E0' },
        { name: 'Stripe', value: 25, color: '#9EEFFD' },
      ],
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },

  getActiveSubscriptions: (): Response => {
    const response: ApiResponse<ActiveSubscriptionsData> = {
      success: true,
      message: 'Suscripciones activas obtenidas exitosamente',
      data: {
        monthly_data: [
          {
            month: '2024-01',
            month_name: 'Enero',
            active_subscriptions: 1200,
            premium_subscriptions: 650,
            pro_subscriptions: 550,
            growth: 50,
            growth_percentage: '4.3%',
          },
          {
            month: '2024-02',
            month_name: 'Febrero',
            active_subscriptions: 1250,
            premium_subscriptions: 680,
            pro_subscriptions: 570,
            growth: 50,
            growth_percentage: '4.2%',
          },
        ],
        totals: {
          total_active_subscriptions: 1250,
          growth_rate: '4.2%',
          premium_count: 680,
          pro_count: 570,
        },
      },
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },

  getPaymentMethodsDetailed: (): Response => {
    const response: ApiResponse<PaymentMethodsData> = {
      success: true,
      message: 'Métodos de pago detallados obtenidos exitosamente',
      data: {
        payment_methods: [
          {
            method: 'gpay',
            method_name: 'Google Pay',
            revenue: '45,250.00 €',
            transactions: 1250,
            percentage: '45%',
          },
          {
            method: 'apple_pay',
            method_name: 'Apple Pay',
            revenue: '30,150.00 €',
            transactions: 850,
            percentage: '30%',
          },
          {
            method: 'stripe',
            method_name: 'Stripe',
            revenue: '25,100.00 €',
            transactions: 700,
            percentage: '25%',
          },
        ],
        totals: {
          total_revenue: '100,500.00 €',
          total_transactions: 2800,
        },
        summary: {
          average_transaction_value: '35.89 €',
          most_popular_method: 'Google Pay',
        },
      },
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },

  getNetAmount: (): Response => {
    const response: ApiResponse<NetAmountData> = {
      success: true,
      message: 'Importe neto obtenido exitosamente',
      data: {
        revenue_breakdown: {
          gross_revenue: '125,000.00 €',
          refunds: '2,500.00 €',
          failed_payments: '1,200.00 €',
          net_revenue: '121,300.00 €',
        },
        metrics: {
          refund_rate: '2.0%',
          success_rate: '98.0%',
          period: 'Últimos 30 días',
        },
      },
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },

  getCurrentMonthProjection: (): Response => {
    const response: ApiResponse<CurrentMonthProjectionData> = {
      success: true,
      message: 'Proyección del mes actual obtenida exitosamente',
      data: {
        current_month: 'Octubre 2024',
        scheduled_renewals: [
          {
            subscription_id: 'sub_1',
            user_email: 'usuario1@example.com',
            plan_type: 'premium',
            plan_price: '9.99 €',
            renewal_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            payment_method: 'Google Pay',
          },
          {
            subscription_id: 'sub_2',
            user_email: 'usuario2@example.com',
            plan_type: 'pro',
            plan_price: '19.99 €',
            renewal_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
            payment_method: 'Apple Pay',
          },
        ],
        projection: {
          projected_revenue: '15,000.00 €',
          premium_renewals: 120,
          pro_renewals: 80,
          total_scheduled: 200,
          days_remaining: 15,
        },
      },
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },

  getAnnualRevenue: (): Response => {
    const response: ApiResponse<AnnualRevenueData> = {
      success: true,
      message: 'Ingresos anuales obtenidos exitosamente',
      data: {
        year: 2024,
        monthly_revenue: [
          {
            month: '2024-01',
            month_name: 'Enero',
            revenue: '120,000.00 €',
            transactions: 3500,
            growth: '5,000.00 €',
            growth_percentage: '4.3%',
          },
          {
            month: '2024-02',
            month_name: 'Febrero',
            revenue: '125,000.00 €',
            transactions: 3650,
            growth: '5,000.00 €',
            growth_percentage: '4.2%',
          },
        ],
        totals: {
          total_annual_revenue: '1,500,000.00 €',
          average_monthly_revenue: '125,000.00 €',
          growth_rate: '12.5%',
          best_month: 'Diciembre',
          worst_month: 'Enero',
        },
      },
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },

  getPeriods: (): Response => {
    const response: ApiResponse<PeriodsData> = {
      success: true,
      message: 'Períodos obtenidos exitosamente',
      data: {
        periods: [
          {
            period: '2024-01',
            month: 'Enero',
            year: 2024,
            premium_subscriptions: 650,
            pro_subscriptions: 550,
            total_subscriptions: 1200,
            revenue: '120,000.00 €',
          },
          {
            period: '2024-02',
            month: 'Febrero',
            year: 2024,
            premium_subscriptions: 680,
            pro_subscriptions: 570,
            total_subscriptions: 1250,
            revenue: '125,000.00 €',
          },
        ],
        totals: {
          total_periods: 12,
          total_premium_subscriptions: 7800,
          total_pro_subscriptions: 6600,
          total_revenue: '1,500,000.00 €',
        },
      },
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },

  getPeriodDetails: (year: number, month: number): Response => {
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    const response: ApiResponse<PeriodDetailData> = {
      success: true,
      message: 'Detalles del período obtenidos exitosamente',
      data: {
        period: `${year}-${String(month).padStart(2, '0')}`,
        month: monthNames[month - 1],
        year,
        payments: [
          {
            payment_id: 'pay_1',
            user_email: 'usuario1@example.com',
            plan_type: 'premium',
            amount: '9.99 €',
            payment_method: 'Google Pay',
            payment_date: new Date(year, month - 1, 1).toISOString(),
            status: 'success',
            transaction_id: 'txn_1',
          },
          {
            payment_id: 'pay_2',
            user_email: 'usuario2@example.com',
            plan_type: 'pro',
            amount: '19.99 €',
            payment_method: 'Apple Pay',
            payment_date: new Date(year, month - 1, 5).toISOString(),
            status: 'success',
            transaction_id: 'txn_2',
          },
        ],
        totals: {
          premium_total: '6,500.00 €',
          pro_total: '11,400.00 €',
          total_revenue: '17,900.00 €',
          total_transactions: 200,
        },
        breakdown: {
          premium_transactions: 120,
          pro_transactions: 80,
          refunded_transactions: 2,
          average_transaction_value: '89.50 €',
        },
      },
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },

  getRevenueSummary: (): Response => {
    const response: ApiResponse<RevenueSummaryData> = {
      success: true,
      message: 'Resumen de ingresos obtenido exitosamente',
      data: {
        active_subscriptions_summary: {
          total_active: 1250,
          growth_rate: '4.2%',
        },
        payment_methods_summary: {
          total_revenue: '100,500.00 €',
          most_popular_method: 'Google Pay',
        },
        net_amount_summary: {
          net_revenue: '121,300.00 €',
          success_rate: '98.0%',
        },
        current_month_summary: {
          projected_revenue: '15,000.00 €',
          scheduled_renewals: 200,
        },
        annual_summary: {
          total_annual_revenue: '1,500,000.00 €',
          growth_rate: '12.5%',
        },
      },
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },
}


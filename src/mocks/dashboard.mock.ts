import type { ApiResponse } from '@/types/api'
import type { DashboardData } from '@/types/dashboard'

const MOCK_DASHBOARD_DATA: DashboardData = {
  user_activity: {
    active_users: 1250,
    inactive_users: 350,
    active_percentage: 78.1,
    inactive_percentage: 21.9,
  },
  failed_payments_24h: [
    {
      id: '1',
      user_id: 'user_1',
      amount: 9.99,
      failure_reason: 'Tarjeta rechazada',
      payment_date: new Date().toISOString(),
      user_email: 'usuario1@example.com',
    },
    {
      id: '2',
      user_id: 'user_2',
      amount: 19.99,
      failure_reason: 'Fondos insuficientes',
      payment_date: new Date(Date.now() - 3600000).toISOString(),
      user_email: 'usuario2@example.com',
    },
  ],
  expiring_subscriptions_7d: [
    {
      id: '1',
      user_id: 'user_3',
      plan_name: 'Premium',
      end_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      user_email: 'usuario3@example.com',
    },
    {
      id: '2',
      user_id: 'user_4',
      plan_name: 'Pro',
      end_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      user_email: 'usuario4@example.com',
    },
  ],
  subscription_distribution: {
    explorer: 450,
    premium: 650,
    pro: 500,
    total_subscriptions: 1600,
  },
  growth_rate: {
    renewal_rate: 85.5,
    new_subscriptions: 120,
    churn_rate: 5.2,
  },
  retention_rate: {
    month_1: 92.5,
    month_2: 88.3,
    month_3: 85.1,
    month_4: 82.7,
    month_5: 80.2,
    month_6: 78.9,
    average_retention: 84.6,
  },
  click_success_rate: {
    success_rate: 76,
    trend: '+5.2% vs mes pasado',
  },
  languages: {
    stats: [
      { language: 'Español', count: 60, percentage: 60 },
      { language: 'Inglés', count: 25, percentage: 25 },
      { language: 'Alemán', count: 15, percentage: 15 },
    ],
    trend: '+5.2% vs mes pasado',
    spanish: 60,
    english: 25,
    german: 15,
  },
}

export const mockDashboard = {
  getStats: (): Response => {
    const response: ApiResponse<DashboardData> = {
      success: true,
      message: 'Estadísticas obtenidas exitosamente',
      data: MOCK_DASHBOARD_DATA,
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },

  getActiveUsers: (): Response => {
    const response: ApiResponse = {
      success: true,
      message: 'Usuarios activos obtenidos exitosamente',
      data: {
        active_users: MOCK_DASHBOARD_DATA.user_activity.active_users,
        data: [
          { date: '2024-01', users: 1100 },
          { date: '2024-02', users: 1150 },
          { date: '2024-03', users: 1200 },
          { date: '2024-04', users: 1250 },
        ],
      },
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },

  getSubscriptions: (): Response => {
    const response: ApiResponse = {
      success: true,
      message: 'Suscripciones obtenidas exitosamente',
      data: {
        distribution: MOCK_DASHBOARD_DATA.subscription_distribution,
        growth: MOCK_DASHBOARD_DATA.growth_rate,
      },
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },

  getRetentionRate: (): Response => {
    const response: ApiResponse = {
      success: true,
      message: 'Tasa de retención obtenida exitosamente',
      data: MOCK_DASHBOARD_DATA.retention_rate,
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },

  getUserGrowth: (): Response => {
    const response: ApiResponse = {
      success: true,
      message: 'Crecimiento de usuarios obtenido exitosamente',
      data: {
        growth_rate: MOCK_DASHBOARD_DATA.growth_rate,
        monthly_data: [
          { month: '2024-01', new_users: 100, total_users: 1100 },
          { month: '2024-02', new_users: 120, total_users: 1150 },
          { month: '2024-03', new_users: 110, total_users: 1200 },
          { month: '2024-04', new_users: 130, total_users: 1250 },
        ],
      },
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },
}


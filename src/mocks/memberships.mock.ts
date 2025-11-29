import type { ApiResponse } from '@/types/api'
import type { Subscription, AllSubscriptionsData, TrialSubscriptionsData, SuspendedSubscriptionsData, RenewalSubscriptionsData } from '@/types/dashboard'

// Datos mock de suscripciones
const MOCK_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub_1',
    user: {
      id: 'user_1',
      email: 'usuario1@example.com',
      name: 'María García',
    },
    plan: {
      id: 'plan_premium',
      name: 'Premium',
      type: 'premium',
      price: '9.99 €',
    },
    status: 'active',
    status_label: 'Activa',
    dates: {
      start_date: '2024-01-15T10:00:00Z',
      end_date: '2024-11-15T10:00:00Z',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
    },
    auto_renew: true,
    payment_method: 'Google Pay',
    days_remaining: 15,
  },
  {
    id: 'sub_2',
    user: {
      id: 'user_2',
      email: 'usuario2@example.com',
      name: 'Juan Pérez',
    },
    plan: {
      id: 'plan_pro',
      name: 'Pro',
      type: 'pro',
      price: '19.99 €',
    },
    status: 'active',
    status_label: 'Activa',
    dates: {
      start_date: '2024-02-20T14:30:00Z',
      end_date: '2024-12-20T14:30:00Z',
      created_at: '2024-02-20T14:30:00Z',
      updated_at: '2024-02-20T14:30:00Z',
    },
    auto_renew: true,
    payment_method: 'Apple Pay',
    days_remaining: 60,
  },
  {
    id: 'sub_3',
    user: {
      id: 'user_3',
      email: 'usuario3@example.com',
      name: 'Ana López',
    },
    plan: {
      id: 'plan_explorer',
      name: 'Explorer',
      type: 'explorer',
      price: '0.00 €',
    },
    status: 'trial',
    status_label: 'En prueba',
    dates: {
      start_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      end_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    auto_renew: false,
    payment_method: 'N/A',
    days_remaining: 2,
  },
  {
    id: 'sub_4',
    user: {
      id: 'user_4',
      email: 'usuario4@example.com',
      name: 'Carlos Ruiz',
    },
    plan: {
      id: 'plan_premium',
      name: 'Premium',
      type: 'premium',
      price: '9.99 €',
    },
    status: 'suspended',
    status_label: 'Suspendida',
    dates: {
      start_date: '2024-03-10T09:15:00Z',
      end_date: '2024-11-10T09:15:00Z',
      created_at: '2024-03-10T09:15:00Z',
      updated_at: '2024-09-10T09:15:00Z',
    },
    auto_renew: false,
    payment_method: 'Stripe',
    days_remaining: 0,
  },
]

export const mockMemberships = {
  getAllSubscriptions: (): Response => {
    const response: ApiResponse<AllSubscriptionsData> = {
      success: true,
      message: 'Todas las suscripciones obtenidas exitosamente',
      data: {
        all_subscriptions: MOCK_SUBSCRIPTIONS,
        categorized: {
          active: MOCK_SUBSCRIPTIONS.filter((s) => s.status === 'active'),
          trial: MOCK_SUBSCRIPTIONS.filter((s) => s.status === 'trial'),
          suspended: MOCK_SUBSCRIPTIONS.filter((s) => s.status === 'suspended'),
        },
        totals: {
          total_subscriptions: MOCK_SUBSCRIPTIONS.length,
          active_count: MOCK_SUBSCRIPTIONS.filter((s) => s.status === 'active').length,
          trial_count: MOCK_SUBSCRIPTIONS.filter((s) => s.status === 'trial').length,
          suspended_count: MOCK_SUBSCRIPTIONS.filter((s) => s.status === 'suspended').length,
        },
        summary: {
          active_percentage: 50,
          trial_percentage: 25,
          suspended_percentage: 25,
        },
      },
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },

  getTrialSubscriptions: (): Response => {
    const trialSubs = MOCK_SUBSCRIPTIONS.filter((s) => s.status === 'trial')
    const response: ApiResponse<TrialSubscriptionsData> = {
      success: true,
      message: 'Suscripciones en prueba obtenidas exitosamente',
      data: {
        trial_subscriptions: trialSubs,
        totals: {
          total_trial: trialSubs.length,
          potential_premium_revenue: '9.99 €',
          potential_pro_revenue: '19.99 €',
          total_potential_revenue: '29.98 €',
        },
        breakdown: {
          premium_trials: 0,
          pro_trials: 0,
          explorer_trials: trialSubs.length,
        },
      },
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },

  getSuspendedSubscriptions: (): Response => {
    const suspendedSubs = MOCK_SUBSCRIPTIONS.filter((s) => s.status === 'suspended')
    const response: ApiResponse<SuspendedSubscriptionsData> = {
      success: true,
      message: 'Suscripciones suspendidas obtenidas exitosamente',
      data: {
        suspended_subscriptions: suspendedSubs,
        categorized: {
          suspended: suspendedSubs,
        },
        totals: {
          total_suspended: suspendedSubs.length,
        },
        summary: {
          suspended_percentage: 25,
        },
      },
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },

  getSubscriptionRenewals: (): Response => {
    const renewals = MOCK_SUBSCRIPTIONS.filter((s) => s.auto_renew && s.status === 'active')
    const response: ApiResponse<RenewalSubscriptionsData> = {
      success: true,
      message: 'Renovaciones de suscripciones obtenidas exitosamente',
      data: {
        renewed_subscriptions: renewals,
        categorized: {
          active: renewals,
        },
        totals: {
          total_renewals: renewals.length,
        },
        summary: {
          scheduled_revenue: '29.98 €',
        },
      },
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },

  getSubscriptionSummary: (): Response => {
    const response: ApiResponse = {
      success: true,
      message: 'Resumen de suscripciones obtenido exitosamente',
      data: {
        overview: {
          total_subscriptions: MOCK_SUBSCRIPTIONS.length,
          active: MOCK_SUBSCRIPTIONS.filter((s) => s.status === 'active').length,
          trial: MOCK_SUBSCRIPTIONS.filter((s) => s.status === 'trial').length,
          suspended: MOCK_SUBSCRIPTIONS.filter((s) => s.status === 'suspended').length,
        },
      },
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },

  getSubscriptionById: (id: string): Response => {
    const subscription = MOCK_SUBSCRIPTIONS.find((s) => s.id === id)
    if (!subscription) {
      const errorResponse: ApiResponse = {
        success: false,
        message: 'Suscripción no encontrada',
        errors: ['La suscripción con el ID proporcionado no existe'],
      }
      return new Response(JSON.stringify(errorResponse), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const response: ApiResponse<Subscription> = {
      success: true,
      message: 'Suscripción obtenida exitosamente',
      data: subscription,
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },

  updateSubscription: (id: string, data: any): Response => {
    const subscriptionIndex = MOCK_SUBSCRIPTIONS.findIndex((s) => s.id === id)
    if (subscriptionIndex === -1) {
      const errorResponse: ApiResponse = {
        success: false,
        message: 'Suscripción no encontrada',
        errors: ['La suscripción con el ID proporcionado no existe'],
      }
      return new Response(JSON.stringify(errorResponse), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const updatedSubscription = {
      ...MOCK_SUBSCRIPTIONS[subscriptionIndex],
      ...data,
      dates: {
        ...MOCK_SUBSCRIPTIONS[subscriptionIndex].dates,
        updated_at: new Date().toISOString(),
      },
    }
    MOCK_SUBSCRIPTIONS[subscriptionIndex] = updatedSubscription

    const response: ApiResponse<Subscription> = {
      success: true,
      message: 'Suscripción actualizada exitosamente',
      data: updatedSubscription,
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },

  toggleSubscriptionStatus: (id: string): Response => {
    const subscription = MOCK_SUBSCRIPTIONS.find((s) => s.id === id)
    if (!subscription) {
      const errorResponse: ApiResponse = {
        success: false,
        message: 'Suscripción no encontrada',
        errors: ['La suscripción con el ID proporcionado no existe'],
      }
      return new Response(JSON.stringify(errorResponse), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    subscription.status = subscription.status === 'active' ? 'suspended' : 'active'
    subscription.status_label = subscription.status === 'active' ? 'Activa' : 'Suspendida'
    subscription.dates.updated_at = new Date().toISOString()

    const response: ApiResponse<Subscription> = {
      success: true,
      message: `Suscripción ${subscription.status === 'active' ? 'activada' : 'suspendida'} exitosamente`,
      data: subscription,
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },

  cancelSubscription: (id: string): Response => {
    const subscription = MOCK_SUBSCRIPTIONS.find((s) => s.id === id)
    if (!subscription) {
      const errorResponse: ApiResponse = {
        success: false,
        message: 'Suscripción no encontrada',
        errors: ['La suscripción con el ID proporcionado no existe'],
      }
      return new Response(JSON.stringify(errorResponse), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    subscription.status = 'cancelled'
    subscription.status_label = 'Cancelada'
    subscription.auto_renew = false
    subscription.dates.updated_at = new Date().toISOString()

    const response: ApiResponse<Subscription> = {
      success: true,
      message: 'Suscripción cancelada exitosamente',
      data: subscription,
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },

  getSubscriptions: (params: any = {}): Response => {
    let filteredSubs = [...MOCK_SUBSCRIPTIONS]

    // Filtrar por estado
    if (params.status) {
      filteredSubs = filteredSubs.filter((s) => s.status === params.status)
    }

    // Paginación
    const page = parseInt(params.page) || 1
    const limit = parseInt(params.limit) || 10
    const start = (page - 1) * limit
    const end = start + limit
    const paginatedSubs = filteredSubs.slice(start, end)

    const response: ApiResponse = {
      success: true,
      message: 'Suscripciones obtenidas exitosamente',
      data: {
        subscriptions: paginatedSubs,
        pagination: {
          page,
          limit,
          total: filteredSubs.length,
          totalPages: Math.ceil(filteredSubs.length / limit),
        },
      },
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },
}


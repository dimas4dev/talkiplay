/**
 * Mock Interceptor para interceptar llamadas fetch y devolver datos mock
 * Se activa cuando VITE_USE_MOCKS=true en las variables de entorno
 */

import { mockAuth } from './auth.mock'
import { mockDashboard } from './dashboard.mock'
import { mockUsers } from './users.mock'
import { mockRevenues } from './revenues.mock'
import { mockMetrics } from './metrics.mock'
import { mockMemberships } from './memberships.mock'
import { mockReports } from './reports.mock'
import { mockNotifications } from './notifications.mock'
import { mockSettings } from './settings.mock'
import type { ApiResponse } from '@/types/api'

// Verificar si los mocks están habilitados
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true'

// Guardar el fetch original
const originalFetch = window.fetch

// Función para simular delay de red
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Función para crear respuesta mock exitosa
const createMockResponse = <T>(data: T, status: number = 200): Response => {
  const response: ApiResponse<T> = {
    success: true,
    message: 'Success',
    data: data
  }
  
  return new Response(JSON.stringify(response), {
    status,
    statusText: 'OK',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

// Función para crear respuesta mock de error
const createMockErrorResponse = (message: string, status: number = 400): Response => {
  const response: ApiResponse = {
    success: false,
    message,
    errors: [message]
  }
  
  return new Response(JSON.stringify(response), {
    status,
    statusText: 'Error',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

// Función para extraer el endpoint de la URL
const getEndpoint = (url: string, baseURL: string): string => {
  if (url.startsWith(baseURL)) {
    return url.substring(baseURL.length)
  }
  return url
}

// Función principal del interceptor
export const setupMockInterceptor = (baseURL: string) => {
  if (!USE_MOCKS) {
    console.log('🔴 Mocks deshabilitados - usando API real')
    return
  }

  console.log('🟢 Mocks habilitados - interceptando llamadas a la API')

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url
    const endpoint = getEndpoint(url, baseURL)
    const method = init?.method || 'GET'

    // Simular delay de red (200-500ms)
    await delay(200 + Math.random() * 300)

    console.log(`🎭 Mock: ${method} ${endpoint}`)

    try {
      // Auth endpoints
      if (endpoint.startsWith('/api/v1/auth')) {
        return handleAuthEndpoint(endpoint, method, init)
      }

      // Dashboard endpoints
      if (endpoint.startsWith('/api/v1/admin/dashboard') || endpoint.startsWith('/api/v1/dashboard')) {
        return handleDashboardEndpoint(endpoint, method, init)
      }

      // Users endpoints
      if (endpoint.startsWith('/api/v1/users') || endpoint.startsWith('/api/v1/admin/users')) {
        return handleUsersEndpoint(endpoint, method, init)
      }

      // Revenues/Income endpoints
      if (endpoint.startsWith('/api/v1/admin/income')) {
        return handleRevenuesEndpoint(endpoint, method, init)
      }

      // Metrics endpoints
      if (endpoint.startsWith('/api/v1/admin/metrics')) {
        return handleMetricsEndpoint(endpoint, method, init)
      }

      // Memberships/Subscriptions endpoints
      if (endpoint.startsWith('/api/v1/admin/subscriptions') || endpoint.startsWith('/api/v1/subscriptions')) {
        return handleMembershipsEndpoint(endpoint, method, init)
      }

      // Reports endpoints
      if (endpoint.startsWith('/api/v1/admin/reports') || endpoint.startsWith('/api/v1/reports')) {
        return handleReportsEndpoint(endpoint, method, init)
      }

      // Notifications endpoints
      if (endpoint.startsWith('/api/v1/admin/notifications') || endpoint.startsWith('/api/v1/notifications')) {
        return handleNotificationsEndpoint(endpoint, method, init)
      }

      // Settings endpoints
      if (endpoint.startsWith('/api/v1/settings')) {
        return handleSettingsEndpoint(endpoint, method, init)
      }

      // Si no hay mock para este endpoint, usar fetch original
      console.warn(`⚠️ No hay mock para: ${method} ${endpoint}`)
      return originalFetch(input, init)
    } catch (error) {
      console.error('Error en mock interceptor:', error)
      return createMockErrorResponse(
        error instanceof Error ? error.message : 'Error desconocido',
        500
      )
    }
  }
}

// Handlers para cada tipo de endpoint
const handleAuthEndpoint = (endpoint: string, method: string, init?: RequestInit): Response => {
  if (endpoint === '/api/v1/auth/login' && method === 'POST') {
    const body = init?.body ? JSON.parse(init.body as string) : {}
    return mockAuth.login(body.email, body.password)
  }

  if (endpoint === '/api/v1/auth/refresh' && method === 'POST') {
    return mockAuth.refreshToken()
  }

  if (endpoint === '/api/v1/auth/profile' && method === 'GET') {
    return mockAuth.getUserProfile()
  }

  if (endpoint === '/api/v1/auth/forgot-password' && method === 'POST') {
    const body = init?.body ? JSON.parse(init.body as string) : {}
    return mockAuth.forgotPassword(body.email)
  }

  if (endpoint === '/api/v1/auth/verify-otp' && method === 'POST') {
    const body = init?.body ? JSON.parse(init.body as string) : {}
    return mockAuth.verifyOTP(body.email, body.code)
  }

  if (endpoint === '/api/v1/auth/reset-password' && method === 'POST') {
    const body = init?.body ? JSON.parse(init.body as string) : {}
    return mockAuth.resetPassword(body.email, body.code, body.newPassword)
  }

  return createMockErrorResponse('Endpoint de auth no encontrado', 404)
}

const handleDashboardEndpoint = (endpoint: string, method: string, init?: RequestInit): Response => {
  if (endpoint === '/api/v1/admin/dashboard/stats' && method === 'GET') {
    return mockDashboard.getStats()
  }

  if (endpoint === '/api/v1/dashboard/active-users' && method === 'GET') {
    return mockDashboard.getActiveUsers()
  }

  if (endpoint === '/api/v1/dashboard/subscriptions' && method === 'GET') {
    return mockDashboard.getSubscriptions()
  }

  if (endpoint === '/api/v1/dashboard/retention-rate' && method === 'GET') {
    return mockDashboard.getRetentionRate()
  }

  if (endpoint === '/api/v1/dashboard/user-growth' && method === 'GET') {
    return mockDashboard.getUserGrowth()
  }

  return createMockErrorResponse('Endpoint de dashboard no encontrado', 404)
}

const handleUsersEndpoint = (endpoint: string, method: string, init?: RequestInit): Response => {
  // GET /api/v1/users - Lista de usuarios con query params
  if (endpoint.startsWith('/api/v1/users') && method === 'GET' && !endpoint.includes('/reports')) {
    const url = new URL(endpoint, 'http://localhost')
    const params = Object.fromEntries(url.searchParams.entries())
    const userId = endpoint.match(/\/api\/v1\/users\/([^\/]+)$/)?.[1]
    
    if (userId) {
      return mockUsers.getUserById(userId)
    }
    return mockUsers.getUsers(params)
  }

  // PUT /api/v1/users/:id
  if (endpoint.match(/^\/api\/v1\/users\/[^\/]+$/) && method === 'PUT') {
    const userId = endpoint.split('/').pop() || ''
    const body = init?.body ? JSON.parse(init.body as string) : {}
    return mockUsers.updateUser(userId, body)
  }

  // POST /api/v1/users/:id/toggle-status
  if (endpoint.match(/^\/api\/v1\/users\/[^\/]+\/toggle-status$/) && method === 'POST') {
    const userId = endpoint.split('/')[4] || ''
    return mockUsers.toggleUserStatus(userId)
  }

  // DELETE /api/v1/users/:id
  if (endpoint.match(/^\/api\/v1\/users\/[^\/]+$/) && method === 'DELETE') {
    const userId = endpoint.split('/').pop() || ''
    return mockUsers.deleteUser(userId)
  }

  // POST /api/v1/admin/users/greeting
  if (endpoint === '/api/v1/admin/users/greeting' && method === 'POST') {
    const body = init?.body ? JSON.parse(init.body as string) : {}
    return mockUsers.sendGreeting(body)
  }

  // PUT /api/v1/admin/users/:id/status
  if (endpoint.match(/^\/api\/v1\/admin\/users\/[^\/]+\/status$/) && method === 'PUT') {
    const userId = endpoint.split('/')[5] || ''
    const body = init?.body ? JSON.parse(init.body as string) : {}
    return mockUsers.updateUserStatus(userId, body)
  }

  // GET /api/v1/admin/users/:id
  if (endpoint.match(/^\/api\/v1\/admin\/users\/[^\/]+$/) && method === 'GET') {
    const userId = endpoint.split('/').pop() || ''
    return mockUsers.getUserById(userId)
  }

  // GET /api/v1/admin/users/:id/reports
  if (endpoint.match(/^\/api\/v1\/admin\/users\/[^\/]+\/reports$/) && method === 'GET') {
    const userId = endpoint.split('/')[5] || ''
    return mockUsers.getUserReports(userId)
  }

  return createMockErrorResponse('Endpoint de usuarios no encontrado', 404)
}

const handleRevenuesEndpoint = (endpoint: string, method: string, init?: RequestInit): Response => {
  if (endpoint === '/api/v1/admin/income' && method === 'GET') {
    return mockRevenues.getRevenues()
  }

  if (endpoint.startsWith('/api/v1/admin/income/') && method === 'GET') {
    const period = decodeURIComponent(endpoint.split('/').pop() || '')
    return mockRevenues.getRevenueByPeriod(period)
  }

  if (endpoint === '/api/v1/admin/income/stats' && method === 'GET') {
    return mockRevenues.getRevenueStats()
  }

  if (endpoint === '/api/v1/admin/income/payment-methods' && method === 'GET') {
    return mockRevenues.getPaymentMethods()
  }

  if (endpoint === '/api/v1/admin/income/active-subscriptions' && method === 'GET') {
    return mockRevenues.getActiveSubscriptions()
  }

  if (endpoint === '/api/v1/admin/income/net-amount' && method === 'GET') {
    return mockRevenues.getNetAmount()
  }

  if (endpoint === '/api/v1/admin/income/current-month-projection' && method === 'GET') {
    return mockRevenues.getCurrentMonthProjection()
  }

  if (endpoint === '/api/v1/admin/income/annual' && method === 'GET') {
    return mockRevenues.getAnnualRevenue()
  }

  if (endpoint === '/api/v1/admin/income/periods' && method === 'GET') {
    return mockRevenues.getPeriods()
  }

  if (endpoint === '/api/v1/admin/income/period-details' && method === 'GET') {
    const url = new URL(endpoint, 'http://localhost')
    const year = parseInt(url.searchParams.get('year') || '2024')
    const month = parseInt(url.searchParams.get('month') || '1')
    return mockRevenues.getPeriodDetails(year, month)
  }

  if (endpoint === '/api/v1/admin/income/summary' && method === 'GET') {
    return mockRevenues.getRevenueSummary()
  }

  return createMockErrorResponse('Endpoint de ingresos no encontrado', 404)
}

const handleMetricsEndpoint = (endpoint: string, method: string, init?: RequestInit): Response => {
  if (endpoint === '/api/v1/admin/metrics/all' && method === 'GET') {
    return mockMetrics.getAllMetrics()
  }

  if (endpoint === '/api/v1/admin/metrics/clips/stats' && method === 'GET') {
    return mockMetrics.getClipStats()
  }

  if (endpoint === '/api/v1/admin/metrics/clips/by-source' && method === 'GET') {
    return mockMetrics.getClipsBySource()
  }

  if (endpoint === '/api/v1/admin/metrics/pro-features/overview' && method === 'GET') {
    return mockMetrics.getProFeaturesOverview()
  }

  if (endpoint === '/api/v1/admin/metrics/pro-features/last-month' && method === 'GET') {
    return mockMetrics.getProFeaturesLastMonth()
  }

  if (endpoint === '/api/v1/admin/metrics/clips/by-month' && method === 'GET') {
    return mockMetrics.getClipsByMonth()
  }

  if (endpoint === '/api/v1/admin/metrics/summary' && method === 'GET') {
    return mockMetrics.getMetricsSummary()
  }

  return createMockErrorResponse('Endpoint de métricas no encontrado', 404)
}

const handleMembershipsEndpoint = (endpoint: string, method: string, init?: RequestInit): Response => {
  if (endpoint === '/api/v1/admin/subscriptions/all' && method === 'GET') {
    return mockMemberships.getAllSubscriptions()
  }

  if (endpoint === '/api/v1/admin/subscriptions/trial' && method === 'GET') {
    return mockMemberships.getTrialSubscriptions()
  }

  if (endpoint === '/api/v1/admin/subscriptions/suspended' && method === 'GET') {
    return mockMemberships.getSuspendedSubscriptions()
  }

  if (endpoint === '/api/v1/admin/subscriptions/renewals' && method === 'GET') {
    return mockMemberships.getSubscriptionRenewals()
  }

  if (endpoint === '/api/v1/admin/subscriptions/summary' && method === 'GET') {
    return mockMemberships.getSubscriptionSummary()
  }

  if (endpoint.match(/^\/api\/v1\/admin\/subscriptions\/[^\/]+$/) && method === 'GET') {
    const id = endpoint.split('/').pop() || ''
    return mockMemberships.getSubscriptionById(id)
  }

  if (endpoint.match(/^\/api\/v1\/admin\/subscriptions\/[^\/]+$/) && method === 'PUT') {
    const id = endpoint.split('/').pop() || ''
    const body = init?.body ? JSON.parse(init.body as string) : {}
    return mockMemberships.updateSubscription(id, body)
  }

  if (endpoint.match(/^\/api\/v1\/admin\/subscriptions\/[^\/]+\/toggle-status$/) && method === 'POST') {
    const id = endpoint.split('/')[5] || ''
    return mockMemberships.toggleSubscriptionStatus(id)
  }

  if (endpoint.match(/^\/api\/v1\/admin\/subscriptions\/[^\/]+\/cancel$/) && method === 'POST') {
    const id = endpoint.split('/')[5] || ''
    return mockMemberships.cancelSubscription(id)
  }

  if (endpoint.startsWith('/api/v1/subscriptions') && method === 'GET') {
    const url = new URL(endpoint, 'http://localhost')
    const params = Object.fromEntries(url.searchParams.entries())
    return mockMemberships.getSubscriptions(params)
  }

  return createMockErrorResponse('Endpoint de suscripciones no encontrado', 404)
}

const handleReportsEndpoint = (endpoint: string, method: string, init?: RequestInit): Response => {
  if (endpoint === '/api/v1/admin/reports/summary' && method === 'GET') {
    return mockReports.getReportsSummary()
  }

  if (endpoint.match(/^\/api\/v1\/admin\/reports\/[^\/]+$/) && method === 'GET') {
    const reportId = endpoint.split('/').pop() || ''
    return mockReports.getReportById(reportId)
  }

  if (endpoint.match(/^\/api\/v1\/admin\/reports\/[^\/]+$/) && method === 'PUT') {
    const reportId = endpoint.split('/').pop() || ''
    const body = init?.body ? JSON.parse(init.body as string) : {}
    return mockReports.updateReport(reportId, body)
  }

  if (endpoint.match(/^\/api\/v1\/admin\/reports\/[^\/]+\/mark-read$/) && method === 'POST') {
    const reportId = endpoint.split('/')[5] || ''
    return mockReports.markRead(reportId)
  }

  if (endpoint.match(/^\/api\/v1\/admin\/reports\/[^\/]+\/mark-resolved$/) && method === 'POST') {
    const reportId = endpoint.split('/')[5] || ''
    return mockReports.markResolved(reportId)
  }

  const isReportsList =
    endpoint === '/api/v1/admin/reports' ||
    endpoint.startsWith('/api/v1/admin/reports?')

  if (isReportsList && method === 'GET') {
    const url = new URL(`http://localhost${endpoint}`)
    const params = Object.fromEntries(url.searchParams.entries())
    return mockReports.getReports(params)
  }

  if (endpoint.startsWith('/api/v1/reports/user/') && method === 'GET') {
    const userId = endpoint.split('/').pop() || ''
    return mockReports.getUserReports(userId)
  }

  return createMockErrorResponse('Endpoint de reportes no encontrado', 404)
}

const handleNotificationsEndpoint = (endpoint: string, method: string, init?: RequestInit): Response => {
  if (endpoint === '/api/v1/admin/notifications' && method === 'GET') {
    return mockNotifications.getNotifications()
  }

  if (endpoint === '/api/v1/admin/notifications/stats' && method === 'GET') {
    return mockNotifications.getNotificationStats()
  }

  if (endpoint === '/api/v1/admin/notifications/mark-all-read' && method === 'PUT') {
    return mockNotifications.markAllNotificationsAsRead()
  }

  if (endpoint.match(/^\/api\/v1\/admin\/notifications\/user\/[^\/]+\/unread-count$/) && method === 'GET') {
    const userId = endpoint.split('/')[5] || ''
    return mockNotifications.getUnreadNotificationCount(userId)
  }

  if (endpoint.match(/^\/api\/v1\/admin\/notifications\/[^\/]+\/read$/) && method === 'PUT') {
    const notificationId = endpoint.split('/')[5] || ''
    return mockNotifications.markNotificationAsRead(notificationId)
  }

  if (endpoint.match(/^\/api\/v1\/admin\/notifications\/[^\/]+$/) && method === 'DELETE') {
    const notificationId = endpoint.split('/').pop() || ''
    return mockNotifications.deleteNotification(notificationId)
  }

  return createMockErrorResponse('Endpoint de notificaciones no encontrado', 404)
}

const handleSettingsEndpoint = (endpoint: string, method: string, init?: RequestInit): Response => {
  if (endpoint === '/api/v1/settings/terms-and-conditions' && method === 'GET') {
    return mockSettings.getTermsAndConditions()
  }

  if (endpoint === '/api/v1/settings/privacy-policy' && method === 'GET') {
    return mockSettings.getPrivacyPolicy()
  }

  if (endpoint.match(/^\/api\/v1\/settings\/sections\/active\/.+$/) && method === 'GET') {
    const type = endpoint.split('/').pop() || ''
    return mockSettings.getActiveSections(type)
  }

  if (endpoint === '/api/v1/settings/sections' && method === 'GET') {
    return mockSettings.getAllSections()
  }

  if (endpoint.match(/^\/api\/v1\/settings\/sections\/type\/.+$/) && method === 'GET') {
    const type = endpoint.split('/').pop() || ''
    return mockSettings.getSectionsByType(type)
  }

  if (endpoint.match(/^\/api\/v1\/settings\/sections\/[^\/]+$/) && method === 'GET') {
    const id = endpoint.split('/').pop() || ''
    return mockSettings.getSectionById(id)
  }

  if (endpoint === '/api/v1/settings/sections' && method === 'POST') {
    const body = init?.body ? JSON.parse(init.body as string) : {}
    return mockSettings.createSection(body)
  }

  if (endpoint.match(/^\/api\/v1\/settings\/sections\/[^\/]+$/) && method === 'PUT') {
    const id = endpoint.split('/').pop() || ''
    const body = init?.body ? JSON.parse(init.body as string) : {}
    return mockSettings.updateSection(id, body)
  }

  if (endpoint.match(/^\/api\/v1\/settings\/sections\/[^\/]+$/) && method === 'DELETE') {
    const id = endpoint.split('/').pop() || ''
    return mockSettings.deleteSection(id)
  }

  return createMockErrorResponse('Endpoint de settings no encontrado', 404)
}

// Exportar función para restaurar fetch original
export const restoreOriginalFetch = () => {
  window.fetch = originalFetch
  console.log('🔴 Mocks deshabilitados - fetch original restaurado')
}


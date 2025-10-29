import type { DashboardData, RevenueData, RevenuePeriodDetail, Section, SectionCreateRequest, SectionUpdateRequest, Subscription, UserReport, UserHeader, UserReportsData, AllSubscriptionsData, TrialSubscriptionsData, SuspendedSubscriptionsData, RenewalSubscriptionsData } from '@/types/dashboard'
import type { Notification } from '@/types/websocket'
import type {
  ActiveSubscriptionsData,
  PaymentMethodsData,
  NetAmountData,
  CurrentMonthProjectionData,
  AnnualRevenueData,
  PeriodsData,
  PeriodDetailData,
  RevenueSummaryData
} from '@/types/revenues'
import type { ApiResponse, LoginRequest, LoginResponse, RefreshTokenResponse, User } from '@/types/api'

// Configuración base de la API
const API_BASE_URL = import.meta.env.VITE_CLIPNEST_API_URL || 'https://api.clipnest.com'

// Función utilitaria para filtrar parámetros undefined y construir query string
function buildQueryString(params?: Record<string, any>): string {
  if (!params) return ''
  
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(([_, value]) => value !== undefined && value !== null && value !== '')
  )
  
  return Object.keys(filteredParams).length > 0 ? `?${new URLSearchParams(filteredParams as any).toString()}` : ''
}


// Tipos para las respuestas de la API

// Clase para manejar las peticiones HTTP
class ApiClient {
  private baseURL: string
  private accessToken: string | null = null

  constructor(baseURL: string) {
    this.baseURL = baseURL
    this.accessToken = localStorage.getItem('accessToken')
  }

  // Método para establecer el token de acceso
  setAccessToken(token: string | null) {
    this.accessToken = token
    if (token) {
      try {
        localStorage.setItem('accessToken', token)
      } catch (error) {
        console.error('❌ Error al guardar token en localStorage:', error)
      }
    } else {
      localStorage.removeItem('accessToken')
    }
  }

  // Método para establecer el refresh token
  setRefreshToken(token: string | null) {
    if (token) {
      localStorage.setItem('refreshToken', token)
    } else {
      localStorage.removeItem('refreshToken')
    }
  }

  // Método para obtener el refresh token
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken')
  }

  // Método para obtener el token de acceso
  getAccessToken(): string | null {
    return this.accessToken
  }

  // Método base para hacer peticiones HTTP
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    isRetry: boolean = false
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`


    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    // Agregar token de autorización si existe
    if (this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`
    } else {
      console.warn('⚠️ No hay token de acceso disponible')
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      // Intentar parsear como JSON
      let data
      try {
        data = await response.json()
      } catch (jsonError) {
        // Si no es JSON válido, verificar si es HTML
        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('text/html')) {
          throw new Error('La API no está configurada correctamente. Verifica la URL de la API.')
        }
        throw new Error('Respuesta no válida del servidor')
      }

      // Si es un error 401 y no es un retry, intentar renovar el token
      if (response.status === 401 && !isRetry && this.getRefreshToken()) {
        try {
          await this.refreshToken()
          // Reintentar la petición original con el nuevo token
          return this.request(endpoint, options, true)
        } catch (refreshError) {
          // Si falla la renovación, limpiar tokens y redirigir al login
          this.setAccessToken(null)
          this.setRefreshToken(null)
          window.location.href = '/login'
          throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.')
        }
      }

      if (!response.ok) {
        // Si la respuesta tiene un mensaje de error, usarlo
        if (data && data.message) {
          throw new Error(data.message)
        }
        // Si no, usar el mensaje de error genérico
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      return data
    } catch (error) {
      console.error('Error en la petición:', error)

      // No usar mocks, lanzar el error directamente

      throw error
    }
  }

  // Método para renovar el token
  private async refreshToken(): Promise<void> {
    const refreshToken = this.getRefreshToken()

    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const response = await fetch(`${this.baseURL}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken })
    })

    const data = await response.json()

    if (!response.ok || !data.success) {
      throw new Error('Failed to refresh token')
    }

    // Actualizar el token de acceso
    this.setAccessToken(data.data.accessToken)
  }


  // Método GET
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  // Método POST
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // Método PUT
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // Método DELETE
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

// Instancia del cliente API
export const apiClient = new ApiClient(API_BASE_URL)

// Servicios específicos
export const authService = {
  // Login
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await apiClient.post<LoginResponse>('/api/v1/auth/login', credentials)

    if (response.success && response.data) {
      // Guardar ambos tokens (están dentro de response.data.tokens)
      if (response.data.tokens) {
        apiClient.setAccessToken(response.data.tokens.accessToken)
        apiClient.setRefreshToken(response.data.tokens.refreshToken)
      }
    }

    return response
  },

  // Refresh token
  async refreshToken(): Promise<ApiResponse<RefreshTokenResponse>> {
    const refreshToken = apiClient.getRefreshToken()

    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const response = await apiClient.post<RefreshTokenResponse>('/api/v1/auth/refresh', {
      refreshToken
    })

    if (response.success && response.data) {
      // Actualizar el token de acceso
      apiClient.setAccessToken(response.data.accessToken)
    }

    return response
  },

  // Obtener perfil del usuario
  async getUserProfile(): Promise<ApiResponse<User>> {
    return apiClient.get<User>('/api/v1/auth/profile')
  },

  // Logout
  logout(): void {
    apiClient.setAccessToken(null)
    apiClient.setRefreshToken(null)
  },

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!apiClient.getAccessToken()
  },

  // Obtener el token de acceso
  getAccessToken(): string | null {
    return apiClient.getAccessToken()
  },

  // Obtener el refresh token
  getRefreshToken(): string | null {
    return apiClient.getRefreshToken()
  },

  // Verificar estado del token (para debugging)
  debugTokenStatus(): void {
    // Estado del token disponible para debugging
  },

  // Solicitar recuperación de contraseña
  async forgotPassword(email: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>('/api/v1/auth/forgot-password', { email })
  },

  // Verificar código OTP
  async verifyOTP(email: string, code: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>('/api/v1/auth/verify-otp', { email, code })
  },

  // Restablecer contraseña
  async resetPassword(email: string, code: string, newPassword: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>('/api/v1/auth/reset-password', { 
      email, 
      code, 
      newPassword 
    })
  },

  // NOTIFICACIONES - Endpoints del backend
  async getNotifications(): Promise<ApiResponse<Notification[]>> {
    return apiClient.get<Notification[]>('/api/v1/admin/notifications')
  },

  async getNotificationStats(): Promise<ApiResponse<{ total: number; unread: number; read: number }>> {
    return apiClient.get<{ total: number; unread: number; read: number }>('/api/v1/admin/notifications/stats')
  },

  async markAllNotificationsAsRead(): Promise<ApiResponse<{ message: string }>> {
    return apiClient.put<{ message: string }>('/api/v1/admin/notifications/mark-all-read')
  },

  async getUnreadNotificationCount(userId: string): Promise<ApiResponse<{ count: number }>> {
    return apiClient.get<{ count: number }>(`/api/v1/admin/notifications/user/${userId}/unread-count`)
  },

  async markNotificationAsRead(notificationId: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.put<{ message: string }>(`/api/v1/admin/notifications/${notificationId}/read`)
  },

  async deleteNotification(notificationId: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete<{ message: string }>(`/api/v1/admin/notifications/${notificationId}`)
  }
}

// Servicios para datos del dashboard
export const dashboardService = {
  // Obtener estadísticas del dashboard
  async getStats(): Promise<ApiResponse<DashboardData>> {
    return apiClient.get<DashboardData>('/api/v1/admin/dashboard/stats')
  },

  // Obtener datos de usuarios activos
  async getActiveUsers(): Promise<ApiResponse<any>> {
    return apiClient.get('/api/v1/dashboard/active-users')
  },

  // Obtener datos de suscripciones
  async getSubscriptions(): Promise<ApiResponse<any>> {
    return apiClient.get('/api/v1/dashboard/subscriptions')
  },

  // Obtener datos de tasa de retención
  async getRetentionRate(): Promise<ApiResponse<any>> {
    return apiClient.get('/api/v1/dashboard/retention-rate')
  },

  // Obtener datos de crecimiento de usuarios
  async getUserGrowth(): Promise<ApiResponse<any>> {
    return apiClient.get('/api/v1/dashboard/user-growth')
  }
}

// Servicios para usuarios
export const userService = {
  // Obtener lista de usuarios
  async getUsers(params?: {
    page?: number
    limit?: number
    search?: string
    role?: string
    subscription_status?: string
    sort_by?: string
    sort_order?: 'asc' | 'desc'
  }): Promise<ApiResponse<any>> {
    const query = buildQueryString(params)
    return apiClient.get(`/api/v1/users${query}`)
  },

  // Obtener usuario por ID
  async getUserById(id: string): Promise<ApiResponse<any>> {
    return apiClient.get(`/api/v1/users/${id}`)
  },

  // Actualizar usuario
  async updateUser(id: string, data: any): Promise<ApiResponse<any>> {
    return apiClient.put(`/api/v1/users/${id}`, data)
  },

  // Bloquear/desbloquear usuario
  async toggleUserStatus(id: string): Promise<ApiResponse<any>> {
    return apiClient.post(`/api/v1/users/${id}/toggle-status`)
  },

  // Enviar saludo a usuarios
  async sendGreeting(data: {
    user_ids: string[]
    message: string
    title: string
  }): Promise<ApiResponse<any>> {
    return apiClient.post('/api/v1/admin/users/greeting', data)
  },

  // Cambiar estado del usuario
  async updateUserStatus(userId: string, data: {
    status: 'active' | 'suspended' | 'blocked'
    reason?: string
  }): Promise<ApiResponse<any>> {
    return apiClient.put(`/api/v1/admin/users/${userId}/status`, data)
  },

  // Eliminar usuario (soft delete)
  async deleteUser(userId: string): Promise<ApiResponse<any>> {
    return apiClient.delete(`/api/v1/users/${userId}`)
  }
}

// Servicios para suscripciones
export const subscriptionService = {
  // Obtener suscripciones
  async getSubscriptions(params?: any): Promise<ApiResponse<any>> {
    const query = buildQueryString(params)
    return apiClient.get(`/api/v1/subscriptions${query}`)
  },

  // Obtener suscripción por ID
  async getSubscriptionById(id: string): Promise<ApiResponse<any>> {
    return apiClient.get(`/api/v1/subscriptions/${id}`)
  },

  // Actualizar suscripción
  async updateSubscription(id: string, data: any): Promise<ApiResponse<any>> {
    return apiClient.put(`/api/v1/subscriptions/${id}`, data)
  }
}

// Servicios para ingresos
export const revenueService = {
  // Obtener datos completos de ingresos (legacy)
  async getRevenues(): Promise<ApiResponse<RevenueData>> {
    return apiClient.get<RevenueData>('/api/v1/admin/income')
  },

  // Obtener ingresos por período específico (legacy)
  async getRevenueByPeriod(period: string): Promise<ApiResponse<RevenuePeriodDetail>> {
    return apiClient.get<RevenuePeriodDetail>(`/api/v1/admin/income/${encodeURIComponent(period)}`)
  },

  // Obtener estadísticas de ingresos (legacy)
  async getRevenueStats(): Promise<ApiResponse<any>> {
    return apiClient.get('/api/v1/admin/income/stats')
  },

  // Obtener métodos de pago (legacy)
  async getPaymentMethods(): Promise<ApiResponse<any>> {
    return apiClient.get('/api/v1/admin/income/payment-methods')
  }
}

// Servicios para Income (nuevos endpoints)
export const incomeService = {
  // Obtener suscripciones activas de los últimos 12 meses
  async getActiveSubscriptions(): Promise<ApiResponse<ActiveSubscriptionsData>> {
    return apiClient.get<ActiveSubscriptionsData>('/api/v1/admin/income/active-subscriptions')
  },

  // Obtener métodos de pago con detalles
  async getPaymentMethodsDetailed(): Promise<ApiResponse<PaymentMethodsData>> {
    return apiClient.get<PaymentMethodsData>('/api/v1/admin/income/payment-methods')
  },

  // Obtener importe neto
  async getNetAmount(): Promise<ApiResponse<NetAmountData>> {
    return apiClient.get<NetAmountData>('/api/v1/admin/income/net-amount')
  },

  // Obtener proyección del mes actual
  async getCurrentMonthProjection(): Promise<ApiResponse<CurrentMonthProjectionData>> {
    return apiClient.get<CurrentMonthProjectionData>('/api/v1/admin/income/current-month-projection')
  },

  // Obtener ingresos anuales
  async getAnnualRevenue(): Promise<ApiResponse<AnnualRevenueData>> {
    return apiClient.get<AnnualRevenueData>('/api/v1/admin/income/annual')
  },

  // Obtener períodos
  async getPeriods(): Promise<ApiResponse<PeriodsData>> {
    return apiClient.get<PeriodsData>('/api/v1/admin/income/periods')
  },

  // Obtener detalles de un período específico
  async getPeriodDetails(year: number, month: number): Promise<ApiResponse<PeriodDetailData>> {
    return apiClient.get<PeriodDetailData>(`/api/v1/admin/income/period-details?year=${year}&month=${month}`)
  },

  // Obtener resumen de ingresos
  async getRevenueSummary(): Promise<ApiResponse<RevenueSummaryData>> {
    return apiClient.get<RevenueSummaryData>('/api/v1/admin/income/summary')
  }
}

// Servicios para reportes
export const reportService = {
  // Obtener reportes
  async getReports(params?: any): Promise<ApiResponse<any>> {
    const query = buildQueryString(params)
    return apiClient.get(`/api/v1/reports${query}`)
  },

  // Obtener reportes por usuario
  async getUserReports(userId: string): Promise<ApiResponse<any>> {
    return apiClient.get(`/api/v1/reports/user/${userId}`)
  }
}

// Servicios para notificaciones
export const notificationService = {
  // Obtener notificaciones
  async getNotifications(params?: any): Promise<ApiResponse<any>> {
    const query = buildQueryString(params)
    return apiClient.get(`/api/v1/notifications${query}`)
  },

  // Marcar notificación como leída
  async markAsRead(id: string): Promise<ApiResponse<any>> {
    return apiClient.post(`/api/v1/notifications/${id}/read`)
  }
}

// Servicios para Memberships/Subscriptions
export const membershipService = {
  // Obtener todas las suscripciones
  async getAllSubscriptions(): Promise<ApiResponse<AllSubscriptionsData>> {
    return apiClient.get<AllSubscriptionsData>('/api/v1/admin/subscriptions/all')
  },

  // Obtener suscripciones en prueba
  async getTrialSubscriptions(): Promise<ApiResponse<TrialSubscriptionsData>> {
    return apiClient.get<TrialSubscriptionsData>('/api/v1/admin/subscriptions/trial')
  },

  // Obtener suscripciones suspendidas
  async getSuspendedSubscriptions(): Promise<ApiResponse<SuspendedSubscriptionsData>> {
    return apiClient.get<SuspendedSubscriptionsData>('/api/v1/admin/subscriptions/suspended')
  },

  // Obtener renovaciones de suscripciones
  async getSubscriptionRenewals(): Promise<ApiResponse<RenewalSubscriptionsData>> {
    return apiClient.get<RenewalSubscriptionsData>('/api/v1/admin/subscriptions/renewals')
  },

  // Obtener resumen completo de suscripciones
  async getSubscriptionSummary(): Promise<ApiResponse<any>> {
    return apiClient.get<any>('/api/v1/admin/subscriptions/summary')
  },

  // Obtener suscripción por ID
  async getSubscriptionById(id: string): Promise<ApiResponse<Subscription>> {
    return apiClient.get<Subscription>(`/api/v1/admin/subscriptions/${id}`)
  },

  // Actualizar suscripción
  async updateSubscription(id: string, data: any): Promise<ApiResponse<Subscription>> {
    return apiClient.put<Subscription>(`/api/v1/admin/subscriptions/${id}`, data)
  },

  // Suspender/activar suscripción
  async toggleSubscriptionStatus(id: string): Promise<ApiResponse<Subscription>> {
    return apiClient.post<Subscription>(`/api/v1/admin/subscriptions/${id}/toggle-status`)
  },

  // Cancelar suscripción
  async cancelSubscription(id: string): Promise<ApiResponse<Subscription>> {
    return apiClient.post<Subscription>(`/api/v1/admin/subscriptions/${id}/cancel`)
  }
}

// Servicios para Metrics
export const metricsService = {
  // Obtener todas las métricas
  async getAllMetrics(): Promise<ApiResponse<import('@/types/metrics').AllMetricsData>> {
    return apiClient.get<import('@/types/metrics').AllMetricsData>('/api/v1/admin/metrics/all')
  },

  // Obtener estadísticas de clips
  async getClipStats(): Promise<ApiResponse<import('@/types/metrics').ClipStatsData>> {
    return apiClient.get<import('@/types/metrics').ClipStatsData>('/api/v1/admin/metrics/clips/stats')
  },

  // Obtener clips por fuente
  async getClipsBySource(): Promise<ApiResponse<import('@/types/metrics').ClipsBySourceData>> {
    return apiClient.get<import('@/types/metrics').ClipsBySourceData>('/api/v1/admin/metrics/clips/by-source')
  },

  // Obtener resumen de características PRO
  async getProFeaturesOverview(): Promise<ApiResponse<import('@/types/metrics').ProFeaturesOverviewData>> {
    return apiClient.get<import('@/types/metrics').ProFeaturesOverviewData>('/api/v1/admin/metrics/pro-features/overview')
  },

  // Obtener características PRO del último mes
  async getProFeaturesLastMonth(): Promise<ApiResponse<import('@/types/metrics').ProFeaturesLastMonthData>> {
    return apiClient.get<import('@/types/metrics').ProFeaturesLastMonthData>('/api/v1/admin/metrics/pro-features/last-month')
  },

  // Obtener clips por mes
  async getClipsByMonth(): Promise<ApiResponse<import('@/types/metrics').ClipsByMonthData>> {
    return apiClient.get<import('@/types/metrics').ClipsByMonthData>('/api/v1/admin/metrics/clips/by-month')
  },

  // Obtener resumen de métricas
  async getMetricsSummary(): Promise<ApiResponse<import('@/types/metrics').MetricsSummaryData>> {
    return apiClient.get<import('@/types/metrics').MetricsSummaryData>('/api/v1/admin/metrics/summary')
  }
}

// Servicios para Reports/User
export const reportsService = {
  // Obtener datos completos de un usuario y sus reportes
  async getUserReports(userId: string): Promise<ApiResponse<UserReportsData>> {
    return apiClient.get<UserReportsData>(`/api/v1/admin/users/${userId}/reports`)
  },

  // Obtener información del usuario
  async getUserById(userId: string): Promise<ApiResponse<UserHeader>> {
    return apiClient.get<UserHeader>(`/api/v1/admin/users/${userId}`)
  },

  // Obtener reportes de un usuario
  async getUserReportsList(userId: string, params?: any): Promise<ApiResponse<UserReport[]>> {
    const query = buildQueryString(params)
    return apiClient.get<UserReport[]>(`/api/v1/admin/users/${userId}/reports${query}`)
  },

  // Obtener reporte específico
  async getReportById(reportId: string): Promise<ApiResponse<UserReport>> {
    return apiClient.get<UserReport>(`/api/v1/admin/reports/${reportId}`)
  },

  // Actualizar estado del reporte
  async updateReportStatus(reportId: string, status: 'pending' | 'reviewed' | 'resolved'): Promise<ApiResponse<UserReport>> {
    return apiClient.put<UserReport>(`/api/v1/admin/reports/${reportId}`, { status })
  },

  // Eliminar reporte
  async deleteReport(reportId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/api/v1/admin/reports/${reportId}`)
  }
}

// Servicios Admin para Reportes
export const adminReportsService = {
  // Listado con paginación/filtros/sort
  async getReports(params?: {
    page?: number
    limit?: number
    status?: string
    subscription_type?: string
    search?: string
    sort_by?: string
    sort_order?: 'asc' | 'desc'
  }): Promise<ApiResponse<any>> {
    const query = buildQueryString(params)
    return apiClient.get(`/api/v1/admin/reports${query}`)
  },

  // Resumen
  async getReportsSummary(): Promise<ApiResponse<any>> {
    return apiClient.get('/api/v1/admin/reports/summary')
  },

  // Obtener reporte por id
  async getReportById(reportId: string): Promise<ApiResponse<any>> {
    return apiClient.get(`/api/v1/admin/reports/${reportId}`)
  },

  // Actualizar reporte
  async updateReport(reportId: string, payload: { status?: string; admin_response?: string; resolved?: boolean }): Promise<ApiResponse<any>> {
    return apiClient.put(`/api/v1/admin/reports/${reportId}`, payload)
  },

  // Marcar leído
  async markRead(reportId: string): Promise<ApiResponse<any>> {
    return apiClient.post(`/api/v1/admin/reports/${reportId}/mark-read`)
  },

  // Marcar resuelto
  async markResolved(reportId: string): Promise<ApiResponse<any>> {
    return apiClient.post(`/api/v1/admin/reports/${reportId}/mark-resolved`)
  }
}

// Servicios para Settings
export const settingsService = {
  // Obtener términos y condiciones
  async getTermsAndConditions(): Promise<ApiResponse<{ sections: Section[] }>> {
    return apiClient.get<{ sections: Section[] }>('/api/v1/settings/terms-and-conditions')
  },

  // Obtener política de privacidad
  async getPrivacyPolicy(): Promise<ApiResponse<{ sections: Section[] }>> {
    return apiClient.get<{ sections: Section[] }>('/api/v1/settings/privacy-policy')
  },

  // Obtener secciones activas por tipo
  async getActiveSections(type: string): Promise<ApiResponse<Section[]>> {
    return apiClient.get<Section[]>(`/api/v1/settings/sections/active/${type}`)
  },

  // Obtener todas las secciones (admin only)
  async getAllSections(): Promise<ApiResponse<Section[]>> {
    return apiClient.get<Section[]>('/api/v1/settings/sections')
  },

  // Obtener secciones por tipo (admin only)
  async getSectionsByType(type: string): Promise<ApiResponse<Section[]>> {
    return apiClient.get<Section[]>(`/api/v1/settings/sections/type/${type}`)
  },

  // Obtener sección por ID (admin only)
  async getSectionById(id: string): Promise<ApiResponse<Section>> {
    return apiClient.get<Section>(`/api/v1/settings/sections/${id}`)
  },

  // Crear nueva sección
  async createSection(data: SectionCreateRequest): Promise<ApiResponse<Section>> {
    return apiClient.post<Section>('/api/v1/settings/sections', data)
  },

  // Actualizar sección (admin only)
  async updateSection(id: string, data: SectionUpdateRequest): Promise<ApiResponse<Section>> {
    return apiClient.put<Section>(`/api/v1/settings/sections/${id}`, data)
  },

  // Eliminar sección (admin only)
  async deleteSection(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/api/v1/settings/sections/${id}`)
  }
}

export default apiClient

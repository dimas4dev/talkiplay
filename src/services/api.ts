// Cliente base para peticiones HTTP
import type {
  LoginRequest,
  LoginResponse,
  ForgotPasswordResponse,
  VerifyOTPResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  ApiResponse,
  AdminUsersQueryParams,
  AdminUsersResponse,
  AdminUserStats,
  AdminUserDetail,
  AdminFamiliesQueryParams,
  AdminFamiliesResponse,
  AdminFamilyDetail,
  WarnUserPayload,
  SuspendUserPayload,
  BlockUserPayload,
  ActivateUserPayload,
  BulkActionPayload,
  ForbiddenWord,
  ForbiddenWordsResponse,
  CreateForbiddenWordPayload,
  UpdateForbiddenWordPayload,
  DashboardAnalyticsResponse,
  UsageMetricsResponse,
  LegalDocument,
  AdminNotificationsResponse,
  AdminNotificationsStats,
  AdminUnreadCount,
  FeedbackListResponse,
  FeedbackDetail,
  ReportListResponse,
  ReportDetail,
} from '@/types/api'

// Configuración base de la API
const API_BASE_URL = import.meta.env.VITE_TALKIPLAY_API_URL || 'https://api.talkiplay.com'

// Función utilitaria para construir query string
function buildQueryString(params?: Record<string, any>): string {
  if (!params) return ''
  
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(([_, value]) => value !== undefined && value !== null && value !== '')
  )
  
  return Object.keys(filteredParams).length > 0 ? `?${new URLSearchParams(filteredParams as any).toString()}` : ''
}

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
        console.error('Error al guardar token en localStorage:', error)
      }
    } else {
      localStorage.removeItem('accessToken')
    }
  }


  // Método para obtener el token de acceso
  getAccessToken(): string | null {
    return this.accessToken
  }

  // Método base para hacer peticiones GET
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>('GET', endpoint)
  }

  // Método base para hacer peticiones POST
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>('POST', endpoint, data)
  }

  // Método base para hacer peticiones PUT
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>('PUT', endpoint, data)
  }

  // Método base para hacer peticiones DELETE
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>('DELETE', endpoint)
  }

  // Método base para hacer peticiones PATCH
  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>('PATCH', endpoint, data)
  }

  // Método privado para hacer peticiones HTTP
  private async request<T>(
    method: string,
    endpoint: string,
    data?: any
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`

    const headers: Record<string, string> = {
      'Accept': 'application/json',
    }

    // Si los datos son FormData, no establecer Content-Type (el navegador lo hará automáticamente)
    const isFormData = data instanceof FormData
    if (!isFormData) {
      headers['Content-Type'] = 'application/json'
    }

    // Agregar token de autorización si existe
    if (this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`
    }

    const options: RequestInit = {
      method,
      headers,
    }

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      options.body = isFormData ? data : JSON.stringify(data)
    }

    try {
      const response = await fetch(url, options)

      // Intentar parsear como JSON
      let responseData
      try {
        const text = await response.text()
        // Si la respuesta está vacía, intentar parsear como objeto vacío
        if (!text || text.trim() === '') {
          responseData = {}
        } else {
          responseData = JSON.parse(text)
        }
      } catch (jsonError) {
        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('text/html')) {
          throw new Error('La API no está configurada correctamente. Verifica la URL de la API.')
        }
        // Si es un código de éxito (2xx) pero no se puede parsear JSON, devolver objeto vacío
        if (response.ok) {
          console.warn('Respuesta exitosa pero no es JSON válido:', jsonError)
          responseData = {}
        } else {
          throw new Error('Respuesta no válida del servidor')
        }
      }

      // Aceptar códigos 200-299 como éxito (incluyendo 201 Created)
      if (!response.ok) {
        const errorMessage = responseData?.message || responseData?.error || `Error ${response.status}: ${response.statusText}`
        throw new Error(errorMessage)
      }

      return responseData as T
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Error de conexión')
    }
  }
}

// Instancia única del cliente API
const apiClient = new ApiClient(API_BASE_URL)

// --- Servicios de Autenticación ---
export const authService = {
  // Login
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    try {
      // Permitimos que el backend responda en distintos formatos:
      // 1) ApiResponse<LoginResponse>
      // 2) LoginResponse directo { user, accessToken }
      // 3) Cualquier objeto que contenga accessToken y user
      const raw = await apiClient.post<any>('/api/auth/login', credentials)

      if (!raw || typeof raw !== 'object') {
        throw new Error('Respuesta del servidor inválida')
      }

      let wrapped: ApiResponse<LoginResponse>

      // Caso 1: ya viene como ApiResponse<LoginResponse>
      if ('success' in raw && 'data' in raw && raw.data) {
        wrapped = raw as ApiResponse<LoginResponse>
      } else if (raw.user && (raw.accessToken || raw.token)) {
        // Caso 2: LoginResponse plano { user, accessToken } o { user, token }
        wrapped = {
          success: true,
          message: raw.message || 'Login exitoso',
          data: {
            user: raw.user,
            accessToken: raw.accessToken || raw.token,
          },
        }
      } else if (raw.data && raw.data.user && (raw.data.accessToken || raw.data.token)) {
        // Caso 3: data contiene user + token con otra key
        wrapped = {
          success: true,
          message: raw.message || 'Login exitoso',
          data: {
            user: raw.data.user,
            accessToken: raw.data.accessToken || raw.data.token,
          },
        }
      } else {
        console.error('Formato de respuesta de login no reconocido:', raw)
        throw new Error('Formato de respuesta de login no reconocido')
      }

      if (wrapped.success && wrapped.data) {
        const token = wrapped.data.accessToken
        if (token) {
          apiClient.setAccessToken(token)
        } else {
          console.warn('Login exitoso pero no se recibió accessToken')
        }
      } else {
        console.warn('Login no exitoso:', wrapped.message || 'Sin mensaje')
      }

      return wrapped
    } catch (error) {
      console.error('Error en login:', error)
      throw error
    }
  },

  // Olvido de contraseña
  async forgotPassword(email: string): Promise<ApiResponse<ForgotPasswordResponse>> {
    return apiClient.post<ApiResponse<ForgotPasswordResponse>>('/api/auth/forgot-password', { email })
  },

  // Verificar OTP
  async verifyOTP(email: string, code: string): Promise<ApiResponse<VerifyOTPResponse>> {
    return apiClient.post<ApiResponse<VerifyOTPResponse>>('/api/auth/verify-otp', { email, code })
  },

  // Reset password
  async resetPassword(payload: ResetPasswordRequest): Promise<ApiResponse<ResetPasswordResponse>> {
    return apiClient.post<ApiResponse<ResetPasswordResponse>>('/api/auth/reset-password', payload)
  },


  // Obtener perfil de usuario
  async getUserProfile(): Promise<ApiResponse<any>> {
    return apiClient.get<ApiResponse<any>>('/api/auth/profile')
  },

  // Logout (limpiar tokens)
  logout(): void {
    apiClient.setAccessToken(null)
    localStorage.removeItem('username')
  },

  // Método auxiliar para obtener access token
  getAccessToken(): string | null {
    return apiClient.getAccessToken()
  },
}

// --- Servicios de Administración de Familias (/api/admin/families) ---
export const adminFamilyService = {
  // Listar todas las familias con filtros y paginación
  async getFamilies(params?: AdminFamiliesQueryParams): Promise<AdminFamiliesResponse> {
    const query = buildQueryString(params as Record<string, any> | undefined)
    return apiClient.get<AdminFamiliesResponse>(`/api/admin/families${query}`)
  },

  // Obtener familia por ID
  async getById(id: string): Promise<AdminFamilyDetail> {
    return apiClient.get<AdminFamilyDetail>(`/api/admin/families/${id}`)
  },

  // Eliminar cuenta de familia
  async delete(id: string): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/api/admin/families/${id}`)
  },

  // Advertir a una familia
  async warn(id: string, payload: WarnUserPayload): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(`/api/admin/families/${id}/warn`, payload)
  },

  // Suspender a una familia
  async suspend(id: string, payload: SuspendUserPayload): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(`/api/admin/families/${id}/suspend`, payload)
  },

  // Bloquear a una familia
  async block(id: string, payload: BlockUserPayload): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(`/api/admin/families/${id}/block`, payload)
  },

  // Activar/Desbloquear a una familia
  async activate(id: string, payload: ActivateUserPayload): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(`/api/admin/families/${id}/activate`, payload)
  },

  // Actualizar imagen de perfil de familia (admin)
  async updateProfileImage(id: string, imageFile: File): Promise<AdminFamilyDetail> {
    const formData = new FormData()
    formData.append('image', imageFile)
    return apiClient.patch<AdminFamilyDetail>(`/api/admin/families/${id}/profile-image`, formData)
  },

  // Eliminar imagen de perfil de familia (admin)
  async deleteProfileImage(id: string): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/api/admin/families/${id}/profile-image`)
  },
}

// --- Servicios de Administración de Usuarios (Legacy - mantener para compatibilidad) ---
export const adminUserService = {
  // Listar usuarios con filtros y paginación
  async getUsers(params: AdminUsersQueryParams): Promise<AdminUsersResponse> {
    const query = buildQueryString(params as Record<string, any>)
    return apiClient.get<AdminUsersResponse>(`/api/admin/users${query}`)
  },

  // Obtener estadísticas de usuarios
  async getStats(): Promise<AdminUserStats> {
    return apiClient.get<AdminUserStats>('/api/admin/users/stats')
  },

  // Obtener detalle de usuario por ID
  async getById(id: string): Promise<AdminUserDetail> {
    return apiClient.get<AdminUserDetail>(`/api/admin/users/${id}`)
  },

  // Advertir usuario
  async warn(id: string, payload: WarnUserPayload): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(`/api/admin/users/${id}/warn`, payload)
  },

  // Suspender usuario
  async suspend(id: string, payload: SuspendUserPayload): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(`/api/admin/users/${id}/suspend`, payload)
  },

  // Bloquear usuario
  async block(id: string, payload: BlockUserPayload): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(`/api/admin/users/${id}/block`, payload)
  },

  // Activar usuario
  async activate(id: string, payload: ActivateUserPayload): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(`/api/admin/users/${id}/activate`, payload)
  },

  // Acción masiva sobre usuarios
  async bulkAction(payload: BulkActionPayload): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>('/api/admin/users/bulk-action', payload)
  },
}

// --- Servicios de Palabras Prohibidas (Moderation) ---
export const forbiddenWordsService = {
  // Listar todas las palabras prohibidas
  async getAll(): Promise<ForbiddenWordsResponse | ForbiddenWord[]> {
    const response = await apiClient.get<any>('/api/moderation/forbidden-words')
    
    // Si la respuesta es un array directo, convertirlo al formato esperado
    if (Array.isArray(response)) {
      return {
        data: response,
        total: response.length,
      }
    }
    
    // Si ya viene en el formato esperado, retornarlo tal cual
    return response as ForbiddenWordsResponse
  },

  // Crear una nueva palabra prohibida
  async create(payload: CreateForbiddenWordPayload): Promise<ApiResponse<ForbiddenWord> | ForbiddenWord> {
    const response = await apiClient.post<any>('/api/moderation/forbidden-words', payload)
    
    // Si la respuesta es directamente un ForbiddenWord (sin wrapper ApiResponse)
    if (response && typeof response === 'object' && 'word' in response && 'isStrong' in response) {
      return {
        success: true,
        message: 'Palabra creada exitosamente',
        data: response as ForbiddenWord,
      }
    }
    
    // Si ya viene en formato ApiResponse, retornarlo tal cual
    return response as ApiResponse<ForbiddenWord>
  },

  // Actualizar una palabra prohibida
  async update(id: string, payload: UpdateForbiddenWordPayload): Promise<ApiResponse<ForbiddenWord> | ForbiddenWord> {
    const response = await apiClient.put<any>(`/api/moderation/forbidden-words/${id}`, payload)
    
    // Si la respuesta es directamente un ForbiddenWord (sin wrapper ApiResponse)
    if (response && typeof response === 'object' && 'word' in response && 'isStrong' in response) {
      return {
        success: true,
        message: 'Palabra actualizada exitosamente',
        data: response as ForbiddenWord,
      }
    }
    
    // Si ya viene en formato ApiResponse, retornarlo tal cual
    return response as ApiResponse<ForbiddenWord>
  },

  // Eliminar una palabra prohibida
  async delete(id: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete<ApiResponse<{ message: string }>>(`/api/moderation/forbidden-words/${id}`)
  },
}

// --- Servicios de Dashboard Analytics ---
export const dashboardService = {
  // Obtener datos del dashboard
  async getDashboard(): Promise<DashboardAnalyticsResponse> {
    return apiClient.get<DashboardAnalyticsResponse>('/api/analytics/dashboard')
  },

  // Obtener métricas de uso
  async getUsageMetrics(): Promise<UsageMetricsResponse> {
    return apiClient.get<UsageMetricsResponse>('/api/analytics/usage-metrics')
  },
}

// --- Servicios de Settings ---
export const settingsService = {
  // Obtener todas las secciones de Términos y Condiciones
  async getTerms(): Promise<LegalDocument[]> {
    return apiClient.get<LegalDocument[]>('/api/settings/legal-documents/terms')
  },

  // Obtener todas las secciones de Política de Privacidad
  async getPrivacy(): Promise<LegalDocument[]> {
    return apiClient.get<LegalDocument[]>('/api/settings/legal-documents/privacy')
  },

  // Crear nueva sección de Términos y Condiciones (admin)
  async createTermsSection(payload: { title: string; content: string }): Promise<LegalDocument> {
    return apiClient.post<LegalDocument>('/api/settings/legal-documents/terms', payload)
  },

  // Crear nueva sección de Política de Privacidad (admin)
  async createPrivacySection(payload: { title: string; content: string }): Promise<LegalDocument> {
    return apiClient.post<LegalDocument>('/api/settings/legal-documents/privacy', payload)
  },

  // Actualizar sección (admin)
  async updateSection(id: string, payload: { title?: string; content?: string; isActive?: boolean }): Promise<LegalDocument> {
    return apiClient.patch<LegalDocument>(`/api/settings/legal-documents/${id}`, payload)
  },

  // Eliminar sección (admin)
  async deleteSection(id: string): Promise<void> {
    await apiClient.delete<void>(`/api/settings/legal-documents/${id}`)
  },
}

// --- Servicios de Feedback & Sugerencias ---
export const feedbackService = {
  // Listar feedback con paginación y filtros
  async list(params?: { page?: number; limit?: number; status?: string; search?: string }): Promise<FeedbackListResponse> {
    const query = buildQueryString(params as Record<string, any> | undefined)
    const response = await apiClient.get<any>(`/api/feedback${query}`)

    // El endpoint puede devolver directamente un array (como en tu ejemplo de curl)
    // o un objeto paginado con { data, total, page, limit, totalPages }.
    if (Array.isArray(response)) {
      const data = response
      const limit = params?.limit ?? data.length
      const page = params?.page ?? 1

      return {
        data,
        total: data.length,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(data.length / limit)),
      }
    }

    return response as FeedbackListResponse
  },

  // Obtener detalle de feedback por ID
  async getById(id: string): Promise<FeedbackDetail> {
    return apiClient.get<FeedbackDetail>(`/api/feedback/${id}`)
  },

  // Marcar feedback como leído
  async markAsRead(id: string): Promise<void> {
    await apiClient.put<void>(`/api/feedback/${id}/read`)
  },

  // Actualizar estado de feedback
  async updateStatus(id: string, status: string): Promise<void> {
    await apiClient.put<void>(`/api/feedback/${id}/status`, { status })
  },
}

// --- Servicios de Reportes de incidentes ---
export const reportsService = {
  // Listar reportes con filtros
  async list(params?: { page?: number; limit?: number; status?: string; type?: string }): Promise<ReportListResponse> {
    const query = buildQueryString(params as Record<string, any> | undefined)
    return apiClient.get<ReportListResponse>(`/api/reports${query}`)
  },

  // Obtener reporte por ID
  async getById(id: string): Promise<ReportDetail> {
    return apiClient.get<ReportDetail>(`/api/reports/${id}`)
  },

  // Eliminar reporte
  async delete(id: string): Promise<void> {
    await apiClient.delete<void>(`/api/reports/${id}`)
  },
}

// --- Servicios de Notificaciones de Administrador ---
export const notificationsService = {
  // Obtener notificaciones con paginación
  async getAdminNotifications(params?: { page?: number; limit?: number }): Promise<AdminNotificationsResponse> {
    const query = buildQueryString(params as Record<string, any> | undefined)
    return apiClient.get<AdminNotificationsResponse>(`/api/admin/notifications${query}`)
  },

  // Obtener estadísticas de notificaciones
  async getAdminNotificationsStats(): Promise<AdminNotificationsStats> {
    return apiClient.get<AdminNotificationsStats>('/api/admin/notifications/stats')
  },

  // Marcar notificación como leída
  async markNotificationAsRead(id: string): Promise<void> {
    await apiClient.post<void>(`/api/admin/notifications/${id}/read`)
  },

  // Obtener solo el conteo de no leídas (optimizado para badges en header, etc.)
  async getUnreadCount(): Promise<AdminUnreadCount> {
    return apiClient.get<AdminUnreadCount>('/api/admin/notifications/unread-count')
  },
}

// --- Servicios de Reportes de Usuario ---
export const userReportsService = {
  // Obtener reportes de un usuario
  async getUserReports(userId: string): Promise<any> {
    return apiClient.get<any>(`/api/admin/users/${userId}/reports`)
  },

  // Obtener sugerencias/feedback de un usuario
  async getUserSuggestions(userId: string): Promise<any> {
    return apiClient.get<any>(`/api/admin/users/${userId}/suggestions`)
  },
}

export default apiClient
export { buildQueryString }

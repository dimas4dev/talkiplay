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

  // Método privado para hacer peticiones HTTP
  private async request<T>(
    method: string,
    endpoint: string,
    data?: any
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }

    // Agregar token de autorización si existe
    if (this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`
    }

    const options: RequestInit = {
      method,
      headers,
    }

    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data)
    }

    try {
      const response = await fetch(url, options)

      // Intentar parsear como JSON
      let responseData
      try {
        responseData = await response.json()
      } catch (jsonError) {
        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('text/html')) {
          throw new Error('La API no está configurada correctamente. Verifica la URL de la API.')
        }
        throw new Error('Respuesta no válida del servidor')
      }

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
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/api/v1/auth/login', credentials)
    
    if (response.success && response.data) {
      // Guardar access token
      apiClient.setAccessToken(response.data.accessToken)
    }
    
    return response
  },

  // Olvido de contraseña
  async forgotPassword(email: string): Promise<ApiResponse<ForgotPasswordResponse>> {
    return apiClient.post<ApiResponse<ForgotPasswordResponse>>('/api/v1/auth/forgot-password', { email })
  },

  // Verificar OTP
  async verifyOTP(email: string, code: string): Promise<ApiResponse<VerifyOTPResponse>> {
    return apiClient.post<ApiResponse<VerifyOTPResponse>>('/api/v1/auth/verify-otp', { email, code })
  },

  // Reset password
  async resetPassword(payload: ResetPasswordRequest): Promise<ApiResponse<ResetPasswordResponse>> {
    return apiClient.post<ApiResponse<ResetPasswordResponse>>('/api/v1/auth/reset-password', payload)
  },


  // Obtener perfil de usuario
  async getUserProfile(): Promise<ApiResponse<any>> {
    return apiClient.get<ApiResponse<any>>('/api/v1/auth/profile')
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

// --- Servicios de Administración de Usuarios ---
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
}

export default apiClient
export { buildQueryString }

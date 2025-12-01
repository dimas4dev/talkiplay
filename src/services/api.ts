// Cliente base para peticiones HTTP
// TODO: Implementar servicios de API desde cero

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

export default apiClient
export { buildQueryString }

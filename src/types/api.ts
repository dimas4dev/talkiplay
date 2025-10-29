// Tipos para la API
export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  errors?: string[]
}

export interface LoginRequest {
  email: string
  password: string
}

export interface User {
  id: string
  username: string
  email: string
  created_at: string
  updated_at: string
}

export interface Tokens {
  accessToken: string
  refreshToken: string
}

export interface LoginResponse {
  user: User
  tokens: Tokens
}

export interface RefreshTokenResponse {
  accessToken: string
}

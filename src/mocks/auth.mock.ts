import type { ApiResponse, LoginResponse, User } from '@/types/api'

const MOCK_USER: User = {
  id: '1',
  username: 'admin',
  email: 'admin@talkiplay.com',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

const MOCK_ACCESS_TOKEN = 'mock_access_token_' + Date.now()

export const mockAuth = {
  login: (email: string, password: string): Response => {
    // Credenciales mock válidas
    if (email === 'admin@talkiplay.com' && password === 'admin123') {
      const response: ApiResponse<LoginResponse> = {
        success: true,
        message: 'Login exitoso',
        data: {
          user: MOCK_USER,
          accessToken: MOCK_ACCESS_TOKEN,
        },
      }
      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Error de credenciales inválidas
    const errorResponse: ApiResponse = {
      success: false,
      message: 'Credenciales inválidas',
      errors: ['Email o contraseña incorrectos'],
    }
    return new Response(JSON.stringify(errorResponse), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  },

  refreshToken: (): Response => {
    const response: ApiResponse<{ accessToken: string }> = {
      success: true,
      message: 'Token renovado exitosamente',
      data: {
        accessToken: 'new_mock_access_token_' + Date.now(),
      },
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },

  getUserProfile: (): Response => {
    const response: ApiResponse<User> = {
      success: true,
      message: 'Perfil obtenido exitosamente',
      data: MOCK_USER,
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },

  forgotPassword: (email: string): Response => {
    const response: ApiResponse<{ message: string }> = {
      success: true,
      message: 'Código OTP enviado exitosamente',
      data: {
        message: `Se ha enviado un código OTP a ${email}`,
      },
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },

  verifyOTP: (_email: string, code: string): Response => {
    // Código OTP mock válido
    if (code === '123456') {
      const response: ApiResponse<{ message: string }> = {
        success: true,
        message: 'Código OTP verificado exitosamente',
        data: {
          message: 'Código OTP válido',
        },
      }
      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const errorResponse: ApiResponse = {
      success: false,
      message: 'Código OTP inválido',
      errors: ['El código OTP proporcionado no es válido'],
    }
    return new Response(JSON.stringify(errorResponse), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  },

  resetPassword: (_email: string, code: string, newPassword: string): Response => {
    if (code === '123456' && newPassword.length >= 6) {
      const response: ApiResponse<{ message: string }> = {
        success: true,
        message: 'Contraseña restablecida exitosamente',
        data: {
          message: 'Tu contraseña ha sido restablecida correctamente',
        },
      }
      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const errorResponse: ApiResponse = {
      success: false,
      message: 'Error al restablecer contraseña',
      errors: ['Código OTP inválido o contraseña muy corta'],
    }
    return new Response(JSON.stringify(errorResponse), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  },
}


import type { ApiResponse, UserHeader, UserReportsData } from '@/types/dashboard'
import type { UserReport } from '@/types/dashboard'

// Datos mock de usuarios
const MOCK_USERS = [
  {
    id: '1',
    email: 'usuario1@example.com',
    name: 'María García',
    username: 'maria_garcia',
    role: 'user',
    subscription_status: 'premium',
    subscription_type: 'Premium',
    status: 'Activo',
    registrationDate: '2024-01-15T10:00:00Z',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    email: 'usuario2@example.com',
    name: 'Juan Pérez',
    username: 'juan_perez',
    role: 'user',
    subscription_status: 'pro',
    subscription_type: 'Pro',
    status: 'Activo',
    registrationDate: '2024-02-20T14:30:00Z',
    created_at: '2024-02-20T14:30:00Z',
    updated_at: '2024-02-20T14:30:00Z',
  },
  {
    id: '3',
    email: 'usuario3@example.com',
    name: 'Ana López',
    username: 'ana_lopez',
    role: 'user',
    subscription_status: 'explorer',
    subscription_type: 'Explorador',
    status: 'Activo',
    registrationDate: '2024-03-10T09:15:00Z',
    created_at: '2024-03-10T09:15:00Z',
    updated_at: '2024-03-10T09:15:00Z',
  },
]

const MOCK_USER_REPORTS: Record<string, UserReport[]> = {
  '1': [
    {
      id: 'report_1',
      date: '2024-10-01T10:00:00Z',
      title: 'Problema con la aplicación',
      author: 'María García',
      email: 'usuario1@example.com',
      body: 'La aplicación se cierra inesperadamente al intentar guardar un clip.',
      status: 'pending',
      created_at: '2024-10-01T10:00:00Z',
      updated_at: '2024-10-01T10:00:00Z',
    },
    {
      id: 'report_2',
      date: '2024-10-05T14:30:00Z',
      title: 'Error al sincronizar',
      author: 'María García',
      email: 'usuario1@example.com',
      body: 'No puedo sincronizar mis clips entre dispositivos.',
      status: 'reviewed',
      created_at: '2024-10-05T14:30:00Z',
      updated_at: '2024-10-06T09:00:00Z',
    },
  ],
  '2': [
    {
      id: 'report_3',
      date: '2024-10-03T11:20:00Z',
      title: 'Solicitud de función',
      author: 'Juan Pérez',
      email: 'usuario2@example.com',
      body: 'Me gustaría poder exportar clips en formato PDF.',
      status: 'resolved',
      created_at: '2024-10-03T11:20:00Z',
      updated_at: '2024-10-04T16:00:00Z',
    },
  ],
}

export const mockUsers = {
  getUsers: (params: any = {}): Response => {
    let filteredUsers = [...MOCK_USERS]

    // Filtrar por búsqueda
    if (params.search) {
      const searchLower = params.search.toLowerCase()
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          user.username.toLowerCase().includes(searchLower)
      )
    }

    // Filtrar por rol
    if (params.role) {
      filteredUsers = filteredUsers.filter((user) => user.role === params.role)
    }

    // Filtrar por estado de suscripción
    if (params.subscription_status) {
      filteredUsers = filteredUsers.filter(
        (user) => user.subscription_status === params.subscription_status
      )
    }

    // Ordenar
    if (params.sort_by) {
      filteredUsers.sort((a, b) => {
        const aVal = (a as any)[params.sort_by]
        const bVal = (b as any)[params.sort_by]
        const order = params.sort_order === 'desc' ? -1 : 1
        if (aVal < bVal) return -1 * order
        if (aVal > bVal) return 1 * order
        return 0
      })
    }

    // Paginación
    const page = parseInt(params.page) || 1
    const limit = parseInt(params.limit) || 10
    const start = (page - 1) * limit
    const end = start + limit
    const paginatedUsers = filteredUsers.slice(start, end)

    const response: ApiResponse = {
      success: true,
      message: 'Usuarios obtenidos exitosamente',
      data: {
        users: paginatedUsers,
        pagination: {
          page,
          limit,
          total: filteredUsers.length,
          totalPages: Math.ceil(filteredUsers.length / limit),
        },
      },
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },

  getUserById: (userId: string): Response => {
    const user = MOCK_USERS.find((u) => u.id === userId)
    if (!user) {
      const errorResponse: ApiResponse = {
        success: false,
        message: 'Usuario no encontrado',
        errors: ['El usuario con el ID proporcionado no existe'],
      }
      return new Response(JSON.stringify(errorResponse), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const userHeader: UserHeader = {
      id: parseInt(user.id),
      name: user.name,
      email: user.email,
      userId: user.id,
      subscription: user.subscription_type as 'Explorador' | 'Premium' | 'Pro',
      status: user.status as 'Activo' | 'Bloqueado' | 'Inactivo',
      registrationDate: user.registrationDate,
      reports: MOCK_USER_REPORTS[userId]?.length || 0,
    }

    const response: ApiResponse<UserHeader> = {
      success: true,
      message: 'Usuario obtenido exitosamente',
      data: userHeader,
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },

  getUserReports: (userId: string): Response => {
    const user = MOCK_USERS.find((u) => u.id === userId)
    if (!user) {
      const errorResponse: ApiResponse = {
        success: false,
        message: 'Usuario no encontrado',
        errors: ['El usuario con el ID proporcionado no existe'],
      }
      return new Response(JSON.stringify(errorResponse), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const userHeader: UserHeader = {
      id: parseInt(user.id),
      name: user.name,
      email: user.email,
      userId: user.id,
      subscription: user.subscription_type as 'Explorador' | 'Premium' | 'Pro',
      status: user.status as 'Activo' | 'Bloqueado' | 'Inactivo',
      registrationDate: user.registrationDate,
      reports: MOCK_USER_REPORTS[userId]?.length || 0,
    }

    const response: ApiResponse<UserReportsData> = {
      success: true,
      message: 'Reportes del usuario obtenidos exitosamente',
      data: {
        user: userHeader,
        reports: MOCK_USER_REPORTS[userId] || [],
      },
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },

  updateUser: (userId: string, data: any): Response => {
    const userIndex = MOCK_USERS.findIndex((u) => u.id === userId)
    if (userIndex === -1) {
      const errorResponse: ApiResponse = {
        success: false,
        message: 'Usuario no encontrado',
        errors: ['El usuario con el ID proporcionado no existe'],
      }
      return new Response(JSON.stringify(errorResponse), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const updatedUser = {
      ...MOCK_USERS[userIndex],
      ...data,
      updated_at: new Date().toISOString(),
    }
    MOCK_USERS[userIndex] = updatedUser

    const response: ApiResponse = {
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: updatedUser,
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },

  toggleUserStatus: (userId: string): Response => {
    const user = MOCK_USERS.find((u) => u.id === userId)
    if (!user) {
      const errorResponse: ApiResponse = {
        success: false,
        message: 'Usuario no encontrado',
        errors: ['El usuario con el ID proporcionado no existe'],
      }
      return new Response(JSON.stringify(errorResponse), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    user.status = user.status === 'Activo' ? 'Bloqueado' : 'Activo'
    user.updated_at = new Date().toISOString()

    const response: ApiResponse = {
      success: true,
      message: `Usuario ${user.status === 'Activo' ? 'activado' : 'bloqueado'} exitosamente`,
      data: user,
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },

  updateUserStatus: (userId: string, data: { status: string; reason?: string }): Response => {
    const user = MOCK_USERS.find((u) => u.id === userId)
    if (!user) {
      const errorResponse: ApiResponse = {
        success: false,
        message: 'Usuario no encontrado',
        errors: ['El usuario con el ID proporcionado no existe'],
      }
      return new Response(JSON.stringify(errorResponse), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const statusMap: Record<string, string> = {
      active: 'Activo',
      suspended: 'Bloqueado',
      blocked: 'Bloqueado',
    }

    user.status = statusMap[data.status] || user.status
    user.updated_at = new Date().toISOString()

    const response: ApiResponse = {
      success: true,
      message: 'Estado del usuario actualizado exitosamente',
      data: user,
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },

  deleteUser: (userId: string): Response => {
    const userIndex = MOCK_USERS.findIndex((u) => u.id === userId)
    if (userIndex === -1) {
      const errorResponse: ApiResponse = {
        success: false,
        message: 'Usuario no encontrado',
        errors: ['El usuario con el ID proporcionado no existe'],
      }
      return new Response(JSON.stringify(errorResponse), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    MOCK_USERS.splice(userIndex, 1)

    const response: ApiResponse = {
      success: true,
      message: 'Usuario eliminado exitosamente',
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },

  sendGreeting: (data: { user_ids: string[]; message: string; title: string }): Response => {
    const response: ApiResponse = {
      success: true,
      message: `Saludo enviado a ${data.user_ids.length} usuario(s) exitosamente`,
      data: {
        sent: data.user_ids.length,
        message: 'Saludo enviado correctamente',
      },
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },
}


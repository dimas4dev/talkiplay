import type { ApiResponse, UserHeader, UserReportsData } from '@/types/dashboard'
import type { UserReport } from '@/types/dashboard'

// Datos mock de usuarios
const MOCK_USERS = [
  {
    id: '1',
    email: 'msantos@mail.com',
    name: 'Familia Santos',
    username: 'Familia Santos',
    role: 'user',
    subscription_status: 'active',
    subscription_type: 'Premium',
    status: 'Bloqueado',
    registrationDate: '2024-11-07T10:00:00Z',
    created_at: '2024-11-07T10:00:00Z',
    updated_at: '2024-11-07T10:00:00Z',
  },
  {
    id: '2',
    email: 'juan.perez@example.com',
    name: 'Juan Pérez',
    username: 'Familia Santos',
    role: 'user',
    subscription_status: 'active',
    subscription_type: 'Pro',
    status: 'Bloqueado',
    registrationDate: '2024-02-20T14:30:00Z',
    created_at: '2024-02-20T14:30:00Z',
    updated_at: '2024-02-20T14:30:00Z',
  },
  {
    id: '3',
    email: 'ana.lopez@example.com',
    name: 'Ana López',
    username: 'Familia Santos',
    role: 'user',
    subscription_status: 'active',
    subscription_type: 'Explorador',
    status: 'Activo',
    registrationDate: '2024-03-10T09:15:00Z',
    created_at: '2024-03-10T09:15:00Z',
    updated_at: '2024-03-10T09:15:00Z',
  },
  {
    id: '4',
    email: 'carlos.martinez@example.com',
    name: 'Carlos Martínez',
    username: 'Familia Santos',
    role: 'user',
    subscription_status: 'active',
    subscription_type: 'Premium',
    status: 'Activo',
    registrationDate: '2024-02-24T08:00:00Z',
    created_at: '2024-02-24T08:00:00Z',
    updated_at: '2024-02-24T08:00:00Z',
  },
  {
    id: '5',
    email: 'laura.rodriguez@example.com',
    name: 'Laura Rodríguez',
    username: 'Familia Santos',
    role: 'user',
    subscription_status: 'cancelled',
    subscription_type: 'Explorador',
    status: 'Activo',
    registrationDate: '2024-02-24T10:30:00Z',
    created_at: '2024-02-24T10:30:00Z',
    updated_at: '2024-02-24T10:30:00Z',
  },
  {
    id: '6',
    email: 'pedro.sanchez@example.com',
    name: 'Pedro Sánchez',
    username: 'Familia Santos',
    role: 'user',
    subscription_status: 'active',
    subscription_type: 'Pro',
    status: 'Bloqueado',
    registrationDate: '2024-02-24T12:00:00Z',
    created_at: '2024-02-24T12:00:00Z',
    updated_at: '2024-02-24T12:00:00Z',
  },
  {
    id: '7',
    email: 'sofia.fernandez@example.com',
    name: 'Sofía Fernández',
    username: 'Familia Santos',
    role: 'user',
    subscription_status: 'suspended',
    subscription_type: 'Premium',
    status: 'Suspendido',
    registrationDate: '2024-02-24T14:15:00Z',
    created_at: '2024-02-24T14:15:00Z',
    updated_at: '2024-02-24T14:15:00Z',
  },
  {
    id: '8',
    email: 'diego.torres@example.com',
    name: 'Diego Torres',
    username: 'Familia Santos',
    role: 'user',
    subscription_status: 'active',
    subscription_type: 'Explorador',
    status: 'Activo',
    registrationDate: '2024-02-24T16:45:00Z',
    created_at: '2024-02-24T16:45:00Z',
    updated_at: '2024-02-24T16:45:00Z',
  },
  {
    id: '9',
    email: 'isabella.morales@example.com',
    name: 'Isabella Morales',
    username: 'Familia Santos',
    role: 'user',
    subscription_status: 'active',
    subscription_type: 'Pro',
    status: 'Activo',
    registrationDate: '2024-02-24T18:20:00Z',
    created_at: '2024-02-24T18:20:00Z',
    updated_at: '2024-02-24T18:20:00Z',
  },
  {
    id: '10',
    email: 'miguel.gonzalez@example.com',
    name: 'Miguel González',
    username: 'Familia Santos',
    role: 'user',
    subscription_status: 'blocked',
    subscription_type: 'Premium',
    status: 'Bloqueado',
    registrationDate: '2024-02-24T20:00:00Z',
    created_at: '2024-02-24T20:00:00Z',
    updated_at: '2024-02-24T20:00:00Z',
  },
  {
    id: '11',
    email: 'valentina.ramirez@example.com',
    name: 'Valentina Ramírez',
    username: 'Familia Santos',
    role: 'user',
    subscription_status: 'active',
    subscription_type: 'Explorador',
    status: 'Suspendido',
    registrationDate: '2024-02-24T22:10:00Z',
    created_at: '2024-02-24T22:10:00Z',
    updated_at: '2024-02-24T22:10:00Z',
  },
  {
    id: '12',
    email: 'santiago.cruz@example.com',
    name: 'Santiago Cruz',
    username: 'Familia Santos',
    role: 'user',
    subscription_status: 'active',
    subscription_type: 'Pro',
    status: 'Activo',
    registrationDate: '2024-02-24T23:30:00Z',
    created_at: '2024-02-24T23:30:00Z',
    updated_at: '2024-02-24T23:30:00Z',
  },
]

const MOCK_USER_REPORTS: Record<string, UserReport[]> = {
  '1': [
    {
      id: 'report_1',
      date: '2025-09-12T10:00:00Z',
      title: 'Reporte 1245',
      author: 'José Manuel',
      email: 'jmanuel@mail.com',
      body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      status: 'pending',
      created_at: '2025-09-12T10:00:00Z',
      updated_at: '2025-09-12T10:00:00Z',
    },
    {
      id: 'report_2',
      date: '2025-09-10T14:30:00Z',
      title: 'Reporte 1245',
      author: 'José Manuel',
      email: 'jmanuel@mail.com',
      body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      status: 'reviewed',
      created_at: '2025-09-10T14:30:00Z',
      updated_at: '2025-09-10T14:30:00Z',
    },
  ],
  '2': [
    {
      id: 'report_3',
      date: '2025-09-08T11:20:00Z',
      title: 'Reporte 1245',
      author: 'José Manuel',
      email: 'jmanuel@mail.com',
      body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      status: 'resolved',
      created_at: '2025-09-08T11:20:00Z',
      updated_at: '2025-09-08T11:20:00Z',
    },
  ],
}

const MOCK_USER_MANUAL_MESSAGES: Record<string, { sender: string; text: string }[]> = {
  '1': [
    { sender: 'Familia Santos', text: 'Lorem ipsum dolor' },
    { sender: 'Familia Suárez', text: 'Lorem' },
    {
      sender: 'Familia Santos',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla venenatis, ante ac porttitor dictum, metus dui malesuada arcu, at efficitur massa urna bibendum urna.',
    },
    { sender: 'Familia Suárez', text: 'Lorem' },
    {
      sender: 'Familia Suárez',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    { sender: 'Familia Santos', text: 'Lorem ipsum dolor sit amet, consectetur' },
    { sender: 'Familia Santos', text: 'Lorem ipsum' },
    {
      sender: 'Familia Suárez',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    { sender: 'Familia Santos', text: 'Lorem ipsum' },
    {
      sender: 'Familia Santos',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla venenatis, ante ac porttitor dictum.',
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

    // Datos de familia y miembros
    const familyMembers = [
      {
        id: '1',
        name: 'José Daniel',
        role: 'Admin',
        avatar: 'penguin',
        email: 'jdaniel@mail.com',
        created_at: '2025-02-24T10:00:00Z',
        status: 'suspended'
      },
      {
        id: '2',
        name: 'Fernando',
        role: 'Admin',
        avatar: 'turtle',
        email: 'fersantos@mail.com',
        created_at: '2025-02-24T10:00:00Z',
        status: 'active'
      },
      {
        id: '3',
        name: 'Laura',
        role: 'Integrante',
        avatar: 'fox',
        email: 'laura@mail.com',
        created_at: '2025-02-24T10:00:00Z',
        status: 'active'
      },
      {
        id: '4',
        name: 'Clara Isabel',
        role: 'Integrante',
        avatar: 'dog',
        email: 'clara@mail.com',
        created_at: '2025-02-24T10:00:00Z',
        status: 'active'
      }
    ]

    const history = [
      { date: '2024-11-07T10:00:00Z', text: 'Se registró' },
      { date: '2024-11-08T10:00:00Z', text: 'Fernando se unió al plan familiar' },
      { date: '2024-11-12T10:00:00Z', text: 'La familia recibió una advertencia' },
      { date: '2024-11-12T14:00:00Z', text: 'La familia fue bloqueada' },
      { date: '2024-11-12T16:00:00Z', text: 'La familia fue desbloqueada' }
    ]

    const response: ApiResponse<any> = {
      success: true,
      message: 'Usuario obtenido exitosamente',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
          created_at: user.created_at,
          status: user.status === 'Activo' ? 'active' : user.status === 'Bloqueado' ? 'blocked' : 'suspended',
          user_id: '000022',
          clicks: 3,
          reports: MOCK_USER_REPORTS[userId]?.length || 0,
        },
        subscription: {
          plan_type: user.subscription_status === 'active' ? 'premium' : 'explorer',
          status: user.subscription_status,
          start_date: user.created_at,
          end_date: null
        },
        family_members: familyMembers,
        administrators: familyMembers.filter(m => m.role === 'Admin'),
        history: history
      },
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
        manualMessages: MOCK_USER_MANUAL_MESSAGES[userId] || [],
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


import type { ApiResponse, UserReport } from '@/types/dashboard'

// Datos mock de reportes
const MOCK_REPORTS: UserReport[] = [
  {
    id: 'report_1',
    date: '2024-10-01T10:00:00Z',
    title: 'Problema con la aplicación',
    author: 'María García',
    email: 'usuario1@example.com',
    body: 'La aplicación se cierra inesperadamente al intentar guardar un clip. Esto ocurre tanto en iOS como en Android.',
    status: 'pending',
    created_at: '2024-10-01T10:00:00Z',
    updated_at: '2024-10-01T10:00:00Z',
  },
  {
    id: 'report_2',
    date: '2024-10-05T14:30:00Z',
    title: 'Error al sincronizar',
    author: 'Juan Pérez',
    email: 'usuario2@example.com',
    body: 'No puedo sincronizar mis clips entre dispositivos. He intentado varias veces sin éxito.',
    status: 'reviewed',
    created_at: '2024-10-05T14:30:00Z',
    updated_at: '2024-10-06T09:00:00Z',
  },
  {
    id: 'report_3',
    date: '2024-10-03T11:20:00Z',
    title: 'Solicitud de función',
    author: 'Ana López',
    email: 'usuario3@example.com',
    body: 'Me gustaría poder exportar clips en formato PDF. Sería muy útil para mi trabajo.',
    status: 'resolved',
    created_at: '2024-10-03T11:20:00Z',
    updated_at: '2024-10-04T16:00:00Z',
  },
  {
    id: 'report_4',
    date: '2024-10-07T08:15:00Z',
    title: 'Problema de rendimiento',
    author: 'Carlos Ruiz',
    email: 'usuario4@example.com',
    body: 'La aplicación va muy lenta cuando tengo muchos clips guardados. ¿Hay alguna forma de optimizar esto?',
    status: 'pending',
    created_at: '2024-10-07T08:15:00Z',
    updated_at: '2024-10-07T08:15:00Z',
  },
]

export const mockReports = {
  getReports: (params: any = {}): Response => {
    let filteredReports = [...MOCK_REPORTS]

    // Filtrar por estado
    if (params.status) {
      filteredReports = filteredReports.filter((r) => r.status === params.status)
    }

    // Filtrar por tipo de suscripción
    if (params.subscription_type) {
      // En un caso real, esto se filtraría por la suscripción del usuario
      // Por ahora, solo simulamos
    }

    // Buscar
    if (params.search) {
      const searchLower = params.search.toLowerCase()
      filteredReports = filteredReports.filter(
        (r) =>
          r.title.toLowerCase().includes(searchLower) ||
          r.body.toLowerCase().includes(searchLower) ||
          r.author.toLowerCase().includes(searchLower) ||
          r.email.toLowerCase().includes(searchLower)
      )
    }

    // Ordenar
    if (params.sort_by) {
      filteredReports.sort((a, b) => {
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
    const paginatedReports = filteredReports.slice(start, end)

    const response: ApiResponse = {
      success: true,
      message: 'Reportes obtenidos exitosamente',
      data: {
        reports: paginatedReports,
        pagination: {
          page,
          limit,
          total: filteredReports.length,
          totalPages: Math.ceil(filteredReports.length / limit),
        },
      },
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },

  getReportsSummary: (): Response => {
    const response: ApiResponse = {
      success: true,
      message: 'Resumen de reportes obtenido exitosamente',
      data: {
        total: MOCK_REPORTS.length,
        pending: MOCK_REPORTS.filter((r) => r.status === 'pending').length,
        reviewed: MOCK_REPORTS.filter((r) => r.status === 'reviewed').length,
        resolved: MOCK_REPORTS.filter((r) => r.status === 'resolved').length,
      },
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },

  getReportById: (reportId: string): Response => {
    const report = MOCK_REPORTS.find((r) => r.id === reportId)
    if (!report) {
      const errorResponse: ApiResponse = {
        success: false,
        message: 'Reporte no encontrado',
        errors: ['El reporte con el ID proporcionado no existe'],
      }
      return new Response(JSON.stringify(errorResponse), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const response: ApiResponse<UserReport> = {
      success: true,
      message: 'Reporte obtenido exitosamente',
      data: report,
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },

  updateReport: (reportId: string, payload: { status?: string; admin_response?: string; resolved?: boolean }): Response => {
    const reportIndex = MOCK_REPORTS.findIndex((r) => r.id === reportId)
    if (reportIndex === -1) {
      const errorResponse: ApiResponse = {
        success: false,
        message: 'Reporte no encontrado',
        errors: ['El reporte con el ID proporcionado no existe'],
      }
      return new Response(JSON.stringify(errorResponse), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const updatedReport = {
      ...MOCK_REPORTS[reportIndex],
      ...(payload.status && { status: payload.status as 'pending' | 'reviewed' | 'resolved' }),
      updated_at: new Date().toISOString(),
    }
    MOCK_REPORTS[reportIndex] = updatedReport

    const response: ApiResponse<UserReport> = {
      success: true,
      message: 'Reporte actualizado exitosamente',
      data: updatedReport,
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },

  markRead: (reportId: string): Response => {
    const reportIndex = MOCK_REPORTS.findIndex((r) => r.id === reportId)
    if (reportIndex === -1) {
      const errorResponse: ApiResponse = {
        success: false,
        message: 'Reporte no encontrado',
        errors: ['El reporte con el ID proporcionado no existe'],
      }
      return new Response(JSON.stringify(errorResponse), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const updatedReport = {
      ...MOCK_REPORTS[reportIndex],
      status: 'reviewed' as const,
      updated_at: new Date().toISOString(),
    }
    MOCK_REPORTS[reportIndex] = updatedReport

    const response: ApiResponse<UserReport> = {
      success: true,
      message: 'Reporte marcado como leído exitosamente',
      data: updatedReport,
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },

  markResolved: (reportId: string): Response => {
    const reportIndex = MOCK_REPORTS.findIndex((r) => r.id === reportId)
    if (reportIndex === -1) {
      const errorResponse: ApiResponse = {
        success: false,
        message: 'Reporte no encontrado',
        errors: ['El reporte con el ID proporcionado no existe'],
      }
      return new Response(JSON.stringify(errorResponse), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const updatedReport = {
      ...MOCK_REPORTS[reportIndex],
      status: 'resolved' as const,
      updated_at: new Date().toISOString(),
    }
    MOCK_REPORTS[reportIndex] = updatedReport

    const response: ApiResponse<UserReport> = {
      success: true,
      message: 'Reporte marcado como resuelto exitosamente',
      data: updatedReport,
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },

  getUserReports: (userId: string): Response => {
    // Filtrar reportes por usuario (simulado)
    const userReports = MOCK_REPORTS.filter((r) => {
      // En un caso real, esto se filtraría por userId
      // Por ahora, simulamos que algunos reportes pertenecen a este usuario
      return r.id.startsWith('report_')
    })

    const response: ApiResponse<UserReport[]> = {
      success: true,
      message: 'Reportes del usuario obtenidos exitosamente',
      data: userReports,
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },
}


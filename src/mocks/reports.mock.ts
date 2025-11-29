import type { ApiResponse, UserReport } from '@/types/dashboard'

// Datos mock de reportes (coinciden con el diseño de la tabla)
const MOCK_REPORTS: (UserReport & { user_id?: string; user_name?: string; generated_date?: string; comment?: string })[] = [
  {
    id: 'report_1',
    date: '2025-02-24T10:00:00Z',
    generated_date: '2025-02-24T10:00:00Z',
    title: 'Incidente 1',
    author: 'José Contreras',
    email: 'jcontreras@mail.com',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    status: 'pending', // Marcado
    created_at: '2025-02-24T10:00:00Z',
    updated_at: '2025-02-24T10:00:00Z',
    user_id: '1',
    user_name: 'José Contreras',
  },
  {
    id: 'report_2',
    date: '2025-02-24T11:00:00Z',
    generated_date: '2025-02-24T11:00:00Z',
    title: 'Incidente 2',
    author: 'José Contreras',
    email: 'jcontreras@mail.com',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    status: 'reviewed', // No leído
    created_at: '2025-02-24T11:00:00Z',
    updated_at: '2025-02-24T11:00:00Z',
    user_id: '1',
    user_name: 'José Contreras',
  },
  {
    id: 'report_3',
    date: '2025-02-24T12:00:00Z',
    generated_date: '2025-02-24T12:00:00Z',
    title: 'Incidente 3',
    author: 'José Contreras',
    email: 'jcontreras@mail.com',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    status: 'resolved', // Leído
    created_at: '2025-02-24T12:00:00Z',
    updated_at: '2025-02-24T12:00:00Z',
    user_id: '1',
    user_name: 'José Contreras',
  },
  {
    id: 'report_4',
    date: '2025-02-24T13:00:00Z',
    generated_date: '2025-02-24T13:00:00Z',
    title: 'Incidente 4',
    author: 'José Contreras',
    email: 'jcontreras@mail.com',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    status: 'pending', // Marcado
    created_at: '2025-02-24T13:00:00Z',
    updated_at: '2025-02-24T13:00:00Z',
    user_id: '1',
    user_name: 'José Contreras',
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
        summary: {
          reports_this_month: MOCK_REPORTS.length,
          total_reports: MOCK_REPORTS.length,
          unread_reports: MOCK_REPORTS.filter((r) => r.status === 'pending' || r.status === 'reviewed').length,
          marked_reports: MOCK_REPORTS.filter((r) => r.status === 'reviewed').length,
          resolved_reports: MOCK_REPORTS.filter((r) => r.status === 'resolved').length,
        },
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


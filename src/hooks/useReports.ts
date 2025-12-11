import { useApiData } from './useApiData'
import { feedbackService, reportsService } from '@/services/api'
import type { FeedbackListResponse, ReportListResponse } from '@/types/api'

export type ReportsQuery = {
  page?: number
  limit?: number
  status?: string
  type?: string
  search?: string
}

export function useAdminReports(params: ReportsQuery) {
  return useApiData<{
    reports: any[]
    pagination: { total: number; page: number; limit: number; total_pages: number }
  }>({
    fetchFn: async () => {
      const response: ReportListResponse = await reportsService.list({
        page: params.page,
        limit: params.limit,
        status: params.status,
        type: params.type,
      })

      const reports = response.data.map((item: any) => {
        // ID del usuario que usaremos para /api/admin/users/{id}/reports.
        // Prioridad: reporter.id (quien hizo el reporte) y fallback al usuario reportado.
        const userId =
          item.reporter?.id ||
          item.reportedUser?.id ||
          item.reporterId ||
          item.reportedUserId ||
          item.id

        const familyId = item.family?.id || item.familyId || null

        return {
          id: item.id,
          user_id: userId,
          family_id: familyId,
          author: item.family?.familyName || item.reporter?.email || item.reportedUser?.email || '-',
          email: item.reportedUser?.email || item.reporter?.email || '-',
          comment: item.offensiveContent || item.reason || '-',
          body: item.offensiveContent || item.reason || '-',
          status: item.status,
          created_at: item.createdAt,
        }
      })

      return {
        reports,
        pagination: {
          total: response.total,
          page: response.page,
          limit: response.limit,
          total_pages: response.totalPages,
        },
      }
    },
    dependencies: [params.page, params.limit, params.status, params.type],
  })
}

// Lista de sugerencias de mejora (feedback)
export function useFeedbackList(params: ReportsQuery) {
  return useApiData<{
    reports: any[]
    pagination: { total: number; page: number; limit: number; total_pages: number }
  }>({
    fetchFn: async () => {
      const response: FeedbackListResponse = await feedbackService.list({
        page: params.page,
        limit: params.limit,
        status: params.status,
        search: params.search,
      })

      const reports = response.data.map((item) => {
        const user = (item as any).user || null

        return {
          id: item.id,
          // ID del usuario que envía la sugerencia (fallback al id de la sugerencia si no hay user)
          user_id: user?.id || item.id,
          // ID de la familia asociada (si existe) para usarlo en la página de detalle
          family_id: (item as any).familyId || null,
          author: item.fullName || user?.name || item.email || '-',
          email: item.email || user?.email || '-',
          comment: item.comments,
          body: item.comments,
          status: item.status,
          created_at: item.createdAt,
        }
      })

      return {
        reports,
        pagination: {
          total: response.total,
          page: response.page,
          limit: response.limit,
          total_pages: response.totalPages,
        },
      }
    },
    dependencies: [params.page, params.limit, params.status, params.search],
  })
}

export function useAdminReportsSummary() {
  return useApiData<any>({
    fetchFn: async () => {
      // TODO: Implementar llamada a API
      throw new Error('Servicio de resumen de reportes no implementado aún')
    },
    enabled: false,
  })
}


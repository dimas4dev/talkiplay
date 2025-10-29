import { useApiData } from './useApiData'
import { reportsService } from '@/services/api'
import type { UserReportsData, UserReport } from '@/types/dashboard'

export function useUserReports(userId: string) {
  return useApiData<UserReportsData>({
    fetchFn: async () => {
      const response = await reportsService.getUserReports(userId)
      
      if (response.success && response.data) {
        return response.data
      } else {
        throw new Error(`Error al cargar los reportes del usuario ${userId}`)
      }
    }
  })
}

export function useUserReportsList(userId: string, params?: any) {
  return useApiData<UserReport[]>({
    fetchFn: async () => {
      const response = await reportsService.getUserReportsList(userId, params)
      
      if (response.success && response.data) {
        return response.data
      } else {
        throw new Error(`Error al cargar la lista de reportes del usuario ${userId}`)
      }
    }
  })
}

export function useReportById(reportId: string) {
  return useApiData<UserReport>({
    fetchFn: async () => {
      const response = await reportsService.getReportById(reportId)
      
      if (response.success && response.data) {
        return response.data
      } else {
        throw new Error(`Error al cargar el reporte ${reportId}`)
      }
    }
  })
}

// Hook para operaciones CRUD de reportes
export function useReportOperations() {
  const updateReportStatus = async (reportId: string, status: 'pending' | 'reviewed' | 'resolved') => {
    const response = await reportsService.updateReportStatus(reportId, status)
    if (!response.success) {
      throw new Error('Error al actualizar el estado del reporte')
    }
    return response.data
  }

  const deleteReport = async (reportId: string) => {
    const response = await reportsService.deleteReport(reportId)
    if (!response.success) {
      throw new Error('Error al eliminar el reporte')
    }
    return response.data
  }

  return {
    updateReportStatus,
    deleteReport
  }
}

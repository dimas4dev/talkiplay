import { useApiData } from './useApiData'
import { userReportsService, adminFamilyService } from '@/services/api'
import type { UserReportsData, UserReport, UserHeader } from '@/types/dashboard'
import type { ReportListItem, FeedbackItem } from '@/types/api'

// Función para mapear ReportListItem a UserReport
function mapReportToUserReport(report: ReportListItem, index: number): UserReport {
  return {
    id: report.id,
    date: report.createdAt,
    title: report.reason || `Reporte ${index + 1}`,
    author: report.family?.familyName || report.reportedUser?.email || 'Desconocido',
    email: report.reportedUser?.email || '',
    body: report.offensiveContent || report.reason || '',
    status: report.status === 'marked' ? 'pending' : report.status === 'read' ? 'reviewed' : 'resolved',
    created_at: report.createdAt,
    updated_at: report.createdAt,
  }
}

// Función para mapear FeedbackItem a UserReport
function mapFeedbackToUserReport(feedback: FeedbackItem, index: number): UserReport {
  return {
    id: feedback.id,
    date: feedback.createdAt,
    title: feedback.comments?.substring(0, 50) || `Sugerencia ${index + 1}`,
    author: feedback.fullName || feedback.user?.name || 'Desconocido',
    email: feedback.email || feedback.user?.email || '',
    body: feedback.comments || '',
    status: feedback.status === 'unread' ? 'pending' : feedback.status === 'read' ? 'reviewed' : 'resolved',
    created_at: feedback.createdAt,
    updated_at: feedback.createdAt,
  }
}

export function useUserReports(userId: string) {
  return useApiData<UserReportsData>({
    fetchFn: async () => {
      // Obtener reportes del usuario
      const reportsData = await userReportsService.getUserReports(userId)
      
      // Obtener información de la familia para construir UserHeader
      const familyData = await adminFamilyService.getById(userId)
      
      // Mapear reportes
      const reports: UserReport[] = Array.isArray(reportsData) 
        ? reportsData.map((r: any, i: number) => {
            // Si viene como ReportListItem
            if (r.type && r.reportedUser) {
              return mapReportToUserReport(r as ReportListItem, i)
            }
            // Si ya viene en formato UserReport
            return r as UserReport
          })
        : reportsData?.data?.map((r: any, i: number) => mapReportToUserReport(r, i)) || []
      
      // Construir UserHeader desde familyData
      const userHeader: UserHeader = {
        id: parseInt(familyData.id) || 0,
        name: familyData.family?.familyName || familyData.name || '',
        email: familyData.email || '',
        userId: familyData.id,
        subscription: 'Explorador' as const, // TODO: obtener del API si está disponible
        status: familyData.accountStatus === 'active' ? 'Activo' : 
                familyData.accountStatus === 'blocked' ? 'Bloqueado' : 'Inactivo',
        registrationDate: familyData.createdAt || '',
        reports: reports.length,
        clicks: familyData.clicksCount || 0,
      }
      
      return {
        user: userHeader,
        reports,
        manualMessages: [], // TODO: obtener del API si está disponible
      }
    },
    dependencies: [userId],
    enabled: !!userId,
  })
}

export function useUserSuggestions(userId: string) {
  return useApiData<UserReportsData>({
    fetchFn: async () => {
      // Obtener sugerencias del usuario
      const suggestionsData = await userReportsService.getUserSuggestions(userId)
      
      // Obtener información de la familia para construir UserHeader
      const familyData = await adminFamilyService.getById(userId)
      
      // Mapear sugerencias
      const reports: UserReport[] = Array.isArray(suggestionsData)
        ? suggestionsData.map((s: any, i: number) => {
            // Si viene como FeedbackItem
            if (s.comments && s.user) {
              return mapFeedbackToUserReport(s as FeedbackItem, i)
            }
            // Si ya viene en formato UserReport
            return s as UserReport
          })
        : suggestionsData?.data?.map((s: any, i: number) => mapFeedbackToUserReport(s, i)) || []
      
      // Construir UserHeader desde familyData
      const userHeader: UserHeader = {
        id: parseInt(familyData.id?.replace(/-/g, '').substring(0, 8) || '0', 16) || 0,
        name: familyData.family?.familyName || familyData.name || '',
        email: familyData.email || '',
        userId: familyData.id,
        subscription: 'Explorador' as const, // TODO: obtener del API si está disponible
        status: familyData.accountStatus === 'active' ? 'Activo' : 
                familyData.accountStatus === 'blocked' ? 'Bloqueado' : 'Inactivo',
        registrationDate: familyData.createdAt || '',
        reports: reports.length,
        clicks: familyData.clicksCount || 0,
      }
      
      return {
        user: userHeader,
        reports,
      }
    },
    dependencies: [userId],
    enabled: !!userId,
  })
}

export function useUserReportsList(userId: string, params?: any) {
  return useApiData<any>({
    fetchFn: async () => {
      // TODO: Implementar llamada a API si es necesario
      throw new Error('Servicio de lista de reportes no implementado aún')
    },
    dependencies: [userId, params],
    enabled: false, // Deshabilitado hasta que se implemente
  })
}


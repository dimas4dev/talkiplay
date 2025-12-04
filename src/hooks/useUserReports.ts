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
    type: (report as any).type,
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

// En esta pantalla el parámetro que recibimos en la URL es el ID del USUARIO.
// Paso 1: consultamos /api/admin/users/{userId}/reports
// Paso 2: de la respuesta tomamos el familyId del primer reporte (si existe)
//         y con eso consultamos /api/admin/families/{familyId} para armar el header.
export function useUserReports(userId: string) {
  return useApiData<UserReportsData>({
    fetchFn: async () => {
      // 1) Obtener reportes del usuario
      const rawReports = await userReportsService.getUserReports(userId)

      const reportsArray: any[] = Array.isArray((rawReports as any)?.data)
        ? (rawReports as any).data
        : Array.isArray(rawReports)
          ? (rawReports as any)
          : []
      
      // Mapear reportes
      const reports: UserReport[] = reportsArray.map((r: any, i: number) => {
        if (r.type && r.reportedUser) {
          return mapReportToUserReport(r as ReportListItem, i)
        }
        return r as UserReport
      })

      // 2) Intentar obtener la familia a partir del primer reporte
      const firstReport = reportsArray[0]
      const familyIdFromReport: string | null =
        firstReport?.family?.id || firstReport?.familyId || null

      let familyData: any = null
      if (familyIdFromReport) {
        familyData = await adminFamilyService.getById(familyIdFromReport)
      }

      // Construir UserHeader priorizando la información de la familia
      const userHeader: UserHeader = {
        id: familyData ? parseInt(familyData.id) || 0 : 0,
        name:
          familyData?.familyName ||
          familyData?.family?.familyName ||
          firstReport?.family?.familyName ||
          firstReport?.reportedUser?.name ||
          firstReport?.reportedUser?.email ||
          'Usuario',
        email:
          familyData?.email ||
          familyData?.family?.user?.email ||
          firstReport?.reportedUser?.email ||
          firstReport?.reporter?.email ||
          '',
        userId: userId,
        subscription: 'Explorador' as const, // TODO: obtener del API si está disponible
        status:
          (familyData?.accountStatus === 'blocked'
            ? 'Bloqueado'
            : familyData?.accountStatus === 'inactive'
              ? 'Inactivo'
              : 'Activo'),
        registrationDate: familyData?.createdAt || firstReport?.createdAt || '',
        reports: reports.length,
        clicks: familyData?.clicksCount || 0,
      }
      
      // 3) Construir lista de mensajes manuales a partir de los reportes type === 'manual'
      const manualMessages = reportsArray
        .filter((r: any) => r.type === 'manual')
        .flatMap((r: any) =>
          (r.lastMessages || []).map((m: any) => ({
            sender: m.sender?.familyName || 'Familia',
            text: m.content,
          })),
        )
        .slice(0, 10)

      return {
        user: userHeader,
        reports,
        // Mensajes construidos desde los reportes manuales del API
        manualMessages,
      }
    },
    dependencies: [userId],
    enabled: !!userId,
  })
}

// Para sugerencias seguimos recibiendo el ID de USUARIO (no de familia),
// por lo que aquí no cambiamos la semántica todavía.
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
        name:
          (familyData as any)?.family?.familyName ||
          (familyData as any)?.familyName ||
          (familyData as any)?.name ||
          'Familia',
        email: (familyData as any)?.email || (familyData as any)?.family?.user?.email || '',
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


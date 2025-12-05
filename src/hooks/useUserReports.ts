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

      const rawStatus: string = familyData?.accountStatus || 'active'
      const normalizedStatus = rawStatus.toLowerCase()
      let statusText: UserHeader['status'] = 'Activo'
      if (normalizedStatus.includes('bloq') || rawStatus === 'blocked') {
        statusText = 'Bloqueado'
      } else if (normalizedStatus.includes('suspen') || rawStatus === 'suspended') {
        statusText = 'Suspendido'
      } else if (normalizedStatus.includes('inac') || rawStatus === 'inactive') {
        statusText = 'Inactivo'
      }

      // Construir UserHeader priorizando la información de la familia
      const userHeader: UserHeader = {
        id: 0,
        name:
          familyData?.family?.familyName ||
          familyData?.familyName ||
          firstReport?.family?.familyName ||
          firstReport?.reportedUser?.name ||
          firstReport?.reportedUser?.email ||
          'Usuario',
        email:
          familyData?.email ||
          firstReport?.reportedUser?.email ||
          firstReport?.reporter?.email ||
          '',
        userId: familyData?.userId || userId,
        familyId: familyIdFromReport || familyData?.family?.id,
        subscription: 'Explorador' as const, // TODO: obtener del API si está disponible
        status: statusText,
        registrationDate: familyData?.createdAt || firstReport?.createdAt || '',
        reports: familyData?.reportCount ?? reports.length,
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
export function useUserSuggestions(userId: string, familyId?: string | null) {
  return useApiData<UserReportsData>({
    fetchFn: async () => {
      // 1) Obtener sugerencias del usuario
      const rawSuggestions = await userReportsService.getUserSuggestions(userId)

      const suggestionsArray: any[] = Array.isArray((rawSuggestions as any)?.data)
        ? (rawSuggestions as any).data
        : Array.isArray(rawSuggestions)
          ? (rawSuggestions as any)
          : []

      // Mapear sugerencias al formato de UserReport
      const reports: UserReport[] = suggestionsArray.map((s: any, i: number) => {
        if (s.comments && s.user) {
          return mapFeedbackToUserReport(s as FeedbackItem, i)
        }
        return s as UserReport
      })

      const first = suggestionsArray[0]
      // 2) Determinar familyId a usar: prioridad al queryParam, luego al campo familyId del API
      const familyIdToUse: string | null = familyId || first?.familyId || null

      let familyData: any = null
      if (familyIdToUse) {
        familyData = await adminFamilyService.getById(familyIdToUse)
      }

      const rawStatus: string = familyData?.accountStatus || 'active'
      const normalizedStatus = rawStatus.toLowerCase()
      let statusText: UserHeader['status'] = 'Activo'
      if (normalizedStatus.includes('bloq') || rawStatus === 'blocked') {
        statusText = 'Bloqueado'
      } else if (normalizedStatus.includes('suspen') || rawStatus === 'suspended') {
        statusText = 'Suspendido'
      } else if (normalizedStatus.includes('inac') || rawStatus === 'inactive') {
        statusText = 'Inactivo'
      }

      // 3) Construir UserHeader combinando info de familia + usuario que envía la sugerencia
      const userHeader: UserHeader = {
        id: 0,
        name:
          familyData?.family?.familyName ||
          familyData?.familyName ||
          first?.user?.name ||
          first?.user?.email ||
          'Usuario',
        email:
          familyData?.email ||
          first?.user?.email ||
          '',
        userId: familyData?.userId || first?.user?.id || userId,
        familyId: familyIdToUse || familyData?.family?.id,
        subscription: 'Explorador' as const, // TODO: obtener del API si está disponible
        status: statusText,
        registrationDate: familyData?.createdAt || first?.createdAt || '',
        reports: familyData?.reportCount ?? reports.length,
        clicks: familyData?.clicksCount || 0,
      }
      
      return {
        user: userHeader,
        reports,
      }
    },
    dependencies: [userId, familyId],
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


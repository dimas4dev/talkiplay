import { Link, useParams } from 'wouter'
import UserHeaderCard from '@/components/users/UserHeaderCard'
import { ROUTES } from '@/constants/routes'
import ApiStateHandler from '@/components/ui/ApiStateHandler'
import { ToastContainer, useToast } from '@/components/ui/toast'
import { useUserReports, useReportOperations } from '@/hooks/useUserReports'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

type RouteParams = { id: string }

export default function UserReportsPage() {
  const { t } = useTranslation('reports')
  const { id } = useParams<RouteParams>()
  const { data, isLoading, error, refetch } = useUserReports(id || '')
  const { updateReportStatus, deleteReport } = useReportOperations()
  const { toasts, removeToast, success, error: showError } = useToast()
  const [isUpdating, setIsUpdating] = useState(false)

  // Función para manejar operaciones de reportes
  const handleUpdateReportStatus = async (reportId: string, status: 'pending' | 'reviewed' | 'resolved') => {
    setIsUpdating(true)
    try {
      await updateReportStatus(reportId, status)
      await refetch()
      success('Estado actualizado', 'El estado del reporte se ha actualizado correctamente')
    } catch (error) {
      console.error('Error al actualizar estado:', error)
      showError('Error al actualizar', 'No se pudo actualizar el estado del reporte')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteReport = async (reportId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este reporte?')) {
      return
    }
    
    setIsUpdating(true)
    try {
      await deleteReport(reportId)
      await refetch()
      success('Reporte eliminado', 'El reporte se ha eliminado correctamente')
    } catch (error) {
      console.error('Error al eliminar reporte:', error)
      showError('Error al eliminar', 'No se pudo eliminar el reporte')
    } finally {
      setIsUpdating(false)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <>
      <ApiStateHandler
        isLoading={isLoading}
        error={error}
        data={data}
        loadingText="Cargando reportes del usuario..."
        errorTitle="Error al cargar los reportes"
        emptyText="No hay reportes disponibles para este usuario"
      >
        {(data) => (
          <div className="mx-auto max-w-6xl p-6">
            {/* Breadcrumb */}
            <nav className="mb-4 text-sm text-neutral-500">
              <Link href={ROUTES.reports} className="underline underline-offset-2">{t('title')}</Link>
              <span className="mx-2">/</span>
              <span className="text-neutral-900">{data.user.name}</span>
            </nav>

            {/* Header del usuario reutilizable */}
            <UserHeaderCard user={data.user} />

            {/* Lista de reportes */}
            <h2 className="mb-3 text-lg font-semibold text-neutral-900">{t('title')}</h2>
            <div className="space-y-6">
              {data.reports.map((report) => (
                <div key={report.id}>
                  {/* Fecha fuera del contenedor */}
                  <div className="mb-2 text-sm text-neutral-500">{formatDate(report.date)}</div>
                  <section className="rounded-lg border border-neutral-200 bg-white p-6">
                    <div className="mb-4 flex items-start justify-between">
                      <h3 className="text-base font-semibold text-neutral-900">{report.title}</h3>
                      <div className="flex gap-2">
                        <button 
                          className="rounded p-1 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          onClick={() => handleUpdateReportStatus(report.id, 'reviewed')}
                          disabled={isUpdating}
                        >
                          <span className="ms">check</span>
                        </button>
                        <button 
                          className="rounded p-1 hover:bg-danger-50 text-danger-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          onClick={() => handleDeleteReport(report.id)}
                          disabled={isUpdating}
                        >
                          <span className="ms">delete</span>
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-neutral-900 mb-4">
                      <div className="font-semibold">{t('tableLabels.fullName')}</div>
                      <div className="text-right">{report.author}</div>
                      <div className="font-semibold">{t('tableLabels.email')}</div>
                      <div className="text-right">{report.email}</div>
                      <div className="font-semibold">{t('table.status')}</div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded text-xs ${
                          report.status === 'pending' ? 'bg-warning-50 text-warning-800' :
                          report.status === 'reviewed' ? 'bg-info-50 text-info-800' :
                          'bg-success-50 text-success-800'
                        }`}>
                          {report.status === 'pending' ? t('statusLabels.pending') :
                           report.status === 'reviewed' ? t('statusLabels.reviewed') : t('statusLabels.resolved')}
                        </span>
                      </div>
                      <div className="font-semibold">{t('table.comment')}</div>
                      <div></div>
                    </div>
                    <p className="text-neutral-900 leading-relaxed">{report.body}</p>
                  </section>
                </div>
              ))}
            </div>
          </div>
        )}
      </ApiStateHandler>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  )
}



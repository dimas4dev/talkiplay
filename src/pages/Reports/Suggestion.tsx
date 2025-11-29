import { Link, useParams } from 'wouter'
import UserHeaderCard from '@/components/users/UserHeaderCard'
import { ROUTES } from '@/constants/routes'
import ApiStateHandler from '@/components/ui/ApiStateHandler'
import { ToastContainer, useToast } from '@/components/ui/toast'
import { useUserReports } from '@/hooks/useUserReports'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import FamilyMemberCard from '@/components/users/FamilyMemberCard'

type RouteParams = { id: string }

export default function UserSuggestionReportsPage() {
  const { t } = useTranslation('reports')
  const { id } = useParams<RouteParams>()
  const { data, isLoading, error } = useUserReports(id || '')
  const { toasts, removeToast } = useToast()
  const [flaggedIds, setFlaggedIds] = useState<string[]>([])

  const groupedReports = useMemo(() => {
    if (!data?.reports) return []
    const byDate: Record<string, typeof data.reports> = {}
    data.reports.forEach((report) => {
      const date = new Date(report.date || report.created_at)
      const key = date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
      if (!byDate[key]) byDate[key] = []
      byDate[key].push(report)
    })
    return Object.entries(byDate)
  }, [data])

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
        {(data) => {
          const firstReport = data.reports[0]
          const reporterName = firstReport?.author || data.user.name
          const reporterRole = 'Admin'
          return (
          <div className="mx-auto max-w-6xl space-y-6">
            {/* Breadcrumb */}
            <nav className="mb-2 mt-4 text-sm text-neutral-500">
              <Link href={ROUTES.reports} className="underline underline-offset-2">
                {t('title')}
              </Link>
              <span className="mx-2">/</span>
              <span className="text-neutral-900" style={{ color: '#006874' }}>
                {reporterName}
              </span>
            </nav>

            {/* Header compuesto: usuario + familia */}
            <div className="grid items-stretch gap-4 md:grid-cols-[220px_1fr]">
              {/* Tarjeta usuario */}
              <FamilyMemberCard
                name={reporterName}
                role={reporterRole}
                avatar={(firstReport as any)?.avatar || 'penguin'}
                size="small"
              />

              {/* Tarjeta familia con menú que solo tiene "Ver familia" */}
              <UserHeaderCard user={data.user} menuMode="familyOnly" />
            </div>

            {/* Lista de reportes */}
            <h2 className="text-lg font-semibold text-neutral-900">Reportes</h2>

            <div className="space-y-6">
              {groupedReports.map(([dateLabel, reports]) => (
                <div key={dateLabel} className="space-y-4">
                  <div className="text-sm text-neutral-500">{dateLabel}</div>
                  {reports.map((report) => (
                    <section key={report.id} className="rounded-2xl border border-neutral-200 bg-white p-6">
                      <div className="mb-4 flex items-start justify-between">
                        <h3 className="text-base font-semibold text-neutral-900">{report.title}</h3>
                        <button
                          type="button"
                          className="rounded p-1 text-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          onClick={() =>
                            setFlaggedIds((prev) =>
                              prev.includes(report.id) ? prev.filter((id) => id !== report.id) : [...prev, report.id],
                            )
                          }
                          aria-label="Marcar reporte"
                        >
                          <span
                            className={`ms ${flaggedIds.includes(report.id) ? 'ms-filled' : ''}`}
                            style={{
                              color: flaggedIds.includes(report.id) ? '#B42318' : '#9FA8AA',
                            }}
                          >
                            {flaggedIds.includes(report.id) ? 'flag' : 'outlined_flag'}
                          </span>
                        </button>
                      </div>
                      <div className="mb-4 grid grid-cols-2 gap-y-1 text-sm text-neutral-900">
                        <div className="font-semibold">Nombre completo</div>
                        <div className="text-right">{report.author}</div>
                        <div className="font-semibold">Correo electrónico</div>
                        <div className="text-right">{report.email}</div>
                        <div className="font-semibold">Comentario</div>
                        <div></div>
                      </div>
                      <p className="text-sm leading-relaxed text-neutral-900">{report.body}</p>
                      <div className="mt-2 text-xs text-neutral-500">...</div>
                    </section>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}}
      </ApiStateHandler>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  )
}



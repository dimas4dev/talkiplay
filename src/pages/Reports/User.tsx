import { Link, useParams } from 'wouter'
import UserHeaderCard from '@/components/users/UserHeaderCard'
import { ROUTES } from '@/constants/routes'
import ApiStateHandler from '@/components/ui/ApiStateHandler'
import { ToastContainer, useToast } from '@/components/ui/toast'
import { useUserReports } from '@/hooks/useUserReports'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

type RouteParams = { id: string }

export default function UserReportsPage() {
  const { t } = useTranslation('reports')
  const { id } = useParams<RouteParams>()
  const { data, isLoading, error } = useUserReports(id || '')
  const { toasts, removeToast } = useToast()
  const [activeTab, setActiveTab] = useState<'sent' | 'manual'>('sent')
  const [isManualOpen, setIsManualOpen] = useState(true)

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const groupedReports = useMemo(() => {
    if (!data?.reports) return []
    const byDate: Record<string, typeof data.reports> = {}
    data.reports.forEach((report) => {
      const key = formatDate(report.date || report.created_at)
      if (!byDate[key]) byDate[key] = []
      byDate[key].push(report)
    })
    const entries = Object.entries(byDate)
    // ordenar por fecha descendente
    return entries.sort(([dateA], [dateB]) => {
      const a = new Date(dateA.split(' ').reverse().join('-')).getTime()
      const b = new Date(dateB.split(' ').reverse().join('-')).getTime()
      return b - a
    })
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
          const manualMessages = data.manualMessages ?? []
          return (
          <div className="mx-auto max-w-6xl p-6 space-y-6">
            {/* Breadcrumb */}
            <nav className="mb-4 text-sm text-neutral-500">
              <Link href={ROUTES.reports} className="underline underline-offset-2">{t('title')}</Link>
              <span className="mx-2">/</span>
              <span className="text-neutral-900" style={{ color: '#006874' }}>{data.user.name}</span>
            </nav>

            {/* Header familia */}
            <UserHeaderCard user={data.user} />

            {/* Botones de acción familia */}
            <div className="grid grid-cols-3 gap-4">
              <button 
                className="w-full rounded-lg border-0 px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                style={{
                  backgroundColor: 'var(--color-primary-container)',
                  color: 'var(--color-primary-600)',
                }}
              >
                Advertir
              </button>
              <button 
                className="w-full rounded-lg border-0 px-4 py-3 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                style={{
                  backgroundColor: 'var(--color-primary-500)',
                }}
              >
                Suspender
              </button>
              <button 
                className="w-full rounded-lg border-0 px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                style={{
                  backgroundColor: 'var(--color-error-container)',
                  color: 'var(--color-error-500)',
                }}
              >
                Desbloquear
              </button>
            </div>

            {/* Título Reportes */}
            <h2 className="text-lg font-semibold text-neutral-900">Reportes</h2>

            {/* Tabs Enviados / Manuales */}
            <div className="flex items-center justify-evenly text-sm font-semibold border-b border-neutral-200 pb-2">
              <button
                onClick={() => setActiveTab('sent')}
                className={`pb-2 transition-colors ${
                  activeTab === 'sent'
                    ? 'text-[#006874] border-b-2 border-[#006874]'
                    : 'text-neutral-400 border-b-2 border-transparent'
                }`}
              >
                {t('userTabs.sent')}
              </button>
              <button
                onClick={() => setActiveTab('manual')}
                className={`pb-2 transition-colors ${
                  activeTab === 'manual'
                    ? 'text-[#006874] border-b-2 border-[#006874]'
                    : 'text-neutral-400 border-b-2 border-transparent'
                }`}
              >
                {t('userTabs.manual')}
              </button>
            </div>

            {/* Contenido por tab */}
            {activeTab === 'sent' ? (
              // Lista de reportes agrupados por fecha (Enviados)
              <div className="space-y-6">
                {groupedReports.map(([dateLabel, reports]) => (
                  <div key={dateLabel} className="space-y-3">
                    <div className="text-sm text-neutral-500">{dateLabel}</div>
                    {reports.map((report) => (
                      <section key={report.id} className="rounded-2xl border border-neutral-200 bg-white p-6">
                        <div className="mb-4 flex items-start justify-between">
                          <h3 className="text-base font-semibold text-neutral-900">
                            {report.title || `Reporte ${report.id}`}
                          </h3>
                          <span
                            className={`ms text-lg ${
                              report.status === 'pending' ? 'text-danger-600' : 'text-neutral-400'
                            }`}
                          >
                            {report.status === 'pending' ? 'flag' : 'outlined_flag'}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-y-1 text-sm text-neutral-900 mb-3">
                          <div className="font-semibold">{t('tableLabels.fullName')}</div>
                          <div className="text-right">Familia {data.user.name}</div>
                          <div className="font-semibold">{t('tableLabels.user')}</div>
                          <div className="text-right">{report.author}</div>
                          <div className="font-semibold">{t('table.comment')}</div>
                          <div className="text-right"></div>
                        </div>
                        <p className="text-sm text-neutral-900 leading-relaxed">{report.body}</p>
                      </section>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              // Tab Manuales: cabecera de familia + contenedor separado con mensajes
              <div className="space-y-4">
                <div className="text-sm text-neutral-500">
                  {groupedReports[0]?.[0] ?? formatDate(new Date().toISOString())}
                </div>

                {/* Cabecera de familia (acordeón) */}
                <section className="rounded-2xl border border-neutral-200 bg-white">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between px-6 py-4 text-left"
                    onClick={() => setIsManualOpen((prev) => !prev)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 overflow-hidden rounded-full bg-neutral-200">
                        {/* Avatar genérico para la familia del reporte manual */}
                        <img
                          src="/talkiplay.svg"
                          alt="Avatar familia"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-neutral-900">Familia Suárez</span>
                        <span className="ms text-base text-neutral-400">chevron_right</span>
                      </div>
                    </div>
                    <span
                      className={`ms text-base text-neutral-400 transition-transform ${
                        isManualOpen ? 'rotate-180' : ''
                      }`}
                    >
                      expand_more
                    </span>
                  </button>
                </section>

                {/* Contenedor de mensajes, separado visualmente y con animación */}
                <section
                  className={`overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-all duration-300 ease-out ${
                    isManualOpen ? 'opacity-100 translate-y-0 max-h-[600px]' : 'opacity-0 -translate-y-2 max-h-0 border-transparent'
                  }`}
                  aria-hidden={!isManualOpen}
                >
                  <div className="px-6 py-4">
                    <h3 className="mb-3 text-base font-semibold text-neutral-900">Últimos 10 mensajes</h3>
                    <ul className="space-y-1 text-sm">
                      {manualMessages.map((msg, index) => (
                        <li key={`${msg.sender}-${index}`} className="flex gap-2">
                          <span className="min-w-[110px] text-[#006874]">{msg.sender}</span>
                          <span className="flex-1 text-neutral-900">
                            {msg.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              </div>
            )}
          </div>
        )}}
      </ApiStateHandler>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  )
}



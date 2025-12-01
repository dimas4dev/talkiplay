import { useTranslation } from 'react-i18next'
import { useDashboard } from '@/hooks/useDashboard'
import { useDashboardExport } from '@/hooks/useDashboardExport'
import StatsCard from '@/components/ui/stats-card'
import LanguagesDonut from '@/components/dashboard/LanguagesDonut'
import ClickSuccessRate from '@/components/dashboard/ClickSuccessRate'
import NewUsers from '@/components/dashboard/NewUsers'
import ApiStateHandler from '@/components/ui/ApiStateHandler'
import { ExportButton } from '@/components/ui/export-button'

export default function Dashboard() {
  const { t } = useTranslation('dashboard')
  const { data, isLoading, error } = useDashboard()
  const { exportDashboard } = useDashboardExport(data)
  
  return (
    <ApiStateHandler
      isLoading={isLoading}
      error={error}
      data={data}
      loadingText={t('loading')}
      errorTitle={t('errorTitle')}
      emptyText={t('emptyText')}
    >
      {(data) => {
        const trendVsYesterday = `▲ +4 vs ayer`
        const trendVsLastMonth = `▲ +4 vs mes anterior`
        
        return (
          <section
            aria-labelledby="stats-heading"
            className="space-y-4 w-full h-full"
          >
            <h2 id="stats-heading" className="sr-only">{t('mainStatsAria')}</h2>
            <div
              className="grid grid-cols-12 grid-rows-4 gap-4 h-[calc(100vh-12rem)]"
            >
              {/* div1 - Usuarios activos (columna 1-3, fila 1) */}
              <div className="col-span-3 col-start-1 row-start-1 h-full">
                <StatsCard
                  title={t('activeUsers.title')}
                  subtitle={trendVsYesterday}
                  value={data.user_activity?.active_users || 100}
                  subtitleBelowValue={true}
                />
              </div>

              {/* div2 - Promedio de Clicks por familia (columna 1-3, fila 2) */}
              <div className="col-span-3 col-start-1 row-start-2 h-full">
                <StatsCard
                  title={t('averageClicks.title')}
                  subtitle={trendVsLastMonth}
                  value={3}
                  subtitleBelowValue={true}
                />
              </div>

              {/* div3 - Tasa de éxito de Clicks (columna 4-12, fila 1-2, span 9 columnas y 2 filas) */}
              <div className="col-span-9 row-span-2 col-start-4 row-start-1 h-full">
                <ClickSuccessRate 
                  successRate={data.click_success_rate?.success_rate || 76} 
                  trend={data.click_success_rate?.trend}
                />
              </div>

              {/* div4 - Idiomas (columna 1-3, fila 3-4, span 3 columnas y 2 filas) */}
              <div className="col-span-3 row-span-2 row-start-3 col-start-1 h-full">
                <LanguagesDonut
                  spanish={data.languages?.spanish || 60}
                  english={data.languages?.english || 25}
                  german={data.languages?.german || 15}
                  trend={data.languages?.trend}
                />
              </div>

              {/* div5 - Nuevos usuarios (columna 4-12, fila 3-4, span 9 columnas y 2 filas) */}
              <div className="col-span-9 row-span-2 row-start-3 col-start-4 h-full">
                <NewUsers />
              </div>
            </div>
            
            {/* Botón de exportar métricas */}
            <div className="mt-4">
              <ExportButton
                onExport={exportDashboard}
                text={t('exportMetrics')}
                className="flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2 text-xs font-medium transition-colors"
                style={{
                  borderColor: 'var(--color-primary-fixed-dim)',
                  backgroundColor: 'var(--color-primary-fixed-dim)',
                  color: 'var(--color-neutral-800)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary-600)'
                  e.currentTarget.style.color = 'white'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary-fixed-dim)'
                  e.currentTarget.style.color = 'var(--color-neutral-800)'
                }}
              />
            </div>
          </section>
        )
      }}
    </ApiStateHandler>
  )
}



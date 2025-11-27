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
            className="space-y-3 max-w-6xl mx-auto px-4"
          >
            <h2 id="stats-heading" className="sr-only">{t('mainStatsAria')}</h2>
            <div
              className="grid grid-cols-12 auto-rows-min gap-4"
            >
              {/* div1 - Usuarios activos */}
              <div className="col-span-4">
                <StatsCard
                  title={t('activeUsers.title')}
                  subtitle={trendVsYesterday}
                  value={data.user_activity?.active_users || 100}
                  subtitleBelowValue={true}
                />
              </div>

              {/* div2 - Promedio de Clicks por familia */}
              <div className="col-span-4">
                <StatsCard
                  title={t('averageClicks.title')}
                  subtitle={trendVsLastMonth}
                  value={3}
                  subtitleBelowValue={true}
                />
              </div>

              {/* div3 - Tasa de éxito de Clicks */}
              <div className="col-span-8 row-span-2">
                <div className="h-full min-h-[260px]">
                  <ClickSuccessRate successRate={76} />
                </div>
              </div>

              {/* div4 - Idiomas */}
              <div className="col-span-4 row-span-2">
                <div className="h-full min-h-[220px]">
                  <LanguagesDonut
                    spanish={60}
                    english={25}
                    german={15}
                  />
                </div>
              </div>

              {/* div5 - Nuevos usuarios */}
              <div className="col-span-8">
                <div className="h-full min-h-[220px]">
                  <NewUsers />
                </div>
              </div>
            </div>
            
            {/* Botón de exportar métricas */}
            <div className="mt-4">
              <ExportButton
                onExport={exportDashboard}
                text={t('exportMetrics')}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-primary-500 bg-primary-50 px-4 py-2 text-xs font-medium text-primary-600 transition-colors hover:bg-primary-600 hover:text-white"
              />
            </div>
          </section>
        )
      }}
    </ApiStateHandler>
  )
}



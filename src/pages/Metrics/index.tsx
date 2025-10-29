import { useTranslation } from 'react-i18next'
import { useAllMetrics } from '@/hooks/useMetrics'
import { useMetricsExport } from '@/hooks/useMetricsExport'
import ApiStateHandler from '@/components/ui/ApiStateHandler'
import StatsCard from '@/components/ui/stats-card'
import DonutChart from '@/components/charts/DonutChart'
import BarChart from '@/components/charts/BarChart'
import HorizontalBarChart from '@/components/charts/HorizontalBarChart'
import { ExportButton } from '@/components/ui/export-button'

export default function Metrics() {
  const { t } = useTranslation('metrics')
  const { data, isLoading, error } = useAllMetrics()
  const { exportMetrics } = useMetricsExport(data)

  if (!data) {
    return (
      <ApiStateHandler
        isLoading={isLoading}
        error={error}
        data={data}
        loadingText={t('loading')}
        errorTitle={t('errorTitle')}
        emptyText={t('emptyText')}
      >
        {() => null}
      </ApiStateHandler>
    )
  }

  const { clip_stats, clips_by_source, pro_feature_usage_overview, pro_features_last_month, clips_by_month } = data

  // Datos para el diseño original
  const clipsData = clips_by_source.map(source => ({
    name: source.source_display_name,
    value: source.total_clips,
    color: getSourceColor(source.source)
  }))

  const monthlyClipsData = clips_by_month.slice(0, 12).map(month => ({
    month: month.month_name.split(' ')[0],
    clips: month.clips_saved
  }))

  const proUsageData = [
    { name: 'Usuarios Pro', value: pro_feature_usage_overview.percentage_users_with_pro, color: 'var(--color-chart-accent)' },
    { name: 'Usuarios Free', value: 100 - pro_feature_usage_overview.percentage_users_with_pro, color: 'var(--color-neutral-200)' },
  ]

  const proFeaturesData = pro_features_last_month.slice(0, 4).map(feature => ({
    name: feature.feature_name,
    value: feature.unique_users,
    percentage: feature.percentage
  }))

  // Calcular el crecimiento de clips promedio
  const calculateGrowth = () => {
    if (clips_by_month.length < 2) return t('trends.growthVsPrevMonth', { value: '+0' })
    const currentMonth = clips_by_month[0]
    const previousMonth = clips_by_month[1]
    const currentAvg = currentMonth.clips_saved / currentMonth.active_users
    const previousAvg = previousMonth.clips_saved / previousMonth.active_users
    const growth = currentAvg - previousAvg
    const sign = growth >= 0 ? '+' : ''
    const value = `${sign}${growth.toFixed(1)}`
    return t('trends.growthVsPrevMonth', { value })
  }

  // Calcular el trend de uso de funciones PRO
  const calculateProTrend = () => {
    if (clips_by_month.length < 2) return t('trends.percentVsPrevPeriod', { value: '+0%' })
    const currentMonth = clips_by_month[0]
    const previousMonth = clips_by_month[1]
    const userGrowth = ((currentMonth.active_users - previousMonth.active_users) / previousMonth.active_users) * 100
    const sign = userGrowth >= 0 ? '+' : ''
    const value = `${sign}${userGrowth.toFixed(1)}%`
    return t('trends.percentVsPrevPeriod', { value })
  }


  return (
    <ApiStateHandler
      isLoading={isLoading}
      error={error}
      data={data}
      loadingText={t('loading')}
      errorTitle={t('errorTitle')}
      emptyText={t('emptyText')}
    >
      {() => (
        <div className="mx-auto max-w-6xl p-6">
          <div className="grid grid-cols-5 grid-rows-4 gap-4">
            {/* div1: Clips guardados promedio */}
            <div className="col-span-2 h-full">
              <StatsCard
                title={t('avgClipsSaved')}
                subtitle={calculateGrowth()}
                value={clip_stats.avg_clips_per_user.toFixed(0)}
                subtitleBelowValue
              />
            </div>

            {/* div2: Clips guardados donut */}
            <div className="h-full w-full col-span-3 col-start-3 row-span-2">
              <section className="h-full w-full rounded-lg border border-neutral-200 bg-white p-6">
                <DonutChart
                  title={t('clipsSaved')}
                  subtitle=""
                  data={clipsData}
                  trend=""
                />
              </section>
            </div>

            {/* div3: Uso funciones Pro (izquierda) */}
            <div className="col-span-2 row-span-2 row-start-2">
              <section className="h-full flex flex-col rounded-lg border border-neutral-200 bg-white p-4">
                <div className="flex-1 flex items-center justify-center">
                  <DonutChart
                    title={t('proUsage')}
                    subtitle={t('last30days')}
                    data={proUsageData}
                    trend={calculateProTrend()}
                    showLegend={false}
                  />
                </div>

                <p className="text-xs text-neutral-500 mt-2 text-center">
                  {t('proUsageHint')}
                </p>
              </section>
            </div>

            {/* div4: Clips guardados bar chart */}
            <div className="col-span-3 col-start-3 row-start-3">
              <section className="h-full rounded-lg border border-neutral-200 bg-white p-6">
                <HorizontalBarChart
                  title={t('proUsage')}
                  subtitle={t('lastMonth')}
                  data={proFeaturesData}
                />
              </section>
            </div>

            {/* div5: Uso de funciones Pro (derecha) */}
            <div className="col-span-5 row-span-1 row-start-4">
              <section className="h-full rounded-lg border border-neutral-200 bg-white p-6">
                <BarChart
                  title={t('clipsSaved')}
                  subtitle={t('last12Months')}
                  data={monthlyClipsData}
                  series={[
                    { dataKey: 'clips', name: t('clips'), color: 'var(--color-chart-accent)' }
                  ]}
                />
              </section>
            </div>

            {/* Botón Exportar métricas */}
            <div className="col-span-5 row-start-5 mt-4">
              <ExportButton
                onExport={exportMetrics}
                text={t('exportMetrics')}
              />
            </div>
          </div>
        </div>
      )}
    </ApiStateHandler>
  )
}

// Funciones auxiliares para colores
function getSourceColor(source: string): string {
  const colors: Record<string, string> = {
    'manual': 'var(--color-chart-accent)',
    'web_extension': 'var(--color-chart-success)',
    'mobile_app': 'var(--color-chart-warning)',
    'desktop_app': 'var(--color-chart-danger)',
    'cloud_sync': 'var(--color-chart-purple)',
    'import': 'var(--color-chart-info)'
  }
  return colors[source] || 'var(--color-neutral-500)'
}
import { useTranslation } from 'react-i18next'
import { useAllMetrics } from '@/hooks/useMetrics'
import ApiStateHandler from '@/components/ui/ApiStateHandler'
import StatsCard from '@/components/ui/stats-card'
import DonutChart from '@/components/charts/DonutChart'
import BarChart from '@/components/charts/BarChart'

export default function Metrics() {
  const { t } = useTranslation('metrics')
  const { data, isLoading, error } = useAllMetrics()

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
        // Datos para las KPI cards
        const avgPlaydates = data.clip_stats.avg_clips_per_user || 100
        const conversionTime = 16 // días
        const avgClicksPerFamily = 3

        // Datos para el gráfico de Playdates creados (últimos 12 meses)
        const playdatesData = data.clips_by_month.slice(0, 12).map(month => ({
          month: month.month_name.substring(0, 3), // Primeras 3 letras del mes
          playdates: month.clips_saved
        }))

        // Datos para el donut de Edad de niños
        const ageData = data.clips_by_source.map(source => ({
          name: source.source_display_name,
          value: source.total_clips,
          color: getAgeColor(source.source),
          percentage: `${source.percentage}%`
        }))

        // Datos para el gráfico de Clicks (últimos 12 meses)
        // Usar los mismos datos de playdates pero con valores diferentes para clicks
        const clicksData = [
          { month: 'Aug', clicks: 2 },
          { month: 'Apr', clicks: 1 },
          { month: 'Mar', clicks: 1 },
          { month: 'Apr', clicks: 1 },
          { month: 'May', clicks: 4 },
          { month: 'Jun', clicks: 2 },
        ]

        return (
          <section className="space-y-4 w-full h-full">
            {/* 3 KPI Cards en la parte superior - mantener como estaban */}
            <div className="grid grid-cols-3 gap-4">
              {/* KPI 1: Playdates creados en promedio */}
              <div className="h-full">
                <StatsCard
                  title={t('avgPlaydatesCreated')}
                  subtitle="▲ +4 vs ayer"
                  value={avgPlaydates}
                  subtitleBelowValue={true}
                />
              </div>

              {/* KPI 2: Tiempo de conversión */}
              <div className="h-full">
                <StatsCard
                  title={t('conversionTime')}
                  subtitle={t('conversionTimeDescription')}
                  value={`${conversionTime} días`}
                  subtitleBelowValue={true}
                />
              </div>

              {/* KPI 3: Promedio de clicks por familia */}
              <div className="h-full">
                <StatsCard
                  title={t('avgClicksPerFamily')}
                  subtitle="▲ +4 vs mes anterior"
                  value={avgClicksPerFamily}
                  subtitleBelowValue={true}
                />
              </div>
            </div>

            {/* Grid para las gráficas: 6 columnas x 6 filas (para dividir en partes iguales) */}
            <div className="grid grid-cols-6 grid-rows-6 gap-x-8 gap-y-2 h-[calc(100vh-20rem)]">
              {/* Gráfico 1: Playdates creados - div2: span 6 cols, span 3 rows, start col 1, row 1 */}
              <div className="col-span-6 col-start-1 row-span-3 row-start-1 h-full">
                <div className="h-full flex flex-col">
                  <BarChart
                    title={t('playdatesCreated')}
                    subtitle={t('last12Months')}
                    data={playdatesData}
                    series={[
                      { 
                        dataKey: 'playdates', 
                        name: t('playdates'), 
                        color: 'var(--color-primary-500)' // Teal
                      }
                    ]}
                    barRadius={8}
                  />

                </div>
              </div>

              {/* Gráfico 2: Edad de niños - div3: span 3 cols, span 3 rows, start col 1, row 4 */}
              <div className="col-span-3 col-start-1 row-span-3 row-start-4 h-full">
                <DonutChart
                  title={t('childrenAge')}
                  subtitle=""
                  data={ageData}
                  trend=""
                  showLegend={true}
                  centerText={`${data.clip_stats.total_users} ${t('profiles')}`}
                />
              </div>

              {/* Gráfico 3: Clicks - div4: span 3 cols, span 3 rows, start col 4, row 4 */}
              <div className="col-span-3 col-start-4 row-span-3 row-start-4 h-full">
                <div className="h-full flex flex-col">
                  <BarChart
                    title={t('clicks')}
                    subtitle={t('last12Months')}
                    data={clicksData}
                    series={[
                      { 
                        dataKey: 'clicks', 
                        name: t('clicks'), 
                        color: 'var(--color-primary-fixed-dim)' // Light blue
                      }
                    ]}
                    barRadius={8}
                  />
                  <p className="text-center text-sm text-emerald-600 mt-2 flex-shrink-0">
                    ▲ {t('upwardTrendThisMonth')}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )
      }}
    </ApiStateHandler>
  )
}

// Función auxiliar para colores de edad
function getAgeColor(source: string): string {
  const colors: Record<string, string> = {
    'early_childhood': 'var(--color-primary-fixed-dim)', // Light blue - Primera infancia
    'childhood': 'var(--color-primary-500)', // Teal - Infancia
    'adolescence': 'var(--color-neutral-700)', // Dark teal/black - Adolescencia
  }
  return colors[source] || 'var(--color-neutral-500)'
}

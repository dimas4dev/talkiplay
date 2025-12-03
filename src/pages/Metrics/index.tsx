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
        // KPI 1: Playdates creados en promedio
        const avgPlaydates = data.playdatesCreated.average
        const playdatesTrendText = data.playdatesCreated.trendText

        // KPI 2: Tiempo de conversión
        const conversionTimeDays = data.conversionTime.averageDays
        const conversionDescription = data.conversionTime.description

        // KPI 3: Promedio de clicks por familia
        const avgClicksPerFamily = data.clicksPerFamily.average
        const clicksPerFamilyTrendText = data.clicksPerFamily.trendText

        // Gráfico de Playdates creados (últimos 12 meses)
        const playdatesData = data.playdatesCreated.monthlyData.map((item) => ({
          month: item.month,
          playdates: item.value,
        }))

        // Donut de Edad de niños
        const ageData = data.ageGroups.stats.map((group) => ({
          name: group.ageGroup,
          value: group.count,
          color: getAgeColor(group.ageGroup),
          percentage: `${group.percentage}%`,
        }))

        // Gráfico de Clicks mensuales
        const clicksData = data.clicksMonthly.monthlyData.map((item) => ({
          month: item.month,
          clicks: item.value,
        }))

        return (
          <section className="space-y-4 w-full h-full">
            {/* 3 KPI Cards en la parte superior - mantener como estaban */}
            <div className="grid grid-cols-3 gap-4">
              {/* KPI 1: Playdates creados en promedio */}
              <div className="h-full">
                <StatsCard
                  title={t('avgPlaydatesCreated')}
                  subtitle={playdatesTrendText}
                  value={avgPlaydates}
                  subtitleBelowValue={true}
                />
              </div>

              {/* KPI 2: Tiempo de conversión */}
              <div className="h-full">
                <StatsCard
                  title={t('conversionTime')}
                  subtitle={conversionDescription || t('conversionTimeDescription')}
                  value={`${conversionTimeDays} días`}
                  subtitleBelowValue={true}
                />
              </div>

              {/* KPI 3: Promedio de clicks por familia */}
              <div className="h-full">
                <StatsCard
                  title={t('avgClicksPerFamily')}
                  subtitle={clicksPerFamilyTrendText}
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
                  centerText={`${data.ageGroups.totalProfiles} ${t('profiles')}`}
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
function getAgeColor(ageGroup: string): string {
  const colors: Record<string, string> = {
    'Primera infancia': 'var(--color-primary-fixed-dim)', // Light blue
    'Infancia': 'var(--color-primary-500)', // Teal
    'Adolescencia': 'var(--color-neutral-700)', // Dark
    'No catalogado': 'var(--color-neutral-400)',
  }
  return colors[ageGroup] || 'var(--color-neutral-500)'
}

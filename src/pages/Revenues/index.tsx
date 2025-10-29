import StatsCard from '@/components/ui/stats-card'
import DonutChart from '@/components/charts/DonutChart'
import BarChart from '@/components/charts/BarChart'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'wouter'
import { ROUTES } from '@/constants/routes'
import Table, { type TableColumn } from '@/components/ui/table'
import Pagination from '@/components/ui/pagination'
import DateInput from '@/components/ui/date-input'
import { useRevenueSummary, usePeriods, usePaymentMethodsDetailed } from '@/hooks/useRevenues'
import Loader from '@/components/ui/Loader'
import { ExportButton, exportToCSV } from '@/components/ui/export-button'
import { toEuroCurrencyString } from '@/utils/formatters'

export default function Revenues() {
  const { t } = useTranslation('revenues')
  const { data: summaryData, isLoading: summaryLoading, error: summaryError } = useRevenueSummary()
  const { data: periodsData, isLoading: periodsLoading, error: periodsError } = usePeriods()
  const { data: paymentMethodsData, isLoading: paymentLoading, error: paymentError } = usePaymentMethodsDetailed()
  
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  
  // Helpers to parse period like "Feb 2025" -> Date(2025,1,1)
  const parsePeriod = (p: string): Date => {
    const [mon, yearStr] = p.split(' ')
    const monthMap: Record<string, number> = {
      Ene: 0,
      Feb: 1,
      Mar: 2,
      Abr: 3,
      May: 4,
      Jun: 5,
      Jul: 6,
      Ago: 7,
      Sep: 8,
      Oct: 9,
      Nov: 10,
      Dic: 11,
    }
    const year = Number(yearStr)
    const month = monthMap[mon as keyof typeof monthMap] ?? 0
    return new Date(year, month, 1)
  }

  // Filtrar datos si están disponibles
  const filteredRows = periodsData?.periods?.filter((r) => {
    const d = parsePeriod(r.period).getTime()
    const afterStart = startDate ? d >= new Date(startDate).getTime() : true
    const beforeEnd = endDate ? d <= new Date(endDate).getTime() : true
    return afterStart && beforeEnd
  }) || []

  const totalFiltered = filteredRows.length
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize))
  const start = (page - 1) * pageSize
  const end = Math.min(start + pageSize, totalFiltered)
  const pageItems = filteredRows.slice(start, end)

  const columns: TableColumn<(typeof filteredRows)[number]>[] = [
    { key: 'period', header: t('periods.period'), widthClass: 'w-[30%]', render: (r) => (
      <Link href={`${ROUTES.revenues}/${encodeURIComponent((r as any).month || r.period)}`} className="text-primary-500 underline underline-offset-2">{r.period}</Link>
    ) },
    { key: 'premium', header: t('periods.premiumSubscriptions'), widthClass: 'w-[25%]' },
    { key: 'pro', header: t('periods.proSubscriptions'), widthClass: 'w-[25%]' },
    { key: 'revenue', header: t('periods.total'), widthClass: 'w-[20%]', render: (r) => <span className="text-neutral-900">{toEuroCurrencyString(r.revenue)}</span> },
  ]


  // Mostrar loading solo si todos están cargando
  if (summaryLoading && periodsLoading && paymentLoading) {
    return (
        <div className="mx-auto max-w-6xl p-6">
        <Loader className="h-64" text={t('loading.revenues')} />
      </div>
    )
  }
  
  // Mostrar errores como warnings, no bloquear la renderización
  const hasErrors = summaryError || periodsError || paymentError
  
  return (
        <div className="mx-auto max-w-6xl p-6">
          {/* Banner de errores si los hay */}
          {hasErrors && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-red-700">
                ⚠️ Algunos datos no pudieron cargarse:
                {summaryError && <span className="block">• Resumen: {summaryError}</span>}
                {periodsError && <span className="block">• Períodos: {periodsError}</span>}
                {paymentError && <span className="block">• Métodos de pago: {paymentError}</span>}
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-5 grid-rows-5 gap-2">
            {/* div1: stats cards (col 1, span 5 rows) */}
            <div className="row-span-5 flex flex-col space-y-2">
              <StatsCard 
                title={t('netAmount')} 
                subtitle={t('commission')} 
                value={toEuroCurrencyString(summaryData?.net_amount_summary?.net_revenue)} 
                subtitleBelowValue 
                suffix="" 
              />
              <StatsCard 
                title={t('currentProjection')} 
                subtitle={t('scheduledRenewals')} 
                value={toEuroCurrencyString(summaryData?.current_month_summary?.projected_revenue)} 
                subtitleBelowValue 
                suffix="" 
              />
              <StatsCard 
                title={t('annualRevenue')} 
                subtitle={t('year')} 
                value={toEuroCurrencyString(summaryData?.annual_summary?.total_annual_revenue)} 
                subtitleBelowValue 
              />
            </div>

            {/* div2: bar chart (col-start 2, col-span 2, row-span 4) */}
            <section className="col-start-2 col-span-2 row-span-4 rounded-lg border border-neutral-200 bg-white p-6 flex flex-col">
              {periodsData?.periods && periodsData.periods.length > 0 ? (
                <BarChart
                  title={t('activeSubscriptions')}
                  subtitle={t('last12Months')}
                  data={periodsData.periods}
                  series={[
                    { dataKey: 'premium_subscriptions', name: 'Premium', color: 'var(--color-chart-orange)', stackId: 'a', position: 'bottom' },
                    { dataKey: 'pro_subscriptions', name: 'Pro', color: 'var(--color-chart-secondary)', stackId: 'a', position: 'top' },
                  ]}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">
                    {periodsData?.periods ? t('noPeriodData') : t('loading.periods')}
                  </p>
                </div>
              )}
            </section>

            {/* div3: donut chart (col-start 4, col-span 2, row-span 5) */}
            <section className="col-start-4 col-span-2 row-span-5 rounded-lg border border-neutral-200 bg-white p-6">
              {paymentMethodsData?.payment_methods && paymentMethodsData.payment_methods.length > 0 ? (
                (() => {
                  const mostPopularMethod = paymentMethodsData.summary?.most_popular_method
                  
                  // Mapear datos y encontrar el índice del método más popular
                  const mappedData = paymentMethodsData.payment_methods.map((method, index) => {
                    const methodName = method.method_name || method.method || 'Desconocido'
                    let translatedName = methodName
                    
                    if (methodName.toLowerCase().includes('stripe')) {
                      translatedName = t('paymentMethods.stripe')
                    } else if (methodName.toLowerCase().includes('apple')) {
                      translatedName = t('paymentMethods.applePay')
                    } else if (methodName.toLowerCase().includes('google')) {
                      translatedName = t('paymentMethods.googlePay')
                    }
                    
                    return {
                      name: translatedName,
                      value: parseFloat((method.revenue || '0').replace(/[$,]/g, '')),
                      color: ['var(--color-chart-orange)', 'var(--color-chart-secondary)', 'var(--color-chart-accent)', 'var(--color-chart-cyan)'][index % 4],
                      percentage: method.percentage || '0%',
                      originalMethod: methodName
                    }
                  })
                  
                  // Encontrar el índice del método más popular
                  const mostPopularIndex = mappedData.findIndex(item => 
                    item.originalMethod.toLowerCase().includes(mostPopularMethod?.toLowerCase() || '')
                  )
                  
                  // Traducir el método más popular para el trend
                  let translatedMostPopular = mostPopularMethod || 'Stripe'
                  if (mostPopularMethod?.toLowerCase().includes('stripe')) {
                    translatedMostPopular = t('paymentMethods.stripe')
                  } else if (mostPopularMethod?.toLowerCase().includes('apple')) {
                    translatedMostPopular = t('paymentMethods.applePay')
                  } else if (mostPopularMethod?.toLowerCase().includes('google')) {
                    translatedMostPopular = t('paymentMethods.googlePay')
                  }
                  
                  return (
                    <DonutChart
                      title={t('paymentMethod')}
                      subtitle={t('subscriptionPayments')}
                      data={mappedData}
                      trend={`${translatedMostPopular} ${t('paymentMethods.mostPopular')}`}
                      initialActiveIndex={mostPopularIndex >= 0 ? mostPopularIndex : 0}
                    />
                  )
                })()
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">
                    {paymentMethodsData?.payment_methods ? t('noPaymentData') : t('loading.paymentMethods')}
                  </p>
                </div>
              )}
            </section>

            {/* div4: button (col-start 2, col-span 2, row-start 5) */}
            <div className="col-start-2 col-span-2 row-start-5 flex items-center justify-center">
              <Link href={ROUTES.memberships} className="block w-full rounded bg-primary-500 px-6 py-3 text-center text-white hover:bg-primary-600">
                {t('viewSubscriptions')}
              </Link>
            </div>
          </div>

          {/* Filters (date range) */}
          <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
            <DateInput placeholder={t('filters.startDate')} value={startDate} onChange={setStartDate} max={endDate || undefined} />
            <DateInput placeholder={t('filters.endDate')} value={endDate} onChange={setEndDate} min={startDate || undefined} />
          </div>

          {/* Table */}
          <div className="mt-4 rounded-lg border border-neutral-200 bg-white p-4">
            <Table columns={columns} data={pageItems} headerPaddingClass="p-0" headerBgClass="bg-neutral-50" />
            <Pagination className="mt-2" currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>

          {/* Export button */}
          <div className="mt-4">
            <ExportButton
              text={t('exportRevenues')}
              onExport={() => {
                // Preparar datos para exportar: periodos visibles actualmente
                const rows = pageItems.map((r) => ({
                  Periodo: r.period,
                  Premium: r.premium_subscriptions,
                  Pro: r.pro_subscriptions,
                  Total: toEuroCurrencyString(r.revenue),
                }))
                exportToCSV(rows, 'ingresos-periodos')
              }}
              disabled={!filteredRows.length}
            />
          </div>

        </div>
  )
}



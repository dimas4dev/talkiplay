import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRoute } from 'wouter'
import StatsCard from '@/components/ui/stats-card'
import Table from '@/components/ui/table'
import Pagination from '@/components/ui/pagination'
import SearchBar from '@/components/ui/search-bar'
import Badge from '@/components/ui/badge'
import { toEuroCurrencyString } from '@/utils/formatters'
import Loader from '@/components/ui/Loader'
import { usePeriodDetails } from '@/hooks/useRevenues'

function parseYearMonthFromLabel(label: string): { year: number | null; month: number | null } {
  if (!label) return { year: null, month: null }
  // Soportar formato "YYYY-MM"
  if (/^\d{4}-\d{2}$/.test(label)) {
    const [y, m] = label.split('-')
    return { year: Number(y), month: Number(m) }
  }
  // Formato "Octubre 2024" (ES)
  const parts = label.trim().split(/\s+/)
  if (parts.length >= 2) {
    const monthMap: Record<string, number> = {
      Enero: 1, Febrero: 2, Marzo: 3, Abril: 4, Mayo: 5, Junio: 6,
      Julio: 7, Agosto: 8, Septiembre: 9, Octubre: 10, Noviembre: 11, Diciembre: 12,
    }
    const monthName = parts[0]
    const yearNum = Number(parts[1])
    const monthNum = monthMap[monthName]
    if (monthNum && yearNum) return { year: yearNum, month: monthNum }
  }
  return { year: null, month: null }
}

function toPaymentMethodLabel(method: string | undefined): string {
  if (!method) return '—'
  const m = method.toLowerCase()
  if (m.includes('apple')) return 'Apple Pay'
  if (m.includes('google')) return 'Google Pay'
  if (m.includes('stripe')) return 'Stripe'
  return method
}

export default function RevenuePeriod() {
  const { t } = useTranslation('revenues')
  const [, params] = useRoute('/revenues/:period')
  const periodParam = decodeURIComponent(params?.period ?? '')
  const { year, month } = useMemo(() => parseYearMonthFromLabel(periodParam), [periodParam])

  const { data, isLoading, error } = usePeriodDetails(
    year,
    month
  )

  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 10

  useEffect(() => {
    setPage(1)
  }, [search])

  const payments = data?.payments ?? []
  const filtered = payments.filter((p) =>
    (p.user_email || '').toLowerCase().includes(search.toLowerCase())
  )
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const start = (page - 1) * pageSize
  const pageItems = filtered.slice(start, start + pageSize)

  return (
    <div className="mx-auto max-w-6xl p-6">
      <header className="mb-4 flex items-center justify-between">
        <div className="text-neutral-500">{t('title')} / <span className="text-primary-600">{periodParam}</span></div>
      </header>

      {isLoading && (
        <Loader className="h-24" text={t('loading.revenues')} />
      )}
      {error && !isLoading && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-red-600">{String(error)}</div>
      )}

      {/* Summary cards (orden y etiquetas según Figma) */}
      <div className="mb-4 grid grid-cols-1 gap-2 md:grid-cols-4">
        <StatsCard
          title={t('periods.period')}
          subtitle=""
          value={data?.period || periodParam}
          subtitleBelowValue
        />
        <StatsCard
          title={t('periods.proSubscriptions')}
          subtitle=""
          value={data?.breakdown?.pro_transactions ?? 0}
          subtitleBelowValue
        />
        <StatsCard
          title={t('periods.premiumSubscriptions')}
          subtitle=""
          value={data?.breakdown?.premium_transactions ?? 0}
          subtitleBelowValue
        />
        <StatsCard
          title={t('periods.total')}
          subtitle={``}
          value={toEuroCurrencyString(data?.totals?.total_revenue)}
          subtitleBelowValue
        />
      </div>

      {/* Controls */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <SearchBar placeholder={t('periods.searchByEmail')} value={search} onChange={setSearch} />
        </div>
      </div>

      {/* Charges table */}
      <div className="rounded-lg border border-neutral-200 bg-white p-4">
        <Table
          headerPaddingClass="p-0"
          headerBgClass="bg-neutral-50"
          columns={[
            { key: 'user_email', header: t('table.email'), widthClass: 'w-[30%]' },
            { key: 'payment_method', header: t('table.method'), widthClass: 'w-[15%]', render: (r: any) => toPaymentMethodLabel(r.payment_method) },
            { key: 'amount', header: t('table.amount'), widthClass: 'w-[15%]' },
            {
              key: 'plan_type', header: t('table.subscription'), widthClass: 'w-[15%]', render: (r: any) => (
                <Badge variant={r.plan_type === 'premium' ? 'premium' : 'pro'}>{r.plan_type === 'premium' ? 'Premium' : 'Pro'}</Badge>
              )
            }]}
          data={pageItems}
        />
        <Pagination className="mt-2" currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  )
}

import SearchBar from '@/components/ui/search-bar'
import SortDropdown from '@/components/ui/sort-dropdown'
import FilterDropdown from '@/components/ui/filter-dropdown'
import Pagination from '@/components/ui/pagination'
import PaginationInfo from '@/components/ui/pagination-info'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'wouter'
import { ROUTES } from '@/constants/routes'
import ApiStateHandler from '@/components/ui/ApiStateHandler'
import { useAdminReports, useAdminReportsSummary } from '@/hooks/useReports'

type TabKey = 'incidents' | 'suggestions'

export default function Reports() {
  const { t } = useTranslation('reports')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<'generated_date' | 'status' | 'subscription_type'>('generated_date')
  const [sortOrder, _] = useState<'asc' | 'desc'>('desc')
  const [filters, setFilters] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [activeTab, setActiveTab] = useState<TabKey>('incidents')
  const pageSize = 10

  const query = useMemo(() => {
    const statusFilters = filters.filter((f) => ['marcado', 'no_leido', 'leido'].includes(f))

    const statusFilter = statusFilters[0]
    const apiStatus =
      statusFilter === 'marcado'
        ? 'pending'
        : statusFilter === 'no_leido'
          ? 'reviewed'
          : statusFilter === 'leido'
            ? 'resolved'
            : undefined

    return {
      page,
      limit: pageSize,
      ...(search && { search }),
      ...(apiStatus && { status: apiStatus }),
      sort_by: sort,
      sort_order: sortOrder,
    }
  }, [filters, page, pageSize, search, sort, sortOrder])

  const { data, isLoading, error } = useAdminReports(query)
  const { data: summaryData } = useAdminReportsSummary()

  const handleTotalClick = () => {
    setFilters([])
    setSearch('')
    setPage(1)
  }

  const handleUnreadClick = () => {
    setFilters(['no_leido'])
    setSearch('')
    setPage(1)
  }

  const handleResolvedClick = () => {
    setFilters(['leido'])
    setSearch('')
    setPage(1)
  }

  const totalReports = summaryData?.summary?.reports_this_month ?? summaryData?.summary?.total_reports ?? summaryData?.total ?? 0
  const unreadReports = summaryData?.summary?.unread_reports ?? summaryData?.summary?.pending ?? summaryData?.pending ?? 0
  const markedReports = summaryData?.summary?.marked_reports ?? summaryData?.summary?.reviewed ?? summaryData?.reviewed ?? 0

  const metrics = [
    { label: t('stats.reportsThisMonth'), value: totalReports, onClick: handleTotalClick },
    { label: t('stats.unread'), value: unreadReports, onClick: handleUnreadClick },
    { label: t('stats.marked'), value: markedReports, onClick: handleResolvedClick },
  ]

  const statusStyles: Record<string, { label: string; className: string }> = {
    marcado: { label: t('status.marked'), className: 'bg-[#FCE4E4] text-[#B42318]' },
    no_leido: { label: t('status.unread'), className: 'bg-neutral-200 text-neutral-800' },
    leido: { label: t('status.read'), className: 'bg-[var(--color-status-active-bg)] text-white' },
  }

  const STATUS_MAP: Record<string, 'marcado' | 'no_leido' | 'leido'> = {
    pending: 'marcado',
    marked: 'marcado',
    marcado: 'marcado',
    unread: 'no_leido',
    'no_leido': 'no_leido',
    reviewed: 'no_leido',
    resolved: 'leido',
    leido: 'leido',
  }

  const getReporterName = (report: any) =>
    report.user_name || report.reporter_name || report.author || report.name || '-'

  const getReportDate = (report: any) => {
    const rawDate = report.generated_date || report.date || report.created_at
    if (!rawDate) return '-'
    const parsed = new Date(rawDate)
    if (isNaN(parsed.getTime())) return '-'
    return parsed.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const getReportStatus = (report: any) => STATUS_MAP[report.status] || 'leido'

  const getReportComment = (report: any) => report.comment || report.body || '-'

  return (
    <ApiStateHandler isLoading={isLoading} error={error} data={data} loadingText={t('loading')} errorTitle={t('errorTitle')} emptyText={t('emptyText')}>
      {(data) => (
        <div className="mx-auto max-w-6xl p-6 space-y-6">
          {/* Tabs */}
          <div className="flex items-center justify-evenly text-sm font-semibold">
            {[
              { key: 'incidents', label: t('tabs.incidents') },
              { key: 'suggestions', label: t('tabs.suggestions') },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as TabKey)}
                className={`pb-2 transition-colors ${
                  activeTab === tab.key
                    ? 'text-[#006874] border-b-2 border-[#006874]'
                    : 'text-neutral-400 border-b-2 border-transparent'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {metrics.map((metric) => (
              <section
                key={metric.label}
                className="rounded-2xl border border-neutral-200 bg-white px-6 py-4 text-center cursor-pointer transition-colors hover:border-[#006874] focus:outline-none focus:ring-2 focus:ring-[#006874]"
                onClick={metric.onClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    metric.onClick()
                  }
                }}
              >
                <div className="text-sm font-medium text-[var(--color-primary-500)]">{metric.label}</div>
                <div className="mt-1 text-3xl font-semibold text-[var(--color-primary-500)]">{metric.value}</div>
              </section>
            ))}
          </div>

          {/* Toolbar */}
          <div className="rounded-2xl border border-neutral-200 bg-white px-6 py-4 flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <SearchBar
                value={search}
                onChange={(v) => {
                  setPage(1)
                  setSearch(v)
                }}
                placeholder={t('toolbar.search')}
              />
            </div>
            <div className="flex-1">
              <SortDropdown
                value={sort}
                onChange={(v: any) => setSort(v)}
                label={t('toolbar.sort')}
                className="w-full"
              />
            </div>
            <div className="flex-1">
              <FilterDropdown
                values={filters}
                onChange={(vals) => {
                  setPage(1)
                  setFilters(vals)
                }}
                label={t('toolbar.filter')}
                groups={[
                  {
                    key: 'status',
                    labelKey: 'filters.status',
                    options: [
                      { value: 'marcado', labelKey: 'filters.marked' },
                      { value: 'leido', labelKey: 'filters.read' },
                      { value: 'no_leido', labelKey: 'filters.unread' },
                    ],
                  },
                  {
                    key: 'type',
                    labelKey: 'filters.type',
                    options: [
                      { value: 'automatico', labelKey: 'filters.automatic' },
                      { value: 'manual', labelKey: 'filters.manual' },
                    ],
                  },
                ]}
                namespace="reports"
                className="w-full"
              />
            </div>
          </div>

          {/* Table */}
          <section className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[var(--color-surface-variant)] text-left text-sm font-semibold text-neutral-900">
                  <tr>
                    <th className="px-6 py-4">{t('table.name')}</th>
                    <th className="px-6 py-4">{t('table.date')}</th>
                    <th className="px-6 py-4">{t('table.status')}</th>
                    <th className="px-6 py-4">{t('table.comment')}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.reports.map((report: any, index: number) => {
                    const normalizedStatus = getReportStatus(report)
                    const statusInfo = statusStyles[normalizedStatus] || statusStyles.leido
                    const baseHref =
                      activeTab === 'suggestions'
                        ? `/reports/suggestions/${(report as any).user_id || report.id}`
                        : `${ROUTES.reports}/${(report as any).user_id || report.id}`
                    return (
                      <tr key={report.id} className={index > 0 ? 'border-t border-neutral-200' : ''}>
                        <td className="px-6 py-4 text-sm text-neutral-900">
                          <Link
                            href={baseHref}
                            className="font-semibold text-[#006874] underline-offset-2 hover:underline"
                          >
                            {getReporterName(report)}
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-sm text-neutral-900">
                          {getReportDate(report)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusInfo.className}`}>
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-neutral-900">
                          <span className="block truncate max-w-[380px]" title={getReportComment(report)}>
                            {getReportComment(report)}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-4 border-t border-neutral-200 px-6 py-4 md:flex-row md:items-center md:justify-between">
              <PaginationInfo
                total={data.pagination.total}
                currentStart={(data.pagination.page - 1) * data.pagination.limit + 1}
                currentEnd={Math.min(data.pagination.page * data.pagination.limit, data.pagination.total)}
                itemName={t('title')}
              />
              <Pagination currentPage={data.pagination.page} totalPages={data.pagination.total_pages || 1} onPageChange={setPage} />
            </div>
          </section>
        </div>
      )}
    </ApiStateHandler>
  )
}

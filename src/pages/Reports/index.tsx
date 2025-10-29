import SearchBar from '@/components/ui/search-bar'
import SortDropdown from '@/components/ui/sort-dropdown'
import FilterDropdown from '@/components/ui/filter-dropdown'
import Table from '@/components/ui/table'
import Pagination from '@/components/ui/pagination'
import PaginationInfo from '@/components/ui/pagination-info'
import Badge from '@/components/ui/badge'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'wouter'
import { ROUTES } from '@/constants/routes'
import ApiStateHandler from '@/components/ui/ApiStateHandler'
import { useAdminReports, useAdminReportsSummary } from '@/hooks/useReports'

export default function Reports() {
  const { t } = useTranslation('reports')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<'generated_date' | 'status' | 'subscription_type'>('generated_date')
  const [sortOrder, _] = useState<'asc' | 'desc'>('desc')
  const [filters, setFilters] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const pageSize = 10

  const query = useMemo(() => {
    // Separar filtros por tipo
    const statusFilters = filters.filter(f => ['marcado', 'no_leido', 'leido'].includes(f))
    const subscriptionFilters = filters.filter(f => ['explorer', 'premium', 'pro', 'trial'].includes(f))
    
    const queryParams = {
      page,
      limit: pageSize,
      ...(search && { search }),
      // Solo usar el primer filtro de cada tipo por ahora (el backend puede que no soporte múltiples)
      ...(statusFilters.length > 0 && { status: statusFilters[0] }),
      ...(subscriptionFilters.length > 0 && { subscription_type: subscriptionFilters[0] }),
      sort_by: sort,
      sort_order: sortOrder,
    }
    
    
    return queryParams
  }, [page, pageSize, search, filters, sort, sortOrder])

  const { data, isLoading, error } = useAdminReports(query)
  const { data: summaryData } = useAdminReportsSummary()

  // Funciones de navegación para las stats-cards
  const handleTotalClick = () => {
    // Limpiar todos los filtros para mostrar todos los reportes
    setFilters([])
    setSearch('')
    setPage(1)
  }

  const handleUnreadClick = () => {
    // Filtrar por reportes no leídos
    setFilters(['no_leido'])
    setSearch('')
    setPage(1)
  }

  const handleResolvedClick = () => {
    // Filtrar por reportes resueltos (leídos)
    setFilters(['leido'])
    setSearch('')
    setPage(1)
  }

  // Función para traducir tipos de suscripción
  const translateSubscriptionType = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'explorer':
        return t('filters.explorer')
      case 'premium':
        return t('filters.premium')
      case 'pro':
        return t('filters.pro')
      default:
        return type
    }
  }

  const columns = [
    { key: 'reporter_name', header: t('table.name'), render: (r: any) => <Link href={`${ROUTES.reports}/${r.id}`} className="text-primary-600 underline hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded">{r.user_name}</Link> },
    { key: 'subscription_type', header: t('table.subscription'), render: (r: any) => <span className="capitalize">{translateSubscriptionType(r.subscription_type)}</span> },
    { key: 'generated_date', header: t('table.date'), render: (r: any) => new Date(r.generated_date).toLocaleDateString('es-ES') },
    {
      key: 'status', header: t('table.status'), render: (r: any) => (
        r.status === 'leido' ? <Badge variant="status-active">{t('status.read')}</Badge>
          : r.status === 'no_leido' ? <Badge variant="status-inactive">{t('status.unread')}</Badge>
            : <Badge variant="status-payment-error">{t('status.marked')}</Badge>
      )
    },
    { key: 'comment', header: t('table.comment'), render: (r: any) => (
      <div className="max-w-[500px] min-w-[300px]">
        <span 
          className="block truncate text-ellipsis overflow-hidden whitespace-nowrap" 
          title={r.comment}
          style={{ maxWidth: '500px' }}
        >
          {r.comment}
        </span>
      </div>
    ) },
  ]

  return (
    <ApiStateHandler isLoading={isLoading} error={error} data={data} loadingText={t('loading')} errorTitle={t('errorTitle')} emptyText={t('emptyText')}>
      {(data) => (
        <div className="mx-auto max-w-6xl p-6">
          {/* Resumen */}
          <div className="mb-6 grid grid-cols-3 gap-4">
            <section 
              className="rounded-lg border border-neutral-200 bg-white p-4 text-center cursor-pointer transition-colors hover:bg-neutral-50 hover:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              onClick={handleTotalClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleTotalClick()
                }
              }}
            >
              <div className="text-sm text-neutral-500">{t('stats.total')}</div>
              <div className="text-2xl font-bold">{summaryData?.summary?.total_reports ?? 0}</div>
            </section>
            <section 
              className="rounded-lg border border-neutral-200 bg-white p-4 text-center cursor-pointer transition-colors hover:bg-neutral-50 hover:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              onClick={handleUnreadClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleUnreadClick()
                }
              }}
            >
              <div className="text-sm text-neutral-500">{t('stats.unread')}</div>
              <div className="text-2xl font-bold">{summaryData?.summary?.unread_reports ?? 0}</div>
            </section>
            <section 
              className="rounded-lg border border-neutral-200 bg-white p-4 text-center cursor-pointer transition-colors hover:bg-neutral-50 hover:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              onClick={handleResolvedClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleResolvedClick()
                }
              }}
            >
              <div className="text-sm text-neutral-500">{t('stats.resolved')}</div>
              <div className="text-2xl font-bold">{summaryData?.summary?.resolved_reports ?? 0}</div>
            </section>
          </div>

          {/* Barra de herramientas */}
          <div className="mb-4 flex items-center gap-6">
            <div className="flex-1"><SearchBar value={search} onChange={(v) => { setPage(1); setSearch(v) }} placeholder={t('toolbar.search')} /></div>
            <div className="flex-1"><SortDropdown value={sort} onChange={(v: any) => setSort(v)} label={t('toolbar.sort')} /></div>
            <div className="flex-1">
              <FilterDropdown
                values={filters}
                onChange={(vals) => { setPage(1); setFilters(vals) }}
                label={t('toolbar.filter')}
                groups={[
                  {
                    key: 'subscription',
                    labelKey: 'filters.subscription',
                    options: [
                      { value: 'explorer', labelKey: 'filters.explorer' },
                      { value: 'premium', labelKey: 'filters.premium' },
                      { value: 'pro', labelKey: 'filters.pro' },
                    ]
                  },
                  {
                    key: 'status',
                    labelKey: 'filters.status',
                    options: [
                      { value: 'marcado', labelKey: 'filters.marked' },
                      { value: 'leido', labelKey: 'filters.read' },
                      { value: 'no_leido', labelKey: 'filters.unread' },
                    ]
                  }
                ]}
                namespace="reports"
              />
            </div>
          </div>

          {/* Tabla */}
          <div className="mb-4">
            <Table columns={columns as any} data={data.reports} />
          </div>

          {/* Paginación */}
          <div className="mb-2 flex items-center justify-between">
            <PaginationInfo total={data.pagination.total} currentStart={(data.pagination.page - 1) * data.pagination.limit + 1} currentEnd={Math.min(data.pagination.page * data.pagination.limit, data.pagination.total)} itemName="Reportes" />
          </div>
          <div className="flex justify-center">
            <Pagination currentPage={data.pagination.page} totalPages={data.pagination.total_pages || 1} onPageChange={setPage} />
          </div>
        </div>
      )}
    </ApiStateHandler>
  )
}



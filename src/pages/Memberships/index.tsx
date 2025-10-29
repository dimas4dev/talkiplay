import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'wouter'
import MembershipStatsCard from '@/components/ui/membership-stats-card'
import SearchBar from '@/components/ui/search-bar'
import FilterDropdown from '@/components/ui/filter-dropdown'
import SortDropdown from '@/components/ui/sort-dropdown'
import PaginationInfo from '@/components/ui/pagination-info'
import FilterChip from '@/components/ui/filter-chip'
import SubscriptionsTable from '@/components/ui/subscriptions-table'
import Pagination from '@/components/ui/pagination'
import ApiStateHandler from '@/components/ui/ApiStateHandler'
import { 
  useMemberships, 
  useAllSubscriptions, 
  useTrialSubscriptions, 
  useSuspendedSubscriptions, 
  useSubscriptionRenewals
} from '@/hooks/useMemberships'

type TabKey = 'all' | 'trial' | 'suspended' | 'renewals'

export default function Memberships() {
  const { t } = useTranslation('memberships')
  const [location] = useLocation()
  const { data: summaryData } = useMemberships()
  const { data: allSubscriptions, isLoading: allLoading, error: allError, refetch: refetchAll } = useAllSubscriptions()
  const { data: trialSubscriptions, isLoading: trialLoading, error: trialError, refetch: refetchTrial } = useTrialSubscriptions()
  const { data: suspendedSubscriptions, isLoading: suspendedLoading, error: suspendedError, refetch: refetchSuspended } = useSuspendedSubscriptions()
  const { data: renewalSubscriptions, isLoading: renewalLoading, error: renewalError, refetch: refetchRenewal } = useSubscriptionRenewals()
  const [activeTab, setActiveTab] = useState<TabKey>(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const tabParam = urlParams.get('tab')
    return (tabParam && ['all', 'trial', 'suspended', 'renewals'].includes(tabParam)) 
      ? tabParam as TabKey 
      : 'all'
  })
  const [sortValue, setSortValue] = useState<string>('name_asc')
  const [filters, setFilters] = useState<string[]>(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const filterParam = urlParams.get('filter')
    if (filterParam) {
      const filterArray = filterParam.split(',')
      return filterArray.filter(f => 
        ['premium', 'pro', 'active', 'cancelled', 'trial', 'payment_error', 'expired', 
         'google_pay', 'apple_pay', 'stripe', 'inactivo'].includes(f)
      )
    }
    return []
  })
  const [specialFilters, setSpecialFilters] = useState<string[]>(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const filterParam = urlParams.get('filter')
    if (filterParam) {
      const filterArray = filterParam.split(',')
      return filterArray.filter(f => ['due_next_7_days'].includes(f))
    }
    return []
  })
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [page, setPage] = useState<number>(1)
  const pageSize = 10

  // Función para leer parámetros de URL y aplicar filtros automáticamente
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const tabParam = urlParams.get('tab')
    const filterParam = urlParams.get('filter')

    // Cambiar pestaña si se especifica en la URL
    if (tabParam && ['all', 'trial', 'suspended', 'renewals'].includes(tabParam)) {
      setActiveTab(tabParam as TabKey)
    }

    // Aplicar filtros si se especifican en la URL
    if (filterParam) {
      const filterArray = filterParam.split(',')
      
      // Separar filtros normales de filtros especiales
      const normalFilters = filterArray.filter(f => 
        ['premium', 'pro', 'active', 'cancelled', 'trial', 'payment_error', 'expired', 
         'google_pay', 'apple_pay', 'stripe', 'inactivo'].includes(f)
      )
      const specialFiltersArray = filterArray.filter(f => 
        ['due_next_7_days'].includes(f)
      )
      
      
      setFilters(normalFilters)
      setSpecialFilters(specialFiltersArray)
    }
  }, [location])


  // Función para obtener datos según la pestaña activa
  const getCurrentData = () => {
    switch (activeTab) {
      case 'all':
        return { data: allSubscriptions, isLoading: allLoading, error: allError, refetch: refetchAll }
      case 'trial':
        return { data: trialSubscriptions, isLoading: trialLoading, error: trialError, refetch: refetchTrial }
      case 'suspended':
        return { data: suspendedSubscriptions, isLoading: suspendedLoading, error: suspendedError, refetch: refetchSuspended }
      case 'renewals':
        return { data: renewalSubscriptions, isLoading: renewalLoading, error: renewalError, refetch: refetchRenewal }
      default:
        return { data: allSubscriptions, isLoading: allLoading, error: allError, refetch: refetchAll }
    }
  }

  const currentData = getCurrentData()


  // Filtrar y ordenar datos si están disponibles
  const getFilteredItems = () => {
    if (!currentData.data) return []
    
    return currentData.data
      // Filtrar por búsqueda
      .filter((item) => item.user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       item.user.email.toLowerCase().includes(searchTerm.toLowerCase()))
      // Filtrar por suscripción
      .filter((item) => {
        if (filters.includes('premium') || filters.includes('pro')) {
          return (filters.includes('premium') && item.plan.type === 'premium') || 
                 (filters.includes('pro') && item.plan.type === 'pro')
        }
        return true
      })
      // Filtrar por estado
      .filter((item) => {
        if (filters.includes('active') || filters.includes('cancelled') || filters.includes('trial') || 
            filters.includes('payment_error') || filters.includes('expired') || filters.includes('inactivo')) {
          return (filters.includes('active') && item.status === 'active') || 
                 (filters.includes('cancelled') && item.status === 'cancelled') ||
                 (filters.includes('trial') && item.status === 'trial') ||
                 (filters.includes('payment_error') && item.status === 'payment_error') ||
                 (filters.includes('expired') && item.status === 'expired') ||
                 (filters.includes('inactivo') && (item.status === 'expired' || item.status === 'payment_error'))
        }
        return true
      })
      // Filtrar por método de pago
      .filter((item) => {
        if (filters.includes('google_pay') || filters.includes('apple_pay') || filters.includes('stripe')) {
          return (filters.includes('google_pay') && item.payment_method === 'google_pay') || 
                 (filters.includes('apple_pay') && item.payment_method === 'apple_pay') ||
                 (filters.includes('stripe') && item.payment_method === 'stripe')
        }
        return true
      })
      // Filtrar por vencimiento en 7 días (filtro especial)
      .filter((item) => {
        if (!specialFilters.includes('due_next_7_days')) return true
        const now = new Date()
        const due = new Date(item.dates.end_date)
        const diff = (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        return diff >= 0 && diff <= 7
      })
      // Ordenar
      .sort((a, b) => {
        switch (sortValue) {
          case 'name_asc':
            return a.user.name.localeCompare(b.user.name)
          case 'name_desc':
            return b.user.name.localeCompare(a.user.name)
          case 'payment_old_new':
            return new Date(a.dates.end_date).getTime() - new Date(b.dates.end_date).getTime()
          case 'payment_new_old':
            return new Date(b.dates.end_date).getTime() - new Date(a.dates.end_date).getTime()
          case 'sub_high_low':
            return a.plan.type === b.plan.type ? 0 : a.plan.type === 'pro' ? -1 : 
                   a.plan.type === 'premium' ? (b.plan.type === 'pro' ? 1 : -1) : 1
          case 'sub_low_high':
            return a.plan.type === b.plan.type ? 0 : a.plan.type === 'explorer' ? -1 : 
                   a.plan.type === 'premium' ? (b.plan.type === 'explorer' ? 1 : -1) : -1
          default:
            return 0
        }
      })
  }

  const items = getFilteredItems()

  // Reset pagination when query inputs change
  useEffect(() => {
    setPage(1)
  }, [searchTerm, JSON.stringify(filters), sortValue])

  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * pageSize
  const end = Math.min(start + pageSize, total)
  const pageItems = items.slice(start, end)

  // Datos para cada tab usando datos reales
  const getStatsData = () => {
    if (!summaryData) return []
    
    const overview = summaryData.overview
    const trialSummary = summaryData.trial_summary
    const suspendedSummary = summaryData.suspended_summary
    const renewalsSummary = summaryData.renewals_summary
    
    switch (activeTab) {
      case 'trial':
        return [
          {
            icon: 'schedule',
            label: t('stats.trial'),
            value: trialSummary.total.toString(),
            iconBackgroundColor: 'bg-transparent',
            iconTextColor: 'text-[#5459DA]',
            iconSize: 'ms-24'
          },
          {
            icon: 'star_shine',
            label: 'Potencial Premium',
            value: `€${trialSummary.potential_revenue.toFixed(2)}`,
            iconBackgroundColor: 'bg-transparent',
            iconTextColor: 'text-[#5459DA]',
            iconSize: 'ms-24'
          },
          {
            icon: 'stars',
            label: 'Potencial Total',
            value: `€${trialSummary.potential_revenue.toFixed(2)}`,
            iconBackgroundColor: 'bg-transparent',
            iconTextColor: 'text-[#5459DA]',
            iconSize: 'ms-24',
            iconFill: true
          }
        ]
      case 'suspended':
        return [
          {
            icon: 'close',
            label: 'Total suspendidas',
            value: suspendedSummary.total.toString(),
            iconSize: 'ms-24'
          },
          {
            icon: 'exclamation',
            label: 'Canceladas',
            value: suspendedSummary.cancelled.toString(),
            iconSize: 'ms-24'
          },
          {
            icon: 'money_off',
            label: 'Errores de pago',
            value: suspendedSummary.payment_errors.toString(),
            iconBackgroundColor: 'bg-transparent',
            iconTextColor: 'text-[#5459DA]',
            iconSize: 'ms-24'
          },
          {
            icon: 'avg_pace',
            label: 'Vencidas',
            value: suspendedSummary.expired.toString(),
            iconBackgroundColor: 'bg-transparent',
            iconTextColor: 'text-[#5459DA]',
            iconSize: 'ms-24'
          }
        ]
      case 'renewals':
        return [
          {
            icon: 'star_shine',
            label: 'Renovaciones Premium',
            value: renewalsSummary.premium_renewals.toString(),
            iconBackgroundColor: 'bg-transparent',
            iconTextColor: 'text-[#5459DA]',
            iconSize: 'ms-24'
          },
          {
            icon: 'stars',
            label: 'Renovaciones Pro',
            value: renewalsSummary.pro_renewals.toString(),
            iconBackgroundColor: 'bg-transparent',
            iconTextColor: 'text-[#5459DA]',
            iconSize: 'ms-24',
            iconFill: true
          },
          {
            icon: 'attach_money',
            label: 'Total programado',
            value: renewalsSummary.scheduled.toString(),
            iconBackgroundColor: 'bg-transparent',
            iconTextColor: 'text-[#5459DA]',
            iconSize: 'ms-24'
          }
        ]
      default:
        return [
          {
            icon: 'check',
            label: t('stats.active'),
            value: overview.active.toString(),
            iconSize: 'ms-24'
          },
          {
            icon: 'close',
            label: t('stats.suspended'),
            value: overview.suspended.toString(),
            iconSize: 'ms-24'
          },
          {
            icon: 'avg_pace',
            label: t('stats.trial'),
            value: overview.trial.toString(),
            iconBackgroundColor: 'bg-transparent',
            iconTextColor: 'text-[#5459DA]',
            iconSize: 'ms-24'
          }
        ]
    }
  }

  const tabs = [
    { key: 'all' as TabKey, label: t('tabs.all') },
    { key: 'trial' as TabKey, label: t('tabs.trial') },
    { key: 'suspended' as TabKey, label: t('tabs.suspended') },
    { key: 'renewals' as TabKey, label: t('tabs.renewals') },
  ]

  return (
    <>
      <ApiStateHandler
        isLoading={currentData.isLoading}
        error={currentData.error}
        data={currentData.data}
        loadingText="Cargando suscripciones..."
        errorTitle="Error al cargar las suscripciones"
        emptyText="No hay suscripciones disponibles"
      >
        {() => (
          <div className="mx-auto max-w-6xl p-6">
            {/* Header */}
            <div className="mb-6">        
              {/* Tabs */}
              <div className="flex justify-evenly gap-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`text-base font-semibold leading-[1.3] transition-colors ${
                      activeTab === tab.key
                        ? 'border-b-2 border-primary-500 text-primary-600'
                        : 'text-neutral-900 hover:text-primary-600'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats Panel */}
            <div className="mb-8 rounded-lg border border-neutral-200 bg-white p-6">
              <div className={`grid divide-x divide-neutral-200 ${getStatsData().length === 4 ? 'grid-cols-4' : 'grid-cols-3'}`}>
                {getStatsData().map((stat, index) => (
                  <MembershipStatsCard
                    key={index}
                    icon={stat.icon}
                    label={stat.label}
                    value={stat.value}
                    iconBackgroundColor={stat.iconBackgroundColor}
                    iconTextColor={stat.iconTextColor}
                    iconSize={stat.iconSize}
                    iconFill={'iconFill' in stat ? stat.iconFill : false}
                  />
                ))}
              </div>
            </div>

            {/* Search and Filters */}
            <div className="mb-6">
              <div className="flex items-center justify-evenly gap-6 mb-4">
                {/* Search Bar */}
                <div className="flex-1 basis-[600px] max-w-[640px]">
                  <SearchBar placeholder={t('searchPlaceholder')} value={searchTerm} onChange={setSearchTerm} />
                </div>

                {/* Sort and Filter Dropdowns */}
                <div className="flex gap-4">
                  <SortDropdown value={sortValue} onChange={setSortValue} />
                  <FilterDropdown 
                    values={filters} 
                    onChange={setFilters}
                    groups={[
                      {
                        key: 'subscription',
                        labelKey: 'filter.subscription',
                        options: [
                          { value: 'premium', labelKey: 'filter.premium' },
                          { value: 'pro', labelKey: 'filter.pro' },
                        ]
                      },
                      {
                        key: 'status',
                        labelKey: 'filter.status',
                        options: [
                          { value: 'active', labelKey: 'filter.active' },
                          { value: 'cancelled', labelKey: 'filter.cancelled' },
                          { value: 'trial', labelKey: 'filter.trial' },
                          { value: 'payment_error', labelKey: 'filter.paymentError' },
                          { value: 'expired', labelKey: 'filter.expired' },
                          { value: 'inactivo', labelKey: 'filter.inactivo' },
                        ]
                      },
                      {
                        key: 'payment_method',
                        labelKey: 'filter.paymentMethod',
                        options: [
                          { value: 'google_pay', labelKey: 'filter.googlePay' },
                          { value: 'apple_pay', labelKey: 'filter.applePay' },
                          { value: 'stripe', labelKey: 'filter.stripe' },
                        ]
                      }
                    ]}
                  />
                </div>
              </div>

              {/* Summary and Pagination Info */}
              <PaginationInfo 
                total={total}
                currentStart={start + 1}
                currentEnd={end}
                itemName="Suscripciones"
              />

              {/* Quick Filter Chips below summary */}
              <div className="mt-3">
                <FilterChip
                  label={t('filter.dueNext7Days')}
                  selected={specialFilters.includes('due_next_7_days')}
                  onToggle={(sel) => {
                    setSpecialFilters((prev) => {
                      const exists = prev.includes('due_next_7_days')
                      if (sel && !exists) return [...prev, 'due_next_7_days']
                      if (!sel && exists) return prev.filter((v) => v !== 'due_next_7_days')
                      return prev
                    })
                  }}
                />
              </div>
            </div>

            {/* Content */}
            <SubscriptionsTable 
              className="mt-4" 
              items={pageItems as any}
            />
            <Pagination className="mt-4" currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </ApiStateHandler>
    </>
  )
}



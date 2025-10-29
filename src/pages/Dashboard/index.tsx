import { useTranslation } from 'react-i18next'
import { useLocation } from 'wouter'
import { useDashboard } from '@/hooks/useDashboard'
import { useDashboardExport } from '@/hooks/useDashboardExport'
import StatsCard from '@/components/ui/stats-card'
import ActiveUsersCard from '@/components/dashboard/ActiveUsersCard'
import SubscriptionsDonut from '@/components/dashboard/SubscriptionsDonut'
import RetentionRate from '@/components/dashboard/RetentionRate'
import UserGrowth from '@/components/dashboard/UserGrowth'
import ApiStateHandler from '@/components/ui/ApiStateHandler'
import { ExportButton } from '@/components/ui/export-button'
import { ROUTES } from '@/constants/routes'

export default function Dashboard() {
  const { t } = useTranslation('dashboard')
  const { data, isLoading, error } = useDashboard()
  const { exportDashboard } = useDashboardExport(data)
  const [, setLocation] = useLocation()

  // Funciones de navegación para los stats-cards
  const handleInactiveUsersClick = () => {
    // Redirige a la pantalla 2, sección "Usuarios", con filtro "Estado" activado en "Inactivo"
    setLocation(`${ROUTES.users}?filter=inactive`)
  }

  const handleFailedPaymentsClick = () => {
    // Redirige a la pantalla 4-2, sección "Suscripciones", pestaña "Suspendidas", con filtro "Estado" activado en "Error pago"
    setLocation(`${ROUTES.memberships}?tab=suspended&filter=inactivo`)
  }

  const handleExpiringPlansClick = () => {
    // Redirige a la pantalla 4, sección "Suscripciones", pestaña "Todas", con filtro rápido "Venciendo en los próximos 7 días" activado
    setLocation(`${ROUTES.memberships}?tab=all&filter=due_next_7_days`)
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
      {(data) => (
        <section aria-labelledby="stats-heading" className="space-y-6">
          <h2 id="stats-heading" className="sr-only">{t('mainStatsAria')}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatsCard 
              title={t('cards.inactiveUsers')} 
              subtitle={t('cards.subtitles.last30days')} 
              value={data.user_activity.inactive_users}
              onClick={handleInactiveUsersClick}
            />
            <StatsCard 
              title={t('cards.failedPayments')} 
              subtitle={t('cards.subtitles.last24h')} 
              value={data.failed_payments_24h.length}
              onClick={handleFailedPaymentsClick}
            />
            <StatsCard 
              title={t('cards.expiringPlans')} 
              subtitle={t('cards.subtitles.next7days')} 
              value={data.expiring_subscriptions_7d.length}
              onClick={handleExpiringPlansClick}
            />
          </div>
          <div className="grid grid-cols-5 grid-rows-5 gap-0 min-h-0 flex-1">
            {/* div1 - Usuarios activos */}
                <div className="col-start-1 col-end-3 row-start-1 row-end-3 pb-3 px-6 pt-6">
                  <ActiveUsersCard
                    data={data.user_activity}
                    trendValue={Math.round(data.user_activity.active_percentage - 50)}
                  />
            </div>
            
            {/* div2 - Suscripciones */}
            <div className="col-start-1 col-end-3 row-start-3 row-end-6 pt-3 px-6 pb-6">
              <SubscriptionsDonut data={data.subscription_distribution} />
            </div>
            
            {/* div3 - Tasa de retención */}
            <div className="col-start-3 col-end-6 row-start-1 row-end-4 pb-3 px-6 pt-6">
              <RetentionRate data={data.retention_rate} />
            </div>
            
            {/* div4 - Crecimiento */}
            <div className="col-start-3 col-end-6 row-start-4 row-end-6 pt-3 px-6 pb-6">
              <UserGrowth data={data.growth_rate} />
            </div>
          </div>
          
          {/* Botón de exportar métricas */}
          <div className="mt-8">
            <ExportButton
              onExport={exportDashboard}
              text={t('exportMetrics')}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-primary-500 bg-primary-50 px-6 py-3 text-sm font-medium text-primary-600 transition-colors hover:bg-primary-600 hover:text-white"
            />
          </div>
        </section>
      )}
    </ApiStateHandler>
  )
}



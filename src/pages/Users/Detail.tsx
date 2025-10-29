import { Link, useParams, useLocation } from 'wouter'
import { useTranslation } from 'react-i18next'
import Timeline from '@/components/ui/timeline'
import UserHeaderCard from '@/components/users/UserHeaderCard'
import { ROUTES } from '@/constants/routes'
import { useUserById } from '@/hooks/useUsers'
import { useUserStatus } from '@/hooks/useUserStatus'
import { useUserDelete } from '@/hooks/useUserDelete'
import ApiStateHandler from '@/components/ui/ApiStateHandler'
import { useToast, ToastContainer } from '@/components/ui/toast'
import { toEuroCurrencyString } from '@/utils/formatters'

type RouteParams = { id: string }

export default function UserDetailPage() {
  const { t } = useTranslation('userDetail')
  const params = useParams<RouteParams>()
  const [, setLocation] = useLocation()
  const { data: user, isLoading, error, refetch } = useUserById(params.id)
  const { updateUserStatus, isLoading: isUpdatingStatus } = useUserStatus()
  const { deleteUser, isLoading: isDeletingUser } = useUserDelete()
  const { toasts, success, error: showError, removeToast } = useToast()

  // Funciones para manejar cambios de estado

  const handleDeleteUser = async () => {
    if (!params.id || !user) {
      return
    }

    const userName = user.user?.username || 'Usuario'
    
    const result = await deleteUser(params.id)
    
    if (result.success) {
      success(`Usuario eliminado`, `${userName} ha sido eliminado exitosamente`)
      // Redirigir a la página de usuarios después de un breve delay
      setTimeout(() => {
        setLocation(ROUTES.users)
      }, 1500)
    } else {
      showError('Error al eliminar usuario', result.message)
    }
  }

  const handleBlockUser = async () => {
    if (!params.id || !user) {
      return
    }

    // Obtener el status actual del usuario
    const currentStatus = user?.user?.status
    const newStatus = currentStatus === 'blocked' ? 'active' : 'blocked'
    const reason = newStatus === 'blocked' ? 'Actividad sospechosa detectada' : 'Usuario reactivado'

    const result = await updateUserStatus(params.id, newStatus, reason)

    if (result.success) {
      const toastTitle = newStatus === 'blocked' ? t('toasts.userBlocked') : t('toasts.userUnblocked')
      const toastMessage = newStatus === 'blocked' ? t('toasts.userBlockedSuccess') : t('toasts.userUnblockedSuccess')
      success(toastTitle, toastMessage)
      // Recargar los datos del usuario para actualizar la UI
      await refetch()
    } else {
      const errorMessage = newStatus === 'blocked' ? t('toasts.errorBlocking') : t('toasts.errorUnblocking')
      showError(errorMessage, result.message)
    }
  }

  const handleToggleUserStatus = async () => {
    const currentStatus = user?.user?.status
    const newStatus = currentStatus === 'blocked' ? 'active' : 'blocked'
    const reason = newStatus === 'blocked' ? 'Actividad sospechosa detectada' : 'Usuario reactivado'


    const result = await updateUserStatus(params.id, newStatus, reason)

    if (result.success) {
      const toastTitle = newStatus === 'blocked' ? t('toasts.userBlocked') : t('toasts.userUnblocked')
      const toastMessage = newStatus === 'blocked' ? t('toasts.userBlockedSuccess') : t('toasts.userUnblockedSuccess')
      success(toastTitle, toastMessage)
      // Recargar los datos del usuario para actualizar la UI
      await refetch()
    } else {
      const errorMessage = newStatus === 'blocked' ? t('toasts.errorBlocking') : t('toasts.errorUnblocking')
      showError(errorMessage, result.message)
    }
  }


  // Función para generar elementos del timeline
  const generateTimelineItems = (data: any) => {
    const items = []

    // Registro del usuario
    items.push({
      date: new Date(data.user.created_at).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      content: t('timeline.registered')
    })

    // Si hay suscripción, agregar eventos relacionados
    if (data.subscription) {
      const subscription = data.subscription

      // Fecha de inicio de suscripción
      if (subscription.start_date) {
        items.push({
          date: new Date(subscription.start_date).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          }),
          content: `${t('timeline.activatedMembership')} ${subscription.plan_type === 'premium' ? t('subscriptionTypes.premium') : t('subscriptionTypes.pro')}`
        })
      }

      // Si la suscripción está activa y tiene fecha de fin, agregar renovación
      if (subscription.status === 'active' && subscription.end_date) {
        const endDate = new Date(subscription.end_date)
        const now = new Date()
        if (endDate > now) {
          items.push({
            date: endDate.toLocaleDateString('es-ES', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            }),
            content: subscription.auto_renew ? t('timeline.autoRenewalScheduled') : t('timeline.subscriptionExpires')
          })
        }
      }
    }

    // Agregar pagos del historial
    if (data.payment_history && data.payment_history.length > 0) {
      data.payment_history.forEach((payment: any) => {
        items.push({
          date: new Date(payment.payment_date).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          }),
          content: `Pago de ${toEuroCurrencyString(payment.amount)} - ${payment.status === 'success' ? t('timeline.paymentSuccessful') : t('timeline.paymentFailed')}`
        })
      })
    }

    // Ordenar por fecha (más reciente primero)
    return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  return (
    <>
      <ApiStateHandler
        isLoading={isLoading}
        error={error}
        data={user}
        loadingText={t('loading')}
        errorTitle={t('errorTitle')}
        emptyText={t('emptyText')}
      >
        {(data) => {
          const user = data.user
          const subscription = data.subscription


          return (
            <div className="mx-auto max-w-6xl p-6">
              {/* Breadcrumb */}
              <nav className="mb-4 text-sm text-neutral-500">
                <Link href={ROUTES.users} className="underline underline-offset-2">{t('breadcrumb')}</Link>
                <span className="mx-2">/</span>
                <span className="text-neutral-900">{user.username}</span>
              </nav>

              {/* Header card */}
              <UserHeaderCard
                key={`user-${user.id}-${data.user?.status}`}
                user={{
                  id: user.id,
                  name: user.username,
                  email: user.email,
                  userId: user.id.toString(),
                  subscription: subscription?.plan_type === 'premium' ? t('subscriptionTypes.premium') :
                    subscription?.plan_type === 'pro' ? t('subscriptionTypes.pro') : t('subscriptionTypes.explorer'),
                  status: data.user?.status === 'active' ? t('userInfo.statusTypes.active') :
                    data.user?.status === 'blocked' ? t('userInfo.statusTypes.blocked') :
                      data.user?.status === 'inactive' ? t('userInfo.statusTypes.inactive') : t('userInfo.statusTypes.active'),
                   registrationDate: new Date(user.created_at).toLocaleDateString('es-ES', {
                     day: '2-digit',
                     month: 'short',
                     year: 'numeric'
                   }),
                  reports: 0,
                  nextPayment: subscription?.end_date ? new Date(subscription.end_date).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  }) : 'N/A',
                  history: [
                    { date: new Date(user.created_at).toLocaleDateString('es-ES'), text: t('timeline.registered') },
                    ...(subscription?.status === 'active' ?
                      [{ date: new Date(subscription.start_date).toLocaleDateString('es-ES'), text: t('timeline.activatedSubscription') }] :
                      [])
                  ]
                }}
                onToggleStatus={handleToggleUserStatus}
                isUpdatingStatus={isUpdatingStatus}
                onDeleteUser={handleDeleteUser}
                isDeletingUser={isDeletingUser}
                translations={{
                  subscription: t('subscription'),
                  userId: t('userInfo.userId'),
                  email: t('userInfo.email'),
                  registration: t('userInfo.registration'),
                  reports: t('userInfo.reports'),
                  status: t('userInfo.status'),
                  block: t('menu.block'),
                  unblock: t('menu.unblock'),
                  viewReports: t('menu.viewReports'),
                  deleteAccount: t('menu.deleteAccount'),
                  updating: t('menu.updating'),
                }}
              />



              {/* Subscription summary */}
              <section className="mb-4 rounded-lg border border-neutral-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-neutral-900 leading-none" aria-hidden="true">stars</span>
                    <div>
                      <div className="text-sm text-neutral-500">{t('subscription')}</div>
                      <div className="text-lg font-semibold text-neutral-900">
                        {subscription?.plan_type === 'premium' ? t('subscriptionTypes.premium') :
                          subscription?.plan_type === 'pro' ? t('subscriptionTypes.pro') : t('subscriptionTypes.explorer')}
                      </div>
                    </div>
                  </div>
                   <div className="text-sm text-neutral-500">
                     {t('nextPayment')} <span className="ml-2 font-semibold text-neutral-900">
                       {subscription?.end_date ? new Date(subscription.end_date).toLocaleDateString('es-ES', {
                         day: '2-digit',
                         month: 'short',
                         year: 'numeric'
                       }) : 'N/A'}
                     </span>
                   </div>
                </div>
              </section>

              {/* Action buttons */}
              <div className="mb-6 grid grid-cols-2 gap-6">
                <button
                  className="w-full rounded border border-primary-500 bg-primary-500 px-4 py-3 text-white hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500"
                  disabled={isUpdatingStatus}
                >
                  {t('actions.sendRecoveryEmail')}
                </button>
                <button
                  onClick={handleBlockUser}
                  disabled={isUpdatingStatus}
                  className="w-full rounded border border-primary-100 bg-primary-50 px-4 py-3 text-primary-600 hover:bg-primary-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {isUpdatingStatus ?
                    (data.user?.status === 'blocked' ? t('actions.unblocking') : t('actions.blocking')) :
                    (data.user?.status === 'blocked' ? t('actions.unblockUser') : t('actions.blockUser'))
                  }
                </button>
              </div>

              {/* Timeline */}
              <section className="rounded-lg border border-neutral-200 bg-white p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-neutral-900">{t('history')}</h2>
                  <span className="ms text-primary-600">expand_less</span>
                </div>
                <Timeline items={generateTimelineItems(data)} />
              </section>
            </div>
          )
        }}
      </ApiStateHandler>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  )
}

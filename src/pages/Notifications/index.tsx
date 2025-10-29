import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNotificationsContext } from '@/contexts/NotificationsContext'
import type { NotificationFilter } from '@/types/websocket'

export default function Notifications() {
  const { t } = useTranslation('notifications')
  const [activeTab, setActiveTab] = useState<NotificationFilter>('all')
  
  const {
    isLoading,
    isConnected,
    isConnecting,
    error,
    markAsRead,
    markAllAsRead,
    clearRecentlyRead,
    getFilteredNotifications,
    getStats,
    loadNotifications
  } = useNotificationsContext()

  // Evitar warnings de variables no usadas (se usan en el JSX)
  void isConnected
  void isConnecting
  void error
  void markAllAsRead

  // Cargar notificaciones desde el backend al montar
  useEffect(() => {
    loadNotifications()
  }, [loadNotifications])

  // Obtener notificaciones filtradas
  const displayNotifications = getFilteredNotifications(activeTab)
  const stats = getStats()

  // Limpiar notificaciones recientemente leídas cuando se cambie de tab
  const handleTabChange = (tab: NotificationFilter) => {
    setActiveTab(tab)
    if (tab === 'all') {
      clearRecentlyRead()
    }
  }

  const todayNotifications = displayNotifications.filter(n => {
    const now = new Date()
    const notificationDate = new Date(n.created_at)
    const diffInHours = (now.getTime() - notificationDate.getTime()) / (1000 * 60 * 60)
    return diffInHours < 24
  })
  
  const lastWeekNotifications = displayNotifications.filter(n => {
    const now = new Date()
    const notificationDate = new Date(n.created_at)
    const diffInHours = (now.getTime() - notificationDate.getTime()) / (1000 * 60 * 60)
    return diffInHours >= 24 && diffInHours < 168 // 7 días
  })

  return (
    <div className="mx-auto max-w-6xl p-6">
      {/* Header */}
      <div className="mb-6">
        {/* Connection Status */}
        
        {/* Tabs */}
        <div className="flex justify-evenly">
          <button
            onClick={() => handleTabChange('unread')}
            className={`text-sm font-medium transition-colors ${
              activeTab === 'unread'
                ? 'border-b-2 border-primary-500 text-primary-600'
                : 'text-neutral-900 hover:text-primary-600'
            }`}
          >
            {t('unread')} {stats.unread > 0 && `(${stats.unread})`}
          </button>
          <button
            onClick={() => handleTabChange('all')}
            className={`text-sm font-medium transition-colors ${
              activeTab === 'all'
                ? 'border-b-2 border-primary-500 text-primary-600'
                : 'text-neutral-900 hover:text-primary-600'
            }`}
          >
            {t('all')}
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-6">
        {isLoading && (
          <div className="text-center py-12 text-neutral-500">{t('loading')}</div>
        )}
        {/* Today Section */}
        {todayNotifications.length > 0 && (
          <section>
            <h2 className="mb-3 text-sm font-bold text-neutral-900">{t('today')}</h2>
            <div className="space-y-3">
              {todayNotifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`relative w-full rounded-lg border px-4 py-6 transition-colors hover:bg-neutral-50 ${
                    notification.type === 'payment_failed' ? 'border-red-200 bg-red-50' :
                    notification.type === 'cancel_subscription' ? 'border-yellow-200 bg-yellow-50' :
                    notification.type === 'payment_success' ? 'border-green-200 bg-green-50' :
                    notification.type === 'new_report' ? 'border-blue-200 bg-blue-50' :
                    'border-neutral-200 bg-white'
                  }`}
                  onMouseEnter={() => markAsRead(notification.id)}
                >
                  {notification.title && (
                    <h3 className="text-sm font-semibold text-neutral-900 mb-1">{notification.title}</h3>
                  )}
                  <p className="text-sm text-neutral-900">{notification.message}</p>
                  <p className="mt-2 text-xs text-neutral-500">
                    {new Date(notification.created_at).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  {!notification.is_read && (
                    <div className="absolute right-4 top-4 h-2 w-2 rounded-full bg-neutral-900"></div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Last Week Section */}
        {lastWeekNotifications.length > 0 && (
          <section>
            <h2 className="mb-3 text-sm font-bold text-neutral-900">{t('lastWeek')}</h2>
            <div className="space-y-3">
              {lastWeekNotifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`relative w-full rounded-lg border px-4 py-6 transition-colors hover:bg-neutral-50 ${
                    notification.type === 'payment_failed' ? 'border-red-200 bg-red-50' :
                    notification.type === 'cancel_subscription' ? 'border-yellow-200 bg-yellow-50' :
                    notification.type === 'payment_success' ? 'border-green-200 bg-green-50' :
                    notification.type === 'new_report' ? 'border-blue-200 bg-blue-50' :
                    'border-neutral-200 bg-white'
                  }`}
                  onMouseEnter={() => markAsRead(notification.id)}
                >
                  {notification.title && (
                    <h3 className="text-sm font-semibold text-neutral-900 mb-1">{notification.title}</h3>
                  )}
                  <p className="text-sm text-neutral-900">{notification.message}</p>
                  <p className="mt-2 text-xs text-neutral-500">
                    {new Date(notification.created_at).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  {!notification.is_read && (
                    <div className="absolute right-4 top-4 h-2 w-2 rounded-full bg-neutral-900"></div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {displayNotifications.length === 0 && (
          <div className="text-center py-12">
            <p className="text-neutral-500">{t('empty')}</p>
          </div>
        )}
      </div>
    </div>
  )
}



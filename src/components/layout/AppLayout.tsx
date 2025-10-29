import { type ReactNode } from 'react'
import { Link, useLocation } from 'wouter'
// usando Material Symbols (clase utilitaria .ms)
import clipnestIcon from '@/assets/images/icons/clipnest.svg'
import { useAuth } from '@/hooks/useAuth'
import { useNotificationsContext } from '@/contexts/NotificationsContext'
import { useTranslation } from 'react-i18next'
import { NAV_ITEMS, SIDEBAR_ACTIVE_BG, SIDEBAR_BG, SIDEBAR_BORDER, SIDEBAR_USER_BG } from '@/constants/sidebar'
import NotificationToasts from '@/components/NotificationToasts'


type AppLayoutProps = { children: ReactNode }


export default function AppLayout({ children }: AppLayoutProps) {
  const [location, setLocation] = useLocation()
  const { user, logout } = useAuth()
  const { notifications, getStats } = useNotificationsContext()
  const { t: tSidebar } = useTranslation('sidebar')
  const { t: tCommon } = useTranslation('common')

  // Obtener estadísticas (se recalcula cuando cambia el array de notifications)
  // notifications se usa implícitamente para forzar re-render
  const notificationStats = getStats()
  
  // Evitar warning de variable no usada (necesaria para re-render)
  void notifications

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <aside className={`sidebar flex w-72 min-w-[18rem] flex-col border-r px-5 pt-6 pb-0 ${SIDEBAR_BORDER} ${SIDEBAR_BG}`}>
        <figure className="mb-8 flex items-center justify-center">
          <img src={clipnestIcon} alt={tCommon('brand')} className="h-[60px] w-[60px] rounded-xl" />
        </figure>

        <nav className="flex flex-1 flex-col gap-1">
          {NAV_ITEMS.map(({ href, labelKey, icon, colorClass }) => {
            const active = location === href
            return (
              <Link key={href} href={href} aria-current={active ? 'page' : undefined} className="block">
                <div
                  className={
                    'mb-1 flex h-14 items-center gap-4 rounded-xl px-4 text-base font-medium transition-colors ' +
                    (active ? `${SIDEBAR_ACTIVE_BG} text-neutral-900` : 'text-neutral-700 hover:bg-white')
                  }
                >
                  <span className={`ms ms-32 shrink-0 leading-none ${colorClass}`}>
                    {icon}
                  </span>
                  <span>{tSidebar(labelKey)}</span>
                </div>
              </Link>
            )
          })}

          <div className="my-4 h-px w-full bg-neutral-200" />

          <Link href="/settings" className="block">
            <div className={
              'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ' +
              (location === '/settings' ? 'bg-primary-100 text-neutral-900' : 'text-neutral-700 hover:bg-white')
            }>
              <span className="ms ms-32 text-neutral-700">settings</span>
              <span>{tSidebar('settings')}</span>
            </div>
          </Link>
        </nav>

        <div className={`mt-auto -mx-5 px-5 py-4 text-neutral-900 ${SIDEBAR_USER_BG}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="ms ms-32 text-neutral-700">account_circle</span>
              <div>
                <div className="text-sm font-semibold leading-tight">{user || 'Usuario'}</div>
              </div>
            </div>
            <button
              aria-label={tCommon('logout')}
              className="rounded p-2 text-neutral-800 hover:bg-primary-100"
              onClick={() => {
                logout()
                setLocation('/login')
              }}
            >
              <span className="ms ms-32">logout</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 bg-neutral-50">
        <header className="mt-12 grid h-16 grid-cols-3 items-center px-8">
          <button aria-label={tCommon('back')} onClick={() => window.history.back()} className="justify-self-start text-neutral-900">
            <span className="ms ms-32">arrow_back</span>
          </button>
          <h1 className="justify-self-center text-xl font-semibold text-neutral-900">
            {tSidebar(
              (NAV_ITEMS.find((i) => i.href === location)?.labelKey) ||
                (location === '/settings' ? 'settings' : 'dashboard')
            )}
          </h1>
          <div className="justify-self-end">
            <Link aria-label={tCommon('notifications')} href="/notifications" className="group relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-neutral-50 transition-colors hover:bg-primary-50">
              <span className="ms ms-32 text-neutral-900 group-hover:text-primary-600">notifications</span>
              
              {/* Badge de notificaciones no leídas */}
              {notificationStats.unread > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {notificationStats.unread > 99 ? '99+' : notificationStats.unread}
                </span>
              )}
            </Link>
          </div>
        </header>
        <div className="p-6">{children}</div>
      </main>
      
      {/* Toast Notifications */}
      <NotificationToasts />
    </div>
  )
}



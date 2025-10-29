import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import { useNotifications } from '@/hooks/useNotifications'
import type { NotificationsReturn } from '@/types/websocket'

type NotificationsContextType = NotificationsReturn

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined)

interface NotificationsProviderProps {
  children: ReactNode
}

export function NotificationsProvider({ children }: NotificationsProviderProps) {
  const notificationsData = useNotifications()

  return (
    <NotificationsContext.Provider value={notificationsData}>
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotificationsContext() {
  const context = useContext(NotificationsContext)
  if (context === undefined) {
    throw new Error('useNotificationsContext must be used within a NotificationsProvider')
  }
  return context
}

import { useEffect, useRef } from 'react'
import { useNotificationsContext } from '@/contexts/NotificationsContext'
import { useToast } from '@/contexts/ToastContext'

export default function NotificationToasts() {
  const { notifications } = useNotificationsContext()
  const { addToast } = useToast()
  const lastNotificationCountRef = useRef(0)

  // Detectar nuevas notificaciones
  useEffect(() => {
    if (notifications.length > lastNotificationCountRef.current) {
      // Hay nuevas notificaciones
      const newNotifications = notifications.slice(0, notifications.length - lastNotificationCountRef.current)
      
      newNotifications.forEach(notification => {
        // Mapear el tipo de notificación del backend al tipo de toast
        let toastType: 'success' | 'error' | 'warning' | 'info' = 'info'
        
        switch (notification.type) {
          case 'new_report':
            toastType = 'info'
            break
          case 'cancel_subscription':
            toastType = 'warning'
            break
          case 'payment_success':
            toastType = 'success'
            break
          case 'payment_failed':
            toastType = 'error'
            break
          default:
            toastType = 'info'
        }

        addToast({
          type: toastType,
          title: notification.title,
          message: notification.message,
          duration: 5000 // 5 segundos
        })
      })
    }
    
    lastNotificationCountRef.current = notifications.length
  }, [notifications, addToast])

  // Este componente no renderiza nada, solo maneja la lógica
  return null
}

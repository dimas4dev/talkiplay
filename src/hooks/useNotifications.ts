import { useState, useEffect, useCallback } from 'react'
import { useSocketIO } from './useSocketIO'
import apiClient from '@/services/api'
import type { 
  Notification, 
  NotificationType,
  NotificationStats, 
  NotificationFilter,
  NotificationsReturn
} from '@/types/websocket'

export function useNotifications(): NotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [recentlyRead, setRecentlyRead] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(false)

  // Cargar notificaciones desde el backend
  const loadNotifications = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await apiClient.get<Notification[]>('/api/v1/admin/notifications')
      if (response.success && response.data) {
        // Convertir las fechas de string a Date
        const formattedNotifications = response.data.map((notification: Notification) => ({
          ...notification,
          created_at: new Date(notification.created_at),
          read_at: notification.read_at ? new Date(notification.read_at) : undefined
        }))
        setNotifications(formattedNotifications)
      }
    } catch (error) {
      console.error('Error loading notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Función para formatear la fecha de la notificación
  const formatNotificationDate = (createdAt: Date): string => {
    const now = new Date()
    const notificationDate = new Date(createdAt)
    const diffInHours = (now.getTime() - notificationDate.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return 'today'
    } else if (diffInHours < 168) { // 7 días
      return 'lastWeek'
    } else {
      return 'older'
    }
  }

  // Función para formatear el timestamp (no se usa actualmente)
  // const formatTimestamp = (createdAt: Date): string => {
  //   const date = new Date(createdAt)
  //   const now = new Date()
  //   const diffInMinutes = (now.getTime() - date.getTime()) / (1000 * 60)

  //   if (diffInMinutes < 1) {
  //     return 'Ahora'
  //   } else if (diffInMinutes < 60) {
  //     return `Hace ${Math.floor(diffInMinutes)} min`
  //   } else if (diffInMinutes < 1440) { // 24 horas
  //     return `Hace ${Math.floor(diffInMinutes / 60)} h`
  //   } else {
  //     return date.toLocaleDateString('es-ES', {
  //       day: '2-digit',
  //       month: 'short',
  //       hour: '2-digit',
  //       minute: '2-digit'
  //     })
  //   }
  // }

  // Manejar mensajes del WebSocket
  const handleWebSocketMessage = useCallback((message: any) => {
    // Verificar si es un mensaje de notificación
    if (message.type && message.type.startsWith('notification:')) {
      // El mensaje tiene estructura: { type: 'notification:new_report', data: Array(1) }
      if (message.data && Array.isArray(message.data) && message.data.length > 0) {
        const notificationData = message.data[0]
        
        // Verificar si tiene la estructura esperada
        if (notificationData.notification) {
          const notification = notificationData.notification
          
          // Crear la notificación con la estructura correcta
          const newNotification: Notification = {
            id: notification.id,
            type: notification.type as NotificationType,
            title: notification.title,
            message: notification.message,
            data: notification.data,
            recipient_id: notification.data?.user_id || 'unknown',
            sender_id: 'system',
            is_read: false,
            created_at: new Date(notification.created_at),
            read_at: undefined
          }

          setNotifications(prev => [newNotification, ...prev])
          
          // Mostrar notificación del sistema si está disponible
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(newNotification.title, {
              body: newNotification.message,
              icon: '/talkiplay.svg'
            })
          }
        }
      }
    }
  }, [])

  // Configurar Socket.IO con modo de desarrollo
  const isDevelopment = import.meta.env.DEV
  const socketUrl = isDevelopment 
    ? `http://82.180.132.38:3001` // Servidor local para desarrollo
    : `http://82.180.132.38:3001` // Servidor real para producción
    
  const { isConnected, isConnecting, error, connect, disconnect } = useSocketIO({
    url: socketUrl,
    onMessage: handleWebSocketMessage,
    onOpen: () => {
      // Socket.IO conectado
    },
    onClose: () => {
      // Socket.IO desconectado
    },
    onError: (error) => {
      console.error('❌ Notifications Socket.IO error:', error)
    }
  })

  // Solicitar permisos de notificación al montar
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
    
    // Cargar notificaciones iniciales
    loadNotifications()
  }, [loadNotifications])

  // Función para marcar notificación como leída
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      // Actualizar en el backend
      await apiClient.put<{ message: string }>(`/api/v1/admin/notifications/${notificationId}/read`)
      
      // Actualizar estado local
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, is_read: true, read_at: new Date() }
            : notification
        )
      )
      setRecentlyRead(prev => new Set(prev).add(notificationId))
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }, [])

  // Función para marcar todas como leídas
  const markAllAsRead = useCallback(async () => {
    try {
      // Actualizar en el backend
      await apiClient.put<{ message: string }>('/api/v1/admin/notifications/mark-all-read')
      
      // Actualizar estado local
      setNotifications(prev => 
        prev.map(notification => ({ 
          ...notification, 
          is_read: true, 
          read_at: new Date() 
        }))
      )
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }, [])

  // Función para limpiar notificaciones recientemente leídas
  const clearRecentlyRead = useCallback(() => {
    setRecentlyRead(new Set())
  }, [])

  // Función para obtener notificaciones filtradas
  const getFilteredNotifications = useCallback((filter: NotificationFilter) => {
    if (filter === 'unread') {
      return notifications.filter(n => !n.is_read || recentlyRead.has(n.id))
    }
    return notifications
  }, [notifications, recentlyRead])

  // Función para eliminar notificación
  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      // Eliminar en el backend
      await apiClient.delete<{ message: string }>(`/api/v1/admin/notifications/${notificationId}`)
      
      // Actualizar estado local
      setNotifications(prev => prev.filter(n => n.id !== notificationId))
      setRecentlyRead(prev => {
        const newSet = new Set(prev)
        newSet.delete(notificationId)
        return newSet
      })
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }, [])

  // Función para obtener estadísticas
  const getStats = useCallback((): NotificationStats => {
    const unreadCount = notifications.filter(n => !n.is_read).length
    const readCount = notifications.filter(n => n.is_read).length
    const todayCount = notifications.filter(n => formatNotificationDate(n.created_at) === 'today').length
    const lastWeekCount = notifications.filter(n => formatNotificationDate(n.created_at) === 'lastWeek').length

    return {
      total: notifications.length,
      unread: unreadCount,
      read: readCount,
      today: todayCount,
      lastWeek: lastWeekCount
    }
  }, [notifications])

  return {
    notifications,
    recentlyRead,
    isConnected,
    isConnecting,
    error,
    isLoading,
    markAsRead,
    markAllAsRead,
    clearRecentlyRead,
    getFilteredNotifications,
    getStats,
    deleteNotification,
    loadNotifications,
    connect,
    disconnect
  }
}

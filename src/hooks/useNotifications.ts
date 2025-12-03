import { useState, useCallback, useRef } from 'react'
import type { Notification, NotificationFilter, NotificationStats, NotificationsReturn } from '@/types/websocket'
import { notificationsService, authService } from '@/services/api'
import type { AdminNotification, AdminNotificationsStats } from '@/types/api'
import { io, type Socket } from 'socket.io-client'

export function useNotifications(): NotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [recentlyRead, setRecentlyRead] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [apiStats, setApiStats] = useState<AdminNotificationsStats | null>(null)
  const socketRef = useRef<Socket | null>(null)

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      // Optimistic update
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, is_read: true, read_at: new Date() } : n
        )
      )
      setRecentlyRead(prev => new Set([...prev, notificationId]))

      // Llamada real al backend
      await notificationsService.markNotificationAsRead(notificationId)

      // Actualizar stats locales si teníamos stats del backend
      setApiStats(prev =>
        prev
          ? {
              ...prev,
              unread: Math.max(0, prev.unread - 1),
              total: prev.total,
            }
          : prev
      )
    } catch (err) {
      // Si falla, revertir el cambio optimista
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, is_read: false, read_at: undefined } : n
        )
      )
      setRecentlyRead(prev => {
        const next = new Set(prev)
        next.delete(notificationId)
        return next
      })
      console.error('Error al marcar notificación como leída', err)
    }
  }, [])

  const markAllAsRead = useCallback(async () => {
    // TODO: Implementar llamada a API
    const now = new Date()
    setNotifications(prev => 
      prev.map(n => ({ ...n, is_read: true, read_at: now }))
    )
  }, [])

  const clearRecentlyRead = useCallback(() => {
    setRecentlyRead(new Set())
  }, [])

  const getFilteredNotifications = useCallback((filter: NotificationFilter) => {
    if (filter === 'unread') {
      return notifications.filter(n => !n.is_read)
    }
    return notifications
  }, [notifications])

  const getStats = useCallback((): NotificationStats => {
    const now = new Date()
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const today = new Date(now.setHours(0, 0, 0, 0))

    const localTotal = notifications.length
    const localUnread = notifications.filter(n => !n.is_read).length

    return {
      total: apiStats?.total ?? localTotal,
      unread: apiStats?.unread ?? localUnread,
      read: (apiStats?.total ?? localTotal) - (apiStats?.unread ?? localUnread),
      today: notifications.filter(n => new Date(n.created_at) >= today).length,
      lastWeek: notifications.filter(n => new Date(n.created_at) >= lastWeek).length,
    }
  }, [notifications, apiStats])

  const deleteNotification = useCallback(async (notificationId: string) => {
    // TODO: integrar endpoint de borrado cuando exista en el backend
    setNotifications(prev => prev.filter(n => n.id !== notificationId))
  }, [])

  // Mapear notificación del API admin -> tipo Notification usado en la UI
  function mapAdminNotification(apiNotification: AdminNotification): Notification {
    return {
      id: apiNotification.id,
      type: apiNotification.type as any,
      title: apiNotification.title,
      message: apiNotification.message,
      data: {
        userId: apiNotification.userId,
        familyId: apiNotification.familyId,
        reportId: apiNotification.reportId,
        metadata: apiNotification.metadata,
      },
      recipient_id: apiNotification.userId,
      sender_id: undefined,
      is_read: apiNotification.isRead,
      created_at: new Date(apiNotification.createdAt),
      read_at: apiNotification.isRead ? new Date(apiNotification.createdAt) : undefined,
    }
  }

  const loadNotifications = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [listResponse, statsResponse] = await Promise.all([
        notificationsService.getAdminNotifications({ page: 1, limit: 20 }),
        notificationsService.getAdminNotificationsStats(),
      ])

      const mapped = listResponse.data.map(mapAdminNotification)
      setNotifications(mapped)
      setApiStats(statsResponse)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar notificaciones')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const connect = useCallback(() => {
    if (socketRef.current || isConnecting) return

    const baseUrl = (import.meta.env.VITE_TALKIPLAY_API_URL || '').replace(/\/+$/, '')
    const token = authService.getAccessToken()

    if (!baseUrl || !token) {
      console.error('No hay URL base o token para conectar al WebSocket de notificaciones')
      return
    }

    setIsConnecting(true)

    const socket = io(`${baseUrl}/admin-notifications`, {
      auth: { token },
      transports: ['websocket', 'polling'],
    })

    socketRef.current = socket

    socket.on('connect', () => {
      setIsConnected(true)
      setIsConnecting(false)
    })

    socket.on('disconnect', () => {
      setIsConnected(false)
    })

    socket.on('connect_error', (err) => {
      console.error('Error de conexión al WebSocket de notificaciones:', err)
      setError(err instanceof Error ? err.message : 'Error de conexión al WebSocket')
      setIsConnecting(false)
      setIsConnected(false)
    })

    // Nueva notificación en tiempo real
    socket.on('newNotification', (apiNotification: AdminNotification) => {
      const mapped = mapAdminNotification(apiNotification)
      setNotifications((prev) => [mapped, ...prev])
      setApiStats((prev) =>
        prev
          ? { ...prev, total: prev.total + 1, unread: prev.unread + (mapped.is_read ? 0 : 1) }
          : { total: 1, unread: mapped.is_read ? 0 : 1 }
      )
    })

    // Actualización del contador de no leídas
    socket.on('unreadCount', (data: { count: number }) => {
      setApiStats((prev) =>
        prev ? { ...prev, unread: data.count } : { total: notifications.length, unread: data.count }
      )
    })
  }, [isConnecting, notifications.length])

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect()
      socketRef.current = null
    }
    setIsConnected(false)
    setIsConnecting(false)
  }, [])

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
    disconnect,
  }
}


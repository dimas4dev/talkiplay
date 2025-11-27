import type { ApiResponse } from '@/types/api'
import type { Notification } from '@/types/websocket'

// Datos mock de notificaciones
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif_1',
    type: 'new_report',
    title: 'Nuevo reporte recibido',
    message: 'María García ha enviado un nuevo reporte: "Problema con la aplicación"',
    recipient_id: 'admin_1',
    is_read: false,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000), // Hace 2 horas
  },
  {
    id: 'notif_2',
    type: 'payment_failed',
    title: 'Pago fallido',
    message: 'El pago de Juan Pérez ha fallado. Razón: Tarjeta rechazada',
    recipient_id: 'admin_1',
    is_read: false,
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000), // Hace 5 horas
  },
  {
    id: 'notif_3',
    type: 'cancel_subscription',
    title: 'Suscripción cancelada',
    message: 'Ana López ha cancelado su suscripción Premium',
    recipient_id: 'admin_1',
    is_read: true,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000), // Hace 1 día
    read_at: new Date(Date.now() - 23 * 60 * 60 * 1000),
  },
  {
    id: 'notif_4',
    type: 'payment_success',
    title: 'Pago exitoso',
    message: 'Carlos Ruiz ha renovado su suscripción Pro exitosamente',
    recipient_id: 'admin_1',
    is_read: true,
    created_at: new Date(Date.now() - 48 * 60 * 60 * 1000), // Hace 2 días
    read_at: new Date(Date.now() - 47 * 60 * 60 * 1000),
  },
  {
    id: 'notif_5',
    type: 'new_report',
    title: 'Nuevo reporte recibido',
    message: 'Pedro Martínez ha enviado un nuevo reporte: "Error al sincronizar"',
    recipient_id: 'admin_1',
    is_read: false,
    created_at: new Date(Date.now() - 72 * 60 * 60 * 1000), // Hace 3 días
  },
]

export const mockNotifications = {
  getNotifications: (): Response => {
    const response: ApiResponse<Notification[]> = {
      success: true,
      message: 'Notificaciones obtenidas exitosamente',
      data: MOCK_NOTIFICATIONS,
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },

  getNotificationStats: (): Response => {
    const total = MOCK_NOTIFICATIONS.length
    const unread = MOCK_NOTIFICATIONS.filter((n) => !n.is_read).length
    const read = MOCK_NOTIFICATIONS.filter((n) => n.is_read).length

    const response: ApiResponse<{ total: number; unread: number; read: number }> = {
      success: true,
      message: 'Estadísticas de notificaciones obtenidas exitosamente',
      data: {
        total,
        unread,
        read,
      },
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },

  markAllNotificationsAsRead: (): Response => {
    MOCK_NOTIFICATIONS.forEach((notification) => {
      if (!notification.is_read) {
        notification.is_read = true
        notification.read_at = new Date()
      }
    })

    const response: ApiResponse<{ message: string }> = {
      success: true,
      message: 'Todas las notificaciones marcadas como leídas',
      data: {
        message: 'Todas las notificaciones han sido marcadas como leídas',
      },
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },

  getUnreadNotificationCount: (userId: string): Response => {
    const unreadCount = MOCK_NOTIFICATIONS.filter(
      (n) => n.recipient_id === userId && !n.is_read
    ).length

    const response: ApiResponse<{ count: number }> = {
      success: true,
      message: 'Conteo de notificaciones no leídas obtenido exitosamente',
      data: {
        count: unreadCount,
      },
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },

  markNotificationAsRead: (notificationId: string): Response => {
    const notification = MOCK_NOTIFICATIONS.find((n) => n.id === notificationId)
    if (!notification) {
      const errorResponse: ApiResponse = {
        success: false,
        message: 'Notificación no encontrada',
        errors: ['La notificación con el ID proporcionado no existe'],
      }
      return new Response(JSON.stringify(errorResponse), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    notification.is_read = true
    notification.read_at = new Date()

    const response: ApiResponse<{ message: string }> = {
      success: true,
      message: 'Notificación marcada como leída',
      data: {
        message: 'La notificación ha sido marcada como leída',
      },
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },

  deleteNotification: (notificationId: string): Response => {
    const notificationIndex = MOCK_NOTIFICATIONS.findIndex((n) => n.id === notificationId)
    if (notificationIndex === -1) {
      const errorResponse: ApiResponse = {
        success: false,
        message: 'Notificación no encontrada',
        errors: ['La notificación con el ID proporcionado no existe'],
      }
      return new Response(JSON.stringify(errorResponse), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    MOCK_NOTIFICATIONS.splice(notificationIndex, 1)

    const response: ApiResponse<{ message: string }> = {
      success: true,
      message: 'Notificación eliminada exitosamente',
      data: {
        message: 'La notificación ha sido eliminada',
      },
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },
}


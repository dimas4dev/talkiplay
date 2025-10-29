// Tipos para WebSocket

export interface WebSocketMessage {
  type: string
  data: any
  timestamp: string
}

export interface WebSocketOptions {
  url: string
  onMessage?: (message: WebSocketMessage) => void
  onOpen?: () => void
  onClose?: () => void
  onError?: (error: Event) => void
  reconnectInterval?: number
  maxReconnectAttempts?: number
}

export interface WebSocketReturn {
  isConnected: boolean
  isConnecting: boolean
  error: string | null
  connect: () => void
  disconnect: () => void
  sendMessage: (message: any) => void
}

// Tipos para notificaciones (coinciden con el backend)
export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  data?: any
  recipient_id: string
  sender_id?: string
  is_read: boolean
  created_at: Date
  read_at?: Date
}

export type NotificationType = 'new_report' | 'cancel_subscription' | 'payment_success' | 'payment_failed'

export interface NotificationWebSocketMessage {
  type: 'notification'
  data: Notification
}

// Nueva estructura que coincide con el mensaje real del Socket.IO
export interface SocketIONotificationMessage {
  notification: Notification
  report?: {
    id: string
    user_name: string
    user_email: string
    subscription_type: string
  }
}

export interface NotificationStats {
  total: number
  unread: number
  read: number
  today: number
  lastWeek: number
}

export interface NotificationFilters {
  unread: 'unread'
  all: 'all'
}

export type NotificationFilter = 'unread' | 'all'

export interface NotificationsReturn {
  notifications: Notification[]
  recentlyRead: Set<string>
  isConnected: boolean
  isConnecting: boolean
  error: string | null
  isLoading: boolean
  markAsRead: (notificationId: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  clearRecentlyRead: () => void
  getFilteredNotifications: (filter: NotificationFilter) => Notification[]
  getStats: () => NotificationStats
  deleteNotification: (notificationId: string) => Promise<void>
  loadNotifications: () => Promise<void>
  connect: () => void
  disconnect: () => void
}

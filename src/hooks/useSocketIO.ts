import { useEffect, useRef, useState, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'
import type { WebSocketMessage, WebSocketOptions, WebSocketReturn } from '@/types/websocket'

// Función helper para convertir readyState a texto (no usada actualmente)
// const getReadyStateText = (readyState: number): string => {
//   switch (readyState) {
//     case 0: return 'CONNECTING'
//     case 1: return 'OPEN'
//     case 2: return 'CLOSING'
//     case 3: return 'CLOSED'
//     default: return 'UNKNOWN'
//   }
// }

export function useSocketIO({
  url,
  onMessage,
  onOpen,
  onClose,
  onError,
  reconnectInterval = 5000,
  maxReconnectAttempts = 5
}: WebSocketOptions): WebSocketReturn {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const socketRef = useRef<Socket | null>(null)
  const reconnectAttemptsRef = useRef(0)

  const connect = useCallback(() => {
    
    if (socketRef.current?.connected) {
      return
    }

    setIsConnecting(true)
    setError(null)

    try {
      // Obtener el token de acceso del localStorage
      const accessToken = localStorage.getItem('accessToken')
      
      if (!accessToken) {
        console.error('❌ No access token found in localStorage')
        setError('No access token found')
        setIsConnecting(false)
        return
      }

      // Crear la URL del Socket.IO con autenticación
      
      const socket = io(url, {
        auth: {
          token: accessToken
        },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: reconnectInterval,
        reconnectionAttempts: maxReconnectAttempts,
        timeout: 20000,
        forceNew: true
      })
      
      socketRef.current = socket

      socket.on('connect', () => {
        setIsConnected(true)
        setIsConnecting(false)
        setError(null)
        reconnectAttemptsRef.current = 0
        onOpen?.()
      })

      socket.on('connect_error', (error) => {
        console.error('❌ Socket.IO connection error:', {
          message: error.message,
          description: (error as any).description,
          context: (error as any).context,
          type: (error as any).type
        })
        setError(`Socket.IO connection error: ${error.message}`)
        setIsConnecting(false)
        onError?.(error as unknown as Event)
      })

      socket.on('disconnect', (reason) => {
        setIsConnected(false)
        setIsConnecting(false)
        onClose?.()

        if (reason === 'io server disconnect') {
          // Desconexión iniciada por el servidor
        } else if (reason === 'io client disconnect') {
          // Desconexión iniciada por el cliente
        } else {
          // Desconexión por error de red, se intentará reconectar
        }
      })

      socket.on('reconnect', () => {
        reconnectAttemptsRef.current = 0
      })

      socket.on('reconnect_error', (error) => {
        console.error('❌ Socket.IO reconnection error:', error)
        reconnectAttemptsRef.current++
      })

      socket.on('reconnect_failed', () => {
        setError('Max reconnection attempts reached')
      })

      // Escuchar mensajes de notificación
      socket.on('notification', (data) => {
        const message: WebSocketMessage = {
          type: 'notification',
          data: data,
          timestamp: new Date().toISOString()
        }
        onMessage?.(message)
      })

      // Escuchar cualquier evento personalizado
      socket.onAny((eventName, ...args) => {
        if (eventName !== 'notification') {
          const message: WebSocketMessage = {
            type: eventName,
            data: args,
            timestamp: new Date().toISOString()
          }
          onMessage?.(message)
        }
      })

    } catch (err) {
      console.error('❌ Error creating Socket.IO connection:', err)
      setError('Failed to create Socket.IO connection')
      setIsConnecting(false)
    }
  }, [url, onMessage, onOpen, onClose, onError, reconnectInterval, maxReconnectAttempts])

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect()
      socketRef.current = null
    }
    setIsConnected(false)
    setIsConnecting(false)
  }, [])

  const sendMessage = useCallback((message: any) => {
    if (socketRef.current?.connected) {
      try {
        socketRef.current.emit('message', message)
      } catch (err) {
        console.error('❌ Error sending Socket.IO message:', err)
      }
    } else {
      console.warn('⚠️ Socket.IO is not connected')
    }
  }, [])

  // Conectar automáticamente al montar
  useEffect(() => {
    connect()

    // Cleanup al desmontar
    return () => {
      disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Remover dependencias para evitar re-montajes

  return {
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
    sendMessage
  }
}

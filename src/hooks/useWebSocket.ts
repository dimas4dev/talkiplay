import { useEffect, useRef, useState, useCallback } from 'react'
import type { WebSocketMessage, WebSocketOptions, WebSocketReturn } from '@/types/websocket'

// Función helper para convertir readyState a texto
const getReadyStateText = (readyState: number): string => {
  switch (readyState) {
    case 0: return 'CONNECTING'
    case 1: return 'OPEN'
    case 2: return 'CLOSING'
    case 3: return 'CLOSED'
    default: return 'UNKNOWN'
  }
}

// Función para probar conectividad del servidor (no utilizada actualmente)
// const testServerConnectivity = async (url: string): Promise<boolean> => {
//   try {
//     // Extraer el host y puerto de la URL del WebSocket
//     const urlObj = new URL(url)
//     const testUrl = `http://${urlObj.host}`
    
    
//     const response = await fetch(testUrl, { 
//       method: 'HEAD',
//       mode: 'no-cors' // Para evitar problemas de CORS
//     })
    
//     return true
//   } catch (error) {
//     console.error('❌ Server connectivity test failed:', error)
//     return false
//   }
// }

export function useWebSocket({
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
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttemptsRef = useRef(0)

  const connect = useCallback(() => {
    
    if (wsRef.current?.readyState === WebSocket.OPEN) {
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

      // Crear la URL del WebSocket con autenticación
      const wsUrl = `${url}?token=${accessToken}`
      
      const ws = new WebSocket(wsUrl)
      wsRef.current = ws

      ws.onopen = () => {
        setIsConnected(true)
        setIsConnecting(false)
        setError(null)
        reconnectAttemptsRef.current = 0
        onOpen?.()
      }

      ws.onmessage = (event) => {
        try {
          const data = event.data.toString()
          const message: WebSocketMessage = JSON.parse(data)
          onMessage?.(message)
        } catch (err) {
          console.error('❌ Error parsing WebSocket message:', err)
        }
      }

      ws.onclose = (event) => {
        setIsConnected(false)
        setIsConnecting(false)
        onClose?.()

        // Intentar reconectar si no fue un cierre intencional
        if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect()
          }, reconnectInterval)
        } else if (event.code === 1000) {
        } else {
        }
      }

      ws.onerror = (event) => {
        console.error('❌ WebSocket error occurred:', {
          type: event.type,
          target: event.target,
          readyState: ws.readyState,
          url: wsUrl,
          readyStateText: getReadyStateText(ws.readyState)
        })
        
        // Información adicional para debug
        console.error('🔍 Debug info:', {
          tokenLength: accessToken?.length,
          tokenPreview: accessToken?.substring(0, 20) + '...',
          serverReachable: 'Testing...'
        })
        
        setError(`WebSocket connection error (Code: ${ws.readyState})`)
        setIsConnecting(false)
        onError?.(event as unknown as Event)
      }

    } catch (err) {
      console.error('❌ Error creating WebSocket connection:', err)
      setError('Failed to create WebSocket connection')
      setIsConnecting(false)
    }
  }, [url, onMessage, onOpen, onClose, onError, reconnectInterval, maxReconnectAttempts])

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }

    if (wsRef.current) {
      wsRef.current.close(1000, 'Intentional disconnect')
      wsRef.current = null
    }

    setIsConnected(false)
    setIsConnecting(false)
  }, [])

  const sendMessage = useCallback((message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send(JSON.stringify(message))
      } catch (err) {
        console.error('❌ Error sending WebSocket message:', err)
      }
    } else {
      console.warn('⚠️ WebSocket is not connected')
    }
  }, [])

  // Conectar automáticamente al montar
  useEffect(() => {
    connect()

    // Cleanup al desmontar
    return () => {
      disconnect()
    }
  }, [connect, disconnect])

  return {
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
    sendMessage
  }
}

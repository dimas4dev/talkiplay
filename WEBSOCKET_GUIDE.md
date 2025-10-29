# WebSocket Integration Guide

## 📡 Configuración de WebSocket

### URL Hardcodeada (Temporal)

Actualmente estamos usando una URL hardcodeada para pruebas:

```typescript
// En useNotifications.ts
url: `ws://82.180.132.38:3001`
```

### Variables de Entorno (Futuro)

Cuando tengamos el servidor disponible, agrega estas variables a tu archivo `.env`:

```env
# API Configuration
VITE_CLIPNEST_API_URL=https://api.clipnest.com

# WebSocket Configuration  
VITE_CLIPNEST_WS_URL=wss://api.clipnest.com
```

### Autenticación

El WebSocket utiliza el `accessToken` almacenado en `localStorage` para autenticación:

```typescript
// Actual (hardcodeado)
const wsUrl = `ws://82.180.132.38:3001?token=${accessToken}`

// Futuro (con variables de entorno)
const wsUrl = `${VITE_CLIPNEST_WS_URL}/ws/notifications?token=${accessToken}`
```

## 🔧 Hooks Disponibles

### `useWebSocket`

Hook genérico para conexiones WebSocket:

```typescript
const { isConnected, isConnecting, error, connect, disconnect, sendMessage } = useWebSocket({
  url: 'wss://api.clipnest.com/ws/notifications',
  onMessage: (message) => console.log('Message received:', message),
  onOpen: () => console.log('Connected'),
  onClose: () => console.log('Disconnected'),
  onError: (error) => console.error('Error:', error),
  reconnectInterval: 5000,
  maxReconnectAttempts: 5
})
```

### `useNotifications`

Hook específico para notificaciones:

```typescript
const {
  notifications,
  isConnected,
  markAsRead,
  markAllAsRead,
  getFilteredNotifications,
  getStats
} = useNotifications()
```

## 📨 Formato de Mensajes

### Mensaje de Notificación

```json
{
  "type": "notification",
  "data": {
    "id": "unique-id",
    "message": "Mensaje de la notificación",
    "title": "Título opcional",
    "type": "info|warning|error|success",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

## 🎨 Tipos de Notificación

Las notificaciones soportan diferentes tipos con estilos visuales:

- **`info`**: Azul (por defecto)
- **`warning`**: Amarillo
- **`error`**: Rojo  
- **`success`**: Verde

## 🔄 Reconexión Automática

El WebSocket incluye reconexión automática:

- **Intervalo**: 5 segundos (configurable)
- **Intentos máximos**: 5 (configurable)
- **Códigos de cierre**: Solo reconecta si no es cierre intencional (código 1000)

## 🔔 Notificaciones del Navegador

El sistema solicita permisos automáticamente y muestra notificaciones del navegador cuando:

- Se recibe una nueva notificación
- El usuario tiene permisos habilitados
- La página no está en foco

## 📊 Estadísticas

El hook `useNotifications` proporciona estadísticas:

```typescript
const stats = getStats()
// {
//   total: 10,
//   unread: 3,
//   today: 5,
//   lastWeek: 8
// }
```

## 🎯 Filtros

```typescript
// Obtener notificaciones no leídas
const unreadNotifications = getFilteredNotifications('unread')

// Obtener todas las notificaciones
const allNotifications = getFilteredNotifications('all')
```

## 🛠️ Funciones Disponibles

### `markAsRead(notificationId)`
Marca una notificación específica como leída.

### `markAllAsRead()`
Marca todas las notificaciones como leídas.

### `clearRecentlyRead()`
Limpia las notificaciones recientemente leídas.

### `sendMessage(message)`
Envía un mensaje al servidor WebSocket.

## 🔍 Debugging

Los hooks incluyen logging detallado:

```typescript
// En la consola del navegador verás:
🔌 WebSocket connected
📨 WebSocket message received: {...}
📤 WebSocket message sent: {...}
🔌 WebSocket disconnected: 1000 Intentional disconnect
```

## ⚠️ Consideraciones

1. **Autenticación**: El token debe estar presente en localStorage
2. **CORS**: Asegúrate de que el servidor WebSocket permita conexiones desde tu dominio
3. **Reconexión**: El sistema reconecta automáticamente, pero puedes deshabilitarlo
4. **Permisos**: Las notificaciones del navegador requieren permisos del usuario
5. **Performance**: Las notificaciones se almacenan en memoria, considera límites para aplicaciones grandes

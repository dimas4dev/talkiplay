# Guía de Integración con Backend

## Configuración de Variables de Entorno

### Archivo `.env.local` (crear en la raíz del proyecto)

```env
# URL de la API de ClipNest
# IMPORTANTE: Cambia esta URL por la URL real de tu API
VITE_CLIPNEST_API_URL=https://api.clipnest.com

# Usar mocks cuando la API no esté disponible (true/false)
VITE_USE_MOCKS=false
```

### 📝 **Variables de Entorno Disponibles**

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `VITE_CLIPNEST_API_URL` | URL base de la API | `https://api.clipnest.com` |
| `VITE_USE_MOCKS` | Usar datos mock | `false` |

### ⚠️ **Configuración Importante**

**Para desarrollo:**
1. Crea un archivo `.env.local` en la raíz del proyecto
2. Configura `VITE_CLIPNEST_API_URL` con la URL real de tu API
3. Establece `VITE_USE_MOCKS=false` para usar la API real

## Estructura de la API

### Autenticación

**Endpoint:** `POST /api/v1/auth/login`

**Request:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Authentication successful",
  "data": {
    "user": "string",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Response (400/401):**
```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    "Field is required",
    "Invalid format"
  ]
}
```

### Refresh Token

**Endpoint:** `POST /api/v1/auth/refresh`

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Response (401):**
```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    "Field is required",
    "Invalid format"
  ]
}
```

## Servicios Implementados

### 1. Servicio de Autenticación (`authService`)
- `login(credentials)` - Iniciar sesión
- `refreshToken()` - Renovar token de acceso
- `logout()` - Cerrar sesión
- `isAuthenticated()` - Verificar autenticación
- `getAccessToken()` - Obtener token de acceso
- `getRefreshToken()` - Obtener refresh token

### 2. Servicio de Dashboard (`dashboardService`)
- `getStats()` - Estadísticas generales
- `getActiveUsers()` - Usuarios activos
- `getSubscriptions()` - Datos de suscripciones
- `getRetentionRate()` - Tasa de retención
- `getUserGrowth()` - Crecimiento de usuarios

### 3. Servicio de Usuarios (`userService`)
- `getUsers(params)` - Lista de usuarios con filtros
- `getUserById(id)` - Usuario específico
- `updateUser(id, data)` - Actualizar usuario
- `toggleUserStatus(id)` - Bloquear/desbloquear

### 4. Servicio de Suscripciones (`subscriptionService`)
- `getSubscriptions(params)` - Lista de suscripciones
- `getSubscriptionById(id)` - Suscripción específica
- `updateSubscription(id, data)` - Actualizar suscripción

### 5. Servicio de Ingresos (`revenueService`)
- `getRevenues(params)` - Lista de ingresos
- `getRevenueByPeriod(period)` - Ingresos por período

### 6. Servicio de Reportes (`reportService`)
- `getReports(params)` - Lista de reportes
- `getUserReports(userId)` - Reportes por usuario

### 7. Servicio de Notificaciones (`notificationService`)
- `getNotifications(params)` - Lista de notificaciones
- `markAsRead(id)` - Marcar como leída

## Hooks Personalizados

### `useAuth()`
Hook para manejar la autenticación:
```typescript
const { isAuthenticated, isLoading, user, login, logout } = useAuth()
```

### `useDashboard()`
Hook para datos del dashboard:
```typescript
const { data, isLoading, error, refetch } = useDashboard()
```

### `useUsers(params)`
Hook para lista de usuarios:
```typescript
const { users, isLoading, error, total } = useUsers({
  search: 'término',
  sort: 'name',
  filters: { status: 'active' },
  page: 1,
  pageSize: 10
})
```

### `useUser(id)`
Hook para usuario específico:
```typescript
const { user, isLoading, error } = useUser('user-id')
```

## Componentes de Autenticación

### `LoginForm`
Formulario de inicio de sesión con validación y manejo de errores.

### `RequireAuth`
Componente de protección de rutas que verifica la autenticación.

### `AuthProvider`
Provider de contexto para manejar el estado de autenticación globalmente.

## Configuración de Rutas

Las rutas están configuradas para:
- `/login` - Página de inicio de sesión
- `/dashboard` - Dashboard principal (requiere autenticación)
- `/users` - Lista de usuarios (requiere autenticación)
- `/users/:id` - Detalle de usuario (requiere autenticación)
- Y todas las demás rutas protegidas

## Manejo de Errores

- **401 Unauthorized**: Redirige automáticamente al login
- **403 Forbidden**: Muestra mensaje de error
- **500 Server Error**: Muestra mensaje de error genérico
- **Network Error**: Muestra mensaje de error de conexión

## Características de Seguridad Implementadas

### 🔐 **Manejo Automático de Tokens**
- **Renovación automática**: Los tokens se renuevan cada 50 minutos
- **Interceptores 401**: Manejo automático de errores de autenticación
- **Limpieza de sesión**: Redirección automática al login cuando falla la renovación

### 🌐 **Cliente HTTP con Axios**
- **Peticiones HTTP confiables**: Usando Axios en lugar de fetch
- **Interceptores automáticos**: Para tokens y manejo de errores
- **Logging detallado**: Todas las peticiones aparecen en Network
- **Timeout configurable**: 10 segundos por defecto

### 🔄 **Flujo de Refresh Token**
1. **Login exitoso**: Se guardan tanto `accessToken` como `refreshToken`
2. **Peticiones autenticadas**: Se incluye automáticamente el `accessToken`
3. **Error 401**: Se intenta renovar el token con `refreshToken`
4. **Renovación exitosa**: Se actualiza el `accessToken` y se reintenta la petición
5. **Renovación fallida**: Se limpian todos los tokens y se redirige al login

## Próximos Pasos

1. ✅ **Implementar refresh token**: Completado
2. ✅ **Agregar interceptores**: Completado
3. **Implementar caché**: Para optimizar las peticiones repetidas
4. **Agregar tests**: Para los servicios y hooks
5. **Documentar endpoints**: Según vayan estando disponibles en el backend

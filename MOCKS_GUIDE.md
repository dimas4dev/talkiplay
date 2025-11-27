# Guía de Mocks

Este proyecto incluye un sistema completo de mocks que permite ejecutar la aplicación localmente sin necesidad de conectarse a la API real.

## 🚀 Cómo Activar los Mocks

Para activar los mocks, simplemente agrega la siguiente variable de entorno:

```bash
VITE_USE_MOCKS=true
```

### Opción 1: Archivo `.env`

Crea un archivo `.env` en la raíz del proyecto con:

```env
VITE_USE_MOCKS=true
```

### Opción 2: Variable de entorno en el sistema

```bash
export VITE_USE_MOCKS=true
npm run dev
```

### Opción 3: En el comando directamente

```bash
VITE_USE_MOCKS=true npm run dev
```

## 📋 Credenciales Mock

Para iniciar sesión con los mocks, usa las siguientes credenciales:

- **Email**: `admin@talkiplay.com`
- **Contraseña**: `admin123`

### Código OTP Mock

Cuando uses la funcionalidad de recuperación de contraseña, el código OTP mock es:

- **Código OTP**: `123456`

## 🎭 Endpoints Mockeados

El sistema de mocks cubre todos los endpoints principales de la aplicación:

### Autenticación (`/api/v1/auth`)
- ✅ `POST /api/v1/auth/login` - Iniciar sesión
- ✅ `POST /api/v1/auth/refresh` - Renovar token
- ✅ `GET /api/v1/auth/profile` - Obtener perfil
- ✅ `POST /api/v1/auth/forgot-password` - Solicitar recuperación
- ✅ `POST /api/v1/auth/verify-otp` - Verificar código OTP
- ✅ `POST /api/v1/auth/reset-password` - Restablecer contraseña

### Dashboard (`/api/v1/admin/dashboard`, `/api/v1/dashboard`)
- ✅ `GET /api/v1/admin/dashboard/stats` - Estadísticas del dashboard
- ✅ `GET /api/v1/dashboard/active-users` - Usuarios activos
- ✅ `GET /api/v1/dashboard/subscriptions` - Suscripciones
- ✅ `GET /api/v1/dashboard/retention-rate` - Tasa de retención
- ✅ `GET /api/v1/dashboard/user-growth` - Crecimiento de usuarios

### Usuarios (`/api/v1/users`, `/api/v1/admin/users`)
- ✅ `GET /api/v1/users` - Lista de usuarios (con paginación, filtros, búsqueda)
- ✅ `GET /api/v1/users/:id` - Obtener usuario por ID
- ✅ `PUT /api/v1/users/:id` - Actualizar usuario
- ✅ `POST /api/v1/users/:id/toggle-status` - Cambiar estado del usuario
- ✅ `DELETE /api/v1/users/:id` - Eliminar usuario
- ✅ `POST /api/v1/admin/users/greeting` - Enviar saludo
- ✅ `PUT /api/v1/admin/users/:id/status` - Actualizar estado
- ✅ `GET /api/v1/admin/users/:id/reports` - Reportes del usuario

### Ingresos/Revenues (`/api/v1/admin/income`)
- ✅ `GET /api/v1/admin/income` - Datos completos de ingresos
- ✅ `GET /api/v1/admin/income/:period` - Ingresos por período
- ✅ `GET /api/v1/admin/income/stats` - Estadísticas de ingresos
- ✅ `GET /api/v1/admin/income/payment-methods` - Métodos de pago
- ✅ `GET /api/v1/admin/income/active-subscriptions` - Suscripciones activas
- ✅ `GET /api/v1/admin/income/net-amount` - Importe neto
- ✅ `GET /api/v1/admin/income/current-month-projection` - Proyección del mes
- ✅ `GET /api/v1/admin/income/annual` - Ingresos anuales
- ✅ `GET /api/v1/admin/income/periods` - Períodos
- ✅ `GET /api/v1/admin/income/period-details` - Detalles del período
- ✅ `GET /api/v1/admin/income/summary` - Resumen de ingresos

### Métricas (`/api/v1/admin/metrics`)
- ✅ `GET /api/v1/admin/metrics/all` - Todas las métricas
- ✅ `GET /api/v1/admin/metrics/clips/stats` - Estadísticas de clips
- ✅ `GET /api/v1/admin/metrics/clips/by-source` - Clips por fuente
- ✅ `GET /api/v1/admin/metrics/pro-features/overview` - Resumen de características PRO
- ✅ `GET /api/v1/admin/metrics/pro-features/last-month` - Características PRO del último mes
- ✅ `GET /api/v1/admin/metrics/clips/by-month` - Clips por mes
- ✅ `GET /api/v1/admin/metrics/summary` - Resumen de métricas

### Suscripciones/Memberships (`/api/v1/admin/subscriptions`, `/api/v1/subscriptions`)
- ✅ `GET /api/v1/admin/subscriptions/all` - Todas las suscripciones
- ✅ `GET /api/v1/admin/subscriptions/trial` - Suscripciones en prueba
- ✅ `GET /api/v1/admin/subscriptions/suspended` - Suscripciones suspendidas
- ✅ `GET /api/v1/admin/subscriptions/renewals` - Renovaciones
- ✅ `GET /api/v1/admin/subscriptions/summary` - Resumen
- ✅ `GET /api/v1/admin/subscriptions/:id` - Obtener suscripción
- ✅ `PUT /api/v1/admin/subscriptions/:id` - Actualizar suscripción
- ✅ `POST /api/v1/admin/subscriptions/:id/toggle-status` - Cambiar estado
- ✅ `POST /api/v1/admin/subscriptions/:id/cancel` - Cancelar suscripción

### Reportes (`/api/v1/admin/reports`, `/api/v1/reports`)
- ✅ `GET /api/v1/admin/reports` - Lista de reportes (con paginación, filtros)
- ✅ `GET /api/v1/admin/reports/summary` - Resumen de reportes
- ✅ `GET /api/v1/admin/reports/:id` - Obtener reporte
- ✅ `PUT /api/v1/admin/reports/:id` - Actualizar reporte
- ✅ `POST /api/v1/admin/reports/:id/mark-read` - Marcar como leído
- ✅ `POST /api/v1/admin/reports/:id/mark-resolved` - Marcar como resuelto
- ✅ `GET /api/v1/reports/user/:id` - Reportes del usuario

### Notificaciones (`/api/v1/admin/notifications`)
- ✅ `GET /api/v1/admin/notifications` - Lista de notificaciones
- ✅ `GET /api/v1/admin/notifications/stats` - Estadísticas
- ✅ `PUT /api/v1/admin/notifications/mark-all-read` - Marcar todas como leídas
- ✅ `GET /api/v1/admin/notifications/user/:id/unread-count` - Conteo no leídas
- ✅ `PUT /api/v1/admin/notifications/:id/read` - Marcar como leída
- ✅ `DELETE /api/v1/admin/notifications/:id` - Eliminar notificación

### Configuración/Settings (`/api/v1/settings`)
- ✅ `GET /api/v1/settings/terms-and-conditions` - Términos y condiciones
- ✅ `GET /api/v1/settings/privacy-policy` - Política de privacidad
- ✅ `GET /api/v1/settings/sections/active/:type` - Secciones activas
- ✅ `GET /api/v1/settings/sections` - Todas las secciones
- ✅ `GET /api/v1/settings/sections/type/:type` - Secciones por tipo
- ✅ `GET /api/v1/settings/sections/:id` - Obtener sección
- ✅ `POST /api/v1/settings/sections` - Crear sección
- ✅ `PUT /api/v1/settings/sections/:id` - Actualizar sección
- ✅ `DELETE /api/v1/settings/sections/:id` - Eliminar sección

## 📁 Estructura de Archivos

Los mocks están organizados en la carpeta `src/mocks/`:

```
src/mocks/
├── mockInterceptor.ts      # Interceptor principal que intercepta fetch
├── auth.mock.ts            # Mocks de autenticación
├── dashboard.mock.ts       # Mocks del dashboard
├── users.mock.ts           # Mocks de usuarios
├── revenues.mock.ts        # Mocks de ingresos
├── metrics.mock.ts         # Mocks de métricas
├── memberships.mock.ts     # Mocks de suscripciones
├── reports.mock.ts         # Mocks de reportes
├── notifications.mock.ts   # Mocks de notificaciones
├── settings.mock.ts        # Mocks de configuración
└── revenues.ts             # Datos mock de ingresos (legacy)
```

## 🔧 Cómo Funciona

1. **Interceptación**: El `mockInterceptor.ts` intercepta todas las llamadas `fetch` cuando `VITE_USE_MOCKS=true`
2. **Enrutamiento**: Cada endpoint es enrutado a su handler correspondiente
3. **Datos Mock**: Los handlers devuelven datos mock realistas que coinciden con la estructura esperada por la aplicación
4. **Delay Simulado**: Se simula un delay de red (200-500ms) para hacer la experiencia más realista

## 🐛 Debugging

Cuando los mocks están activos, verás mensajes en la consola del navegador:

- 🟢 `Mocks habilitados - interceptando llamadas a la API`
- 🎭 `Mock: GET /api/v1/admin/dashboard/stats`
- ⚠️ `No hay mock para: POST /api/v1/unknown-endpoint` (si un endpoint no tiene mock)

## 📝 Notas Importantes

- Los mocks **NO** persisten datos entre recargas de página (son datos en memoria)
- Los mocks simulan respuestas exitosas en la mayoría de casos
- Para probar errores, puedes modificar los archivos mock correspondientes
- Los mocks están diseñados para ser realistas y útiles para desarrollo local

## 🚫 Desactivar Mocks

Para desactivar los mocks, simplemente:

1. Elimina la variable `VITE_USE_MOCKS` del archivo `.env`, o
2. Establece `VITE_USE_MOCKS=false`, o
3. No establezcas la variable en absoluto

La aplicación volverá a usar la API real automáticamente.


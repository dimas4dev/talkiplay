## ClipNest – Panel de administración

Aplicación web basada en React + TypeScript + Vite para administración y analítica de usuarios, suscripciones, ingresos, métricas y notificaciones en ClipNest.

### Requisitos
- Node.js 18+
- pnpm 9+

### Instalación y ejecución
```bash
pnpm install
pnpm dev           # entorno de desarrollo (http://localhost:5173)
pnpm build         # compila a producción en la carpeta dist/
pnpm preview       # sirve el build localmente
```

### Scripts disponibles
- **dev**: arranca Vite en modo desarrollo
- **build**: compila el proyecto a producción
- **preview**: sirve el build localmente
- **lint**: ejecuta ESLint

### Tecnologías principales
- **React 18** + **TypeScript**
- **Vite** (desarrollo y build)
- **TanStack Query** para obtención y cacheo de datos
- **i18next + react-i18next** para internacionalización
- **Tailwind CSS** para estilos (sin estilos inline, evitando `!important`)
- **Material Symbols** para iconografía
- Validaciones con **Zod** en formularios (preferido)

### Estructura del proyecto (principal)
```
src/
  app/            # App shell, i18n y rutas
  assets/         # Imágenes y SVGs
  components/     # UI y componentes de dominio
  hooks/          # hooks (datos, auth, sockets, etc.)
  pages/          # páginas (Dashboard, Users, Revenues, etc.)
  services/       # http/api services
  stores/         # stores (ej. auth)
  styles/         # CSS global y Tailwind
  types/          # tipos compartidos
  utils/          # utilidades (formatters, etc.)
```

### Internacionalización (i18n)
- Configuración en `src/app/i18n.ts`.
- Idiomas disponibles: `es` (por defecto) y `en`.
- Namespaces principales: `common`, `dashboard`, `auth`, `sidebar`, `memberships`, `revenues`, `metrics`, `reports`, `settings`, `userDetail`, `users`, `notifications`, `subscriptions`, `retention`, `userGrowth`.
- Ejemplo de uso:
```tsx
import { useTranslation } from 'react-i18next'

const { t } = useTranslation('revenues')
return <h1>{t('title')}</h1>
```
- Interpolación y plantillas:
```tsx
// Ejemplo en Métricas: trends
t('trends.growthVsPrevMonth', { value: '+1.5' })
t('trends.percentVsPrevPeriod', { value: '+3.2%' })
```
- Accesibilidad: `aria-label`, `alt`, `placeholder`, `title` usan claves i18n en `common` o en el namespace de contexto.

### Estilo y guías
- Seguir principios de **Clean Code** (nombres descriptivos, funciones pequeñas, early-returns, evitar comentarios obvios).
- Evitar estilos inline y `!important`. Utilizar utilidades de **Tailwind** o clases CSS.
- Componentes y utilidades con nombres significativos y tipos explícitos cuando aporte claridad.

### Desarrollo
- Datos y fetching con **TanStack Query** (ver hooks en `src/hooks/`).
- Para UI, reusar componentes genéricos en `src/components/ui/` (tablas, toasts, modales, inputs, etc.).
- Gráficos en `src/components/charts/`.
- Para toasts, usar `useToast()`.

### Despliegue
- Proyecto listo para **Vercel** (ver `vercel.json`).
- Comando de build: `pnpm build`.
- Directorio de salida: `dist/`.

### Variables de entorno
Crea un archivo `.env.local` en la raíz del proyecto.

```bash
# Base URL del backend principal (HTTPS recomendado en producción)
VITE_CLIPNEST_API_URL=https://api.clipnest.com

# Opcional: base para utilidades HTTP simples (fallback a /api)
VITE_API_BASE_URL=/api

# Opcional: URL del servidor de notificaciones Socket.IO
# Recomendado mover el valor hardcodeado de useNotifications a esta variable
# y ajustar el hook para leerla
VITE_SOCKET_URL=http://82.180.132.38:3001
```

Notas:
- Los tokens `accessToken` y `refreshToken` se guardan en `localStorage` por el `apiClient` tras login.
- Algunos hooks (p.ej. notificaciones) usan actualmente una URL de Socket.IO fija; se recomienda migrar a `VITE_SOCKET_URL` en tu entorno.

### Endpoints y servicios
- Los servicios REST están en `src/services/api.ts` y usan `VITE_CLIPNEST_API_URL`.
- Notificaciones via Socket.IO en `src/hooks/useNotifications.ts` → `useSocketIO`.
- Utilidad HTTP simple en `src/services/http.ts` soporta `VITE_API_BASE_URL`.

### Ejecución con backend
- Configura `VITE_CLIPNEST_API_URL` apuntando a tu API.
- Si usas notificaciones en tiempo real, configura `VITE_SOCKET_URL` y ajusta `useNotifications` para leerla (o mantén el host por defecto si es tu servidor).

### Convenciones clave
- i18n: siempre envolver textos visibles o de accesibilidad con `t()`.
- Accesibilidad: usar `aria-*` coherentes, `alt` descriptivos e `aria-labelledby` cuando aplique.
- Formateo: mantener el estilo existente, no re-formatear código no relacionado.

### Soporte / Mantenimiento
- Ejecutar `pnpm lint` antes de abrir PRs.
- Añadir nuevas claves de i18n en ambos idiomas (`es` y `en`).
- Mantener consistencia: usar **Material Symbols** para iconos y **Tailwind** para estilos.

---

© ClipNest. Todos los derechos reservados.

import type { SidebarItem } from '@/types/types.d.ts'
import { ROUTES } from '@/constants/routes'

// Colores del sidebar centralizados
export const SIDEBAR_BG = 'bg-[var(--sidebar-bg)]'
export const SIDEBAR_BORDER = 'border-[var(--color-neutral-400)]'
export const SIDEBAR_USER_BG = 'bg-[var(--sidebar-user-bg)]'
export const SIDEBAR_ACTIVE_BG = 'bg-[var(--color-info-500)]'

// Ítems de navegación del sidebar (labels via i18n keys)
export const NAV_ITEMS: SidebarItem[] = [
  { labelKey: 'dashboard', href: ROUTES.dashboard, icon: 'dashboard_customize', colorClass: 'text-[var(--color-neutral-900)]' },
  { labelKey: 'metrics', href: ROUTES.metrics, icon: 'bar_chart', colorClass: 'text-[var(--color-neutral-900)]' },
  { labelKey: 'users', href: ROUTES.users, icon: 'group', colorClass: 'text-[var(--color-neutral-900)]' },
  { labelKey: 'reports', href: ROUTES.reports, icon: 'report', colorClass: 'text-[var(--color-neutral-900)]' },
  // Sección secundaria
  { labelKey: 'language', href: ROUTES.settings, icon: 'chat_error', colorClass: 'text-[var(--color-neutral-900)]' },
  { labelKey: 'settings', href: ROUTES.settings, icon: 'settings', colorClass: 'text-[var(--color-neutral-900)]' },
]



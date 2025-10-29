import type { SidebarItem } from '@/types/types.d.ts'
import { ROUTES } from '@/constants/routes'

// Colores del sidebar centralizados (clases Tailwind arbitrarias)
export const SIDEBAR_BG = 'bg-[#EEEEFB]'
export const SIDEBAR_BORDER = 'border-[#DDE1FF]'
export const SIDEBAR_USER_BG = 'bg-[#CACCF4]'
export const SIDEBAR_ACTIVE_BG = SIDEBAR_USER_BG

// Ítems de navegación del sidebar (labels via i18n keys)
export const NAV_ITEMS: SidebarItem[] = [
  { labelKey: 'dashboard', href: ROUTES.dashboard, icon: 'dashboard_customize', colorClass: 'text-[#5459DA]' },
  { labelKey: 'memberships', href: ROUTES.memberships, icon: 'stars', colorClass: 'text-[#4DA3E8]' },
  { labelKey: 'revenues', href: ROUTES.revenues, icon: 'attach_money', colorClass: 'text-[#0D9443]' },
  { labelKey: 'metrics', href: ROUTES.metrics, icon: 'bar_chart', colorClass: 'text-[#FF5500]' },
  { labelKey: 'users', href: ROUTES.users, icon: 'group', colorClass: 'text-[#CC0077]' },
  { labelKey: 'reports', href: ROUTES.reports, icon: 'report', colorClass: 'text-[#2F2F2F]' },
  { labelKey: 'notifications', href: ROUTES.notifications, icon: 'notifications', colorClass: 'text-[#5459DA]' },
]



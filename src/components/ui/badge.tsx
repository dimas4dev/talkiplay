import type { BadgeProps } from '@/types/ui'

// Colores usando variables CSS de la paleta semántica
const VARIANT_CLASSES: Record<NonNullable<BadgeProps['variant']>, string> = {
  premium: 'bg-[var(--color-membership-premium-bg)] text-[var(--color-membership-premium-text)]',
  pro: 'bg-[var(--color-membership-pro-bg)] text-[var(--color-membership-pro-text)]',
  explorador: 'bg-[var(--color-membership-explorador-bg)] text-[var(--color-membership-explorador-text)]',
  'status-trial': 'bg-[var(--color-status-trial-bg)] text-[var(--color-status-trial-text)]',
  'status-active': 'bg-[var(--color-status-active-bg)] text-[var(--color-status-active-text)]',
  'status-inactive': 'bg-[var(--color-status-inactive-bg)] text-[var(--color-status-inactive-text)]',
  'status-blocked': 'bg-[var(--color-status-blocked-bg)] text-[var(--color-status-blocked-text)]',
  'status-suspended': 'bg-[var(--color-status-suspended-bg)] text-[var(--color-status-suspended-text)]',
  'status-expired': 'bg-[var(--color-status-expired-bg)] text-[var(--color-status-expired-text)]',
  'status-payment-error': 'bg-[var(--color-status-payment-error-bg)] text-[var(--color-status-payment-error-text)]',
  'status-cancelled': 'bg-[var(--color-status-cancelled-bg)] text-[var(--color-status-cancelled-text)]',
  // Mapeo de variantes "suaves" a estilos existentes para no romper otras pantallas
  'soft-active': 'bg-[var(--color-status-active-bg)] text-[var(--color-status-active-text)]',
  'soft-inactive': 'bg-[var(--color-status-inactive-bg)] text-[var(--color-status-inactive-text)]',
  'soft-blocked': 'bg-[var(--color-status-blocked-bg)] text-[var(--color-status-blocked-text)]',
}

export default function Badge({ children, variant = 'premium', className = '' }: BadgeProps) {
  const base = 'inline-block rounded px-3 py-1 font-bold text-[14px] leading-[1.4]'
  const variantClass = VARIANT_CLASSES[variant]
  return <span className={`${base} ${variantClass} ${className}`}>{children}</span>
}



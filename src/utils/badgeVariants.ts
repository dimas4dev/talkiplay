export type SubscriptionVariant = 'premium' | 'pro' | 'explorador'
export type StatusVariant = 'status-active' | 'status-inactive' | 'status-blocked'

export function getSubscriptionBadgeVariant(subscription?: string | null): SubscriptionVariant {
  if (!subscription) return 'premium'
  const normalized = subscription.toLowerCase()
  if (normalized.includes('pro')) return 'pro'
  if (normalized.includes('explor')) return 'explorador'
  return 'premium'
}

export function getStatusBadgeVariant(status?: string | null): StatusVariant {
  if (!status) return 'status-active'
  const normalized = status.toLowerCase()
  if (normalized.includes('inac')) return 'status-inactive'
  if (normalized.includes('bloq')) return 'status-blocked'
  return 'status-active'
}

// Función para mapear estados de suscripción a variantes de badge
export function getSubscriptionStatusBadgeVariant(subscriptionStatus?: string | null): 'status-active' | 'status-cancelled' | 'status-inactive' {
  if (!subscriptionStatus) return 'status-inactive'
  const normalized = subscriptionStatus.toLowerCase().trim()
  
  if (normalized === 'active') return 'status-active'
  if (normalized === 'cancelled') return 'status-cancelled'
  if (normalized === 'trial') return 'status-active'
  if (normalized === 'expired') return 'status-cancelled'
  if (normalized === 'suspended') return 'status-cancelled'
  
  return 'status-inactive'
}



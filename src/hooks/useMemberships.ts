import { useApiData } from './useApiData'
import { membershipService } from '@/services/api'
import type { 
  SubscriptionOverviewData,
  Subscription 
} from '@/types/dashboard'

// Hook para obtener el resumen completo de suscripciones
export function useMemberships() {
  return useApiData<SubscriptionOverviewData>({
    fetchFn: async () => {
      const response = await membershipService.getSubscriptionSummary()
      
      if (response.success && response.data) {
        return response.data
      } else {
        throw new Error('Error al cargar los datos de membresías')
      }
    }
  })
}

// Hook para obtener todas las suscripciones
export function useAllSubscriptions() {
  return useApiData<Subscription[]>({
    fetchFn: async () => {
      const response = await membershipService.getAllSubscriptions()
      
      if (response.success && response.data) {
        return response.data.all_subscriptions
      } else {
        throw new Error('Error al cargar todas las suscripciones')
      }
    }
  })
}

// Hook para obtener suscripciones en prueba
export function useTrialSubscriptions() {
  return useApiData<Subscription[]>({
    fetchFn: async () => {
      const response = await membershipService.getTrialSubscriptions()
      
      if (response.success && response.data) {
        return response.data.trial_subscriptions
      } else {
        throw new Error('Error al cargar las suscripciones en prueba')
      }
    }
  })
}

// Hook para obtener suscripciones suspendidas
export function useSuspendedSubscriptions() {
  return useApiData<Subscription[]>({
    fetchFn: async () => {
      const response = await membershipService.getSuspendedSubscriptions()
      
      if (response.success && response.data) {
        return response.data.suspended_subscriptions
      } else {
        throw new Error('Error al cargar las suscripciones suspendidas')
      }
    }
  })
}

// Hook para obtener renovaciones de suscripciones
export function useSubscriptionRenewals() {
  return useApiData<Subscription[]>({
    fetchFn: async () => {
      const response = await membershipService.getSubscriptionRenewals()
      
      if (response.success && response.data) {
        return response.data.renewed_subscriptions
      } else {
        throw new Error('Error al cargar las renovaciones de suscripciones')
      }
    }
  })
}

export function useSubscriptionById(id: string) {
  return useApiData<Subscription>({
    fetchFn: async () => {
      const response = await membershipService.getSubscriptionById(id)
      
      if (response.success && response.data) {
        return response.data
      } else {
        throw new Error(`Error al cargar la suscripción ${id}`)
      }
    }
  })
}

// Hook para operaciones CRUD de suscripciones
export function useSubscriptionOperations() {
  const updateSubscription = async (id: string, data: any) => {
    const response = await membershipService.updateSubscription(id, data)
    if (!response.success) {
      throw new Error('Error al actualizar la suscripción')
    }
    return response.data
  }

  const toggleSubscriptionStatus = async (id: string) => {
    const response = await membershipService.toggleSubscriptionStatus(id)
    if (!response.success) {
      throw new Error('Error al cambiar el estado de la suscripción')
    }
    return response.data
  }

  const cancelSubscription = async (id: string) => {
    const response = await membershipService.cancelSubscription(id)
    if (!response.success) {
      throw new Error('Error al cancelar la suscripción')
    }
    return response.data
  }

  return {
    updateSubscription,
    toggleSubscriptionStatus,
    cancelSubscription
  }
}

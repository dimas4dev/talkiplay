import { useApiData } from './useApiData'

// Stub hooks para Memberships - TODO: Implementar cuando el API esté disponible

export function useMemberships() {
  return useApiData<any>({
    fetchFn: async () => {
      throw new Error('Servicio de membresías no implementado aún')
    },
    enabled: false,
  })
}

export function useAllSubscriptions() {
  return useApiData<any>({
    fetchFn: async () => {
      throw new Error('Servicio de todas las suscripciones no implementado aún')
    },
    enabled: false,
  })
}

export function useTrialSubscriptions() {
  return useApiData<any>({
    fetchFn: async () => {
      throw new Error('Servicio de suscripciones de prueba no implementado aún')
    },
    enabled: false,
  })
}

export function useSuspendedSubscriptions() {
  return useApiData<any>({
    fetchFn: async () => {
      throw new Error('Servicio de suscripciones suspendidas no implementado aún')
    },
    enabled: false,
  })
}

export function useSubscriptionRenewals() {
  return useApiData<any>({
    fetchFn: async () => {
      throw new Error('Servicio de renovaciones de suscripciones no implementado aún')
    },
    enabled: false,
  })
}


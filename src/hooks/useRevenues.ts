import { useApiData } from './useApiData'

// Stub hooks para Revenues - TODO: Implementar cuando el API esté disponible

export function useRevenueSummary() {
  return useApiData<any>({
    fetchFn: async () => {
      throw new Error('Servicio de resumen de ingresos no implementado aún')
    },
    enabled: false,
  })
}

export function usePeriods() {
  return useApiData<any>({
    fetchFn: async () => {
      throw new Error('Servicio de períodos de ingresos no implementado aún')
    },
    enabled: false,
  })
}

export function usePaymentMethodsDetailed() {
  return useApiData<any>({
    fetchFn: async () => {
      throw new Error('Servicio de métodos de pago detallados no implementado aún')
    },
    enabled: false,
  })
}

export function usePeriodDetails(_year: number | null, _month: number | null) {
  return useApiData<any>({
    fetchFn: async () => {
      throw new Error('Servicio de detalles de período no implementado aún')
    },
    enabled: false,
  })
}


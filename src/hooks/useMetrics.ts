import { useApiData } from './useApiData'
// TODO: Implementar servicio de métricas cuando esté disponible

export function useAllMetrics() {
  return useApiData<any>({
    fetchFn: async () => {
      // TODO: Implementar llamada a API
      throw new Error('Servicio de métricas no implementado aún')
    },
    enabled: false, // Deshabilitado hasta que se implemente
  })
}

export function useClipStats() {
  return useApiData<any>({
    fetchFn: async () => {
      // TODO: Implementar llamada a API
      throw new Error('Servicio de estadísticas de clips no implementado aún')
    },
    enabled: false,
  })
}

export function useClipsBySource() {
  return useApiData<any>({
    fetchFn: async () => {
      // TODO: Implementar llamada a API
      throw new Error('Servicio de clips por fuente no implementado aún')
    },
    enabled: false,
  })
}

export function useClipsByMonth() {
  return useApiData<any>({
    fetchFn: async () => {
      // TODO: Implementar llamada a API
      throw new Error('Servicio de clips por mes no implementado aún')
    },
    enabled: false,
  })
}

export function useMetricsSummary() {
  return useApiData<any>({
    fetchFn: async () => {
      // TODO: Implementar llamada a API
      throw new Error('Servicio de resumen de métricas no implementado aún')
    },
    enabled: false,
  })
}


import { useApiData } from './useApiData'
// TODO: Implementar servicio de dashboard cuando esté disponible

export function useDashboard() {
  return useApiData<any>({
    fetchFn: async () => {
      // TODO: Implementar llamada a API
      throw new Error('Servicio de dashboard no implementado aún')
    },
    enabled: false, // Deshabilitado hasta que se implemente
  })
}


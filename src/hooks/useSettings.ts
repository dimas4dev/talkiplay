import { useApiData } from './useApiData'
// TODO: Implementar servicio de configuración cuando esté disponible

export type SectionType = 'welcome' | 'about' | 'faq' | 'terms' | 'privacy'

export function useSettings() {
  return useApiData<any>({
    fetchFn: async () => {
      // TODO: Implementar llamada a API
      throw new Error('Servicio de configuración no implementado aún')
    },
    enabled: false, // Deshabilitado hasta que se implemente
  })
}

export function useSectionOperations(type: SectionType) {
  // TODO: Implementar operaciones de sección
  return {
    createSection: async () => {
      throw new Error('Operación no implementada aún')
    },
    updateSection: async () => {
      throw new Error('Operación no implementada aún')
    },
    deleteSection: async () => {
      throw new Error('Operación no implementada aún')
    },
  }
}


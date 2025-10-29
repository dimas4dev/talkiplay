import { useApiData } from './useApiData'
import { settingsService } from '@/services/api'
import type { Section, SectionCreateRequest, SectionUpdateRequest, SectionType } from '@/types/dashboard'

export function useSettings() {
  const apiData = useApiData<{ terms_and_conditions: Section[], privacy_policy: Section[] }>({
    fetchFn: async () => {
      const [termsResponse, privacyResponse] = await Promise.all([
        settingsService.getTermsAndConditions(),
        settingsService.getPrivacyPolicy()
      ])
      
      if (termsResponse.success && privacyResponse.success) {
        return {
          terms_and_conditions: Array.isArray(termsResponse.data?.sections) ? termsResponse.data.sections : [],
          privacy_policy: Array.isArray(privacyResponse.data?.sections) ? privacyResponse.data.sections : []
        }
      } else {
        throw new Error('Error al cargar los datos de configuración')
      }
    }
  })

  return {
    ...apiData,
    refetch: apiData.refetch
  }
}

export function useActiveSections(type: SectionType) {
  return useApiData<Section[]>({
    fetchFn: async () => {
      const response = await settingsService.getActiveSections(type)
      
      if (response.success && response.data) {
        return response.data
      } else {
        throw new Error(`Error al cargar las secciones activas de ${type}`)
      }
    }
  })
}

export function useAllSections() {
  return useApiData<Section[]>({
    fetchFn: async () => {
      const response = await settingsService.getAllSections()
      
      if (response.success && response.data) {
        return response.data
      } else {
        throw new Error('Error al cargar todas las secciones')
      }
    }
  })
}

export function useSectionsByType(type: SectionType) {
  return useApiData<Section[]>({
    fetchFn: async () => {
      const response = await settingsService.getSectionsByType(type)
      
      if (response.success && response.data) {
        return response.data
      } else {
        throw new Error(`Error al cargar las secciones de ${type}`)
      }
    }
  })
}

export function useSectionById(id: string) {
  return useApiData<Section>({
    fetchFn: async () => {
      const response = await settingsService.getSectionById(id)
      
      if (response.success && response.data) {
        return response.data
      } else {
        throw new Error(`Error al cargar la sección ${id}`)
      }
    }
  })
}

// Hook para operaciones CRUD
export function useSectionOperations() {
  const createSection = async (data: SectionCreateRequest) => {
    const response = await settingsService.createSection(data)
    if (!response.success) {
      throw new Error('Error al crear la sección')
    }
    return response.data
  }

  const updateSection = async (id: string, data: SectionUpdateRequest) => {
    const response = await settingsService.updateSection(id, data)
    if (!response.success) {
      throw new Error('Error al actualizar la sección')
    }
    return response.data
  }

  const deleteSection = async (id: string) => {
    const response = await settingsService.deleteSection(id)
    if (!response.success) {
      throw new Error('Error al eliminar la sección')
    }
    return response.data
  }

  return {
    createSection,
    updateSection,
    deleteSection
  }
}

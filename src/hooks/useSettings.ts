import { useApiData } from './useApiData'
import { settingsService } from '@/services/api'
import type { LegalDocument } from '@/types/api'
import type {
  SettingsData,
  Section,
  SectionCreateRequest,
  SectionUpdateRequest,
} from '@/types/dashboard'

// Mapear documentos legales activos al formato SettingsData usado por la UI de configuración
function mapLegalDocumentsToSettingsData(docs: LegalDocument[]): SettingsData {
  const terms: Section[] = []
  const policies: Section[] = []

  docs.forEach((doc, index) => {
    const base: Section = {
      id: doc.id,
      section_type:
        doc.type === 'terms' ? 'terms_and_conditions' : 'privacy_policy',
      title: doc.title,
      description: doc.content,
      order_index: index,
      is_active: doc.isActive,
      created_at: doc.createdAt,
      updated_at: doc.updatedAt,
    }

    if (doc.type === 'terms') {
      terms.push(base)
    } else {
      policies.push(base)
    }
  })

  return {
    terms_and_conditions: terms,
    privacy_policy: policies,
  }
}

// Hook principal para obtener la configuración (documentos legales activos)
export function useSettings() {
  return useApiData<SettingsData>({
    fetchFn: async () => {
      // Llamar a ambos endpoints en paralelo
      const [termsDocs, privacyDocs] = await Promise.all([
        settingsService.getTerms(),
        settingsService.getPrivacy(),
      ])
      
      // Combinar ambos arrays y mapear al formato esperado
      const allDocs = [...termsDocs, ...privacyDocs]
      return mapLegalDocumentsToSettingsData(allDocs)
    },
  })
}

// Operaciones de sección (crear, actualizar, eliminar)
export function useSectionOperations() {
  return {
    createSection: async (payload: SectionCreateRequest) => {
      const { title, description, section_type } = payload
      
      if (section_type === 'terms_and_conditions') {
        return await settingsService.createTermsSection({
          title,
          content: description,
        })
      } else {
        return await settingsService.createPrivacySection({
          title,
          content: description,
        })
      }
    },
    
    updateSection: async (id: string, payload: SectionUpdateRequest) => {
      const updatePayload: { title?: string; content?: string; isActive?: boolean } = {}
      
      if (payload.title !== undefined) updatePayload.title = payload.title
      if (payload.description !== undefined) updatePayload.content = payload.description
      if (payload.is_active !== undefined) updatePayload.isActive = payload.is_active
      
      return await settingsService.updateSection(id, updatePayload)
    },
    
    deleteSection: async (id: string) => {
      await settingsService.deleteSection(id)
    },
  }
}

export default useSettings



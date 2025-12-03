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
      const docs = await settingsService.getActiveLegalDocuments()
      return mapLegalDocumentsToSettingsData(docs)
    },
  })
}

// Por ahora las operaciones de sección son no-op porque aún no tenemos endpoints de escritura
export function useSectionOperations() {
  return {
    createSection: async (_payload: SectionCreateRequest) => {
      // TODO: integrar endpoints de creación cuando estén disponibles
      return
    },
    updateSection: async (_id: string, _payload: SectionUpdateRequest) => {
      // TODO: integrar endpoints de actualización cuando estén disponibles
      return
    },
    deleteSection: async (_id: string) => {
      // TODO: integrar endpoint de eliminación cuando esté disponible
      return
    },
  }
}

export default useSettings



import type { ApiResponse, Section } from '@/types/dashboard'

// Datos mock de secciones
const MOCK_SECTIONS: Section[] = [
  {
    id: 'section_1',
    section_type: 'terms_and_conditions',
    title: 'Términos y Condiciones - Introducción',
    description: 'Estos términos y condiciones rigen el uso de nuestra plataforma...',
    order_index: 1,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'section_2',
    section_type: 'terms_and_conditions',
    title: 'Términos y Condiciones - Uso del Servicio',
    description: 'El usuario se compromete a utilizar el servicio de manera responsable...',
    order_index: 2,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'section_3',
    section_type: 'privacy_policy',
    title: 'Política de Privacidad - Recopilación de Datos',
    description: 'Recopilamos información personal cuando te registras en nuestra plataforma...',
    order_index: 1,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'section_4',
    section_type: 'privacy_policy',
    title: 'Política de Privacidad - Uso de Datos',
    description: 'Utilizamos tus datos personales para proporcionar y mejorar nuestros servicios...',
    order_index: 2,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
]

export const mockSettings = {
  getTermsAndConditions: (): Response => {
    const termsSections = MOCK_SECTIONS.filter(
      (s) => s.section_type === 'terms_and_conditions' && s.is_active
    )
    const response: ApiResponse<{ sections: Section[] }> = {
      success: true,
      message: 'Términos y condiciones obtenidos exitosamente',
      data: {
        sections: termsSections,
      },
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },

  getPrivacyPolicy: (): Response => {
    const privacySections = MOCK_SECTIONS.filter(
      (s) => s.section_type === 'privacy_policy' && s.is_active
    )
    const response: ApiResponse<{ sections: Section[] }> = {
      success: true,
      message: 'Política de privacidad obtenida exitosamente',
      data: {
        sections: privacySections,
      },
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },

  getActiveSections: (type: string): Response => {
    const activeSections = MOCK_SECTIONS.filter(
      (s) => s.section_type === type && s.is_active
    )
    const response: ApiResponse<Section[]> = {
      success: true,
      message: 'Secciones activas obtenidas exitosamente',
      data: activeSections,
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },

  getAllSections: (): Response => {
    const response: ApiResponse<Section[]> = {
      success: true,
      message: 'Todas las secciones obtenidas exitosamente',
      data: MOCK_SECTIONS,
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },

  getSectionsByType: (type: string): Response => {
    const sectionsByType = MOCK_SECTIONS.filter((s) => s.section_type === type)
    const response: ApiResponse<Section[]> = {
      success: true,
      message: 'Secciones por tipo obtenidas exitosamente',
      data: sectionsByType,
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },

  getSectionById: (id: string): Response => {
    const section = MOCK_SECTIONS.find((s) => s.id === id)
    if (!section) {
      const errorResponse: ApiResponse = {
        success: false,
        message: 'Sección no encontrada',
        errors: ['La sección con el ID proporcionado no existe'],
      }
      return new Response(JSON.stringify(errorResponse), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const response: ApiResponse<Section> = {
      success: true,
      message: 'Sección obtenida exitosamente',
      data: section,
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },

  createSection: (data: { title: string; description: string; section_type: string }): Response => {
    const newSection: Section = {
      id: `section_${MOCK_SECTIONS.length + 1}`,
      section_type: data.section_type as 'terms_and_conditions' | 'privacy_policy',
      title: data.title,
      description: data.description,
      order_index: MOCK_SECTIONS.length + 1,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    MOCK_SECTIONS.push(newSection)

    const response: ApiResponse<Section> = {
      success: true,
      message: 'Sección creada exitosamente',
      data: newSection,
    }
    return new Response(JSON.stringify(response), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    })
  },

  updateSection: (id: string, data: { title?: string; description?: string; is_active?: boolean }): Response => {
    const sectionIndex = MOCK_SECTIONS.findIndex((s) => s.id === id)
    if (sectionIndex === -1) {
      const errorResponse: ApiResponse = {
        success: false,
        message: 'Sección no encontrada',
        errors: ['La sección con el ID proporcionado no existe'],
      }
      return new Response(JSON.stringify(errorResponse), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const updatedSection = {
      ...MOCK_SECTIONS[sectionIndex],
      ...data,
      updated_at: new Date().toISOString(),
    }
    MOCK_SECTIONS[sectionIndex] = updatedSection

    const response: ApiResponse<Section> = {
      success: true,
      message: 'Sección actualizada exitosamente',
      data: updatedSection,
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },

  deleteSection: (id: string): Response => {
    const sectionIndex = MOCK_SECTIONS.findIndex((s) => s.id === id)
    if (sectionIndex === -1) {
      const errorResponse: ApiResponse = {
        success: false,
        message: 'Sección no encontrada',
        errors: ['La sección con el ID proporcionado no existe'],
      }
      return new Response(JSON.stringify(errorResponse), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    MOCK_SECTIONS.splice(sectionIndex, 1)

    const response: ApiResponse<void> = {
      success: true,
      message: 'Sección eliminada exitosamente',
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },
}


import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ApiStateHandler from '@/components/ui/ApiStateHandler'
import { ToastContainer, useToast } from '@/components/ui/toast'
import { useSettings, useSectionOperations } from '@/hooks/useSettings'
import type { Section, SectionType } from '@/types/dashboard'

function CollapsibleItem({ section, onChange, onDelete }: { section: Section; onChange: (next: Section) => void; onDelete?: (id: string) => void }) {
  const [open, setOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(section.description)
  const { t } = useTranslation('settings')
  return (
    <div className="rounded-lg border border-neutral-200 bg-white terms-shadow">
      <div
        className="flex w-full items-center justify-between px-4 py-3 cursor-pointer"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="text-neutral-900 font-medium">{section.title}</span>
        <div className="flex items-center gap-4">
          <button className="rounded p-1 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500" onClick={(e) => { e.stopPropagation(); setOpen(true); setIsEditing(true) }}>
            <span className="ms ms-24">edit</span>
          </button>
          {onDelete && (
            <button className="rounded p-1 hover:bg-danger-50 text-danger-600 focus:outline-none focus:ring-2 focus:ring-primary-500" onClick={(e) => { e.stopPropagation(); onDelete(section.id) }}>
              <span className="ms ms-24">delete</span>
            </button>
          )}
          <button className="rounded p-1 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500" onClick={(e) => { e.stopPropagation(); setOpen((o) => !o) }} aria-expanded={open}>
            <span className="ms ms-24">{open ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</span>
          </button>
        </div>
      </div>
      {open && (
        <div className="px-4 pb-4 text-sm text-neutral-900">
          {isEditing ? (
            <>
              <textarea 
                className="h-32 w-full resize-none rounded border border-neutral-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={draft} 
                onChange={(e) => setDraft(e.target.value)}
                placeholder={t('descriptionPlaceholder')}
              />
              <div className="mt-3 flex justify-end gap-3">
                <button className="rounded border border-neutral-300 bg-white px-3 py-2 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500" onClick={() => { setIsEditing(false); setDraft(section.description) }}>{t('cancel')}</button>
                <button className="rounded border border-primary-500 bg-primary-500 px-3 py-2 text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500" onClick={() => { onChange({ ...section, description: draft }); setIsEditing(false) }}>{t('save')}</button>
              </div>
            </>
          ) : (
            <p>{section.description}</p>
          )}
        </div>
      )}
    </div>
  )
}

export default function Settings() {
  const { data, isLoading, error, refetch } = useSettings()
  const { createSection, updateSection, deleteSection } = useSectionOperations()
  const { toasts, removeToast, success, error: showError } = useToast()
  const [isUpdating, setIsUpdating] = useState(false)
  const { t } = useTranslation('settings')

  const [adding, setAdding] = useState<null | 'terms' | 'policies'>(null)
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')

  const handleUpdateSection = async (section: Section) => {
    setIsUpdating(true)
    try {
      await updateSection(section.id, {
        title: section.title,
        description: section.description
      })
      // Refrescar los datos después de la actualización
      await refetch()
      success('Sección actualizada', 'Los cambios se han guardado correctamente')
    } catch (error) {
      console.error('Error al actualizar la sección:', error)
      showError('Error al actualizar', 'No se pudo actualizar la sección. Por favor, inténtalo de nuevo.')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteSection = async (id: string) => {
    // Confirmar antes de eliminar
    if (!confirm('¿Estás seguro de que quieres eliminar esta sección? Esta acción no se puede deshacer.')) {
      return
    }

    setIsUpdating(true)
    try {
      await deleteSection(id)
      // Refrescar los datos después de la eliminación
      await refetch()
      success('Sección eliminada', 'La sección se ha eliminado correctamente')
    } catch (error) {
      console.error('Error al eliminar la sección:', error)
      showError('Error al eliminar', 'No se pudo eliminar la sección. Por favor, inténtalo de nuevo.')
    } finally {
      setIsUpdating(false)
    }
  }

  const addSection = async () => {
    if (!adding || !newTitle.trim() || !newContent.trim()) return
    
    setIsUpdating(true)
    try {
      const sectionType: SectionType = adding === 'terms' ? 'terms_and_conditions' : 'privacy_policy'
      await createSection({
        title: newTitle,
        description: newContent,
        section_type: sectionType
      })
      // Refrescar los datos después de la creación
      await refetch()
      success('Sección creada', 'La nueva sección se ha creado correctamente')
      setAdding(null)
      setNewTitle('')
      setNewContent('')
    } catch (error) {
      console.error('Error al crear la sección:', error)
      showError('Error al crear', 'No se pudo crear la sección. Por favor, inténtalo de nuevo.')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <>
      <ApiStateHandler
        isLoading={isLoading}
        error={error}
        data={data}
        loadingText={t('loading')}
        errorTitle={t('errorTitle')}
        emptyText={t('emptyText')}
      >
        {(data) => (
          <div className="mx-auto max-w-6xl p-6">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Columna izquierda: Términos y condiciones */}
              <div>
                <h2 className="mb-4 text-xl font-semibold text-neutral-900">{t('termsTitle')}</h2>
                <button 
                  className="mb-4 flex w-full items-center justify-center gap-2 rounded border border-primary-500 bg-primary-50 px-4 py-3 text-primary-600 hover:bg-primary-100 transition-colors disabled:opacity-50" 
                  onClick={() => { setAdding('terms'); setNewTitle(''); setNewContent('') }}
                  disabled={isUpdating}
                >
                  <span className="ms ms-24">add</span>
                  <span>{t('addSection')}</span>
                </button>
                {adding === 'terms' && (
                  <div className="mb-4 rounded-lg border border-[#F0F0F0] bg-white p-6 terms-shadow">
                    <div className="mb-3">
                      <input 
                        className="w-full rounded border border-neutral-900 p-3 text-sm focus:outline-none" 
                        placeholder={t('sectionTitlePlaceholder')} 
                        value={newTitle} 
                        onChange={(e) => setNewTitle(e.target.value)}
                        disabled={isUpdating}
                      />
                    </div>
                    <div className="mb-4">
                      <textarea 
                        className="h-40 w-full resize-none rounded border border-neutral-900 p-3 text-sm focus:outline-none" 
                        placeholder={t('descriptionPlaceholder')} 
                        value={newContent} 
                        onChange={(e) => setNewContent(e.target.value)}
                        disabled={isUpdating}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button 
                        className="rounded border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50" 
                        onClick={() => { setAdding(null); setNewTitle(''); setNewContent('') }}
                        disabled={isUpdating}
                      >
                        {t('cancel')}
                      </button>
                      <button 
                        className="rounded border border-[#5459DA] bg-[#5459DA] px-6 py-3 text-white hover:bg-[#4A4FC7] disabled:opacity-50" 
                        onClick={addSection}
                        disabled={isUpdating || !newTitle.trim() || !newContent.trim()}
                      >
                        {isUpdating ? t('saving') : t('save')}
                      </button>
                    </div>
                  </div>
                )}
                <div className="space-y-3">
                  {Array.isArray(data.terms_and_conditions) ? data.terms_and_conditions.map((s) => (
                    <CollapsibleItem key={s.id} section={s} onChange={handleUpdateSection} onDelete={handleDeleteSection} />
                  )) : (
                    <p className="text-gray-500 text-sm">{t('noSections')}</p>
                  )}
                </div>
              </div>

              {/* Columna derecha: Políticas */}
              <div>
                <h2 className="mb-4 text-xl font-semibold text-neutral-900">{t('policiesTitle')}</h2>
                <button 
                  className="mb-4 flex w-full items-center justify-center gap-2 rounded border border-primary-500 bg-primary-50 px-4 py-3 text-primary-600 hover:bg-primary-100 transition-colors disabled:opacity-50" 
                  onClick={() => { setAdding('policies'); setNewTitle(''); setNewContent('') }}
                  disabled={isUpdating}
                >
                  <span className="ms ms-24">add</span>
                  <span>{t('addSection')}</span>
                </button>
                {adding === 'policies' && (
                  <div className="mb-4 rounded-lg border border-[#F0F0F0] bg-white p-6 terms-shadow">
                    <div className="mb-3">
                      <input 
                        className="w-full rounded border border-neutral-900 p-3 text-sm focus:outline-none" 
                        placeholder={t('sectionTitlePlaceholder')} 
                        value={newTitle} 
                        onChange={(e) => setNewTitle(e.target.value)}
                        disabled={isUpdating}
                      />
                    </div>
                    <div className="mb-4">
                      <textarea 
                        className="h-40 w-full resize-none rounded border border-neutral-900 p-3 text-sm focus:outline-none" 
                        placeholder={t('descriptionPlaceholder')} 
                        value={newContent} 
                        onChange={(e) => setNewContent(e.target.value)}
                        disabled={isUpdating}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button 
                        className="rounded border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50" 
                        onClick={() => { setAdding(null); setNewTitle(''); setNewContent('') }}
                        disabled={isUpdating}
                      >
                        {t('cancel')}
                      </button>
                      <button 
                        className="rounded border border-[#5459DA] bg-[#5459DA] px-6 py-3 text-white hover:bg-[#4A4FC7] disabled:opacity-50" 
                        onClick={addSection}
                        disabled={isUpdating || !newTitle.trim() || !newContent.trim()}
                      >
                        {isUpdating ? t('saving') : t('save')}
                      </button>
                    </div>
                  </div>
                )}
                <div className="space-y-3">
                  {Array.isArray(data.privacy_policy) ? data.privacy_policy.map((s) => (
                    <CollapsibleItem key={s.id} section={s} onChange={handleUpdateSection} onDelete={handleDeleteSection} />
                  )) : (
                    <p className="text-gray-500 text-sm">{t('noSections')}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </ApiStateHandler>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  )
}


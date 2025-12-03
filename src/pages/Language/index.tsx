import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Input from '@/components/ui/input'
import Button from '@/components/ui/button'
import Switch from '@/components/ui/switch'
import Tooltip from '@/components/ui/tooltip'
import { useToast } from '@/components/ui/toast'
import { ToastContainer } from '@/components/ui/toast'
import { 
  useForbiddenWords, 
  useCreateForbiddenWord, 
  useUpdateForbiddenWord, 
  useDeleteForbiddenWord 
} from '@/hooks/useForbiddenWords'
import type { ForbiddenWord } from '@/types/api'

export default function LanguagePage() {
  const { t } = useTranslation('language')
  const { toasts, removeToast, success, error: showError } = useToast()
  
  // Hooks de API
  const { data, isLoading, error, refetch } = useForbiddenWords()
  const { create, isLoading: isCreating, error: createError } = useCreateForbiddenWord()
  const { update, isLoading: isUpdating, error: updateError } = useUpdateForbiddenWord()
  const { deleteWord, isLoading: isDeleting, error: deleteError } = useDeleteForbiddenWord()
  
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [formError, setFormError] = useState<string>('')
  const [formData, setFormData] = useState({
    word: '',
    isStrong: false,
  })

  // Obtener palabras del API
  // Normalizar la respuesta: puede venir como array o como objeto con data
  const words = (() => {
    if (!data) return []
    if (Array.isArray(data)) return data
    if (data && typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {
      return data.data
    }
    return []
  })()
  
  // Debug temporal: ver qué está llegando
  useEffect(() => {
    if (data) {
      console.log('🔍 Forbidden words API response:', data)
      console.log('📝 Parsed words array:', words)
      console.log('📊 Words count:', words.length)
    }
    if (error) {
      console.error('❌ Error loading forbidden words:', error)
    }
  }, [data, words, error])

  const maskWord = (word: string) => {
    if (!word) return ''
    
    // Para palabras muy cortas, mostrar tal cual
    if (word.length <= 3) return word
    
    // Para palabras de 4-6 caracteres, mostrar 2 caracteres
    if (word.length <= 6) {
      return word.substring(0, 2) + '*'.repeat(word.length - 2)
    }
    
    // Para palabras de 7-10 caracteres, mostrar 3 caracteres
    if (word.length <= 10) {
      return word.substring(0, 3) + '*'.repeat(word.length - 3)
    }
    
    // Para palabras más largas, mostrar aproximadamente el 40% de la palabra
    const visibleChars = Math.max(4, Math.floor(word.length * 0.4))
    return word.substring(0, visibleChars) + '*'.repeat(word.length - visibleChars)
  }

  const handleAddWord = async () => {
    if (!formData.word.trim()) {
      setFormError(t('errors.emptyWord'))
      return
    }

    setFormError('')
    try {
      const response = await create({
        word: formData.word.trim(),
        isStrong: formData.isStrong,
      })

      console.log('✅ Create response:', response)

      if (response?.success) {
        setFormData({ word: '', isStrong: false })
        setIsAdding(false)
        success(t('success.wordAdded'), t('success.wordAddedMessage'))
        refetch() // Recargar la lista
      } else {
        const errorMsg = createError || response?.message || t('errors.generic')
        setFormError(errorMsg)
        showError('Error', errorMsg)
      }
    } catch (err) {
      console.error('❌ Error in handleAddWord:', err)
      const errorMsg = createError || (err instanceof Error ? err.message : t('errors.generic'))
      setFormError(errorMsg)
      showError('Error', errorMsg)
    }
  }

  const handleEditWord = (word: ForbiddenWord) => {
    setEditingId(word.id)
    setFormError('')
    setFormData({
      word: word.word,
      isStrong: word.isStrong,
    })
  }

  const handleSaveWord = async () => {
    if (!formData.word.trim()) {
      setFormError(t('errors.emptyWord'))
      return
    }

    setFormError('')
    
    if (editingId) {
      // Actualizar palabra existente
      const response = await update(editingId, {
        word: formData.word.trim(),
        isStrong: formData.isStrong,
      })

      if (response?.success) {
        setEditingId(null)
        setFormData({ word: '', isStrong: false })
        success(t('success.wordUpdated'), t('success.wordUpdatedMessage'))
        refetch() // Recargar la lista
      } else {
        const errorMsg = updateError || response?.message || t('errors.generic')
        setFormError(errorMsg)
        showError('Error', errorMsg)
      }
    } else {
      // Crear nueva palabra
      await handleAddWord()
    }
  }

  const handleDeleteWord = async (id: string) => {
    if (confirm(t('confirm.deleteWord'))) {
      const response = await deleteWord(id)
      
      if (response?.success) {
        if (editingId === id) {
          setEditingId(null)
          setFormData({ word: '', isStrong: false })
        }
        success(t('success.wordDeleted'), t('success.wordDeletedMessage'))
        refetch() // Recargar la lista
      } else {
        const errorMsg = deleteError || response?.message || t('errors.generic')
        showError('Error', errorMsg)
      }
    }
  }


  // Mostrar error de carga si hay
  if (error) {
    return (
      <div className="space-y-6 max-w-3xl">
        <div className="rounded-lg bg-red-100 border border-red-300 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6 max-w-3xl">

        {/* Sección de Palabras Prohibidas */}
        <section className="space-y-4">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-neutral-900">{t('prohibitedWords.title')}</h2>
            {!editingId && !isAdding && (
              <Button
                full
                onClick={() => {
                  setIsAdding(true)
                  setFormError('')
                  setFormData({ word: '', isStrong: false })
                }}
                className="bg-[var(--color-primary-500)] text-white hover:bg-[var(--color-primary-600)] rounded-[12px]"
              >
                <span className="ms me-2">add</span>
                {t('prohibitedWords.addWord')}
              </Button>
            )}
          </div>

          {/* Lista de palabras existentes */}
          <div className="space-y-3">
            {isLoading ? (
              <div className="text-center py-8 text-neutral-500">
                {t('loading') || 'Cargando...'}
              </div>
            ) : words.length === 0 ? (
              <div className="text-center py-8 text-neutral-500">
                {t('prohibitedWords.empty') || 'No hay palabras prohibidas'}
              </div>
            ) : (
              words
                .filter((w) => w.id !== editingId)
                .map((word) => (
                  <div
                    key={word.id}
                    className="flex items-center justify-between rounded-[12px] border border-neutral-200 bg-white p-4"
                  >
                    <span className="text-sm font-medium text-neutral-900">{maskWord(word.word)}</span>
                    <button
                      onClick={() => handleEditWord(word)}
                      className="rounded p-2 text-neutral-500 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      aria-label={t('actions.edit')}
                    >
                      <span className="ms">edit</span>
                    </button>
                  </div>
                ))
            )}
          </div>

          {/* Formulario de agregar/editar palabra */}
          {(editingId || isAdding) && (
            <div className="rounded-[12px] border border-neutral-200 bg-white p-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-900">
                  {t('prohibitedWords.wordLabel')}
                </label>
                <Input
                  value={formData.word}
                  onChange={(e) => {
                    setFormData({ ...formData, word: e.target.value })
                    if (formError) setFormError('')
                  }}
                  placeholder={t('prohibitedWords.wordPlaceholder')}
                  autoFocus
                  className="border-b-2 border-b-[var(--color-primary-500)]"
                />
                {formError && (
                  <p className="mt-2 text-sm text-[var(--color-error-500)]">{formError}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-900">{t('prohibitedWords.strongWord')}</span>
                  <Tooltip content={t('prohibitedWords.strongWordTooltip')}>
                    <span className="ms cursor-help text-neutral-500">info</span>
                  </Tooltip>
                </div>
                <Switch
                  checked={formData.isStrong}
                  onChange={(e) => setFormData({ ...formData, isStrong: e.target.checked })}
                />
              </div>

              <div className="flex gap-3 justify-evenly">
                {editingId && (
                  <Button
                    variant="outline"
                    onClick={() => handleDeleteWord(editingId)}
                    disabled={isDeleting}
                    className="bg-[var(--color-primary-fixed-dim)] text-[var(--color-primary-600)] border-0 rounded-[12px] flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? t('actions.deleting') || 'Eliminando...' : t('actions.delete')}
                  </Button>
                )}
                <Button
                  onClick={handleSaveWord}
                  disabled={isCreating || isUpdating}
                  className="bg-[var(--color-primary-500)] text-white hover:bg-[var(--color-primary-600)] rounded-[12px] flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating || isUpdating ? t('actions.saving') || 'Guardando...' : t('actions.save')}
                </Button>
              </div>
            </div>
          )}
        </section>
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  )
}

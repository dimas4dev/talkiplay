import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Input from '@/components/ui/input'
import Button from '@/components/ui/button'
import Switch from '@/components/ui/switch'
import Tooltip from '@/components/ui/tooltip'
import { useToast } from '@/components/ui/toast'
import { ToastContainer } from '@/components/ui/toast'

interface ProhibitedWord {
  id: string
  word: string
  isStrong: boolean
}

export default function LanguagePage() {
  const { t } = useTranslation('language')
  const { toasts, removeToast, success, error: showError } = useToast()
  const [words, setWords] = useState<ProhibitedWord[]>([
    { id: '1', word: 'G*********', isStrong: false },
  ])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [formError, setFormError] = useState<string>('')
  const [formData, setFormData] = useState({
    word: '',
    isStrong: false,
  })

  const maskWord = (word: string) => {
    if (word.length <= 2) return word
    return word[0] + '*'.repeat(word.length - 1)
  }

  const handleAddWord = () => {
    if (!formData.word.trim()) {
      showError('Error', t('errors.emptyWord'))
      return
    }

    const newWord: ProhibitedWord = {
      id: Date.now().toString(),
      word: formData.word.trim(),
      isStrong: formData.isStrong,
    }

    setWords([...words, newWord])
    setFormData({ word: '', isStrong: false })
    success(t('success.wordAdded'), t('success.wordAddedMessage'))
  }

  const handleEditWord = (word: ProhibitedWord) => {
    setEditingId(word.id)
    setFormError('')
    setFormData({
      word: word.word,
      isStrong: word.isStrong,
    })
  }

  const handleSaveWord = () => {
    if (!formData.word.trim()) {
      setFormError(t('errors.emptyWord'))
      return
    }

    setFormError('')
    if (editingId) {
      setWords(
        words.map((w) =>
          w.id === editingId
            ? { ...w, word: formData.word.trim(), isStrong: formData.isStrong }
            : w
        )
      )
      setEditingId(null)
      success(t('success.wordUpdated'), t('success.wordUpdatedMessage'))
    } else {
      handleAddWord()
    }
    setIsAdding(false)
    setFormError('')
    setFormData({ word: '', isStrong: false })
  }

  const handleDeleteWord = (id: string) => {
    if (confirm(t('confirm.deleteWord'))) {
      setWords(words.filter((w) => w.id !== id))
      if (editingId === id) {
        setEditingId(null)
        setFormData({ word: '', isStrong: false })
      }
      success(t('success.wordDeleted'), t('success.wordDeletedMessage'))
    }
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
            {words
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
              ))}
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
                    className="bg-[var(--color-primary-fixed-dim)] text-[var(--color-primary-600)] border-0 rounded-[12px] flex-1"
                  >
                    {t('actions.delete')}
                  </Button>
                )}
                <Button
                  onClick={handleSaveWord}
                  className="bg-[var(--color-primary-500)] text-white hover:bg-[var(--color-primary-600)] rounded-[12px] flex-1"
                >
                  {t('actions.save')}
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

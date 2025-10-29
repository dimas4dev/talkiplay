import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface ModalProps {
  open: boolean
  title?: string
  children: React.ReactNode
  onClose: () => void
  footer?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  closeOnBackdropClick?: boolean
  closeOnEsc?: boolean
}

export default function Modal({
  open,
  title,
  children,
  onClose,
  footer,
  size = 'md',
  closeOnBackdropClick = true,
  closeOnEsc = true,
}: ModalProps) {
  const { t } = useTranslation('common')
  useEffect(() => {
    if (!open || !closeOnEsc) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, closeOnEsc, onClose])

  if (!open) return null

  const sizeClass = size === 'sm' ? 'max-w-md' : size === 'lg' ? 'max-w-2xl' : 'max-w-xl'

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-black/30"
      onClick={() => { if (closeOnBackdropClick) onClose() }}
    >
      <div
        className={`w-full ${sizeClass} rounded-lg border border-neutral-200 bg-white p-6 relative shadow-[0px_5px_15px_0px_var(--ModalShadow)]`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h3 className="mb-4 text-lg font-semibold text-neutral-900">{title}</h3>
        )}
        <div>{children}</div>
        {footer && (
          <div className="mt-4 flex justify-end gap-3">{footer}</div>
        )}
        <button aria-label={t('close')} className="absolute right-4 top-4 rounded p-1 hover:bg-neutral-100" onClick={onClose}>
          <span className="ms">close</span>
        </button>
      </div>
    </div>
  )
}



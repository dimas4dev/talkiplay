import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

interface ToastProps {
  toast: Toast
  onRemove: (id: string) => void
}

function ToastItem({ toast, onRemove }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)
  const { t } = useTranslation('common')

  useEffect(() => {
    // Animar entrada
    const timer = setTimeout(() => setIsVisible(true), 10)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Auto-remove después de la duración
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        handleRemove()
      }, toast.duration)
      return () => clearTimeout(timer)
    }
  }, [toast.duration])

  const handleRemove = () => {
    setIsLeaving(true)
    setTimeout(() => onRemove(toast.id), 300) // Esperar animación de salida
  }

  const getToastStyles = () => {
    // Estilos base del contenedor del toast (card flotante)
    const baseStyles =
      'flex items-start gap-3 p-4 rounded-2xl shadow-md border border-[var(--color-card-border)] bg-white transition-all duration-300 transform'
    
    if (isLeaving) {
      return `${baseStyles} translate-x-full opacity-0`
    }
    
    if (isVisible) {
      return `${baseStyles} translate-x-0 opacity-100`
    }
    
    return `${baseStyles} translate-x-full opacity-0`
  }

  const getTypeStyles = () => {
    switch (toast.type) {
      case 'success':
        return 'border-l-4 border-l-[var(--color-success-500)] text-[var(--color-neutral-900)]'
      case 'error':
        return 'border-l-4 border-l-[var(--color-danger-500)] text-[var(--color-neutral-900)]'
      case 'warning':
        return 'border-l-4 border-l-[var(--color-warning-500)] text-[var(--color-neutral-900)]'
      case 'info':
        return 'border-l-4 border-l-[var(--color-info-500)] text-[var(--color-neutral-900)]'
      default:
        return 'border-l-4 border-l-[var(--color-neutral-300)] text-[var(--color-neutral-900)]'
    }
  }

  const getIcon = () => {
    // Usar Material Symbols para mantener consistencia visual con el resto de la app
    switch (toast.type) {
      case 'success':
        return 'check_circle'
      case 'error':
        return 'error'
      case 'warning':
        return 'warning'
      case 'info':
      default:
        return 'info'
    }
  }

  return (
    <div className={`${getToastStyles()} ${getTypeStyles()}`}>
      <div className="flex-shrink-0 mt-0.5">
        <span className="ms text-[var(--color-info-500)] text-base">
          {getIcon()}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold">{toast.title}</h4>
        {toast.message && (
          <p className="text-sm mt-1 opacity-90">{toast.message}</p>
        )}
      </div>
      <button
        onClick={handleRemove}
        className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full hover:bg-neutral-900/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
        aria-label={t('closeNotification')}
      >
        <span className="text-lg leading-none">&times;</span>
      </button>
    </div>
  )
}

interface ToastContainerProps {
  toasts: Toast[]
  onRemove: (id: string) => void
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  )
}

// Hook para usar toasts
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: Toast = {
      id,
      duration: 5000, // 5 segundos por defecto
      ...toast
    }
    setToasts(prev => [...prev, newToast])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const success = (title: string, message?: string) => {
    addToast({ type: 'success', title, message })
  }

  const error = (title: string, message?: string) => {
    addToast({ type: 'error', title, message })
  }

  const warning = (title: string, message?: string) => {
    addToast({ type: 'warning', title, message })
  }

  const info = (title: string, message?: string) => {
    addToast({ type: 'info', title, message })
  }

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info
  }
}

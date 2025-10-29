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
    const baseStyles = "flex items-start gap-3 p-4 rounded-lg shadow-lg border transition-all duration-300 transform"
    
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
        return 'bg-success-50 border-success-200 text-success-800'
      case 'error':
        return 'bg-danger-50 border-danger-200 text-danger-800'
      case 'warning':
        return 'bg-warning-50 border-warning-200 text-warning-800'
      case 'info':
        return 'bg-info-50 border-info-200 text-info-800'
      default:
        return 'bg-neutral-50 border-neutral-200 text-neutral-800'
    }
  }

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return '✓'
      case 'error':
        return '✕'
      case 'warning':
        return '⚠'
      case 'info':
        return 'ℹ'
      default:
        return 'ℹ'
    }
  }

  return (
    <div className={`${getToastStyles()} ${getTypeStyles()}`}>
      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-current text-white text-sm font-bold">
        {getIcon()}
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

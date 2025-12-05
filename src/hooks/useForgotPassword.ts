import { useState, useCallback } from 'react'
import { useLocation } from 'wouter'
import { forgotPasswordSchema } from '@/schemas/auth'
import { authService } from '@/services/api'

export default function useForgotPassword() {
  const [email, setEmail] = useState('')
  const [formErrors, setFormErrors] = useState<{ email?: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [, setLocation] = useLocation()

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    
    const parsed = forgotPasswordSchema.safeParse({ email })
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors
      setFormErrors({
        email: fieldErrors.email?.[0],
      })
      return
    }
    
    setFormErrors({})
    setIsLoading(true)
    setError(null)
    setIsSuccess(false)

    try {
      const response = await authService.forgotPassword(email)
      
      if (response.success) {
        setIsSuccess(true)
        // Guardar email para el siguiente paso
        localStorage.setItem('forgotPasswordEmail', email)
        // Redirigir a la página de OTP
        setLocation('/otp')
      } else {
        const errorMessage = response.message || 'Error al enviar código de recuperación'
        setError(errorMessage)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error de conexión'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const reset = useCallback(() => {
    setEmail('')
    setFormErrors({})
    setIsLoading(false)
    setError(null)
    setIsSuccess(false)
  }, [])

  return {
    email,
    setEmail,
    formErrors,
    handleSubmit,
    isLoading,
    isSuccess,
    error,
    reset,
  }
}

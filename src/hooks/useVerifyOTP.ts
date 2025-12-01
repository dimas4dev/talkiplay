import { useState, useEffect, useCallback } from 'react'
import { useLocation } from 'wouter'
import { verifyOTPSchema } from '@/schemas/auth'
import { authService } from '@/services/api'
import type { ApiResponse, VerifyOTPResponse } from '@/types/api'

export default function useVerifyOTP() {
  const [otp, setOtp] = useState('')
  const [email, setEmail] = useState<string>('')
  const [formErrors, setFormErrors] = useState<{ code?: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [, setLocation] = useLocation()

  // Obtener el email del localStorage
  useEffect(() => {
    const savedEmail = localStorage.getItem('forgotPasswordEmail')
    if (savedEmail) {
      setEmail(savedEmail)
    } else {
      // Si no hay email guardado, redirigir al forgot password
      setLocation('/password-recovery')
    }
  }, [setLocation])

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    
    if (!email) {
      setFormErrors({ code: 'Email no encontrado' })
      return
    }

    const parsed = verifyOTPSchema.safeParse({ code: otp })
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors
      setFormErrors({
        code: fieldErrors.code?.[0],
      })
      return
    }
    
    setFormErrors({})
    setIsLoading(true)
    setError(null)

    try {
      const response = await authService.verifyOTP(email, otp)
      
      if (response.success && response.data) {
        // Guardar el código verificado
        localStorage.setItem('verifiedOtpCode', otp)
        if (response.data.token) {
          localStorage.setItem('verifiedOtpToken', response.data.token)
        }
        // Redirigir a la página de cambio de contraseña
        setLocation('/change-password')
      } else {
        const errorMessage = response.message || 'Código OTP inválido'
        setError(errorMessage)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error de conexión'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToLogin = useCallback(() => {
    localStorage.removeItem('forgotPasswordEmail')
    localStorage.removeItem('verifiedOtpCode')
    localStorage.removeItem('verifiedOtpToken')
    setLocation('/login')
  }, [setLocation])

  return {
    otp,
    setOtp,
    email,
    formErrors,
    handleSubmit,
    handleBackToLogin,
    isLoading,
    error,
  }
}

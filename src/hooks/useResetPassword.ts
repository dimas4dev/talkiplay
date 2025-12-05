import { useState, useEffect, useCallback } from 'react'
import { useLocation } from 'wouter'
import { resetPasswordSchema } from '@/schemas/auth'
import { authService } from '@/services/api'

export default function useResetPassword() {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [email, setEmail] = useState<string>('')
  const [otpCode, setOtpCode] = useState<string>('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formErrors, setFormErrors] = useState<{ 
    newPassword?: string
    confirmPassword?: string
  }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [, setLocation] = useLocation()

  // Obtener el email y código OTP del localStorage
  useEffect(() => {
    const savedEmail = localStorage.getItem('forgotPasswordEmail')
    const savedOtpCode = localStorage.getItem('verifiedOtpCode')
    
    if (savedEmail) {
      setEmail(savedEmail)
    } else {
      // Si no hay email guardado, redirigir al forgot password
      setLocation('/password-recovery')
    }
    
    if (savedOtpCode) {
      setOtpCode(savedOtpCode)
    } else {
      // Si no hay código OTP, redirigir al OTP
      setLocation('/otp')
    }
  }, [setLocation])

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    
    if (!email || !otpCode) {
      setFormErrors({ newPassword: 'Datos de recuperación no encontrados' })
      return
    }

    const parsed = resetPasswordSchema.safeParse({ 
      email, 
      code: otpCode,
      newPassword, 
      confirmPassword 
    })
    
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors
      setFormErrors({
        newPassword: fieldErrors.newPassword?.[0],
        confirmPassword: fieldErrors.confirmPassword?.[0],
      })
      return
    }
    
    setFormErrors({})
    setIsLoading(true)
    setError(null)
    setIsSuccess(false)

    try {
      const response = await authService.resetPassword({ email, code: otpCode, newPassword })
      
      if (response.success) {
        setIsSuccess(true)
        // Limpiar datos temporales después de reset exitoso
        localStorage.removeItem('verifiedOtpCode')
        localStorage.removeItem('verifiedOtpToken')
        localStorage.removeItem('forgotPasswordEmail')
        // Redirigir al login después de un breve delay
        setTimeout(() => {
          setLocation('/login')
        }, 2000)
      } else {
        const errorMessage = response.message || 'Error al restablecer contraseña'
        setError(errorMessage)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error de conexión'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = (field: 'password' | 'confirm') => {
    if (field === 'password') {
      setShowPassword(!showPassword)
    } else {
      setShowConfirmPassword(!showConfirmPassword)
    }
  }

  const handleBackToLogin = useCallback(() => {
    localStorage.removeItem('forgotPasswordEmail')
    localStorage.removeItem('verifiedOtpCode')
    localStorage.removeItem('verifiedOtpToken')
    setLocation('/login')
  }, [setLocation])

  return {
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    email,
    showPassword,
    showConfirmPassword,
    formErrors,
    handleSubmit,
    handleBackToLogin,
    togglePasswordVisibility,
    isLoading,
    isSuccess,
    error,
  }
}

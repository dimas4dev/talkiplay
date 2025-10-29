import { useState, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useLocation } from 'wouter'
import { authService } from '@/services/api'
import { resetPasswordSchema } from '@/schemas/auth'

export function useResetPassword() {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [email, setEmail] = useState<string>('')
  const [_, setOtpCode] = useState<string>('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formErrors, setFormErrors] = useState<{ 
    newPassword?: string
    confirmPassword?: string
  }>({})
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

  const mutation = useMutation({
    mutationFn: ({ email, code, newPassword }: { email: string; code: string; newPassword: string }) => 
      authService.resetPassword(email, code, newPassword),
    onSuccess: () => {
      setFormErrors({})
      // Limpiar el email del localStorage después del éxito
      localStorage.removeItem('forgotPasswordEmail')
    },
    onError: (error: Error) => {
      console.error('Error en reset password:', error)
    },
  })

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    
    if (!email) {
      setFormErrors({ newPassword: 'Email no encontrado' })
      return
    }

    // Para reset password, necesitamos obtener el código OTP del localStorage
    // En un flujo real, esto se podría pasar como parámetro o almacenar temporalmente
    const savedOtpCode = localStorage.getItem('verifiedOtpCode') || ''
    setOtpCode(savedOtpCode)

    const parsed = resetPasswordSchema.safeParse({ 
      email, 
      code: savedOtpCode,
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
    await mutation.mutateAsync({ email, code: savedOtpCode, newPassword })
  }

  const togglePasswordVisibility = (field: 'password' | 'confirm') => {
    if (field === 'password') {
      setShowPassword(!showPassword)
    } else {
      setShowConfirmPassword(!showConfirmPassword)
    }
  }

  const handleBackToLogin = () => {
    // Limpiar el email del localStorage al volver al login
    localStorage.removeItem('forgotPasswordEmail')
    localStorage.removeItem('verifiedOtpCode')
    setLocation('/login')
  }

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
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error?.message,
    reset: mutation.reset,
  }
}

export default useResetPassword

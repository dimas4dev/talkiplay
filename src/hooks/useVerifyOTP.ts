import { useState, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useLocation } from 'wouter'
import { authService } from '@/services/api'
import { verifyOTPSchema } from '@/schemas/auth'

export function useVerifyOTP() {
  const [otp, setOtp] = useState('')
  const [email, setEmail] = useState<string>('')
  const [formErrors, setFormErrors] = useState<{ code?: string }>({})
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
    mutationFn: ({ email, code }: { email: string; code: string }) => 
      authService.verifyOTP(email, code),
    onSuccess: (_, { code }) => {
      setFormErrors({})
      // Almacenar el código OTP verificado para usar en reset password
      localStorage.setItem('verifiedOtpCode', code)
      // Redirigir a la página de cambio de contraseña después de verificar OTP exitosamente
      setLocation('/change-password')
    },
    onError: (error: Error) => {
      console.error('Error en verify OTP:', error)
    },
  })

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    
    if (!email) {
      setFormErrors({ code: 'Email no encontrado' })
      return
    }

    const parsed = verifyOTPSchema.safeParse({ email, code: otp })
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors
      setFormErrors({
        code: fieldErrors.code?.[0],
      })
      return
    }
    
    setFormErrors({})
    await mutation.mutateAsync({ email, code: otp })
  }

  const handleBackToLogin = () => {
    // Limpiar el email del localStorage al volver al login
    localStorage.removeItem('forgotPasswordEmail')
    setLocation('/login')
  }

  return {
    otp,
    setOtp,
    email,
    formErrors,
    handleSubmit,
    handleBackToLogin,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error?.message,
    reset: mutation.reset,
  }
}

export default useVerifyOTP

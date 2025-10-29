import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useLocation } from 'wouter'
import { authService } from '@/services/api'
import { forgotPasswordSchema } from '@/schemas/auth'

export function useForgotPassword() {
  const [email, setEmail] = useState('')
  const [formErrors, setFormErrors] = useState<{ email?: string }>({})
  const [, setLocation] = useLocation()

  const mutation = useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
    onSuccess: () => {
      setFormErrors({})
      // Almacenar el email para el proceso de OTP
      localStorage.setItem('forgotPasswordEmail', email)
      // Redirigir a la página de OTP después del envío exitoso
      setLocation('/otp')
    },
    onError: (error: Error) => {
      console.error('Error en forgot password:', error)
    },
  })

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
    await mutation.mutateAsync(email)
  }

  return {
    email,
    setEmail,
    formErrors,
    handleSubmit,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error?.message,
    reset: mutation.reset,
  }
}

export default useForgotPassword

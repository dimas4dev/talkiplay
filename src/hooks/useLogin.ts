import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { authService } from '@/services/api'
import type { LoginRequest } from '@/types/api'
import { useAuthStore } from '@/stores/auth.store'
import { useLocation } from 'wouter'
import { persistAuth } from '@/hooks/useAuthHydration'
import { loginSchema } from '@/schemas/auth'

export function useLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const loginStore = useAuthStore((s) => s.login)
  const [, setLocation] = useLocation()

  const mutation = useMutation({
    mutationFn: (payload: LoginRequest) => authService.login(payload),
    onSuccess: (res) => {
      if (res.success && res.data) {
        loginStore(res.data.tokens.accessToken, res.data.user)
        persistAuth({ token: res.data.tokens.accessToken, user: res.data.user }, remember)
        setLocation('/dashboard')
      }
    },
  })

  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({})

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    const parsed = loginSchema.safeParse({ email, password, remember })
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors
      setFormErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      })
      return
    }
    setFormErrors({})
    await mutation.mutateAsync({ email, password })
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    remember,
    setRemember,
    formErrors,
    handleSubmit,
    ...mutation,
  }
}

export default useLogin



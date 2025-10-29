import { type ReactNode, useEffect } from 'react'
import { useAuth } from './useAuth'
import { useLocation } from 'wouter'

type RequireAuthProps = { children: ReactNode }

export function RequireAuth({ children }: RequireAuthProps) {
  const { isAuthenticated } = useAuth()
  const [, setLocation] = useLocation()

  useEffect(() => {
    if (!isAuthenticated) setLocation('/login')
  }, [isAuthenticated, setLocation])

  if (!isAuthenticated) return null
  return <>{children}</>
}
import { useEffect } from 'react'
import { useAuthStore, type AuthUser } from '@/stores/auth.store'

const STORAGE_KEY = 'clipnest_auth'

export function useAuthHydration() {
  const login = useAuthStore((s) => s.login)
  useEffect(() => {
    try {
      const rawLocal = localStorage.getItem(STORAGE_KEY)
      const rawSession = sessionStorage.getItem(STORAGE_KEY)
      const raw = rawLocal ?? rawSession
      if (!raw) return
      const parsed = JSON.parse(raw) as { token?: string; user?: AuthUser }
      if (parsed?.token && parsed?.user) {
        login(parsed.token, parsed.user)
      }
    } catch {
      // ignore malformed storage
    }
  }, [login])
}

export function persistAuth(data: { token: string; user: AuthUser }, remember: boolean) {
  const payload = JSON.stringify(data)
  if (remember) localStorage.setItem(STORAGE_KEY, payload)
  else sessionStorage.setItem(STORAGE_KEY, payload)
}

export function clearPersistedAuth() {
  localStorage.removeItem(STORAGE_KEY)
  sessionStorage.removeItem(STORAGE_KEY)
}

export { STORAGE_KEY as AUTH_STORAGE_KEY }



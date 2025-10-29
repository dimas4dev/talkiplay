import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export type AuthUser = {
  id: string
  email: string
  name?: string
}

type AuthState = {
  token: string | null
  user: AuthUser | null
  login: (token: string, user: AuthUser) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      token: null,
      user: null,
      login: (token, user) => set({ token, user }, false, 'auth/login'),
      logout: () => set({ token: null, user: null }, false, 'auth/logout'),
    }),
    {
      name: 'auth-store',
    }
  )
)



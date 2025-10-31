export const ROUTES = {
  root: '/',
  login: '/login',
  passwordRecovery: '/password-recovery',
  otp: '/otp',
  changePassword: '/change-password',
  dashboard: '/dashboard',
  users: '/users',
  metrics: '/metrics',
  reports: '/reports',
  settings: '/settings',
  notifications: '/notifications',
} as const

export type AppRoute = typeof ROUTES[keyof typeof ROUTES]



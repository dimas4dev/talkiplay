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
  language: '/language',
  notifications: '/notifications',
  memberships: '/memberships',
  revenues: '/revenues',
} as const

export type AppRoute = typeof ROUTES[keyof typeof ROUTES]



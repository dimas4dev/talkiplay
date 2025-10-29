import { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Routes } from './routes'
import { AuthProvider } from '@/hooks/useAuth'
import { useTokenRefresh } from '@/hooks/useTokenRefresh'
import './i18n'

function AppContent() {
  useTokenRefresh()
  return <Routes />
}

export default function App() {
  const queryClient = new QueryClient()
  const { t } = useTranslation('common')
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Suspense fallback={<div>{t('loading')}</div>}>
          <AppContent />
        </Suspense>
      </AuthProvider>
    </QueryClientProvider>
  )
}

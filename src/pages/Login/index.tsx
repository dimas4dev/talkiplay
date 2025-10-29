import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'wouter'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/constants/routes'
import clipnestIcon from '@/assets/images/icons/clipnest.svg'

export default function Login() {
  const { t } = useTranslation('auth')
  const { login, isLoading, isAuthenticated } = useAuth()
  const [, setLocation] = useLocation()
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState<string | null>(null)

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      setLocation('/dashboard')
    }
  }, [isAuthenticated, setLocation])
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const success = await login(formData)
      
      if (!success) {
        setError('Credenciales inválidas. Por favor, intenta de nuevo.')
      }
    } catch (error) {
      console.error('Error en el formulario:', error)
      setError('Error de conexión. Por favor, intenta de nuevo.')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-login-gradient px-4">
      <section className="w-full max-w-[672px]">
        {/* Logo */}
        <figure className="mx-auto mb-10 flex items-center justify-center">
          <img src={clipnestIcon} alt={t('common:brand')} className="h-[98px] w-[98px] rounded-xl" />
        </figure>
        
        {/* Título */}
        <h1 className="mb-10 text-center text-4xl font-bold text-white">{t('welcomeBack')}</h1>
        
        {/* Formulario */}
        <form className="w-full" aria-label={t('aria.loginForm')} onSubmit={handleSubmit}>
          {/* Campo Email */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
              {t('email')}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full px-4 py-3 bg-white border border-white rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-white text-gray-900"
              placeholder={t('emailPlaceholder')}
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          
          {/* Campo Contraseña */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
              {t('password')}
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full px-4 py-3 bg-white border border-white rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-white text-gray-900 pr-12"
                placeholder={t('passwordPlaceholder')}
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => {
                  const passwordInput = document.getElementById('password') as HTMLInputElement
                  if (passwordInput) {
                    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password'
                  }
                }}
              >
                <span className="ms ms-24">visibility_off</span>
              </button>
            </div>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="mb-4 rounded-lg bg-red-100 border border-red-300 p-3">
              <div className="text-sm text-red-700">
                {error}
              </div>
            </div>
          )}

          {/* Recordarme y Olvidé contraseña */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-white border-white rounded focus:ring-white"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-white">
                {t('rememberMe')}
              </label>
            </div>
            <a 
              href={ROUTES.passwordRecovery} 
              className="text-sm text-white hover:text-gray-200 underline"
              onClick={(e) => {
                e.preventDefault()
                setLocation(ROUTES.passwordRecovery)
              }}
            >
              {t('recoveryTitle')}
            </a>
          </div>

          {/* Botón de Login */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-4 px-6 bg-white text-gray-900 font-semibold rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? t('loggingIn') : t('signIn')}
          </button>
        </form>
      </section>
      
      {/* Footer */}
      <footer className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-base font-bold leading-[1.3] text-white">
        ClipNest
      </footer>
    </main>
  )
}



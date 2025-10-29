import { useTranslation } from 'react-i18next'
import { useLocation } from 'wouter'
import { useEffect } from 'react'
import clipnestIcon from '@/assets/images/icons/clipnest.svg'
import useForgotPassword from '@/hooks/useForgotPassword'

export default function PasswordRecovery() {
  const { t } = useTranslation('auth')
  const [, setLocation] = useLocation()
  
  const {
    email,
    setEmail,
    formErrors,
    handleSubmit,
    isLoading,
    isSuccess,
    error,
    reset
  } = useForgotPassword()

  const handleBackToLogin = () => {
    setLocation('/login')
  }

  // La redirección ahora se maneja en el hook useForgotPassword

  // Resetear el estado cuando se monta el componente
  useEffect(() => {
    reset()
  }, [reset])

  if (isSuccess) {
    return (
      <main className="relative flex min-h-screen items-center justify-center bg-login-gradient px-4">
        <section className="w-full max-w-[672px]">
          {/* Logo */}
          <figure className="mx-auto mb-10 flex items-center justify-center">
            <img src={clipnestIcon} alt={t('common:brand')} className="h-[98px] w-[98px] rounded-xl" />
          </figure>
          
          {/* Mensaje de éxito */}
          <div className="text-center">
            <h1 className="mb-6 text-4xl font-bold text-white">{t('recoverySuccessTitle')}</h1>
            <p className="mb-8 text-lg text-white">{t('recoverySuccessMessage')}</p>
            
            <button
              onClick={handleBackToLogin}
              className="w-full flex justify-center py-4 px-6 text-white font-semibold rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 transition-colors border-2 btn-recovery"
            >
              {t('backToLogin')}
            </button>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-base font-bold leading-[1.3] text-white">
          ClipNest
        </footer>
      </main>
    )
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-login-gradient px-4">
      <section className="w-full max-w-[672px]">
        {/* Logo */}
        <figure className="mx-auto mb-10 flex items-center justify-center">
          <img src={clipnestIcon} alt={t('common:brand')} className="h-[98px] w-[98px] rounded-xl" />
        </figure>
        
        {/* Título */}
        <h1 className="mb-4 text-center text-4xl font-bold text-white">{t('recoveryTitle')}</h1>
        
        {/* Subtítulo */}
        <p className="mb-10 text-center text-lg text-white">{t('recoverySubtitle')}</p>
        
        {/* Formulario */}
        <form className="w-full" aria-label={t('aria.recoveryForm')} onSubmit={handleSubmit}>
          {/* Campo Email */}
          <div className="mb-8">
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {/* Error del campo email */}
            {formErrors.email && (
              <div className="mt-2 text-sm text-red-300">
                {formErrors.email}
              </div>
            )}
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-lg bg-red-100 border border-red-300 p-3">
              <div className="text-sm text-red-700">
                {error}
              </div>
            </div>
          )}

          {/* Botón de Envío */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-4 px-6 font-semibold rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-4 btn-send-recovery"
          >
            {isLoading ? t('sendingLink') : t('sendRecoveryLink')}
          </button>

          {/* Botón de Volver */}
          <button
            type="button"
            onClick={handleBackToLogin}
            className="w-full flex justify-center py-4 px-6 text-white font-semibold rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 transition-colors border-2 btn-recovery"
          >
            {t('backToLogin')}
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

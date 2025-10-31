import { useTranslation } from 'react-i18next'
import { useLocation } from 'wouter'
import { useEffect } from 'react'
import talkiplayIcon from '@/assets/images/icons/talkiplay.svg'
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
      <main className="relative flex min-h-screen items-center justify-center px-4 auth-page">
        <section className="w-full max-w-[672px] bg-white p-10">
          {/* Logo */}
          <figure className="mx-auto mb-8 flex items-center justify-center">
            <img src={talkiplayIcon} alt={t('common:brand')} className="rounded-xl w-[165.67px] h-[25.6px]" />
          </figure>
          {/* Mensaje de éxito */}
          <div className="text-center">
            <h1 className="mb-6 text-4xl font-bold text-[var(--color-info-500)]">{t('recoverySuccessTitle')}</h1>
            <p className="mb-8 text-lg text-[var(--color-neutral-900)]">{t('recoverySuccessMessage')}</p>
            <button
              onClick={handleBackToLogin}
              className="w-full flex justify-center py-4 px-6 bg-[var(--color-info-500)] text-white font-semibold rounded-lg shadow-sm hover:bg-[var(--color-chart-cyan)] focus:outline-none focus:ring-2 focus:ring-[var(--color-info-500)] focus:ring-offset-2 transition-colors"
            >
              {t('backToLogin')}
            </button>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center px-4 auth-page">
      <section className="w-full max-w-[672px] bg-white p-10">
        {/* Logo */}
        <figure className="mx-auto mb-8 flex items-center justify-center">
          <img src={talkiplayIcon} alt={t('common:brand')} className="rounded-xl w-[165.67px] h-[25.6px]" />
        </figure>
        
        {/* Título */}
        <h1 className="mb-4 text-center text-4xl font-bold text-[var(--color-info-500)]">{t('recoveryTitle')}</h1>
        
        {/* Subtítulo */}
        <p className="mb-10 text-center text-lg text-[var(--color-neutral-900)]">{t('recoverySubtitle')}</p>
        
        {/* Formulario */}
        <form className="w-full" aria-label={t('aria.recoveryForm')} onSubmit={handleSubmit}>
          {/* Campo Email */}
          <div className="mb-8">
            <label htmlFor="email" className="block text-sm font-medium text-[var(--color-neutral-900)] mb-2">
              {t('email')}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full px-4 py-3 bg-[var(--color-input-bg)] border-0 border-b-2 border-[var(--color-neutral-900)] rounded-none placeholder-gray-400 focus:outline-none focus:border-[var(--color-info-500)] text-[var(--color-neutral-900)]"
              placeholder={t('emailPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {/* Error del campo email */}
            {formErrors.email && (
              <div className="mt-2 text-sm text-red-700">
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
            className="w-full flex justify-center py-4 px-6 bg-[var(--color-info-500)] text-white font-semibold rounded-lg shadow-sm hover:bg-[var(--color-chart-cyan)] focus:outline-none focus:ring-2 focus:ring-[var(--color-info-500)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-6"
          >
            {isLoading ? t('sendingLink') : t('sendRecoveryLink')}
          </button>

          {/* Enlace Volver */}
          <div className="text-center">
            <button
              type="button"
              onClick={handleBackToLogin}
              className="text-sm text-[var(--color-info-500)] hover:text-[var(--color-chart-cyan)] underline transition-colors"
            >
              {t('backToLogin')}
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}

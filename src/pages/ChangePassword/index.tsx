import { useTranslation } from 'react-i18next'
import talkiplayIcon from '@/assets/images/icons/talkiplay.svg'
import useResetPassword from '@/hooks/useResetPassword'

export default function ChangePassword() {
  const { t } = useTranslation('auth')

  const {
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    showConfirmPassword,
    formErrors,
    handleSubmit,
    handleBackToLogin,
    togglePasswordVisibility,
    isLoading,
    isSuccess,
    error
  } = useResetPassword()

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
            <h1 className="mb-6 text-4xl font-bold text-[var(--color-info-500)]">{t('passwordChangedTitle')}</h1>
            <p className="mb-8 text-lg text-[var(--color-neutral-900)]">{t('passwordChangedMessage')}</p>

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
        <h1 className="mb-4 text-center text-4xl font-bold text-[var(--color-info-500)]">{t('changePasswordTitle')}</h1>

        {/* Subtítulo */}
        <p className="mb-10 text-center text-lg text-[var(--color-neutral-900)]">{t('changePasswordSubtitle')}</p>

        {/* Formulario */}
        <form className="w-full" aria-label={t('aria.changePasswordForm')} onSubmit={handleSubmit}>
          {/* Campo Nueva Contraseña */}
          <div className="mb-6">
            <label htmlFor="newPassword" className="block text-sm font-medium text-[var(--color-neutral-900)] mb-2">
              {t('newPassword')}
            </label>
            <div className="relative">
              <input
                id="newPassword"
                name="newPassword"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                className="w-full px-4 py-3 bg-[var(--color-input-bg)] border-0 border-b-2 border-[var(--color-neutral-900)] rounded-none placeholder-gray-400 focus:outline-none focus:border-[var(--color-info-500)] text-[var(--color-neutral-900)] pr-12"
                placeholder={t('newPasswordPlaceholder')}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-neutral-500)] hover:text-[var(--color-neutral-900)]"
                onClick={() => togglePasswordVisibility('password')}
              >
                <span className="ms ms-24">{showPassword ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
            {/* Error del campo nueva contraseña */}
            {formErrors.newPassword && (
              <div className="mt-2 text-sm text-red-700">
                {formErrors.newPassword}
              </div>
            )}
          </div>

          {/* Campo Confirmar Contraseña */}
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--color-neutral-900)] mb-2">
              {t('confirmPassword')}
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                className="w-full px-4 py-3 bg-[var(--color-input-bg)] border-0 border-b-2 border-[var(--color-neutral-900)] rounded-none placeholder-gray-400 focus:outline-none focus:border-[var(--color-info-500)] text-[var(--color-neutral-900)] pr-12"
                placeholder={t('confirmPasswordPlaceholder')}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-neutral-500)] hover:text-[var(--color-neutral-900)]"
                onClick={() => togglePasswordVisibility('confirm')}
              >
                <span className="ms ms-24">{showConfirmPassword ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
            {/* Error del campo confirmar contraseña */}
            {formErrors.confirmPassword && (
              <div className="mt-2 text-sm text-red-700">
                {formErrors.confirmPassword}
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

          {/* Botón de Cambio */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-4 px-6 bg-[var(--color-info-500)] text-white font-semibold rounded-lg shadow-sm hover:bg-[var(--color-chart-cyan)] focus:outline-none focus:ring-2 focus:ring-[var(--color-info-500)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-6"
          >
            {isLoading ? t('changingPassword') : t('changePassword')}
          </button>

          {/* Botón de Volver */}
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

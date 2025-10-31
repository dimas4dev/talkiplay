import { useTranslation } from 'react-i18next'
import talkiplayIcon from '@/assets/images/icons/talkiplay.svg'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp'
import useVerifyOTP from '@/hooks/useVerifyOTP'

export default function OTP() {
  const { t } = useTranslation('auth')
  
  const {
    otp,
    setOtp,
    email,
    formErrors,
    handleSubmit,
    handleBackToLogin,
    isLoading,
    error
  } = useVerifyOTP()


  return (
    <main className="relative flex min-h-screen items-center justify-center px-4 auth-page">
      <section className="w-full max-w-[672px] bg-white p-10">
        {/* Logo */}
        <figure className="mx-auto mb-8 flex items-center justify-center">
          <img src={talkiplayIcon} alt={t('common:brand')} className="rounded-xl w-[165.67px] h-[25.6px]" />
        </figure>
        
        {/* Título */}
        <h1 className="mb-4 text-center text-4xl font-bold text-[var(--color-info-500)]">{t('otpTitle')}</h1>
        
        {/* Subtítulo */}
        <p className="mb-10 text-center text-lg text-[var(--color-neutral-900)]">
          {email ? `Ingresa el código de 6 dígitos que enviamos a ${email}` : t('otpSubtitle')}
        </p>
        
        {/* Formulario */}
        <form className="w-full" aria-label={t('aria.otpForm')} onSubmit={handleSubmit}>
          {/* Campo OTP */}
          <div className="mb-8">
            <label htmlFor="otp" className="block text-sm font-medium text-[var(--color-neutral-900)] mb-2">
              {t('otpLabel')}
            </label>
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={setOtp}
                className="gap-4"
              >
                <InputOTPGroup className="gap-2">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup className="gap-2">
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            {/* Error del campo OTP */}
            {formErrors.code && (
              <div className="mt-2 text-sm text-red-700 text-center">
                {formErrors.code}
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

          {/* Botón de Verificación */}
          <button
            type="submit"
            disabled={isLoading || otp.length !== 6}
            className="w-full flex justify-center py-4 px-6 bg-[var(--color-info-500)] text-white font-semibold rounded-lg shadow-sm hover:bg-[var(--color-chart-cyan)] focus:outline-none focus:ring-2 focus:ring-[var(--color-info-500)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-6"
          >
            {isLoading ? t('verifying') : t('verifyOTP')}
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

import { useTranslation } from 'react-i18next'
import clipnestIcon from '@/assets/images/icons/clipnest.svg'
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
    <main className="relative flex min-h-screen items-center justify-center bg-login-gradient px-4">
      <section className="w-full max-w-[672px]">
        {/* Logo */}
        <figure className="mx-auto mb-10 flex items-center justify-center">
          <img src={clipnestIcon} alt={t('common:brand')} className="h-[98px] w-[98px] rounded-xl" />
        </figure>
        
        {/* Título */}
        <h1 className="mb-4 text-center text-4xl font-bold text-white">{t('otpTitle')}</h1>
        
        {/* Subtítulo */}
        <p className="mb-10 text-center text-lg text-white">
          {email ? `Ingresa el código de 6 dígitos que enviamos a ${email}` : t('otpSubtitle')}
        </p>
        
        {/* Formulario */}
        <form className="w-full" aria-label={t('aria.otpForm')} onSubmit={handleSubmit}>
          {/* Campo OTP */}
          <div className="mb-8">
            <label htmlFor="otp" className="block text-sm font-medium text-white mb-2">
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
              <div className="mt-2 text-sm text-red-300 text-center">
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
            className="w-full flex justify-center py-4 px-6 font-semibold rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-4 btn-send-recovery"
          >
            {isLoading ? t('verifying') : t('verifyOTP')}
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

import { useTranslation } from 'react-i18next'

export default function LanguagePage() {
  const { t } = useTranslation('sidebar')
  return (
    <section className="p-6">
      <h2 className="text-2xl font-bold text-[var(--color-neutral-900)]">{t('language')}</h2>
    </section>
  )
}


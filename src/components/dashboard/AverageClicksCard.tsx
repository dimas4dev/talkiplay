import { useTranslation } from 'react-i18next'

interface AverageClicksCardProps {
  averageClicks: number
  trendValue?: number // variación vs mes anterior (positivo/negativo)
}

export default function AverageClicksCard({ averageClicks, trendValue }: AverageClicksCardProps) {
  const { t } = useTranslation('dashboard')
  const trendIsPositive = typeof trendValue === 'number' && trendValue > 0
  const trendIsNegative = typeof trendValue === 'number' && trendValue < 0
  const trendColor = trendIsPositive
    ? 'text-emerald-600'
    : trendIsNegative
      ? 'text-red-600'
      : 'text-neutral-500'
  const trendArrow = trendIsPositive ? '▲' : trendIsNegative ? '▼' : '■'
  const trendText = typeof trendValue === 'number' ? t('averageClicks.trendVsLastMonth', { trend: `${trendArrow} ${trendValue > 0 ? '+' : ''}${Math.round(trendValue)}` }) : null

  return (
    <section
      aria-labelledby="average-clicks"
      className="flex h-full w-full flex-col justify-center rounded border border-neutral-200 bg-neutral-50 p-4"
    >
      <header className="text-center leading-tight mb-2">
        <h3 id="average-clicks" className="text-base font-medium leading-[1.3] text-neutral-700">{t('averageClicks.title')}</h3>
      </header>
      <p className="text-center text-4xl font-bold leading-[1.6] text-neutral-900 mb-2">{averageClicks}</p>
      {trendText && (
        <p className={`text-center text-sm ${trendColor}`}>{trendText}</p>
      )}
    </section>
  )
}


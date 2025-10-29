import type { UserActivity } from '@/types/dashboard'
import { useTranslation } from 'react-i18next'

interface ActiveUsersCardProps {
  data: UserActivity
  trendValue?: number // variación vs periodo anterior (positivo/negativo)
}

export default function ActiveUsersCard({ data, trendValue }: ActiveUsersCardProps) {
  const { t } = useTranslation('dashboard')
  const trendIsPositive = typeof trendValue === 'number' && trendValue > 0
  const trendIsNegative = typeof trendValue === 'number' && trendValue < 0
  const trendColor = trendIsPositive
    ? 'text-emerald-600'
    : trendIsNegative
      ? 'text-red-600'
      : 'text-neutral-500'
  const trendArrow = trendIsPositive ? '▲' : trendIsNegative ? '▼' : '■'
  const trendText = typeof trendValue === 'number' ? t('activeUsers.trendVsYesterday', { trend: `${trendArrow} ${trendValue > 0 ? '+' : ''}${Math.round(trendValue)}` }) : null

  return (
    <section
      aria-labelledby="active-users"
      className="flex h-full w-full flex-col justify-center rounded border border-neutral-200 bg-neutral-50 p-4"
    >
      <header className="text-center leading-tight">
        <h3 id="active-users" className="text-base font-medium leading-[1.3] text-neutral-700">{t('activeUsers.title')}</h3>
        <p className="text-sm font-medium leading-[1.4] text-neutral-500">{t('activeUsers.percentOfTotal', { percent: data.active_percentage })}</p>
      </header>
      <p className="text-center text-4xl font-bold leading-[1.6] text-neutral-900">{data.active_users}</p>
      {trendText && (
        <p className={`text-center text-sm ${trendColor}`}>{trendText}</p>
      )}
    </section>
  )
}



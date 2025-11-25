import { useTranslation } from 'react-i18next'
import DonutChart from '../charts/DonutChart'

interface LanguagesDonutProps {
  spanish: number
  english: number
  german: number
}

export default function LanguagesDonut({ spanish, english, german }: LanguagesDonutProps) {
  const { t } = useTranslation('dashboard')
  
  const total = spanish + english + german || 1
  const safePct = (value: number) => {
    if (!total || total <= 0) return '0%'
    return `${Math.round((value / total) * 100)}%`
  }

  const chartData = [
    { 
      name: t('languages.spanish'), 
      value: spanish, 
      color: 'var(--color-info-500)', // Teal oscuro
      percentage: safePct(spanish)
    },
    { 
      name: t('languages.english'), 
      value: english, 
      color: 'var(--color-success-500)', // Verde claro
      percentage: safePct(english)
    },
    { 
      name: t('languages.german'), 
      value: german, 
      color: 'var(--color-chart-info)', // Azul claro
      percentage: safePct(german)
    }
  ]

  // Trend calculado (simulado para mostrar +5.2%)
  const trendText = `+5.2% vs mes pasado`

  return (
    <DonutChart
      title={t('languages.title')}
      subtitle={t('languages.subtitle')}
      data={chartData}
      trend={trendText}
    />
  )
}


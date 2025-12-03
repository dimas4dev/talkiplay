import { useTranslation } from 'react-i18next'
import DonutChart from '../charts/DonutChart'

interface LanguageStat {
  language: string
  count: number
  percentage: number
}

interface LanguagesDonutProps {
  stats: LanguageStat[]
  trend?: string
}

// Colores para los diferentes idiomas
const LANGUAGE_COLORS: Record<string, string> = {
  'español': 'var(--color-info-500)', // Teal oscuro
  'spanish': 'var(--color-info-500)',
  'inglés': 'var(--color-success-500)', // Verde claro
  'english': 'var(--color-success-500)',
  'portugués': 'var(--color-chart-info)', // Azul claro
  'portuguese': 'var(--color-chart-info)',
  'alemán': 'var(--color-warning-500)', // Amarillo/Naranja
  'german': 'var(--color-warning-500)',
}

// Colores por defecto si el idioma no está en el mapa
const DEFAULT_COLORS = [
  'var(--color-info-500)',
  'var(--color-success-500)',
  'var(--color-chart-info)',
  'var(--color-warning-500)',
  'var(--color-error-500)',
]

export default function LanguagesDonut({ stats, trend }: LanguagesDonutProps) {
  const { t } = useTranslation('dashboard')
  
  // Mapear los stats del API al formato del gráfico
  const chartData = stats.map((stat, index) => {
    const languageKey = stat.language.toLowerCase()
    const color = LANGUAGE_COLORS[languageKey] || DEFAULT_COLORS[index % DEFAULT_COLORS.length]
    
    return {
      name: stat.language,
      value: stat.count,
      color,
      percentage: `${stat.percentage}%`
    }
  })

  return (
    <DonutChart
      title={t('languages.title')}
      subtitle={t('languages.subtitle')}
      data={chartData}
      trend={trend}
    />
  )
}


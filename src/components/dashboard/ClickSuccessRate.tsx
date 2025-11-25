import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import DonutChart from '../charts/DonutChart'

interface ClickSuccessRateProps {
  successRate: number // Porcentaje de éxito (ej: 76)
}

export default function ClickSuccessRate({ successRate }: ClickSuccessRateProps) {
  const { t } = useTranslation('dashboard')
  const [activeTab, setActiveTab] = useState('30days')

  const tabs = [
    { key: '7days', label: t('clickSuccessRate.last7days') },
    { key: '30days', label: t('clickSuccessRate.last30days') }
  ]

  // Calcular datos para el donut chart
  const success = Number.isFinite(successRate) ? successRate : 76
  const failed = Math.max(0, 100 - success)

  const data30Days = [
    { 
      name: t('clickSuccessRate.successfulMatches'), 
      value: success, 
      color: 'var(--color-info-500)', 
      percentage: `${success}%` 
    },
    { 
      name: 'Sin match', 
      value: failed, 
      color: 'var(--sidebar-user-bg)', 
      percentage: `${failed}%` 
    }
  ]

  // Para 7 días usar el mismo dato (o se puede ajustar si hay datos diferentes)
  const data7Days = data30Days

  const currentData = activeTab === '30days' ? data30Days : data7Days

  // Trend fijo según la imagen (+5.2%)
  const trendText = `+5.2% vs mes pasado`

  return (
    <DonutChart
      title={t('clickSuccessRate.title')}
      subtitle={t('clickSuccessRate.subtitle')}
      data={currentData}
      trend={trendText}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    />
  )
}


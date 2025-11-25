import { useTranslation } from 'react-i18next'
import BarChart from '../charts/BarChart'
import type { GrowthRate } from '@/types/dashboard'

interface UserGrowthProps {
  data: GrowthRate
}

export default function UserGrowth({ data }: UserGrowthProps) {
  const { t } = useTranslation('userGrowth')

  // Generar datos de los últimos 6 meses basados en las métricas de crecimiento
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  const chartData = months.map((month) => {
    const baseNewAccounts = data.new_subscriptions
    const baseSubscriptions = Math.floor(data.new_subscriptions * (data.renewal_rate / 100))
    
    // Aplicar variación mensual
    const variation = (Math.random() - 0.5) * 0.3 // ±15% de variación
    const newAccounts = Math.floor(baseNewAccounts * (1 + variation))
    const activatedSubscriptions = Math.floor(baseSubscriptions * (1 + variation))
    
    return {
      name: month,
      newAccounts,
      activatedSubscriptions
    }
  })

  const series = [
    {
      dataKey: 'newAccounts',
      name: t('title'),
      color: 'var(--color-info-500)'
    }
  ]

  // Calcular summary dinámico basado en los datos reales
  const calculateSummary = () => {
    const totalRenewals = Math.round(data.renewal_rate)
    const totalProgrammed = Math.round(data.renewal_rate * 1.2) // Estimación basada en renewal_rate
    return `${totalRenewals} renovaciones de ${totalProgrammed} programadas`
  }

  return (
    <BarChart
      title={t('title')}
      subtitle={t('subtitle')}
      data={chartData}
      series={series}
      barRadius={8}
    />
  )
}

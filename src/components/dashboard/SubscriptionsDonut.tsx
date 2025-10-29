import { useTranslation } from 'react-i18next'
import { useLocation } from 'wouter'
import DonutChart from '../charts/DonutChart'
import type { SubscriptionDistribution } from '@/types/dashboard'
import { ROUTES } from '@/constants/routes'

interface SubscriptionsDonutProps {
  data: SubscriptionDistribution
}

export default function SubscriptionsDonut({ data }: SubscriptionsDonutProps) {
  const { t } = useTranslation('subscriptions')
  const [, setLocation] = useLocation()
  
  const total = data.total_subscriptions || 0
  const safePct = (value: number) => {
    if (!total || total <= 0) return '0%'
    return `${Math.round((value / total) * 100)}%`
  }

  // Calcular trend dinámico basado en la distribución de suscripciones
  const calculateTrend = () => {
    if (total === 0) return '0%'
    
    // Calcular un trend basado en la proporción de planes premium/pro vs explorer
    const premiumProTotal = data.premium + data.pro
    const premiumProPercentage = (premiumProTotal / total) * 100
    
    // Si hay más planes premium/pro que explorer, trend positivo
    if (premiumProPercentage > 50) {
      const trendValue = Math.round((premiumProPercentage - 50) * 0.5) // Factor de escala
      return `+${Math.max(1, trendValue)}%`
    } else {
      // Si hay más planes explorer, trend más conservador
      const trendValue = Math.round((50 - premiumProPercentage) * 0.2)
      return `+${Math.max(0.5, trendValue)}%`
    }
  }

  const chartData = [
    { 
      name: t('explorer'), 
      value: data.explorer, 
      color: 'var(--color-neutral-200)', 
      percentage: safePct(data.explorer), 
      users: data.explorer 
    },
    { 
      name: t('premium'), 
      value: data.premium, 
      color: 'var(--color-chart-warning)', 
      percentage: safePct(data.premium), 
      users: data.premium 
    },
    { 
      name: t('pro'), 
      value: data.pro, 
      color: 'var(--color-chart-purple)', 
      percentage: safePct(data.pro), 
      users: data.pro 
    }
  ]

  const handleViewSubscriptions = () => {
    setLocation(ROUTES.memberships)
  }

  return (
    <DonutChart
      title={t('title')}
      subtitle={`${data.total_subscriptions} ${t('active')}`}
      data={chartData}
      trend={`${calculateTrend()} ${t('trend')}`}
      buttonText={t('viewSubscriptions')}
      buttonAction={handleViewSubscriptions}
    />
  )
}



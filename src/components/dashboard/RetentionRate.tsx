import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import DonutChart from '../charts/DonutChart'
import type { RetentionRate as RetentionRateType } from '@/types/dashboard'

interface RetentionRateProps {
  data: RetentionRateType
}

export default function RetentionRate({ data }: RetentionRateProps) {
  const { t } = useTranslation('retention')
  const [activeTab, setActiveTab] = useState('30days')

  const tabs = [
    { key: '7days', label: t('last7days') },
    { key: '30days', label: t('last30days') }
  ]

  // Calcular datos SOLO con campos disponibles del backend
  const averageRetention = Number.isFinite(data.average_retention) ? data.average_retention : 0
  const cancelled = Math.max(0, 100 - averageRetention)
  // El backend no expone desglose de errores de pago en retención; mantener 0
  const paymentError = 0
  const cancelledReal = cancelled

  const data30Days = [
    { name: t('renewed'), value: averageRetention, color: 'var(--color-chart-primary)', percentage: `${averageRetention}%` },
    { name: t('cancelled'), value: cancelledReal, color: 'var(--color-chart-warning)', percentage: `${cancelledReal}%` },
    { name: t('paymentError'), value: paymentError, color: 'var(--color-chart-error)', percentage: `${paymentError}%` }
  ]

  // Para 7 días: el endpoint no provee retención 7d; usar mismo dato como fallback
  const sevenDayRetention = averageRetention
  const sevenDayCancelled = Math.max(0, 100 - sevenDayRetention)
  const sevenDayPaymentError = 0
  const sevenDayCancelledReal = sevenDayCancelled

  const data7Days = [
    { name: t('renewed'), value: sevenDayRetention, color: 'var(--color-chart-primary)', percentage: `${sevenDayRetention}%` },
    { name: t('cancelled'), value: sevenDayCancelledReal, color: 'var(--color-chart-warning)', percentage: `${sevenDayCancelledReal}%` },
    { name: t('paymentError'), value: sevenDayPaymentError, color: 'var(--color-chart-error)', percentage: `${sevenDayPaymentError}%` }
  ]

  const currentData = activeTab === '30days' ? data30Days : data7Days

  // Tendencia dinámica
  const monthValues = [
    data.month_1,
    data.month_2,
    data.month_3,
    data.month_4,
    data.month_5,
    data.month_6,
  ]
  const last = Number.isFinite(monthValues[5]) ? monthValues[5] : 0
  const prev = Number.isFinite(monthValues[4]) ? monthValues[4] : 0
  const delta30 = last - prev
  const delta7 = sevenDayRetention - averageRetention
  const activeDelta = activeTab === '30days' ? delta30 : delta7
  const trendPrefix = activeDelta > 0 ? '+' : activeDelta < 0 ? '' : ''
  const trendText = `${trendPrefix}${activeDelta.toFixed(1)}% ${t('trend')}`

  // Calcular summary dinámico basado en los datos reales
  const calculateSummary = () => {
    const totalRenewals = averageRetention
    const totalProgrammed = 100 // Base de comparación
    return `${Math.round(totalRenewals)} renovaciones de ${totalProgrammed} programadas`
  }

  return (
    <DonutChart
      title={t('title')}
      subtitle={t('subtitle')}
      data={currentData}
      trend={trendText}
      summary={calculateSummary()}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    />
  )
}

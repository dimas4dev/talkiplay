import { useTranslation } from 'react-i18next'
import BarChart from '../charts/BarChart'

interface NewUsersProps {
  monthlyData?: Array<{ month: string; value: number }>
}

export default function NewUsers({ monthlyData }: NewUsersProps) {
  const { t } = useTranslation('dashboard')

  // Datos según la imagen: Aug, Apr, Mar, Apr, May, Jun, Jul
  const defaultData = [
    { month: 'Aug', newUsers: 2 },
    { month: 'Apr', newUsers: 1 },
    { month: 'Mar', newUsers: 1 },
    { month: 'Apr', newUsers: 1 },
    { month: 'May', newUsers: 4 },
    { month: 'Jun', newUsers: 2 },
    { month: 'Jul', newUsers: 3 }
  ]

  const chartData = monthlyData 
    ? monthlyData.map(d => ({ name: d.month, newUsers: d.value }))
    : defaultData

  const series = [
    {
      dataKey: 'newUsers',
      name: t('newUsers.title'),
      color: 'var(--color-info-500)'
    }
  ]

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex-1 min-h-0">
        <BarChart
          title={t('newUsers.title')}
          subtitle={t('newUsers.subtitle')}
          data={chartData}
          series={series}
          barRadius={8}
        />
      </div>
    </div>
  )
}


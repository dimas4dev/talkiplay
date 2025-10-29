import Table from './table'
import type { TableColumn } from '@/types/ui'
import Badge from './badge'
import { useTranslation } from 'react-i18next'
import type { Subscription } from '@/types/dashboard'

interface SubscriptionsTableProps {
  items?: Subscription[]
  className?: string
}

export default function SubscriptionsTable({ 
  items = [], 
  className = ''
}: SubscriptionsTableProps) {
  const { t } = useTranslation('subscriptions')
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const getPlanTranslation = (planType: string) => {
    return t(planType)
  }

  const getBadgeVariant = (planType: string) => {
    const variantMap: Record<string, string> = {
      'explorer': 'explorador',
      'premium': 'premium',
      'pro': 'pro'
    }
    return variantMap[planType] || planType
  }


  const columns: TableColumn<Subscription>[] = [
    {
      key: 'user_name',
      header: 'Nombre',
      widthClass: 'w-[25%]',
      render: (row) => (
        <div>
          <div className="text-primary-600 font-medium">{row.user.name}</div>
          <div className="text-sm text-gray-500">{row.user.email}</div>
        </div>
      ),
    },
    {
      key: 'plan',
      header: 'Suscripción',
      widthClass: 'w-[15%]',
      render: (row) => (
        <Badge variant={getBadgeVariant(row.plan.type) as any}>
          {getPlanTranslation(row.plan.type)}
        </Badge>
      ),
    },
    { 
      key: 'due_date', 
      header: 'Vencimiento', 
      widthClass: 'w-[15%]', 
      render: (row) => <span className="text-neutral-900">{formatDate(row.dates.end_date)}</span> 
    },
    {
      key: 'status',
      header: 'Estado',
      widthClass: 'w-[15%]',
      render: (row) => {
        const statusMap: Record<string, Parameters<typeof Badge>[0]['variant']> = {
          'trial': 'status-trial',
          'active': 'status-active',
          'suspended': 'status-suspended',
          'expired': 'status-expired',
          'payment_error': 'status-payment-error',
          'cancelled': 'status-cancelled',
        }
        const variant = statusMap[row.status] ?? 'status-trial'
        return <Badge variant={variant}>{row.status_label}</Badge>
      },
    },
  ]

  return (
    <Table
      columns={columns}
      data={items}
      className={className}
      headerPaddingClass="p-4"
      headerBgClass="bg-neutral-50"
    />
  )
}



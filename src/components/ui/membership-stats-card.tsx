interface MembershipStatsCardProps {
  icon: string
  label: string
  value: string | number
  className?: string
  iconBackgroundColor?: string
  iconTextColor?: string
  iconSize?: string
  iconFill?: boolean
  onClick?: () => void
}

export default function MembershipStatsCard({ 
  icon, 
  label, 
  value, 
  className = '',
  iconBackgroundColor = 'bg-primary-500',
  iconTextColor = 'text-white',
  iconSize = 'ms-20',
  iconFill = false,
  onClick
}: MembershipStatsCardProps) {
  return (
    <div 
      className={`flex flex-col items-center px-6 transition-colors ${
        onClick ? 'cursor-pointer hover:bg-gray-50 hover:rounded-lg' : ''
      } ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      } : undefined}
    >
      <div className={`mb-3 flex h-8 w-8 items-center justify-center rounded-full ${iconBackgroundColor}`}>
        <span className={`ms ${iconSize} ${iconTextColor} ${iconFill ? 'ms-fill' : ''}`}>{icon}</span>
      </div>
      <p className="mb-2 text-sm font-medium text-primary-600">{label}</p>
      <p className="text-2xl font-bold text-neutral-900">{value}</p>
    </div>
  )
}

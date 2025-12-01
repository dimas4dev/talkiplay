interface StatsCardProps {
  title: string
  subtitle: string
  value: number | string
  subtitleBelowValue?: boolean
  suffix?: string
  onClick?: () => void
}

export default function StatsCard({
  title,
  subtitle,
  value,
  subtitleBelowValue = false,
  suffix,
  onClick,
}: StatsCardProps) {
  return (
    <section
      aria-labelledby="stats-title"
      className={`h-full w-full flex flex-col justify-center rounded-md border transition-colors ${
        onClick ? 'cursor-pointer hover:bg-neutral-100 hover:border-primary-500' : 'hover:bg-neutral-100'
      }`}
      style={{
        borderWidth: '1px',
        borderColor: 'var(--color-card-border)',
        backgroundColor: 'var(--color-neutral-50)',
        padding: '20px'
      }}
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
      {/* Título */}
      <header className="text-center leading-tight mb-2">
        <h3
          id="stats-title"
          className="text-base font-medium leading-[1.2] text-neutral-700"
        >
          {title}
        </h3>
      </header>

      {/* Valor principal dinámico */}
      <p className="text-center font-bold text-neutral-900 text-4xl leading-tight break-words mb-1">
        {value}
        {suffix ? ` ${suffix}` : ''}
      </p>

      {/* Subtítulo */}
      <p
        className={`text-center text-sm font-medium leading-[1.2] ${
          subtitleBelowValue ? '' : 'order-[-1]'
        } ${
          subtitle.includes('▲') || subtitle.includes('+')
            ? 'text-emerald-600'
            : subtitle.includes('▼') || subtitle.includes('-')
            ? 'text-red-600'
            : 'text-neutral-500'
        }`}
      >
        {subtitle}
      </p>
    </section>
  )
}

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
        borderColor: 'var(--color-neutral-300)',
        backgroundColor: 'var(--color-neutral-50)',
        padding: '12px'
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
      <header className="text-center leading-tight mb-1">
        <h3
          id="stats-title"
          className="text-[10px] font-medium leading-[1.2] text-neutral-700"
        >
          {title}
        </h3>
      </header>

      {/* Valor principal dinámico */}
      <p className="text-center font-bold text-neutral-900 text-xl leading-tight break-words mb-0.5">
        {value}
        {suffix ? ` ${suffix}` : ''}
      </p>

      {/* Subtítulo */}
      <p
        className={`text-center text-[9px] font-medium leading-[1.2] text-neutral-500 ${
          subtitleBelowValue ? '' : 'order-[-1]'
        }`}
      >
        {subtitle}
      </p>
    </section>
  )
}

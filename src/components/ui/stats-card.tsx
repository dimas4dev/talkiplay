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
      className={`h-full min-h-[107px] flex flex-col justify-center rounded border border-neutral-200 bg-neutral-50 p-4 transition-colors ${
        onClick ? 'cursor-pointer hover:bg-neutral-100 hover:border-primary-500' : 'hover:bg-neutral-100'
      }`}
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
      <header className="text-center leading-tight">
        <h3
          id="stats-title"
          className="text-[clamp(12px,1.5vw,16px)] font-medium leading-[1.3] text-neutral-700"
        >
          {title}
        </h3>
      </header>

      {/* Valor principal dinámico */}
      <p className="text-center font-bold text-neutral-900 text-[clamp(18px,4vw,32px)] leading-tight break-words">
        {value}
        {suffix ? ` ${suffix}` : ''}
      </p>

      {/* Subtítulo */}
      <p
        className={`text-center text-[clamp(10px,1.2vw,14px)] font-medium leading-[1.4] text-neutral-500 ${
          subtitleBelowValue ? '' : 'order-[-1]'
        }`}
      >
        {subtitle}
      </p>
    </section>
  )
}

import React from 'react'

interface TimelineItem {
  date: string
  title?: React.ReactNode
  content: React.ReactNode
}

interface TimelineProps {
  items: TimelineItem[]
  className?: string
}

export default function Timeline({ items, className = '' }: TimelineProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="relative grid grid-cols-[120px_24px_1fr] gap-y-6">
        {/* Línea vertical centrada en la columna 2 (120px + 12px) */}
        <span className="pointer-events-none absolute top-2 bottom-2 left-[132px] w-[2px] bg-success-600" />

        {items.map((it, index) => (
          <React.Fragment key={`${it.date}-${index}`}>
            {/* Fecha */}
            <div className="text-sm text-neutral-900">{it.date}</div>
            {/* Punto */}
            <div className="relative mt-1 flex items-start justify-center">
              <span className="z-10 inline-block h-3 w-3 rounded-full bg-success-600" />
            </div>
            {/* Contenido */}
            <div className="text-neutral-900">
              {it.title && (
                <h4 className="mb-1 text-base font-semibold tracking-tight">{it.title}</h4>
              )}
              <div>{it.content}</div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}



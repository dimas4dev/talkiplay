import { useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface TooltipProps {
  content: string
  children: ReactNode
  className?: string
}

export default function Tooltip({ content, children, className }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help"
      >
        {children}
      </div>
      {isVisible && (
        <div
          className={cn(
            'absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded-lg bg-neutral-800 px-3 py-2 text-xs text-white shadow-lg z-50 whitespace-nowrap',
            className
          )}
        >
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
            <div className="h-2 w-2 rotate-45 bg-neutral-800" />
          </div>
        </div>
      )}
    </div>
  )
}


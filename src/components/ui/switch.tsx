import { forwardRef, type JSX } from 'react'
import { cn } from '@/lib/utils'

type SwitchProps = Omit<JSX.IntrinsicElements['input'], 'type'> & {
  label?: string
  labelClassName?: string
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, labelClassName, ...props }, ref) => {
    return (
      <label className={cn('inline-flex items-center gap-2', labelClassName)}>
        {label && <span className="text-sm text-neutral-900">{label}</span>}
        <div className="relative inline-flex h-6 w-11 items-center">
          <input
            ref={ref}
            type="checkbox"
            className="peer sr-only"
            {...props}
          />
          <div className="h-6 w-11 rounded-full bg-neutral-300 transition-colors peer-checked:bg-[var(--color-primary-500)] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--color-primary-500)] peer-focus:ring-offset-2" />
          <div className="absolute left-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
        </div>
      </label>
    )
  }
)

Switch.displayName = 'Switch'

export default Switch


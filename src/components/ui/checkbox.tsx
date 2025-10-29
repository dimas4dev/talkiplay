import { forwardRef, type JSX } from 'react'
import { cn } from '@/lib/utils'

type CheckboxProps = Omit<JSX.IntrinsicElements['input'], 'type'> & {
  label?: string
  labelClassName?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, labelClassName, ...props }, ref) => {
    return (
      <label className={cn('inline-flex items-center gap-2 text-sm text-neutral-800', labelClassName)}>
        <input
          ref={ref}
          type="checkbox"
          className={cn('h-4 w-4 rounded border border-neutral-300 bg-white appearance-none checked:bg-primary-600 checked:border-primary-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors', className)}
          {...props}
        />
        {label && <span>{label}</span>}
      </label>
    )
  }
)

Checkbox.displayName = 'Checkbox'

export default Checkbox



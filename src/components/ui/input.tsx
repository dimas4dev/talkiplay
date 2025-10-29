import { forwardRef, type JSX } from 'react'
import { cn } from '@/lib/utils'

type InputProps = JSX.IntrinsicElements['input'] & {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'h-12 w-full rounded border border-neutral-300 bg-neutral-50 px-4 text-sm text-neutral-900 placeholder:text-neutral-500 outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors',
          className
        )}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'

export default Input



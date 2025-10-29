import { forwardRef, type JSX } from 'react'
import { cn } from '@/lib/utils'

type ButtonProps = JSX.IntrinsicElements['button'] & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive'
  full?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', full, size = 'md', ...props }, ref) => {
    const base = 'inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none'
    const sizeClasses = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-4',
      lg: 'h-14 px-6'
    }
    const width = full ? 'w-full' : ''
    const variants = {
      primary: 'bg-neutral-900 text-white hover:bg-neutral-800',
      secondary: 'bg-white text-neutral-900 hover:bg-neutral-50',
      ghost: 'bg-transparent hover:bg-neutral-100',
      outline: 'border border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-50',
      destructive: 'bg-red-600 text-white hover:bg-red-700',
    } as const

    return (
      <button ref={ref} className={cn(base, sizeClasses[size], width, variants[variant], className)} {...props} />
    )
  }
)

Button.displayName = 'Button'

export default Button



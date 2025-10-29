import { cn } from '@/lib/utils'
import type { JSX } from 'react'

type LabelProps = JSX.IntrinsicElements['label']

export function Label({ className, ...props }: LabelProps) {
  return <label className={cn('mb-1 block text-sm font-medium text-neutral-800', className)} {...props} />
}

export default Label



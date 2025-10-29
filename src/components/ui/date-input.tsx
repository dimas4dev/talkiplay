interface DateInputProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  className?: string
  min?: string
  max?: string
}

export default function DateInput({ placeholder = 'Fecha', value, onChange, className = '', min, max }: DateInputProps) {
  return (
    <div className={`relative ${className}`}>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        min={min}
        max={max}
        className="w-full rounded-lg border border-neutral-200 bg-white px-12 py-3 text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
        placeholder={placeholder}
      />
      <span className="ms absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">event</span>
    </div>
  )
}



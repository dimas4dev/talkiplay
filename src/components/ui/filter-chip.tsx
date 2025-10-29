interface FilterChipProps {
  label: string
  selected?: boolean
  onToggle?: (selected: boolean) => void
  className?: string
}

export default function FilterChip({ label, selected = false, onToggle, className = '' }: FilterChipProps) {
  const base = 'inline-flex items-center gap-2 rounded-full border transition-colors h-8 px-3 text-sm'
  const selectedClasses = 'bg-primary-600 border-primary-600 text-white hover:bg-primary-600'
  const unselectedClasses = 'bg-white border-neutral-300 text-neutral-900 hover:bg-neutral-50'

  return (
    <button
      type="button"
      className={`${base} ${selected ? selectedClasses : unselectedClasses} ${className}`}
      onClick={() => onToggle?.(!selected)}
    >
      {selected && <span className="ms text-white">done</span>}
      <span>{label}</span>
    </button>
  )
}



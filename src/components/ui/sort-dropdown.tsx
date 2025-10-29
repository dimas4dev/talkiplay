import { useRef, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { SORT_GROUPS, type SortGroup } from '@/constants/sorting'


interface SortDropdownProps {
  label?: string
  groups?: SortGroup[]
  value?: string
  onChange?: (value: string) => void
  className?: string
}

export default function SortDropdown({ 
  label = 'Ordenar',
  groups = SORT_GROUPS,
  value,
  onChange,
  className = ''
}: SortDropdownProps) {
  const { t } = useTranslation('memberships')
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<string>(value ?? groups[0].options[0].value)
  const containerRef = useRef<HTMLDivElement | null>(null)

  // Sincronizar el estado interno con el prop value cuando cambie
  useEffect(() => {
    if (value !== undefined) {
      setSelected(value)
    }
  }, [value])

  // Close when focus leaves the container
  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setOpen(false)
    }
  }

  const handleSelect = (newValue: string) => {
    setSelected(newValue)
    onChange?.(newValue)
    setOpen(false)
  }

  return (
    <div className={`relative w-full ${className}`} ref={containerRef} tabIndex={-1} onBlur={handleBlur}>
      <button 
        className={`flex w-full items-center justify-between gap-[10px] px-10 h-10 border border-neutral-400 rounded bg-white text-neutral-900 hover:bg-neutral-50 transition-colors`}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="ms text-neutral-500">swap_vert</span>
        <span className="text-neutral-500">{label}</span>
        <span className="ms text-neutral-500">keyboard_arrow_down</span>
      </button>

      {open && (
        <div className="absolute z-10 mt-2 w-64 rounded-lg border border-neutral-200 bg-white shadow-md p-4">
          <div className="space-y-6">
            {groups.map((group) => (
              <div key={group.key}>
                <div className="flex items-center gap-2 text-primary-600 font-medium mb-2">
                  <span className="ms">expand_less</span>
                  <span>{t(group.labelKey)}</span>
                </div>
                <div className="space-y-2">
                  {group.options.map((opt) => (
                    <label key={opt.value} className="flex items-center gap-3 cursor-pointer select-none">
                      <input
                        type="radio"
                        name={`sort-${group.key}`}
                        className="h-4 w-4 accent-primary-600"
                        checked={selected === opt.value}
                        onChange={() => handleSelect(opt.value)}
                      />
                      <span className="text-neutral-900">{t(opt.labelKey)}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

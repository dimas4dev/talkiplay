import { useRef, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface FilterOption {
  value: string
  labelKey: string
}

interface FilterGroup {
  key: string
  labelKey: string
  options: FilterOption[]
}

interface FilterDropdownProps {
  label?: string
  groups?: FilterGroup[]
  values?: string[]
  onChange?: (values: string[]) => void
  className?: string
  namespace?: string
}

const DEFAULT_GROUPS: FilterGroup[] = [
  {
    key: 'subscription',
    labelKey: 'filter.subscription',
    options: [
      { value: 'explorador', labelKey: 'filter.explorer' },
      { value: 'premium', labelKey: 'filter.premium' },
      { value: 'pro', labelKey: 'filter.pro' },
    ],
  },
  {
    key: 'status',
    labelKey: 'filter.status',
    options: [
      { value: 'activo', labelKey: 'filter.active' },
      { value: 'bloqueado', labelKey: 'filter.blocked' },
      { value: 'inactivo', labelKey: 'filter.inactive' },
    ],
  },
]

export default function FilterDropdown({ 
  label = 'Filtrar',
  groups = DEFAULT_GROUPS,
  values,
  onChange,
  className = '',
  namespace = 'memberships'
}: FilterDropdownProps) {
  const { t } = useTranslation(namespace)
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<string[]>(values ?? [])
  const containerRef = useRef<HTMLDivElement | null>(null)

  // Sincronizar el estado interno con los valores externos
  useEffect(() => {
    setSelected(values ?? [])
  }, [values])

  const handleToggle = (value: string) => {
    const exists = selected.includes(value)
    const next = exists ? selected.filter((v) => v !== value) : [...selected, value]
    setSelected(next)
    onChange?.(next)
  }

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setOpen(false)
    }
  }

  return (
    <div className={`relative w-full ${className}`} ref={containerRef} tabIndex={-1} onBlur={handleBlur}>
      <button 
        className={`flex w-full items-center justify-between gap-[10px] px-10 h-10 border border-neutral-400 rounded bg-white text-neutral-900 hover:bg-neutral-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500`}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="ms text-neutral-500">filter_list</span>
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
                        type="checkbox"
                        className="h-4 w-4 accent-primary-600"
                        checked={selected.includes(opt.value)}
                        onChange={() => handleToggle(opt.value)}
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

interface SearchBarProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  className?: string
}

export default function SearchBar({ 
  placeholder = "Buscar", 
  value, 
  onChange,
  className = ""
}: SearchBarProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <span 
          className="ms text-neutral-500" 
          style={{ fontSize: '18px', width: '18px', height: '18px' }}
        >
          search
        </span>
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full h-10 pl-10 pr-10 rounded-lg text-neutral-900 placeholder:text-neutral-500 bg-neutral-50 border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
      />
    </div>
  )
}

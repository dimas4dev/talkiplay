interface PaginationInfoProps {
  total: number
  currentStart: number
  currentEnd: number
  itemName?: string
  className?: string
}

export default function PaginationInfo({ 
  total,
  currentStart,
  currentEnd,
  itemName = "Suscripciones",
  className = ""
}: PaginationInfoProps) {
  return (
    <div className={`flex items-center justify-between text-neutral-500 ${className}`}>
      <div className="text-sm">
        <span className="font-medium text-neutral-900">{total} {itemName}</span>
      </div>
      <div className="text-sm">
        <span className="text-neutral-700">{currentStart}-{currentEnd} de {total}</span>
      </div>
    </div>
  )
}

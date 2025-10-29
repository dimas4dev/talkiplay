import { useTranslation } from 'react-i18next'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export default function Pagination({ currentPage, totalPages, onPageChange, className = '' }: PaginationProps) {
  const { t } = useTranslation('common')
  const go = (p: number) => {
    if (p < 1 || p > totalPages) return
    onPageChange(p)
  }

  return (
    <nav className={`flex items-center justify-center gap-3 ${className}`} aria-label={t('pagination')}>
      <button className="text-neutral-500 hover:text-primary-600 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded" onClick={() => go(currentPage - 1)} disabled={currentPage === 1}>‹</button>
      {Array.from({ length: totalPages }).map((_, i) => {
        const p = i + 1
        const isActive = p === currentPage
        return (
          <button
            key={p}
            className={(isActive ? 'h-7 w-7 rounded border border-primary-500 text-primary-600' : 'h-7 w-7 rounded text-neutral-500 hover:text-primary-600') + ' focus:outline-none focus:ring-2 focus:ring-primary-500'}
            onClick={() => go(p)}
          >
            {p}
          </button>
        )
      })}
      <button className="text-neutral-500 hover:text-primary-600 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded" onClick={() => go(currentPage + 1)} disabled={currentPage === totalPages}>›</button>
    </nav>
  )
}



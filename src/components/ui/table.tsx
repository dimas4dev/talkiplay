import type { TableProps } from '@/types/ui'
export type { TableColumn } from '@/types/ui'

export default function Table<T>({
  columns,
  data,
  className = '',
  headerPaddingClass = 'p-4',
  headerBgClass = 'bg-neutral-50'
}: TableProps<T>) {
  return (
    <div className={`overflow-hidden rounded-lg border border-neutral-200 bg-white ${className}`}>
      {/* Header with general padding */}
      <div className={headerPaddingClass}>
        <table className="w-full table-fixed">
          <thead>
            <tr className={`${headerBgClass} text-left text-neutral-900`}>
              {columns.map((col) => (
                <th key={String(col.key)} className={`px-4 py-4 ${col.widthClass ?? ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
        </table>
      </div>

      {/* Body */}
      <table className="w-full table-fixed border-collapse">
        <tbody>
          {data.map((row, rowIdx) => (
            <tr key={rowIdx} className="border-t border-neutral-200">
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  className={`px-4 py-4 ${col.widthClass ?? ''} ${col.cellClassName ?? ''}`}
                >
                  {col.render ? col.render(row) : (row as any)[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}



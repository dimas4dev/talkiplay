import { useTranslation } from 'react-i18next'

type ExportButtonProps = {
  onExport: () => void
  text?: string
  className?: string
  disabled?: boolean
}

export function ExportButton({ 
  onExport, 
  text, 
  className = "flex w-full items-center justify-center gap-2 rounded border border-primary-500 bg-primary-50 px-4 py-3 text-primary-600 hover:bg-primary-600 hover:text-white transition-colors",
  disabled = false 
}: ExportButtonProps) {
  const { t } = useTranslation()

  return (
    <button 
      onClick={onExport}
      disabled={disabled}
      className={`${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <span className="ms ms-24">file_export</span>
      <span>{text || t('common.export')}</span>
    </button>
  )
}

// Función utilitaria para exportar datos a CSV
export function exportToCSV(data: any[], filename: string) {
  if (!data || data.length === 0) {
    console.warn('No hay datos para exportar')
    return
  }

  // Obtener las claves del primer objeto para crear los headers
  const headers = Object.keys(data[0])
  
  // Crear el contenido CSV
  const csvContent = [
    // Headers
    headers.join(','),
    // Datos
    ...data.map(row => 
      headers.map(header => {
        const value = row[header]
        // Escapar comillas y envolver en comillas si contiene comas
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value
      }).join(',')
    )
  ].join('\n')

  // Crear y descargar el archivo
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

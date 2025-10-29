// Utilidades de formato

/**
 * Convierte valores monetarios (strings o números) al formato europeo: € al final y coma como separador decimal.
 * Ejemplo: "$49.99" -> "49,99 €" o 49.99 -> "49,99 €"
 */
export function toEuroCurrencyString(value?: string | number | null): string {
  if (value === null || value === undefined) return '0,00 €'
  
  let num: number
  
  if (typeof value === 'number') {
    num = value
  } else if (typeof value === 'string') {
    // Extraer el valor numérico (remover $ y comas de miles)
    const numericValue = value.replace(/[$,]/g, '')
    num = parseFloat(numericValue)
  } else {
    return '0,00 €'
  }
  
  if (isNaN(num)) return '0,00 €'
  
  // Formatear con coma decimal y símbolo € al final
  return `${num.toFixed(2).replace('.', ',')} €`
}

/**
 * Normaliza strings con valores de dinero a número (elimina $, comas y espacios).
 */
export function currencyStringToNumber(value?: string | null): number {
  if (!value) return 0
  const normalized = value.replace(/[^0-9.-]+/g, '')
  const num = parseFloat(normalized)
  return isNaN(num) ? 0 : num
}


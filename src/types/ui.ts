// Tipos para componentes UI

export type BadgeVariant =
  | 'premium'
  | 'pro'
  | 'explorador'
  | 'status-trial'
  | 'status-active'
  | 'status-inactive'
  | 'status-blocked'
  | 'status-suspended'
  | 'status-expired'
  | 'status-payment-error'
  | 'status-cancelled'
  | 'soft-active'
  | 'soft-inactive'
  | 'soft-blocked'

export interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

// Tabla genérica
export interface TableColumn<T> {
  key: keyof T | string
  header: React.ReactNode
  widthClass?: string
  render?: (row: T) => React.ReactNode
  cellClassName?: string
}

export interface TableProps<T> {
  columns: TableColumn<T>[]
  data: T[]
  className?: string
  headerPaddingClass?: string
  headerBgClass?: string
}


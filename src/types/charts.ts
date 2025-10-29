// Tipos para componentes de gráficos

// Line Chart Types
export type LineData = {
  name: string
  [key: string]: string | number
}

export type LineSeries = {
  dataKey: string
  name: string
  color: string
  strokeWidth?: number
}

export type LineChartProps = {
  title: string
  subtitle: string
  data: LineData[]
  series: LineSeries[]
  trend?: string
  summary?: string
  buttonText?: string
  buttonAction?: () => void
}

// Donut Chart Types
export type DonutData = {
  name: string
  value: number
  color: string
  percentage?: string
  users?: number
}

export type TabOption = {
  key: string
  label: string
}

export type DonutChartProps = {
  title: string
  subtitle: string
  data: DonutData[]
  trend: string
  summary?: string
  buttonText?: string
  buttonAction?: () => void
  tabs?: TabOption[]
  activeTab?: string
  onTabChange?: (tabKey: string) => void
  showLegend?: boolean
  initialActiveIndex?: number
}

// Bar Chart Types
export type BarSeries = {
  dataKey: string
  name: string
  color: string
  stackId?: string
  radius?: number
  position?: 'top' | 'bottom' | 'middle'
}

export type BarChartProps = {
  title: string
  subtitle?: string
  data: Array<Record<string, any>>
  series: BarSeries[]
  barRadius?: number
}

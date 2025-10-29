import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface HorizontalBarData {
  name: string
  value: number
  percentage: number
}

interface HorizontalBarChartProps {
  title: string
  subtitle: string
  data: HorizontalBarData[]
  className?: string
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-md border border-neutral-200 bg-white p-3 shadow-md">
        <p className="text-sm font-semibold text-neutral-900">{label}</p>
        <p className="text-sm text-neutral-500">
          <span className="inline-block h-2 w-2 rounded-full mr-2 bg-[var(--color-chart-accent)]"></span>
          Valor:{' '}
          <span className="font-medium text-neutral-900">
            {payload[0].value}
          </span>
        </p>
      </div>
    )
  }
  return null
}

export default function HorizontalBarChart({
  title,
  subtitle,
  data,
  className = '',
}: HorizontalBarChartProps) {
  return (
    <section className={`flex h-full w-full flex-col ${className}`}>
      {/* Encabezado */}
      <header className="mb-4 text-left">
        <h3 className="text-base font-medium leading-[1.3] text-neutral-700">
          {title}
        </h3>
        <p className="text-sm font-medium leading-[1.4] text-neutral-500">
          {subtitle}
        </p>
      </header>

      {/* Gráfica */}
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{
              top: 10,
              right: 20,
              left: 10,
              bottom: 10,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={false}
              stroke="var(--color-neutral-200)"
            />

            {/* Eje X */}
            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'var(--color-neutral-500)' }}
            />

            {/* Eje Y con auto-ajuste */}
            <YAxis
              type="category"
              dataKey="name"
              axisLine={false}
              tickLine={false}
              width={Math.min(
                Math.max(
                  Math.max(...data.map((d) => d.name.length)) * 7, // ancho mínimo en función de caracteres
                  80
                ),
                180 // límite máximo para que no robe demasiado espacio
              )}
              tick={{ fontSize: 12, fill: 'var(--color-neutral-900)' }}
            />

            {/* Tooltip */}
            <Tooltip content={<CustomTooltip />} />

            {/* Barras responsivas */}
            <Bar
              dataKey="value"
              fill="var(--color-chart-accent)"
              radius={[0, 4, 4, 0]}
              barSize={data.length > 6 ? 16 : 24} // ajusta según cantidad de items
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { BarChartProps } from '@/types/charts'

export default function BarChart({
  title,
  subtitle,
  data,
  series,
  barRadius = 8,
}: BarChartProps) {
  return (
    <div className="h-full w-full flex flex-col min-h-0">
      {/* Header */}
      <header className="mb-2 text-left flex-shrink-0">
        <h3 className="text-sm font-semibold text-neutral-900">{title}</h3>
        {subtitle && (
          <p className="text-xs font-medium text-neutral-500">{subtitle}</p>
        )}
      </header>

      {/* Chart */}
      <section className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            data={data}
            margin={{ top: 10, right: 15, left: 5, bottom: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-neutral-200)" />

            {/* Eje X */}
            <XAxis
              dataKey="month"
              tick={{ fill: 'var(--color-neutral-500)', fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: 'var(--color-neutral-200)' }}
            />

            {/* Eje Y */}
            <YAxis
              tick={{ fill: 'var(--color-neutral-500)', fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: 'var(--color-neutral-200)' }}
              width={35}
            />

            {/* Tooltip personalizado */}
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-md border border-gray-200 bg-white p-3 shadow-md">
                      <p className="font-semibold text-gray-900 text-sm mb-2">
                        {label}
                      </p>
                      {payload.map((entry, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-xs"
                        >
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: entry.color }}
                          />
                          <span className="text-gray-600">{entry.name}:</span>
                          <span className="font-medium text-gray-900">
                            {entry.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )
                }
                return null
              }}
            />

            {/* Leyenda */}
            <Legend
              verticalAlign="bottom"
              align="center"
              height={28}
              iconType="rect"
              wrapperStyle={{ fontSize: '10px', color: 'var(--color-neutral-700)' }}
            />

            {/* Barras */}
            {series.map((s) => (
              <Bar
                key={s.dataKey}
                dataKey={s.dataKey}
                name={s.name}
                fill={s.color}
                stackId={s.stackId}
                radius={(() => {
                  const r = s.radius ?? barRadius
                  if (s.position === 'top') return [r, r, 0, 0]
                  if (s.position === 'bottom') return [0, 0, r, r]
                  if (s.position === 'middle') return [0, 0, 0, 0]
                  return [r, r, r, r] // por defecto bordes redondeados completos
                })()}
              />
            ))}
          </RechartsBarChart>
        </ResponsiveContainer>
      </section>
    </div>
  )
}
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { LineChartProps } from '@/types/charts'

export default function LineChart({
  title,
  subtitle,
  data,
  series,
  trend,
  summary,
  buttonText,
  buttonAction,
}: LineChartProps) {
  return (
    <div className="h-full w-full flex flex-col">
      <section
        aria-labelledby="line-chart-title"
        className="flex-1 rounded border border-neutral-200 bg-neutral-50 px-6 py-5"
      >
        {/* Encabezado */}
        <h3
          id="line-chart-title"
          className="mb-1 text-left text-base font-semibold text-neutral-900"
        >
          {title}
        </h3>
        <p className="mb-4 text-left text-xs text-neutral-500">{subtitle}</p>

        {/* Gráfica */}
        <div className="mx-auto mb-4 h-40 min-h-[160px] max-h-56">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart
              data={data}
              margin={{ top: 10, right: 20, left: 10, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-neutral-200)" />

              <XAxis
                dataKey="name"
                stroke="var(--color-neutral-600)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                width={40}
                stroke="var(--color-neutral-600)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={[0, 'dataMax + 50']}
              />

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

              <Legend
                verticalAlign="bottom"
                align="center"
                height={36}
                iconType="rect"
                wrapperStyle={{ fontSize: '12px', color: 'var(--color-neutral-700)' }}
              />

              {series.map((serie) => (
                <Line
                  key={serie.dataKey}
                  type="monotone"
                  dataKey={serie.dataKey}
                  name={serie.name}
                  stroke={serie.color}
                  strokeWidth={serie.strokeWidth || 3}
                  dot={{ fill: serie.color, r: 4 }}
                  activeDot={{ r: 6, stroke: serie.color, strokeWidth: 2 }}
                />
              ))}
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>

        {/* Trend y Summary */}
        <div className="space-y-2">
          {trend && trend !== "+0% vs periodo previo" && (
            <p className={`text-center text-xs ${trend.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>
              {trend} {trend.startsWith('+') ? '▲' : '▼'}
            </p>
          )}
          {summary && (
            <p className="text-center text-xs text-neutral-500">{summary}</p>
          )}
        </div>
      </section>

      {/* Botón opcional */}
      {buttonText && (
        <button
          onClick={buttonAction}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-500 py-3 text-sm font-medium text-white hover:bg-primary-600"
        >
          {buttonText}
          <span className="ms ms-24">download</span>
        </button>
      )}
    </div>
  )
}

import { PieChart, Pie, Cell, ResponsiveContainer, Sector, Legend, Label } from 'recharts'
import { useState } from 'react'
import type { DonutChartProps } from '@/types/charts'

const renderActiveShape = (props: any) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
  } = props

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={(outerRadius ?? 0) + 6}
        outerRadius={(outerRadius ?? 0) + 10}
        fill={fill}
      />
    </g>
  )
}

export default function DonutChart({
  title,
  subtitle,
  data,
  trend,
  summary,
  buttonText,
  buttonAction,
  tabs,
  activeTab,
  onTabChange,
  showLegend = true,
  initialActiveIndex = 0,
  centerText
}: DonutChartProps) {
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex)

  // Calculate percentages dynamically
  const total = data.reduce((sum, entry) => sum + entry.value, 0)
  const dataWithPercentage = data.map(entry => ({
    ...entry,
    percentage: total > 0 ? `${Math.round((entry.value / total) * 100)}%` : '0%'
  }))

  return (
    <div className="w-full h-full flex flex-col">
      {/* Tabs (opcional) - Fuera del contenedor */}
      {tabs && tabs.length > 0 && (
        <div className="flex justify-evenly mb-3 flex-shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onTabChange?.(tab.key)}
              className={`text-sm font-medium transition-colors pb-1 ${activeTab === tab.key
                ? 'border-b-2 border-primary-500 text-primary-500'
                : 'text-neutral-600 hover:text-neutral-900'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Contenedor de la gráfica */}
      <section aria-labelledby="chart-title" className="flex-1 rounded border border-neutral-200 bg-neutral-50 px-4 py-3 flex flex-col min-h-0">
        <h3 id="chart-title" className="mb-2 text-center text-lg font-semibold text-neutral-900 flex-shrink-0">{title}</h3>
        <p className="mb-3 text-center text-sm text-neutral-500 flex-shrink-0">{subtitle}</p>

        {/* Donut Chart */}
        <div className="relative mx-auto flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dataWithPercentage}
                cx="50%"
                cy="50%"
                innerRadius="50%"
                outerRadius="85%"
                paddingAngle={0}
                dataKey="value"
                activeShape={renderActiveShape}
                onMouseEnter={(_, index) => {
                  setActiveIndex(index)
                }}
              >
                {dataWithPercentage.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    style={{ cursor: 'pointer' }}
                  />
                ))}
                <Label
                  value={centerText || dataWithPercentage[activeIndex].percentage}
                  position="center"
                  dy={centerText ? 0 : -8}
                  style={{
                    fontSize: centerText ? '1.25rem' : '1.5rem',
                    fontWeight: 'bold',
                    fill: 'var(--color-neutral-900)',
                  }}
                />
                {!centerText && (
                  <Label
                    value={dataWithPercentage[activeIndex].name}
                    position="center"
                    dy={12}
                    style={{
                      fontSize: '0.75rem',
                      fill: 'var(--color-neutral-500)',
                      textAnchor: 'middle',
                      width: '80%',
                    }}
                  />
                )}
              </Pie>
              {showLegend && (
                <Legend
                  verticalAlign="bottom"
                  align="center"
                  content={({ payload }) => (
                    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-3 flex-shrink-0">
                      {payload?.map((entry, index) => (
                        <div key={`item-${index}`} className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: entry.color }}
                          />
                          <span className="text-sm text-neutral-800">{entry.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                />
              )}
            </PieChart>
          </ResponsiveContainer>

        </div>


        {trend && trend !== "+0% vs periodo previo" && (
          <p className={`text-center text-sm mt-3 flex-shrink-0 ${trend.startsWith('-') ? 'text-red-600' : 'text-emerald-600'}`}>
            {trend} {trend.startsWith('-') ? '▼' : '▲'}
          </p>
        )}

        {/* Summary (opcional) */}
        {summary && (
          <p className="mt-2 text-center text-sm flex-shrink-0 text-neutral-500">{summary}</p>
        )}
      </section>

      {/* Botón fuera del contenedor (opcional) */}
      {buttonText && (
        <div className="mt-2">
          <button
            onClick={buttonAction}
            className="flex w-full items-center justify-center gap-1 rounded-lg bg-primary-500 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-600"
          >
            {buttonText}
            <span className="ms ms-24">arrow_forward</span>
          </button>
        </div>
      )}
    </div>
  )
}

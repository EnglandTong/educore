import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp } from 'lucide-react'

import type { DifficultyCurvePoint } from '@/api/learningPath'
import { cn } from '@/utils/cn'

export interface DifficultyCurveChartProps {
  data: DifficultyCurvePoint[]
  className?: string
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-[var(--radius-lg)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] p-3 shadow-[var(--shadow-lg)]">
      <p className="text-xs font-medium text-[hsl(var(--color-text))]">{label}</p>
      <p className="mt-1 text-sm font-semibold text-[hsl(var(--color-primary))]">
        Difficulty: {payload[0]!.value}
      </p>
    </div>
  )
}

export function DifficultyCurveChart({ data, className }: DifficultyCurveChartProps) {
  if (data.length === 0) {
    return (
      <div className={cn('flex items-center justify-center gap-3 rounded-[var(--radius-xl)] border border-dashed border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] p-6 text-center', className)}>
        <TrendingUp className="h-5 w-5 text-[hsl(var(--color-text-muted))]" />
        <p className="text-sm text-[hsl(var(--color-text-muted))]">
          Add nodes to see the difficulty curve.
        </p>
      </div>
    )
  }

  return (
    <div className={cn('rounded-[var(--radius-xl)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] p-4', className)}>
      <div className="mb-3 flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-[hsl(var(--color-primary))]" />
        <h4 className="text-sm font-semibold text-[hsl(var(--color-text))]">Difficulty curve</h4>
        <span className="text-xs text-[hsl(var(--color-text-muted))]">
          {data.length} nodes
        </span>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
          <XAxis
            dataKey="order"
            tick={{ fontSize: 10, fill: 'hsl(var(--color-text-muted))' }}
            tickLine={false}
            axisLine={{ stroke: 'hsl(var(--color-border))' }}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: 'hsl(var(--color-text-muted))' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="difficulty"
            stroke="hsl(var(--color-primary))"
            strokeWidth={2}
            dot={{ r: 4, fill: 'hsl(var(--color-primary))', strokeWidth: 0 }}
            activeDot={{ r: 6, fill: 'hsl(var(--color-primary))' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

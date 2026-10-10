import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card'
import type { PriorityDistributionPoint } from '../../types/dashboard'
import { AlertCircle } from 'lucide-react'

export interface PriorityBarChartProps {
  data: PriorityDistributionPoint[]
}

export const PriorityBarChart: React.FC<PriorityBarChartProps> = ({ data }) => {
  const total = data.reduce((acc, curr) => acc + curr.count, 0)

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-500" />
          Task Priority Distribution
        </CardTitle>
        <CardDescription>
          Volume of tasks by delivery criticality
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 min-h-[220px] pt-2">
        {total === 0 ? (
          <div className="flex items-center justify-center h-48 text-xs text-slate-400">
            No priority data recorded
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" strokeOpacity={0.2} vertical={false} />
              <XAxis dataKey="priority" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0]?.payload as PriorityDistributionPoint
                    return (
                      <div className="rounded-xl border border-slate-700 bg-slate-900/95 p-2.5 shadow-xl text-xs text-white">
                        <span className="font-semibold" style={{ color: item.color }}>
                          {item.priority}:
                        </span>{' '}
                        {item.count} tasks
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}

import React from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card'
import type { WeeklyProductivityPoint } from '../../types/dashboard'
import { TrendingUp } from 'lucide-react'

export interface ProductivityChartProps {
  data: WeeklyProductivityPoint[]
}

export const ProductivityChart: React.FC<ProductivityChartProps> = ({ data }) => {
  const totalCompletedThisWeek = data.reduce((acc, curr) => acc + curr.completed, 0)
  const totalCreatedThisWeek = data.reduce((acc, curr) => acc + curr.created, 0)

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-500" />
            Weekly Velocity & Throughput
          </CardTitle>
          <CardDescription>
            Completed vs Created tasks over the past 7 days
          </CardDescription>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-500 dark:text-slate-400">
              Completed ({totalCompletedThisWeek})
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <span className="text-slate-500 dark:text-slate-400">
              Created ({totalCreatedThisWeek})
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 min-h-[260px] pt-4">
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#334155"
              strokeOpacity={0.2}
              vertical={false}
            />
            <XAxis
              dataKey="day"
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-xl border border-slate-700 bg-slate-900/95 p-3 shadow-xl backdrop-blur-md text-xs text-white">
                      <p className="font-bold text-slate-300 mb-1">{label}</p>
                      <div className="space-y-1">
                        <p className="text-emerald-400 flex items-center justify-between gap-4">
                          <span>Completed:</span>
                          <span className="font-mono font-bold">
                            {payload[0]?.value}
                          </span>
                        </p>
                        <p className="text-indigo-400 flex items-center justify-between gap-4">
                          <span>Created:</span>
                          <span className="font-mono font-bold">
                            {payload[1]?.value}
                          </span>
                        </p>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Area
              type="monotone"
              dataKey="completed"
              stroke="#10b981"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorCompleted)"
            />
            <Area
              type="monotone"
              dataKey="created"
              stroke="#6366f1"
              strokeWidth={2}
              strokeDasharray="4 4"
              fillOpacity={1}
              fill="url(#colorCreated)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

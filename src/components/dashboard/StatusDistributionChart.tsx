import React from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card'
import type { TaskDistributionPoint } from '../../types/dashboard'
import { PieChart as PieIcon } from 'lucide-react'

export interface StatusDistributionChartProps {
  data: TaskDistributionPoint[]
}

export const StatusDistributionChart: React.FC<StatusDistributionChartProps> = ({ data }) => {
  const totalTasks = data.reduce((acc, curr) => acc + curr.value, 0)

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold flex items-center gap-2">
          <PieIcon className="w-4 h-4 text-indigo-500" />
          Task Status Distribution
        </CardTitle>
        <CardDescription>
          Workflow breakdown across all project pipelines
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between pt-2">
        {totalTasks === 0 ? (
          <div className="flex items-center justify-center h-48 text-xs text-slate-400">
            No active tasks recorded
          </div>
        ) : (
          <>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={68}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0]?.payload as TaskDistributionPoint
                        const percent =
                          totalTasks > 0 ? Math.round((item.value / totalTasks) * 100) : 0
                        return (
                          <div className="rounded-lg border border-slate-700 bg-slate-900/95 p-2 shadow-lg text-xs text-white">
                            <span className="font-semibold" style={{ color: item.color }}>
                              {item.name}:
                            </span>{' '}
                            {item.value} tasks ({percent}%)
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend Grid */}
            <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              {data.map((item) => {
                const percent = totalTasks > 0 ? Math.round((item.value / totalTasks) * 100) : 0
                return (
                  <div key={item.name} className="flex items-center gap-2 text-xs">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-slate-600 dark:text-slate-400 truncate">
                      {item.name}
                    </span>
                    <span className="ml-auto font-mono font-semibold text-slate-900 dark:text-slate-200">
                      {item.value}{' '}
                      <span className="text-[10px] text-slate-400 font-normal">
                        ({percent}%)
                      </span>
                    </span>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

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
import type { ProjectWithStats } from '../../types/project'
import { FolderKanban } from 'lucide-react'

export interface ProjectProgressChartProps {
  projects: ProjectWithStats[]
}

export const ProjectProgressChart: React.FC<ProjectProgressChartProps> = ({ projects }) => {
  const chartData = projects.map((p) => ({
    name: p.name.length > 15 ? p.name.slice(0, 15) + '…' : p.name,
    fullName: p.name,
    progress: p.progressPercentage,
    completed: p.completedTasks,
    total: p.totalTasks,
    color: p.color,
  }))

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold flex items-center gap-2">
          <FolderKanban className="w-4 h-4 text-indigo-500" />
          Project Delivery Progress
        </CardTitle>
        <CardDescription>
          Completion percentage across active projects
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 min-h-[220px] pt-2">
        {projects.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-xs text-slate-400">
            No projects available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" strokeOpacity={0.2} vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0]?.payload
                    return (
                      <div className="rounded-xl border border-slate-700 bg-slate-900/95 p-2.5 shadow-xl text-xs text-white">
                        <p className="font-bold text-slate-200 mb-1">{item.fullName}</p>
                        <p className="text-indigo-400">
                          Progress: <span className="font-mono font-bold">{item.progress}%</span>
                        </p>
                        <p className="text-slate-400 text-[11px]">
                          ({item.completed} of {item.total} tasks done)
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey="progress" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
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

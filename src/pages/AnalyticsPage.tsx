import React from 'react'
import { useDevTrack } from '../hooks/useDevTrack'
import { ProductivityChart } from '../components/dashboard/ProductivityChart'
import { StatusDistributionChart } from '../components/dashboard/StatusDistributionChart'
import { PriorityBarChart } from '../components/analytics/PriorityBarChart'
import { ProjectProgressChart } from '../components/analytics/ProjectProgressChart'
import { Card, CardContent } from '../components/ui/Card'
import type { Task } from '../types/task'
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Zap,
  Flame,
  Award,
} from 'lucide-react'

export const AnalyticsPage: React.FC = () => {
  const {
    metrics,
    weeklyProductivity,
    statusDistribution,
    priorityDistribution,
    projectsWithStats,
    tasks,
  } = useDevTrack()

  // Calculate engineering efficiency metrics with explicit types
  const totalEstimatedHours = tasks.reduce(
    (sum: number, t: Task) => sum + (t.estimatedHours || 0),
    0
  )
  const completedEstimatedHours = tasks
    .filter((t: Task) => t.status === 'done')
    .reduce((sum: number, t: Task) => sum + (t.estimatedHours || 0), 0)

  const urgentOrHighCount = tasks.filter(
    (t: Task) => t.priority === 'urgent' || t.priority === 'high'
  ).length

  const overdueRatio =
    tasks.length > 0 ? Math.round((metrics.overdueTasks / tasks.length) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
          Productivity & Velocity Analytics
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Deep-dive telemetry into team sprint velocity, delivery bottlenecks, and project completion curves.
        </p>
      </div>

      {/* Summary KPI Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card className="p-4">
          <CardContent className="p-0">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Completed</span>
            </div>
            <div className="text-xl font-bold font-mono text-slate-900 dark:text-white">
              {metrics.completedTasks}
            </div>
            <span className="text-[10px] text-slate-400">
              {metrics.completionPercentage}% of total
            </span>
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardContent className="p-0">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mb-1">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Pending</span>
            </div>
            <div className="text-xl font-bold font-mono text-slate-900 dark:text-white">
              {metrics.pendingTasks}
            </div>
            <span className="text-[10px] text-slate-400">active items</span>
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardContent className="p-0">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mb-1">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <span>Overdue Rate</span>
            </div>
            <div className="text-xl font-bold font-mono text-rose-500">
              {overdueRatio}%
            </div>
            <span className="text-[10px] text-slate-400">
              {metrics.overdueTasks} late tasks
            </span>
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardContent className="p-0">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mb-1">
              <Flame className="w-4 h-4 text-orange-500" />
              <span>High / Urgent</span>
            </div>
            <div className="text-xl font-bold font-mono text-slate-900 dark:text-white">
              {urgentOrHighCount}
            </div>
            <span className="text-[10px] text-slate-400">critical tasks</span>
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardContent className="p-0">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mb-1">
              <Zap className="w-4 h-4 text-indigo-500" />
              <span>Total Est. Hours</span>
            </div>
            <div className="text-xl font-bold font-mono text-slate-900 dark:text-white">
              {totalEstimatedHours}h
            </div>
            <span className="text-[10px] text-slate-400">
              {completedEstimatedHours}h completed
            </span>
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardContent className="p-0">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mb-1">
              <Award className="w-4 h-4 text-sky-500" />
              <span>Health Score</span>
            </div>
            <div className="text-xl font-bold font-mono text-emerald-500">
              {Math.max(20, 100 - overdueRatio * 2)}/100
            </div>
            <span className="text-[10px] text-slate-400">sprint health</span>
          </CardContent>
        </Card>
      </div>

      {/* Row 1: Weekly Velocity & Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProductivityChart data={weeklyProductivity} />
        </div>
        <div>
          <StatusDistributionChart data={statusDistribution} />
        </div>
      </div>

      {/* Row 2: Priority Breakdown & Project Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PriorityBarChart data={priorityDistribution} />
        <ProjectProgressChart projects={projectsWithStats} />
      </div>
    </div>
  )
}

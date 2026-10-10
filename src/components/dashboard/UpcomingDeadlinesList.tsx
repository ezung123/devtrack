import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card'
import { PriorityBadge } from '../ui/Badge'
import { formatDate, getDaysRemaining, isDateOverdue } from '../../utils/dateUtils'
import { CalendarClock, ArrowRight, Check } from 'lucide-react'
import type { Task } from '../../types/task'
import type { Project } from '../../types/project'
import { useDevTrack } from '../../context/DevTrackContext'

export interface UpcomingDeadlinesListProps {
  tasks: Task[]
  projects: Project[]
}

export const UpcomingDeadlinesList: React.FC<UpcomingDeadlinesListProps> = ({
  tasks,
  projects,
}) => {
  const { updateTaskStatus } = useDevTrack()

  // Filter pending tasks and sort chronologically by dueDate
  const pendingTasks = tasks
    .filter((t) => t.status !== 'done')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5)

  const getProjectName = (projectId: string) => {
    return projects.find((p) => p.id === projectId)?.name || 'Project'
  }

  const getDueLabel = (dueDate: string) => {
    const overdue = isDateOverdue(dueDate)
    if (overdue) {
      return <span className="text-rose-500 font-semibold">Overdue</span>
    }
    const days = getDaysRemaining(dueDate)
    if (days === 0) {
      return <span className="text-amber-500 font-semibold">Due today</span>
    }
    if (days === 1) {
      return <span className="text-sky-500 font-medium">Due tomorrow</span>
    }
    return <span className="text-slate-400">in {days} days</span>
  }

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <CalendarClock className="w-4 h-4 text-amber-500" />
            Upcoming Deadlines
          </CardTitle>
          <CardDescription>
            Tasks requiring immediate focus & delivery
          </CardDescription>
        </div>
        <Link
          to="/tasks"
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
        >
          View all
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </CardHeader>

      <CardContent className="flex-1 space-y-3 pt-2">
        {pendingTasks.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            No pending task deadlines. Great job!
          </div>
        ) : (
          pendingTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 hover:border-slate-300 dark:hover:border-slate-700 transition-all text-xs"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <button
                  onClick={() => updateTaskStatus(task.id, 'done')}
                  className="w-4 h-4 rounded-md border border-slate-300 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-500/20 flex items-center justify-center text-transparent hover:text-emerald-500 transition-colors flex-shrink-0"
                  title="Mark as complete"
                  aria-label="Mark task as complete"
                >
                  <Check className="w-3 h-3" />
                </button>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {task.title}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {getProjectName(task.projectId)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <PriorityBadge priority={task.priority} size="sm" />
                <div className="text-[11px] text-right font-mono">
                  {getDueLabel(task.dueDate)}
                  <div className="text-[10px] text-slate-400">{formatDate(task.dueDate)}</div>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}

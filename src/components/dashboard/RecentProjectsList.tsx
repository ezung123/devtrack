import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card'
import { ProgressBar } from '../ui/ProgressBar'
import { ProjectStatusBadge, PriorityBadge } from '../ui/Badge'
import { formatDate } from '../../utils/dateUtils'
import { ArrowRight, FolderKanban } from 'lucide-react'
import type { ProjectWithStats } from '../../types/project'

export interface RecentProjectsListProps {
  projects: ProjectWithStats[]
  onOpenCreateProject?: () => void
}

export const RecentProjectsList: React.FC<RecentProjectsListProps> = ({ projects }) => {
  const displayProjects = projects.slice(0, 4)

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <FolderKanban className="w-4 h-4 text-indigo-500" />
            Recent Projects
          </CardTitle>
          <CardDescription>
            Active engineering projects and delivery status
          </CardDescription>
        </div>
        <Link
          to="/projects"
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
        >
          View all
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </CardHeader>

      <CardContent className="flex-1 space-y-3.5 pt-2">
        {displayProjects.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            No projects found. Create your first project to get started.
          </div>
        ) : (
          displayProjects.map((p) => (
            <div
              key={p.id}
              className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                    {p.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {p.description || 'No description provided'}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <PriorityBadge priority={p.priority} size="sm" />
                  <ProjectStatusBadge status={p.status} size="sm" />
                </div>
              </div>

              {/* Progress and Deadlines */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-500 dark:text-slate-400">
                    {p.completedTasks} / {p.totalTasks} tasks completed
                  </span>
                  <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                    {p.progressPercentage}%
                  </span>
                </div>
                <ProgressBar progress={p.progressPercentage} size="sm" />
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
                <span>Due: {formatDate(p.deadline)}</span>
                {p.isOverdue && (
                  <span className="text-rose-500 font-semibold uppercase tracking-wider">
                    Overdue
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}

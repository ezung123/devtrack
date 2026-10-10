import React from 'react'
import { cn } from '../../utils/cn'
import type { TaskPriority, TaskStatus } from '../../types/task'
import type { ProjectPriority, ProjectStatus } from '../../types/project'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'dot'
  size?: 'sm' | 'md'
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}) => {
  const sizeStyles = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
  const variantStyles =
    variant === 'outline'
      ? 'border bg-transparent'
      : variant === 'dot'
      ? 'bg-transparent border-none'
      : ''

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full transition-colors whitespace-nowrap',
        sizeStyles,
        variantStyles,
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export const PriorityBadge: React.FC<{
  priority: TaskPriority | ProjectPriority
  size?: 'sm' | 'md'
  showIcon?: boolean
}> = ({ priority, size = 'sm' }) => {
  const styles: Record<TaskPriority, string> = {
    urgent:
      'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-semibold',
    high: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-semibold',
    medium: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 font-medium',
    low: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20 font-medium',
  }

  const labels: Record<TaskPriority, string> = {
    urgent: 'Urgent',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
  }

  return (
    <Badge size={size} className={styles[priority]}>
      <span
        className={cn(
          'w-1.5 h-1.5 rounded-full mr-1.5',
          priority === 'urgent' && 'bg-rose-500',
          priority === 'high' && 'bg-amber-500',
          priority === 'medium' && 'bg-sky-500',
          priority === 'low' && 'bg-slate-400'
        )}
      />
      {labels[priority]}
    </Badge>
  )
}

export const StatusBadge: React.FC<{
  status: TaskStatus
  size?: 'sm' | 'md'
}> = ({ status, size = 'sm' }) => {
  const styles: Record<TaskStatus, string> = {
    todo: 'bg-slate-500/10 text-slate-600 dark:text-slate-300 border border-slate-500/20',
    in_progress: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20',
    in_review: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
    done: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
  }

  const labels: Record<TaskStatus, string> = {
    todo: 'To Do',
    in_progress: 'In Progress',
    in_review: 'In Review',
    done: 'Done',
  }

  return (
    <Badge size={size} className={styles[status]}>
      {labels[status]}
    </Badge>
  )
}

export const ProjectStatusBadge: React.FC<{
  status: ProjectStatus
  size?: 'sm' | 'md'
}> = ({ status, size = 'sm' }) => {
  const styles: Record<ProjectStatus, string> = {
    planning: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20',
    active: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
    on_hold: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
    completed: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20',
    cancelled: 'bg-slate-500/10 text-slate-500 dark:text-slate-400 border border-slate-500/20',
  }

  const labels: Record<ProjectStatus, string> = {
    planning: 'Planning',
    active: 'Active',
    on_hold: 'On Hold',
    completed: 'Completed',
    cancelled: 'Cancelled',
  }

  return (
    <Badge size={size} className={styles[status]}>
      {labels[status]}
    </Badge>
  )
}

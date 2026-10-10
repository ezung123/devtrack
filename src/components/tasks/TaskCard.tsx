import React, { useState } from 'react'
import { Card, CardContent } from '../ui/Card'
import { PriorityBadge } from '../ui/Badge'
import { ConfirmDialog } from '../ui/ConfirmDialog'
import { formatDate, isDateOverdue, getDaysRemaining } from '../../utils/dateUtils'
import {
  Calendar,
  Check,
  Clock,
  Edit2,
  Trash2,
  AlertCircle,
  Folder,
  Tag,
} from 'lucide-react'
import type { Task, TaskStatus } from '../../types/task'
import { useDevTrack } from '../../context/DevTrackContext'
import { cn } from '../../utils/cn'

export interface TaskCardProps {
  task: Task
  showProjectBadge?: boolean
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, showProjectBadge = true }) => {
  const { projects, updateTaskStatus, deleteTask, openEditTaskModal } = useDevTrack()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const project = projects.find((p) => p.id === task.projectId)
  const isOverdue = isDateOverdue(task.dueDate, task.status)
  const daysLeft = getDaysRemaining(task.dueDate)
  const isDone = task.status === 'done'

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateTaskStatus(task.id, e.target.value as TaskStatus)
  }

  const toggleComplete = () => {
    updateTaskStatus(task.id, isDone ? 'todo' : 'done')
  }

  return (
    <>
      <Card
        className={cn(
          'transition-all duration-200 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700',
          isDone && 'opacity-75 bg-slate-50/50 dark:bg-slate-900/40'
        )}
      >
        <CardContent className="p-4 space-y-3">
          {/* Top Row: Checkbox, Title, and Priority */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5 min-w-0">
              <button
                onClick={toggleComplete}
                className={cn(
                  'mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-all flex-shrink-0',
                  isDone
                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
                    : 'border-slate-300 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-500/10 text-transparent'
                )}
                title={isDone ? 'Mark as incomplete' : 'Mark as done'}
                aria-label={`Toggle task completion for ${task.title}`}
              >
                <Check className="w-3 h-3 stroke-[3]" />
              </button>

              <div className="min-w-0">
                <h4
                  className={cn(
                    'text-sm font-semibold text-slate-900 dark:text-slate-100 transition-all line-clamp-2',
                    isDone && 'line-through text-slate-400 dark:text-slate-500'
                  )}
                >
                  {task.title}
                </h4>

                {showProjectBadge && project && (
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                    <Folder className="w-3 h-3 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{project.name}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-shrink-0">
              <PriorityBadge priority={task.priority} size="sm" />
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed pl-6">
              {task.description}
            </p>
          )}

          {/* Tags */}
          {task.tags.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap pl-6">
              <Tag className="w-3 h-3 text-slate-400 flex-shrink-0" />
              {task.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Bottom Bar: Timeline, Hours, Status Picker, and Actions */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
            <div className="flex items-center gap-3">
              {/* Due Date */}
              <div
                className={cn(
                  'flex items-center gap-1 text-[11px] font-mono',
                  isOverdue
                    ? 'text-rose-500 font-semibold'
                    : 'text-slate-500 dark:text-slate-400'
                )}
              >
                {isOverdue ? (
                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                ) : (
                  <Calendar className="w-3 h-3 flex-shrink-0" />
                )}
                <span>{formatDate(task.dueDate)}</span>
                {isOverdue && <span className="uppercase text-[9px]">(Overdue)</span>}
                {!isOverdue && !isDone && daysLeft === 0 && (
                  <span className="text-amber-500 font-sans text-[10px]">(Today)</span>
                )}
              </div>

              {/* Estimated Hours */}
              {task.estimatedHours !== null && (
                <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                  <Clock className="w-3 h-3" />
                  <span>{task.estimatedHours}h</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Status Selector */}
              <div className="relative">
                <select
                  value={task.status}
                  onChange={handleStatusChange}
                  className="text-[11px] py-1 pl-2 pr-6 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  aria-label="Change status"
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="in_review">In Review</option>
                  <option value="done">Done</option>
                </select>
              </div>

              {/* Action Buttons */}
              <button
                onClick={() => openEditTaskModal(task)}
                className="p-1 rounded text-slate-400 hover:text-indigo-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Edit task"
                aria-label="Edit task"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsDeleteDialogOpen(true)}
                className="p-1 rounded text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                title="Delete task"
                aria-label="Delete task"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => deleteTask(task.id)}
        title="Delete Task?"
        message={`Are you sure you want to permanently delete "${task.title}"?`}
        confirmText="Delete Task"
        variant="danger"
      />
    </>
  )
}

import React from 'react'
import { PriorityBadge } from '../ui/Badge'
import { formatDate, isDateOverdue } from '../../utils/dateUtils'
import {
  Calendar,
  Clock,
  Edit2,
  Trash2,
  AlertCircle,
  Folder,
  ArrowRight,
  GripVertical,
} from 'lucide-react'
import type { Task, TaskStatus } from '../../types/task'
import type { Project } from '../../types/project'
import { useDevTrack } from '../../context/DevTrackContext'
import { cn } from '../../utils/cn'

export interface KanbanCardProps {
  task: Task
  project?: Project
  onDragStart: (e: React.DragEvent, taskId: string) => void
  onDeleteRequest: (task: Task) => void
}

const NEXT_STATUS: Record<TaskStatus, TaskStatus | null> = {
  todo: 'in_progress',
  in_progress: 'in_review',
  in_review: 'done',
  done: null,
}

const PREV_STATUS: Record<TaskStatus, TaskStatus | null> = {
  todo: null,
  in_progress: 'todo',
  in_review: 'in_progress',
  done: 'in_review',
}

export const KanbanCard: React.FC<KanbanCardProps> = ({
  task,
  project,
  onDragStart,
  onDeleteRequest,
}) => {
  const { updateTaskStatus, openEditTaskModal } = useDevTrack()
  const isOverdue = isDateOverdue(task.dueDate, task.status)
  const isDone = task.status === 'done'

  const next = NEXT_STATUS[task.status]
  const prev = PREV_STATUS[task.status]

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      className={cn(
        'group p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:shadow-md transition-all cursor-grab active:cursor-grabbing select-none',
        isDone && 'opacity-80'
      )}
    >
      {/* Top Row: Grip, Priority, and Edit/Delete */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          <GripVertical className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-slate-400" />
          <PriorityBadge priority={task.priority} size="sm" />
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => openEditTaskModal(task)}
            className="p-1 rounded text-slate-400 hover:text-indigo-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Edit task"
            aria-label="Edit task"
          >
            <Edit2 className="w-3 h-3" />
          </button>
          <button
            onClick={() => onDeleteRequest(task)}
            className="p-1 rounded text-slate-400 hover:text-rose-500 hover:bg-rose-500/10"
            title="Delete task"
            aria-label="Delete task"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Task Title */}
      <h4
        className={cn(
          'text-xs font-semibold text-slate-900 dark:text-slate-100 mb-1 leading-snug',
          isDone && 'line-through text-slate-400 dark:text-slate-500'
        )}
      >
        {task.title}
      </h4>

      {/* Project Pill */}
      {project && (
        <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-2">
          <Folder className="w-3 h-3 text-slate-400 flex-shrink-0" />
          <span className="truncate">{project.name}</span>
        </div>
      )}

      {/* Footer Info: Due Date, Hours, and Accessible Move Action */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px]">
        <div
          className={cn(
            'flex items-center gap-1 font-mono',
            isOverdue
              ? 'text-rose-500 font-semibold'
              : 'text-slate-500 dark:text-slate-400'
          )}
        >
          {isOverdue ? (
            <AlertCircle className="w-3 h-3 text-rose-500" />
          ) : (
            <Calendar className="w-3 h-3" />
          )}
          <span>{formatDate(task.dueDate)}</span>
        </div>

        {task.estimatedHours !== null && (
          <div className="flex items-center gap-0.5 text-slate-400 font-mono">
            <Clock className="w-3 h-3" />
            <span>{task.estimatedHours}h</span>
          </div>
        )}
      </div>

      {/* Quick Move Buttons (Keyboard & Mobile Accessibility) */}
      <div className="flex items-center justify-between gap-1 mt-2.5 pt-2 border-t border-dashed border-slate-100 dark:border-slate-800">
        {prev ? (
          <button
            onClick={() => updateTaskStatus(task.id, prev)}
            className="text-[10px] text-slate-500 hover:text-indigo-500 hover:underline px-1 py-0.5"
            title={`Move back to ${prev.replace('_', ' ')}`}
          >
            ← {prev.replace('_', ' ')}
          </button>
        ) : (
          <span />
        )}

        {next && (
          <button
            onClick={() => updateTaskStatus(task.id, next)}
            className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5 px-1 py-0.5"
            title={`Move forward to ${next.replace('_', ' ')}`}
          >
            {next.replace('_', ' ')}
            <ArrowRight className="w-2.5 h-2.5" />
          </button>
        )}
      </div>
    </div>
  )
}

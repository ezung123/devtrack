import React, { useState } from 'react'
import { PriorityBadge } from '../ui/Badge'
import { formatDate, isDateOverdue } from '../../utils/dateUtils'
import { Check, Edit2, Trash2, AlertCircle } from 'lucide-react'
import type { Task, TaskStatus } from '../../types/task'
import type { Project } from '../../types/project'
import { useDevTrack } from '../../context/DevTrackContext'
import { ConfirmDialog } from '../ui/ConfirmDialog'
import { cn } from '../../utils/cn'

export interface TaskTableProps {
  tasks: Task[]
  projects: Project[]
}

export const TaskTable: React.FC<TaskTableProps> = ({ tasks, projects }) => {
  const { updateTaskStatus, deleteTask, openEditTaskModal } = useDevTrack()
  const [deletingTask, setDeletingTask] = useState<Task | null>(null)

  const getProject = (projectId: string) => {
    return projects.find((p) => p.id === projectId)
  }

  return (
    <>
      <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-950/50 text-slate-500 uppercase tracking-wider font-semibold">
              <th className="py-3 px-4 w-10">Done</th>
              <th className="py-3 px-4 min-w-[200px]">Task Title</th>
              <th className="py-3 px-4">Project</th>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Due Date</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {tasks.map((task) => {
              const project = getProject(task.projectId)
              const isOverdue = isDateOverdue(task.dueDate, task.status)
              const isDone = task.status === 'done'

              return (
                <tr
                  key={task.id}
                  className={cn(
                    'hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors',
                    isDone && 'opacity-65'
                  )}
                >
                  {/* Done Checkbox */}
                  <td className="py-3 px-4">
                    <button
                      onClick={() =>
                        updateTaskStatus(task.id, isDone ? 'todo' : 'done')
                      }
                      className={cn(
                        'w-4 h-4 rounded border flex items-center justify-center transition-all',
                        isDone
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'border-slate-300 dark:border-slate-700 hover:border-emerald-500 text-transparent'
                      )}
                      aria-label="Toggle task complete"
                    >
                      <Check className="w-3 h-3 stroke-[3]" />
                    </button>
                  </td>

                  {/* Title */}
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">
                      <span className={isDone ? 'line-through text-slate-400' : ''}>
                        {task.title}
                      </span>
                    </div>
                    {task.description && (
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {task.description}
                      </p>
                    )}
                  </td>

                  {/* Project */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    {project ? (
                      <span className="inline-flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: project.color }}
                        />
                        {project.name}
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>

                  {/* Priority */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <PriorityBadge priority={task.priority} size="sm" />
                  </td>

                  {/* Status Dropdown */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <select
                      value={task.status}
                      onChange={(e) =>
                        updateTaskStatus(task.id, e.target.value as TaskStatus)
                      }
                      className="text-[11px] py-1 px-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
                      aria-label="Change status"
                    >
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="in_review">In Review</option>
                      <option value="done">Done</option>
                    </select>
                  </td>

                  {/* Due Date */}
                  <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px]">
                    <div
                      className={cn(
                        'flex items-center gap-1',
                        isOverdue
                          ? 'text-rose-500 font-semibold'
                          : 'text-slate-600 dark:text-slate-400'
                      )}
                    >
                      {isOverdue && <AlertCircle className="w-3 h-3 text-rose-500" />}
                      <span>{formatDate(task.dueDate)}</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEditTaskModal(task)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Edit task"
                        aria-label="Edit task"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingTask(task)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                        title="Delete task"
                        aria-label="Delete task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        isOpen={Boolean(deletingTask)}
        onClose={() => setDeletingTask(null)}
        onConfirm={() => {
          if (deletingTask) {
            deleteTask(deletingTask.id)
            setDeletingTask(null)
          }
        }}
        title="Delete Task?"
        message={`Are you sure you want to permanently delete "${deletingTask?.title}"?`}
        confirmText="Delete Task"
        variant="danger"
      />
    </>
  )
}

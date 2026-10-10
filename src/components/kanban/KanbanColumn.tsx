import React, { useState } from 'react'
import { KanbanCard } from './KanbanCard'
import { Plus } from 'lucide-react'
import type { Task, TaskStatus } from '../../types/task'
import type { Project } from '../../types/project'
import { cn } from '../../utils/cn'

export interface KanbanColumnProps {
  status: TaskStatus
  title: string
  color: string
  tasks: Task[]
  projects: Project[]
  onDropTask: (taskId: string, targetStatus: TaskStatus) => void
  onAddTask: (status: TaskStatus) => void
  onDeleteRequest: (task: Task) => void
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  status,
  title,
  color,
  tasks,
  projects,
  onDropTask,
  onAddTask,
  onDeleteRequest,
}) => {
  const [isOver, setIsOver] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (!isOver) setIsOver(true)
  }

  const handleDragLeave = () => {
    setIsOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsOver(false)
    const taskId = e.dataTransfer.getData('text/plain')
    if (taskId) {
      onDropTask(taskId, status)
    }
  }

  const handleCardDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId)
    e.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'flex flex-col flex-1 min-w-[280px] max-w-sm rounded-2xl border p-4 bg-slate-100/60 dark:bg-slate-900/40 transition-all duration-200',
        isOver
          ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20 ring-2 ring-indigo-500/20'
          : 'border-slate-200/80 dark:border-slate-800/80'
      )}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            {title}
          </h3>
          <span className="text-[11px] px-2 py-0.5 rounded-full font-mono font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
            {tasks.length}
          </span>
        </div>

        <button
          onClick={() => onAddTask(status)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-500 hover:bg-white dark:hover:bg-slate-800 transition-colors"
          title={`Add task to ${title}`}
          aria-label={`Add task to ${title}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Droppable Card List */}
      <div className="flex-1 space-y-3 min-h-[400px]">
        {tasks.length === 0 ? (
          <div
            className={cn(
              'h-32 border-2 border-dashed rounded-xl flex items-center justify-center text-xs transition-colors',
              isOver
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                : 'border-slate-200 dark:border-slate-800 text-slate-400'
            )}
          >
            {isOver ? 'Drop here' : 'Drop task here'}
          </div>
        ) : (
          tasks.map((task) => {
            const project = projects.find((p) => p.id === task.projectId)
            return (
              <KanbanCard
                key={task.id}
                task={task}
                project={project}
                onDragStart={handleCardDragStart}
                onDeleteRequest={onDeleteRequest}
              />
            )
          })
        )}
      </div>
    </div>
  )
}

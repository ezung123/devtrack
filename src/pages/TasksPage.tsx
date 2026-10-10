import React, { useState, useMemo } from 'react'
import { useDevTrack } from '../hooks/useDevTrack'
import { TaskCard } from '../components/tasks/TaskCard'
import { TaskTable } from '../components/tasks/TaskTable'
import { TaskFilterBar } from '../components/tasks/TaskFilterBar'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { Plus, LayoutGrid, Table as TableIcon, CheckSquare } from 'lucide-react'
import type { TaskFilterState } from '../types/filter'
import type { Task, TaskPriority } from '../types/task'
import { isDateOverdue } from '../utils/dateUtils'

const DEFAULT_FILTER: TaskFilterState = {
  searchQuery: '',
  status: 'all',
  priority: 'all',
  projectId: 'all',
  overdueOnly: false,
  sortBy: 'dueDate',
  sortOrder: 'asc',
}

const PRIORITY_ORDER: Record<TaskPriority, number> = {
  urgent: 4,
  high: 3,
  medium: 2,
  low: 1,
}

export const TasksPage: React.FC = () => {
  const { tasks, projects, openCreateTaskModal, searchQuery: globalSearch } = useDevTrack()
  const [filter, setFilter] = useState<TaskFilterState>(DEFAULT_FILTER)
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')

  const effectiveSearch = filter.searchQuery || globalSearch

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((t: Task) => {
        if (filter.projectId !== 'all' && t.projectId !== filter.projectId) return false
        if (filter.status !== 'all' && t.status !== filter.status) return false
        if (filter.priority !== 'all' && t.priority !== filter.priority) return false
        if (filter.overdueOnly && !isDateOverdue(t.dueDate, t.status)) return false

        if (effectiveSearch.trim()) {
          const q = effectiveSearch.toLowerCase()
          const matchesTitle = t.title.toLowerCase().includes(q)
          const matchesDesc = t.description.toLowerCase().includes(q)
          const matchesTag = t.tags.some((tag: string) => tag.toLowerCase().includes(q))
          if (!matchesTitle && !matchesDesc && !matchesTag) return false
        }
        return true
      })
      .sort((a: Task, b: Task) => {
        let valA: string | number = a.dueDate
        let valB: string | number = b.dueDate

        if (filter.sortBy === 'dueDate') {
          valA = new Date(a.dueDate).getTime()
          valB = new Date(b.dueDate).getTime()
        } else if (filter.sortBy === 'priority') {
          valA = PRIORITY_ORDER[a.priority]
          valB = PRIORITY_ORDER[b.priority]
        } else if (filter.sortBy === 'createdAt') {
          valA = new Date(a.createdAt).getTime()
          valB = new Date(b.createdAt).getTime()
        } else if (filter.sortBy === 'title') {
          valA = a.title.toLowerCase()
          valB = b.title.toLowerCase()
        }

        if (valA < valB) return filter.sortOrder === 'asc' ? -1 : 1
        if (valA > valB) return filter.sortOrder === 'asc' ? 1 : -1
        return 0
      })
  }, [tasks, filter, effectiveSearch])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 flex items-center gap-2">
            Tasks
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {filteredTasks.length}
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your daily tasks, track due dates, set priorities, and log hours.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Grid vs Table View Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-slate-200/60 dark:bg-slate-800 border border-slate-300/50 dark:border-slate-700/50">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title="Card grid view"
              aria-label="Card grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title="Table view"
              aria-label="Table view"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>

          <Button
            size="sm"
            onClick={() => openCreateTaskModal()}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            New Task
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <TaskFilterBar
        filter={{ ...filter, searchQuery: effectiveSearch }}
        onChange={setFilter}
        onReset={() => setFilter(DEFAULT_FILTER)}
        projects={projects}
      />

      {/* Tasks Render (Grid or Table) */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          icon={<CheckSquare className="w-8 h-8 text-indigo-500" />}
          title="No tasks found matching criteria"
          description="Adjust your search, clear active filters, or add a new task to your pipeline."
          actionLabel="Create New Task"
          onAction={() => openCreateTaskModal()}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task: Task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <TaskTable tasks={filteredTasks} projects={projects} />
      )}
    </div>
  )
}

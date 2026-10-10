import React from 'react'
import { SearchInput } from '../ui/SearchInput'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'
import { ArrowUpDown, RotateCcw, AlertCircle } from 'lucide-react'
import type { TaskFilterState, TaskSortField } from '../../types/filter'
import type { TaskPriority, TaskStatus } from '../../types/task'
import type { Project } from '../../types/project'

export interface TaskFilterBarProps {
  filter: TaskFilterState
  onChange: (filter: TaskFilterState) => void
  onReset: () => void
  projects: Project[]
}

export const TaskFilterBar: React.FC<TaskFilterBarProps> = ({
  filter,
  onChange,
  onReset,
  projects,
}) => {
  const toggleSortOrder = () => {
    onChange({
      ...filter,
      sortOrder: filter.sortOrder === 'asc' ? 'desc' : 'asc',
    })
  }

  const isFiltered =
    filter.searchQuery !== '' ||
    filter.status !== 'all' ||
    filter.priority !== 'all' ||
    filter.projectId !== 'all' ||
    filter.overdueOnly ||
    filter.sortBy !== 'dueDate'

  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm">
      {/* Search Input */}
      <SearchInput
        value={filter.searchQuery}
        onChange={(val) => onChange({ ...filter, searchQuery: val })}
        placeholder="Filter tasks by title or tag..."
        className="max-w-md w-full"
      />

      {/* Filter Controls */}
      <div className="flex items-center gap-2 flex-wrap flex-1 lg:justify-end">
        {/* Project Selector */}
        <div className="min-w-[130px]">
          <Select
            value={filter.projectId}
            onChange={(e) => onChange({ ...filter, projectId: e.target.value })}
            className="py-1.5 text-xs"
          >
            <option value="all">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </Select>
        </div>

        {/* Status */}
        <div className="min-w-[110px]">
          <Select
            value={filter.status}
            onChange={(e) =>
              onChange({ ...filter, status: e.target.value as TaskStatus | 'all' })
            }
            className="py-1.5 text-xs"
          >
            <option value="all">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="in_review">In Review</option>
            <option value="done">Done</option>
          </Select>
        </div>

        {/* Priority */}
        <div className="min-w-[110px]">
          <Select
            value={filter.priority}
            onChange={(e) =>
              onChange({
                ...filter,
                priority: e.target.value as TaskPriority | 'all',
              })
            }
            className="py-1.5 text-xs"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </Select>
        </div>

        {/* Overdue Only Filter */}
        <button
          onClick={() => onChange({ ...filter, overdueOnly: !filter.overdueOnly })}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
            filter.overdueOnly
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400 font-semibold'
              : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          aria-label="Toggle overdue only"
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Overdue</span>
        </button>

        {/* Sort Field */}
        <div className="min-w-[120px]">
          <Select
            value={filter.sortBy}
            onChange={(e) =>
              onChange({ ...filter, sortBy: e.target.value as TaskSortField })
            }
            className="py-1.5 text-xs"
          >
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="createdAt">Created Date</option>
            <option value="title">Title</option>
          </Select>
        </div>

        {/* Sort Direction Toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={toggleSortOrder}
          className="h-8 px-2.5 text-xs"
          title={`Sorting ${filter.sortOrder.toUpperCase()}`}
          aria-label="Toggle sort order"
        >
          <ArrowUpDown className="w-3.5 h-3.5" />
        </Button>

        {/* Reset */}
        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-8 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Reset
          </Button>
        )}
      </div>
    </div>
  )
}

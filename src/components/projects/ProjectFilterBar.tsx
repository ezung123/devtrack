import React from 'react'
import { SearchInput } from '../ui/SearchInput'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'
import { ArrowUpDown, RotateCcw } from 'lucide-react'
import type {
  ProjectFilterState,
  ProjectSortField,
} from '../../types/filter'
import type { ProjectPriority, ProjectStatus } from '../../types/project'

export interface ProjectFilterBarProps {
  filter: ProjectFilterState
  onChange: (filter: ProjectFilterState) => void
  onReset: () => void
}

export const ProjectFilterBar: React.FC<ProjectFilterBarProps> = ({
  filter,
  onChange,
  onReset,
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
    filter.sortBy !== 'createdAt'

  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm">
      {/* Search Input */}
      <SearchInput
        value={filter.searchQuery}
        onChange={(val) => onChange({ ...filter, searchQuery: val })}
        placeholder="Filter projects by title, description or tag..."
        className="max-w-md w-full"
      />

      {/* Filter Controls */}
      <div className="flex items-center gap-2 flex-wrap flex-1 lg:justify-end">
        {/* Status */}
        <div className="min-w-[120px]">
          <Select
            value={filter.status}
            onChange={(e) =>
              onChange({ ...filter, status: e.target.value as ProjectStatus | 'all' })
            }
            className="py-1.5 text-xs"
          >
            <option value="all">All Statuses</option>
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="on_hold">On Hold</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </Select>
        </div>

        {/* Priority */}
        <div className="min-w-[120px]">
          <Select
            value={filter.priority}
            onChange={(e) =>
              onChange({
                ...filter,
                priority: e.target.value as ProjectPriority | 'all',
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

        {/* Sort Field */}
        <div className="min-w-[130px]">
          <Select
            value={filter.sortBy}
            onChange={(e) =>
              onChange({ ...filter, sortBy: e.target.value as ProjectSortField })
            }
            className="py-1.5 text-xs"
          >
            <option value="createdAt">Created Date</option>
            <option value="name">Project Name</option>
            <option value="deadline">Target Deadline</option>
            <option value="priority">Priority Level</option>
            <option value="progress">Progress %</option>
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

        {/* Reset Filter Button */}
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

import type { ProjectPriority, ProjectStatus } from './project'
import type { TaskPriority, TaskStatus } from './task'

export type SortOrder = 'asc' | 'desc'

export type ProjectSortField = 'name' | 'deadline' | 'priority' | 'progress' | 'createdAt'

export interface ProjectFilterState {
  searchQuery: string
  status: ProjectStatus | 'all'
  priority: ProjectPriority | 'all'
  sortBy: ProjectSortField
  sortOrder: SortOrder
}

export type TaskSortField = 'dueDate' | 'priority' | 'createdAt' | 'title'

export interface TaskFilterState {
  searchQuery: string
  status: TaskStatus | 'all'
  priority: TaskPriority | 'all'
  projectId: string | 'all'
  overdueOnly: boolean
  sortBy: TaskSortField
  sortOrder: SortOrder
}

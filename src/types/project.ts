export type ProjectStatus = 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled'

export type ProjectPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface Project {
  id: string
  name: string
  description: string
  status: ProjectStatus
  priority: ProjectPriority
  startDate: string // YYYY-MM-DD
  deadline: string // YYYY-MM-DD
  createdAt: string // ISO timestamp
  updatedAt: string // ISO timestamp
  color: string // Hex or color key
  tags: string[]
}

export type CreateProjectInput = Omit<Project, 'id' | 'createdAt' | 'updatedAt'>

export type UpdateProjectInput = Partial<CreateProjectInput>

export interface ProjectWithStats extends Project {
  totalTasks: number
  completedTasks: number
  pendingTasks: number
  progressPercentage: number
  isOverdue: boolean
}

export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'done'

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface Task {
  id: string
  projectId: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string // YYYY-MM-DD
  createdAt: string // ISO timestamp
  updatedAt: string // ISO timestamp
  completedAt: string | null // ISO timestamp or null
  tags: string[]
  estimatedHours: number | null
}

export type CreateTaskInput = Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'completedAt'>

export type UpdateTaskInput = Partial<CreateTaskInput> & {
  completedAt?: string | null
}

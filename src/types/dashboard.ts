export interface DashboardMetrics {
  totalProjects: number
  activeProjects: number
  totalTasks: number
  completedTasks: number
  pendingTasks: number
  overdueTasks: number
  completionPercentage: number
}

export interface WeeklyProductivityPoint {
  date: string
  day: string
  completed: number
  created: number
}

export interface TaskDistributionPoint {
  name: string
  value: number
  color: string
}

export interface PriorityDistributionPoint {
  priority: string
  count: number
  color: string
}

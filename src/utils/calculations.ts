import type { Project, ProjectWithStats } from '../types/project'
import type { Task } from '../types/task'
import type {
  DashboardMetrics,
  PriorityDistributionPoint,
  TaskDistributionPoint,
  WeeklyProductivityPoint,
} from '../types/dashboard'
import { isDateOverdue } from './dateUtils'

export function calculateProjectProgress(
  projectId: string,
  tasks: Task[]
): { total: number; completed: number; pending: number; percentage: number } {
  const projectTasks = tasks.filter((t) => t.projectId === projectId)
  const total = projectTasks.length
  if (total === 0) {
    return { total: 0, completed: 0, pending: 0, percentage: 0 }
  }
  const completed = projectTasks.filter((t) => t.status === 'done').length
  const pending = total - completed
  const percentage = Math.round((completed / total) * 100)

  return { total, completed, pending, percentage }
}

export function enhanceProjectWithStats(project: Project, tasks: Task[]): ProjectWithStats {
  const stats = calculateProjectProgress(project.id, tasks)
  const isOverdue =
    project.status !== 'completed' &&
    project.status !== 'cancelled' &&
    isDateOverdue(project.deadline)

  return {
    ...project,
    totalTasks: stats.total,
    completedTasks: stats.completed,
    pendingTasks: stats.pending,
    progressPercentage: stats.percentage,
    isOverdue,
  }
}

export function calculateDashboardMetrics(
  projects: Project[],
  tasks: Task[]
): DashboardMetrics {
  const totalProjects = projects.length
  const activeProjects = projects.filter((p) => p.status === 'active').length
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((t) => t.status === 'done').length
  const pendingTasks = totalTasks - completedTasks

  const overdueTasks = tasks.filter((t) => isDateOverdue(t.dueDate, t.status)).length

  const completionPercentage =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100)

  return {
    totalProjects,
    activeProjects,
    totalTasks,
    completedTasks,
    pendingTasks,
    overdueTasks,
    completionPercentage,
  }
}

export function generateWeeklyProductivity(tasks: Task[]): WeeklyProductivityPoint[] {
  const points: WeeklyProductivityPoint[] = []
  const today = new Date()

  // Generate for past 7 days (including today)
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(today.getDate() - i)
    const dateStr = d.toISOString().split('T')[0] ?? ''
    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' })

    const completedCount = tasks.filter((t) => {
      if (t.status !== 'done') return false
      if (t.completedAt) {
        return t.completedAt.startsWith(dateStr)
      }
      return t.updatedAt.startsWith(dateStr)
    }).length

    const createdCount = tasks.filter((t) => t.createdAt.startsWith(dateStr)).length

    points.push({
      date: dateStr,
      day: dayLabel,
      completed: completedCount,
      created: createdCount,
    })
  }

  return points
}

export function calculateStatusDistribution(tasks: Task[]): TaskDistributionPoint[] {
  const counts = {
    todo: 0,
    in_progress: 0,
    in_review: 0,
    done: 0,
  }

  for (const task of tasks) {
    if (task.status in counts) {
      counts[task.status]++
    }
  }

  return [
    { name: 'To Do', value: counts.todo, color: '#94a3b8' },
    { name: 'In Progress', value: counts.in_progress, color: '#38bdf8' },
    { name: 'In Review', value: counts.in_review, color: '#fbbf24' },
    { name: 'Done', value: counts.done, color: '#34d399' },
  ]
}

export function calculatePriorityDistribution(tasks: Task[]): PriorityDistributionPoint[] {
  const counts = {
    low: 0,
    medium: 0,
    high: 0,
    urgent: 0,
  }

  for (const task of tasks) {
    if (task.priority in counts) {
      counts[task.priority]++
    }
  }

  return [
    { priority: 'Low', count: counts.low, color: '#94a3b8' },
    { priority: 'Medium', count: counts.medium, color: '#60a5fa' },
    { priority: 'High', count: counts.high, color: '#f59e0b' },
    { priority: 'Urgent', count: counts.urgent, color: '#ef4444' },
  ]
}

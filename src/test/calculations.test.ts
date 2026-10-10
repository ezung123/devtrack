import { describe, it, expect } from 'vitest'
import {
  calculateProjectProgress,
  calculateDashboardMetrics,
  calculateStatusDistribution,
  calculatePriorityDistribution,
  generateWeeklyProductivity,
} from '../utils/calculations'
import type { Project } from '../types/project'
import type { Task } from '../types/task'

describe('Domain Calculations & Statistics', () => {
  const mockProjects: Project[] = [
    {
      id: 'proj_1',
      name: 'Alpha Project',
      description: 'Test project',
      status: 'active',
      priority: 'high',
      startDate: '2026-10-01',
      deadline: '2026-10-20',
      createdAt: '2026-10-01T00:00:00Z',
      updatedAt: '2026-10-01T00:00:00Z',
      color: '#6366f1',
      tags: ['test'],
    },
    {
      id: 'proj_2',
      name: 'Beta Project',
      description: 'Test project 2',
      status: 'completed',
      priority: 'medium',
      startDate: '2026-09-01',
      deadline: '2026-09-15',
      createdAt: '2026-09-01T00:00:00Z',
      updatedAt: '2026-09-15T00:00:00Z',
      color: '#10b981',
      tags: ['infra'],
    },
  ]

  const mockTasks: Task[] = [
    {
      id: 'task_1',
      projectId: 'proj_1',
      title: 'Task One',
      description: '',
      status: 'done',
      priority: 'high',
      dueDate: '2026-10-15',
      createdAt: '2026-10-01T00:00:00Z',
      updatedAt: '2026-10-05T00:00:00Z',
      completedAt: '2026-10-05T00:00:00Z',
      tags: [],
      estimatedHours: 4,
    },
    {
      id: 'task_2',
      projectId: 'proj_1',
      title: 'Task Two',
      description: '',
      status: 'in_progress',
      priority: 'urgent',
      dueDate: '2026-10-18',
      createdAt: '2026-10-02T00:00:00Z',
      updatedAt: '2026-10-02T00:00:00Z',
      completedAt: null,
      tags: [],
      estimatedHours: 6,
    },
    {
      id: 'task_3',
      projectId: 'proj_1',
      title: 'Task Three (Overdue)',
      description: '',
      status: 'todo',
      priority: 'low',
      dueDate: '2026-01-01', // intentionally past
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
      completedAt: null,
      tags: [],
      estimatedHours: 2,
    },
  ]

  it('calculates project progress percentage accurately', () => {
    const stats = calculateProjectProgress('proj_1', mockTasks)
    expect(stats.total).toBe(3)
    expect(stats.completed).toBe(1)
    expect(stats.pending).toBe(2)
    expect(stats.percentage).toBe(33) // 1/3 = 33%
  })

  it('handles empty task list for project progress without division by zero', () => {
    const stats = calculateProjectProgress('non_existent', mockTasks)
    expect(stats.total).toBe(0)
    expect(stats.completed).toBe(0)
    expect(stats.percentage).toBe(0)
  })

  it('calculates comprehensive dashboard metrics', () => {
    const metrics = calculateDashboardMetrics(mockProjects, mockTasks)
    expect(metrics.totalProjects).toBe(2)
    expect(metrics.activeProjects).toBe(1)
    expect(metrics.totalTasks).toBe(3)
    expect(metrics.completedTasks).toBe(1)
    expect(metrics.pendingTasks).toBe(2)
    expect(metrics.overdueTasks).toBe(1)
    expect(metrics.completionPercentage).toBe(33)
  })

  it('computes status distribution points correctly', () => {
    const distribution = calculateStatusDistribution(mockTasks)
    const todo = distribution.find((d) => d.name === 'To Do')
    const inProgress = distribution.find((d) => d.name === 'In Progress')
    const done = distribution.find((d) => d.name === 'Done')

    expect(todo?.value).toBe(1)
    expect(inProgress?.value).toBe(1)
    expect(done?.value).toBe(1)
  })

  it('computes priority distribution points accurately', () => {
    const distribution = calculatePriorityDistribution(mockTasks)
    const urgent = distribution.find((d) => d.priority === 'Urgent')
    const high = distribution.find((d) => d.priority === 'High')
    const low = distribution.find((d) => d.priority === 'Low')

    expect(urgent?.count).toBe(1)
    expect(high?.count).toBe(1)
    expect(low?.count).toBe(1)
  })

  it('generates 7 daily velocity points for weekly productivity chart', () => {
    const points = generateWeeklyProductivity(mockTasks)
    expect(points.length).toBe(7)
    points.forEach((p) => {
      expect(p.day).toBeDefined()
      expect(p.date).toBeDefined()
      expect(typeof p.completed).toBe('number')
      expect(typeof p.created).toBe('number')
    })
  })
})

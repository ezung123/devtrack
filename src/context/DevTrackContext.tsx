import React, { createContext, useState, useMemo, useCallback } from 'react'
import type { CreateProjectInput, Project, ProjectWithStats, UpdateProjectInput } from '../types/project'
import type { CreateTaskInput, Task, TaskStatus, UpdateTaskInput } from '../types/task'
import type { ActivityLog } from '../types/activity'
import type { UserSettings } from '../types/settings'
import type {
  DashboardMetrics,
  PriorityDistributionPoint,
  TaskDistributionPoint,
  WeeklyProductivityPoint,
} from '../types/dashboard'
import { projectService } from '../services/projectService'
import { taskService } from '../services/taskService'
import { activityService } from '../services/activityService'
import { settingsService } from '../services/settingsService'
import {
  calculateDashboardMetrics,
  calculatePriorityDistribution,
  calculateStatusDistribution,
  enhanceProjectWithStats,
  generateWeeklyProductivity,
} from '../utils/calculations'
import { useToast } from '../hooks/useToast'

export interface DevTrackContextType {
  // State
  projects: Project[]
  projectsWithStats: ProjectWithStats[]
  tasks: Task[]
  activities: ActivityLog[]
  settings: UserSettings
  metrics: DashboardMetrics
  weeklyProductivity: WeeklyProductivityPoint[]
  statusDistribution: TaskDistributionPoint[]
  priorityDistribution: PriorityDistributionPoint[]

  // Search & Navigation Filters
  searchQuery: string
  setSearchQuery: (query: string) => void

  // Project Actions
  createProject: (input: CreateProjectInput) => Project
  updateProject: (id: string, input: UpdateProjectInput) => Project
  deleteProject: (id: string) => void
  getProjectById: (id: string) => Project | undefined

  // Task Actions
  createTask: (input: CreateTaskInput) => Task
  updateTask: (id: string, input: UpdateTaskInput) => Task
  updateTaskStatus: (id: string, status: TaskStatus) => Task
  deleteTask: (id: string) => void
  getTaskById: (id: string) => Task | undefined

  // Settings & Storage Actions
  updateSettings: (partial: Partial<UserSettings>) => void
  exportBackup: () => string
  importBackup: (jsonString: string) => { projectCount: number; taskCount: number }
  resetData: (toDemoData?: boolean) => void
  clearActivities: () => void

  // Modal Controls
  isTaskModalOpen: boolean
  isProjectModalOpen: boolean
  editingTask: Task | null
  editingProject: Project | null
  taskModalDefaultProjectId: string | undefined
  openCreateTaskModal: (projectId?: string) => void
  openEditTaskModal: (task: Task) => void
  closeTaskModal: () => void
  openCreateProjectModal: () => void
  openEditProjectModal: (project: Project) => void
  closeProjectModal: () => void
}

export const DevTrackContext = createContext<DevTrackContextType | undefined>(undefined)

export const DevTrackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { success, error: toastError, info } = useToast()

  // State loaded lazily from service layer without cascading effect renders
  const [projects, setProjects] = useState<Project[]>(() => projectService.getProjects())
  const [tasks, setTasks] = useState<Task[]>(() => taskService.getTasks())
  const [activities, setActivities] = useState<ActivityLog[]>(() => activityService.getActivities())
  const [settings, setSettings] = useState<UserSettings>(() => settingsService.getSettings())
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Modal states
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [taskModalDefaultProjectId, setTaskModalDefaultProjectId] = useState<string | undefined>(undefined)

  // Calculated / Derived values
  const projectsWithStats = useMemo(() => {
    return projects.map((p) => enhanceProjectWithStats(p, tasks))
  }, [projects, tasks])

  const metrics = useMemo(() => {
    return calculateDashboardMetrics(projects, tasks)
  }, [projects, tasks])

  const weeklyProductivity = useMemo(() => {
    return generateWeeklyProductivity(tasks)
  }, [tasks])

  const statusDistribution = useMemo(() => {
    return calculateStatusDistribution(tasks)
  }, [tasks])

  const priorityDistribution = useMemo(() => {
    return calculatePriorityDistribution(tasks)
  }, [tasks])

  // Project Handlers
  const createProject = useCallback(
    (input: CreateProjectInput): Project => {
      try {
        const created = projectService.createProject(input)
        setProjects((prev) => [created, ...prev])
        const act = activityService.log(
          'project_created',
          created.id,
          created.name,
          'project',
          `Created project with ${created.priority} priority`
        )
        setActivities((prev) => [act, ...prev].slice(0, 50))
        success('Project Created', `"${created.name}" is now live.`)
        return created
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to create project'
        toastError('Validation Error', msg)
        throw err
      }
    },
    [success, toastError]
  )

  const updateProject = useCallback(
    (id: string, input: UpdateProjectInput): Project => {
      try {
        const updated = projectService.updateProject(id, input)
        setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)))
        const act = activityService.log(
          'project_updated',
          updated.id,
          updated.name,
          'project',
          'Project specifications updated'
        )
        setActivities((prev) => [act, ...prev].slice(0, 50))
        success('Project Updated', `Changes to "${updated.name}" saved.`)
        return updated
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to update project'
        toastError('Error Updating Project', msg)
        throw err
      }
    },
    [success, toastError]
  )

  const deleteProject = useCallback(
    (id: string) => {
      const target = projects.find((p) => p.id === id)
      if (!target) return

      try {
        projectService.deleteProject(id)
        // Cascade: delete associated tasks to eliminate orphaned records
        const removedTaskCount = taskService.deleteTasksByProjectId(id)

        setProjects((prev) => prev.filter((p) => p.id !== id))
        setTasks((prev) => prev.filter((t) => t.projectId !== id))

        const act = activityService.log(
          'project_deleted',
          id,
          target.name,
          'project',
          `Deleted project and ${removedTaskCount} associated tasks`
        )
        setActivities((prev) => [act, ...prev].slice(0, 50))
        info(
          'Project Deleted',
          `Removed "${target.name}" and ${removedTaskCount} related tasks.`
        )
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to delete project'
        toastError('Error Deleting Project', msg)
      }
    },
    [projects, info, toastError]
  )

  const getProjectById = useCallback(
    (id: string): Project | undefined => {
      return projects.find((p) => p.id === id)
    },
    [projects]
  )

  // Task Handlers
  const createTask = useCallback(
    (input: CreateTaskInput): Task => {
      try {
        const created = taskService.createTask(input)
        setTasks((prev) => [created, ...prev])

        const proj = projects.find((p) => p.id === created.projectId)
        const act = activityService.log(
          'task_created',
          created.id,
          created.title,
          'task',
          `Added to ${proj ? proj.name : 'project'}`
        )
        setActivities((prev) => [act, ...prev].slice(0, 50))
        success('Task Created', `"${created.title}" added successfully.`)
        return created
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to create task'
        toastError('Validation Error', msg)
        throw err
      }
    },
    [projects, success, toastError]
  )

  const updateTask = useCallback(
    (id: string, input: UpdateTaskInput): Task => {
      try {
        const updated = taskService.updateTask(id, input)
        setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)))

        const act = activityService.log(
          'task_updated',
          updated.id,
          updated.title,
          'task',
          'Updated task details'
        )
        setActivities((prev) => [act, ...prev].slice(0, 50))
        success('Task Updated', `"${updated.title}" updated.`)
        return updated
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to update task'
        toastError('Error Updating Task', msg)
        throw err
      }
    },
    [success, toastError]
  )

  const updateTaskStatus = useCallback(
    (id: string, newStatus: TaskStatus): Task => {
      try {
        const updated = taskService.updateTaskStatus(id, newStatus)
        setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)))

        const act = activityService.log(
          'task_status_changed',
          updated.id,
          updated.title,
          'task',
          `Moved to ${newStatus.replace('_', ' ').toUpperCase()}`
        )
        setActivities((prev) => [act, ...prev].slice(0, 50))

        if (newStatus === 'done') {
          success('Task Completed! 🎉', `"${updated.title}" marked as done.`)
        } else {
          info('Status Updated', `"${updated.title}" is now ${newStatus.replace('_', ' ')}.`)
        }
        return updated
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to move task'
        toastError('Status Change Failed', msg)
        throw err
      }
    },
    [info, success, toastError]
  )

  const deleteTask = useCallback(
    (id: string) => {
      const target = tasks.find((t) => t.id === id)
      if (!target) return

      try {
        taskService.deleteTask(id)
        setTasks((prev) => prev.filter((t) => t.id !== id))

        const act = activityService.log(
          'task_deleted',
          id,
          target.title,
          'task',
          'Task deleted permanently'
        )
        setActivities((prev) => [act, ...prev].slice(0, 50))
        info('Task Deleted', `"${target.title}" was removed.`)
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to delete task'
        toastError('Error Deleting Task', msg)
      }
    },
    [tasks, info, toastError]
  )

  const getTaskById = useCallback(
    (id: string): Task | undefined => {
      return tasks.find((t) => t.id === id)
    },
    [tasks]
  )

  // Settings & Maintenance
  const updateSettings = useCallback(
    (partial: Partial<UserSettings>) => {
      try {
        const updated = settingsService.updateSettings(partial)
        setSettings(updated)
        success('Preferences Saved', 'Your workspace preferences were updated.')
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to save settings'
        toastError('Settings Error', msg)
      }
    },
    [success, toastError]
  )

  const exportBackup = useCallback((): string => {
    const jsonStr = settingsService.exportData()
    success('Export Ready', 'DevTrack workspace backup generated.')
    return jsonStr
  }, [success])

  const importBackup = useCallback(
    (jsonString: string): { projectCount: number; taskCount: number } => {
      try {
        const res = settingsService.importData(jsonString)
        setProjects(projectService.getProjects())
        setTasks(taskService.getTasks())
        setActivities(activityService.getActivities())
        setSettings(settingsService.getSettings())
        success('Restore Complete', res.message)
        return { projectCount: res.projectCount, taskCount: res.taskCount }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Import failed'
        toastError('Import Validation Error', msg)
        throw err
      }
    },
    [success, toastError]
  )

  const resetData = useCallback(
    (toDemoData = true) => {
      settingsService.resetData(toDemoData)
      setProjects(projectService.getProjects())
      setTasks(taskService.getTasks())
      setActivities(activityService.getActivities())
      setSettings(settingsService.getSettings())
      info(
        'Workspace Reset',
        toDemoData ? 'Restored demo developer projects.' : 'Clean slate initialized.'
      )
    },
    [info]
  )

  const clearActivities = useCallback(() => {
    activityService.clear()
    setActivities([])
    info('Activity Log Cleared', 'All audit history has been emptied.')
  }, [info])

  // Modal Openers / Closers
  const openCreateTaskModal = useCallback((projectId?: string) => {
    setEditingTask(null)
    setTaskModalDefaultProjectId(projectId)
    setIsTaskModalOpen(true)
  }, [])

  const openEditTaskModal = useCallback((task: Task) => {
    setEditingTask(task)
    setTaskModalDefaultProjectId(task.projectId)
    setIsTaskModalOpen(true)
  }, [])

  const closeTaskModal = useCallback(() => {
    setIsTaskModalOpen(false)
    setEditingTask(null)
    setTaskModalDefaultProjectId(undefined)
  }, [])

  const openCreateProjectModal = useCallback(() => {
    setEditingProject(null)
    setIsProjectModalOpen(true)
  }, [])

  const openEditProjectModal = useCallback((project: Project) => {
    setEditingProject(project)
    setIsProjectModalOpen(true)
  }, [])

  const closeProjectModal = useCallback(() => {
    setIsProjectModalOpen(false)
    setEditingProject(null)
  }, [])

  const value = {
    projects,
    projectsWithStats,
    tasks,
    activities,
    settings,
    metrics,
    weeklyProductivity,
    statusDistribution,
    priorityDistribution,
    searchQuery,
    setSearchQuery,
    createProject,
    updateProject,
    deleteProject,
    getProjectById,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    getTaskById,
    updateSettings,
    exportBackup,
    importBackup,
    resetData,
    clearActivities,
    isTaskModalOpen,
    isProjectModalOpen,
    editingTask,
    editingProject,
    taskModalDefaultProjectId,
    openCreateTaskModal,
    openEditTaskModal,
    closeTaskModal,
    openCreateProjectModal,
    openEditProjectModal,
    closeProjectModal,
  }

  return <DevTrackContext.Provider value={value}>{children}</DevTrackContext.Provider>
}

export { useDevTrack } from '../hooks/useDevTrack'

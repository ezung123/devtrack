import type { CreateTaskInput, Task, TaskStatus, UpdateTaskInput } from '../types/task'
import { storageService, STORAGE_KEYS } from './storageService'
import { INITIAL_TASKS } from './demoData'
import { generateId } from '../utils/idGenerator'
import { createTaskSchema } from '../schemas/taskSchema'

export class TaskService {
  public getTasks(): Task[] {
    const initialized = storageService.getItem<boolean>(STORAGE_KEYS.INITIALIZED, false)
    if (!initialized) {
      storageService.setItem(STORAGE_KEYS.TASKS, INITIAL_TASKS)
      storageService.setItem(STORAGE_KEYS.INITIALIZED, true)
      return INITIAL_TASKS
    }
    return storageService.getItem<Task[]>(STORAGE_KEYS.TASKS, [])
  }

  public getTaskById(id: string): Task | undefined {
    return this.getTasks().find((t) => t.id === id)
  }

  public createTask(input: CreateTaskInput): Task {
    // Validate with Zod
    createTaskSchema.parse(input)

    const now = new Date().toISOString()
    const newTask: Task = {
      ...input,
      id: generateId('task'),
      createdAt: now,
      updatedAt: now,
      completedAt: input.status === 'done' ? now : null,
    }

    const tasks = this.getTasks()
    const updated = [newTask, ...tasks]
    storageService.setItem(STORAGE_KEYS.TASKS, updated)
    return newTask
  }

  public updateTask(id: string, input: UpdateTaskInput): Task {
    const tasks = this.getTasks()
    const index = tasks.findIndex((t) => t.id === id)
    if (index === -1) {
      throw new Error(`Task with ID "${id}" was not found`)
    }

    const existing = tasks[index]
    if (!existing) {
      throw new Error(`Task with ID "${id}" was not found`)
    }

    const now = new Date().toISOString()
    let completedAt = existing.completedAt

    // Check if status changed
    if (input.status !== undefined && input.status !== existing.status) {
      if (input.status === 'done') {
        completedAt = now
      } else if (existing.status === 'done') {
        completedAt = null
      }
    }

    if (input.completedAt !== undefined) {
      completedAt = input.completedAt
    }

    const updatedTask: Task = {
      ...existing,
      ...input,
      completedAt,
      updatedAt: now,
    }

    tasks[index] = updatedTask
    storageService.setItem(STORAGE_KEYS.TASKS, tasks)
    return updatedTask
  }

  public updateTaskStatus(id: string, newStatus: TaskStatus): Task {
    return this.updateTask(id, { status: newStatus })
  }

  public deleteTask(id: string): { success: boolean; deletedTaskId: string } {
    const tasks = this.getTasks()
    const filtered = tasks.filter((t) => t.id !== id)
    if (filtered.length === tasks.length) {
      throw new Error(`Task with ID "${id}" was not found`)
    }

    storageService.setItem(STORAGE_KEYS.TASKS, filtered)
    return { success: true, deletedTaskId: id }
  }

  public deleteTasksByProjectId(projectId: string): number {
    const tasks = this.getTasks()
    const remaining = tasks.filter((t) => t.projectId !== projectId)
    const removedCount = tasks.length - remaining.length
    storageService.setItem(STORAGE_KEYS.TASKS, remaining)
    return removedCount
  }

  public saveAllTasks(tasks: Task[]): void {
    storageService.setItem(STORAGE_KEYS.TASKS, tasks)
  }
}

export const taskService = new TaskService()

import { describe, it, expect, beforeEach } from 'vitest'
import { storageService, STORAGE_KEYS } from '../services/storageService'
import { projectService } from '../services/projectService'
import { taskService } from '../services/taskService'
import { settingsService } from '../services/settingsService'

describe('Service Layer & Persistence Architecture', () => {
  beforeEach(() => {
    localStorage.clear()
    settingsService.resetData(false) // initialize clean slate for isolated tests
  })

  describe('StorageService', () => {
    it('saves and retrieves typed items from localStorage', () => {
      const data = { foo: 'bar', count: 42 }
      storageService.setItem('devtrack_test_key', data)
      const retrieved = storageService.getItem('devtrack_test_key', null)
      expect(retrieved).toEqual(data)
    })

    it('returns default value when key does not exist or JSON is corrupt', () => {
      const nonExistent = storageService.getItem('devtrack_missing', 'default_val')
      expect(nonExistent).toBe('default_val')

      localStorage.setItem('devtrack_corrupt', '{malformed json')
      const fallback = storageService.getItem('devtrack_corrupt', 'fallback_val')
      expect(fallback).toBe('fallback_val')
    })

    it('clears all devtrack prefixed keys without touching external storage', () => {
      storageService.setItem(`${STORAGE_KEYS.PROJECTS}`, [])
      storageService.setItem(`${STORAGE_KEYS.TASKS}`, [])
      localStorage.setItem('unrelated_app_key', 'keep_me')

      storageService.clearAllDevTrackData()

      expect(localStorage.getItem('unrelated_app_key')).toBe('keep_me')
      expect(localStorage.getItem(STORAGE_KEYS.PROJECTS)).toBeNull()
    })
  })

  describe('ProjectService', () => {
    it('creates and persists a new project', () => {
      const project = projectService.createProject({
        name: 'Event Ingestion Engine',
        description: 'Scalable webhook processing',
        status: 'active',
        priority: 'high',
        startDate: '2026-10-01',
        deadline: '2026-10-31',
        color: '#6366f1',
        tags: ['backend', 'kafka'],
      })

      expect(project.id).toBeDefined()
      expect(project.name).toBe('Event Ingestion Engine')

      const found = projectService.getProjectById(project.id)
      expect(found).toBeDefined()
      expect(found?.name).toBe('Event Ingestion Engine')
    })

    it('updates existing project fields', () => {
      const project = projectService.createProject({
        name: 'Initial Name',
        description: '',
        status: 'planning',
        priority: 'medium',
        startDate: '2026-10-01',
        deadline: '2026-10-31',
        color: '#6366f1',
        tags: [],
      })

      const updated = projectService.updateProject(project.id, {
        name: 'Renamed Project',
        status: 'active',
      })

      expect(updated.name).toBe('Renamed Project')
      expect(updated.status).toBe('active')
    })

    it('deletes a project cleanly', () => {
      const project = projectService.createProject({
        name: 'Temporary Project',
        description: '',
        status: 'planning',
        priority: 'low',
        startDate: '2026-10-01',
        deadline: '2026-10-31',
        color: '#6366f1',
        tags: [],
      })

      const res = projectService.deleteProject(project.id)
      expect(res.success).toBe(true)

      const found = projectService.getProjectById(project.id)
      expect(found).toBeUndefined()
    })
  })

  describe('TaskService', () => {
    it('creates a task and updates project task lists', () => {
      const project = projectService.createProject({
        name: 'Parent Project',
        description: '',
        status: 'active',
        priority: 'medium',
        startDate: '2026-10-01',
        deadline: '2026-10-31',
        color: '#6366f1',
        tags: [],
      })

      const task = taskService.createTask({
        projectId: project.id,
        title: 'Build Kafka consumer group',
        description: '',
        status: 'todo',
        priority: 'urgent',
        dueDate: '2026-10-25',
        tags: ['kafka'],
        estimatedHours: 4,
      })

      expect(task.id).toBeDefined()
      expect(task.completedAt).toBeNull()

      const found = taskService.getTaskById(task.id)
      expect(found?.title).toBe('Build Kafka consumer group')
    })

    it('automatically records completedAt timestamp when status moves to done', () => {
      const task = taskService.createTask({
        projectId: 'test_proj',
        title: 'Check completion timestamping',
        description: '',
        status: 'todo',
        priority: 'medium',
        dueDate: '2026-10-25',
        tags: [],
        estimatedHours: 1,
      })

      expect(task.completedAt).toBeNull()

      const completedTask = taskService.updateTaskStatus(task.id, 'done')
      expect(completedTask.status).toBe('done')
      expect(completedTask.completedAt).not.toBeNull()

      // When moved back to in_progress, completedAt is reset to null
      const inProgressTask = taskService.updateTaskStatus(task.id, 'in_progress')
      expect(inProgressTask.status).toBe('in_progress')
      expect(inProgressTask.completedAt).toBeNull()
    })

    it('supports deleting all tasks by project ID for cascade deletions', () => {
      const project = projectService.createProject({
        name: 'Cascade Target',
        description: '',
        status: 'active',
        priority: 'medium',
        startDate: '2026-10-01',
        deadline: '2026-10-31',
        color: '#6366f1',
        tags: [],
      })

      taskService.createTask({
        projectId: project.id,
        title: 'Task A',
        description: '',
        status: 'todo',
        priority: 'low',
        dueDate: '2026-10-25',
        tags: [],
        estimatedHours: 1,
      })

      taskService.createTask({
        projectId: project.id,
        title: 'Task B',
        description: '',
        status: 'todo',
        priority: 'low',
        dueDate: '2026-10-25',
        tags: [],
        estimatedHours: 1,
      })

      const removedCount = taskService.deleteTasksByProjectId(project.id)
      expect(removedCount).toBe(2)

      const remaining = taskService.getTasks().filter((t) => t.projectId === project.id)
      expect(remaining.length).toBe(0)
    })
  })

  describe('SettingsService & Import/Export', () => {
    it('exports and validates workspace backup JSON', () => {
      projectService.createProject({
        name: 'Export Test Project',
        description: '',
        status: 'active',
        priority: 'high',
        startDate: '2026-10-01',
        deadline: '2026-10-31',
        color: '#6366f1',
        tags: [],
      })

      const backupString = settingsService.exportData()
      expect(typeof backupString).toBe('string')

      const parsed = JSON.parse(backupString)
      expect(parsed.version).toBe(1)
      expect(parsed.projects.length).toBeGreaterThanOrEqual(1)

      // Test importing the exported backup
      const importResult = settingsService.importData(backupString)
      expect(importResult.success).toBe(true)
      expect(importResult.projectCount).toBeGreaterThanOrEqual(1)
    })

    it('rejects corrupt or tampered backup imports with validation errors', () => {
      expect(() => {
        settingsService.importData('{ not json')
      }).toThrow('Invalid JSON format')

      expect(() => {
        settingsService.importData(JSON.stringify({ version: 'bad', projects: 123 }))
      }).toThrow('Data validation failed')
    })
  })
})

import { describe, it, expect } from 'vitest'
import { createProjectSchema } from '../schemas/projectSchema'
import { createTaskSchema } from '../schemas/taskSchema'
import { devTrackBackupSchema } from '../schemas/backupSchema'

describe('Zod Validation Schemas', () => {
  describe('createProjectSchema', () => {
    it('accepts valid project input', () => {
      const valid = {
        name: 'Distributed Telemetry Pipeline',
        description: 'Kafka and Prometheus telemetry',
        status: 'active',
        priority: 'high',
        startDate: '2026-10-01',
        deadline: '2026-10-31',
        color: '#6366f1',
        tags: ['kafka', 'monitoring'],
      }
      const result = createProjectSchema.safeParse(valid)
      expect(result.success).toBe(true)
    })

    it('rejects short project name under 2 characters', () => {
      const invalid = {
        name: 'A',
        startDate: '2026-10-01',
        deadline: '2026-10-31',
      }
      const result = createProjectSchema.safeParse(invalid)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain('at least 2 characters')
      }
    })

    it('rejects deadline that is before start date', () => {
      const invalid = {
        name: 'Time Machine Project',
        startDate: '2026-10-20',
        deadline: '2026-10-10', // earlier than start date
      }
      const result = createProjectSchema.safeParse(invalid)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain(
          'Deadline cannot be before the start date'
        )
      }
    })
  })

  describe('createTaskSchema', () => {
    it('accepts valid task input', () => {
      const valid = {
        projectId: 'proj_123',
        title: 'Implement Consumer Retry Loop',
        description: 'Dead letter queue retry handler',
        status: 'todo',
        priority: 'urgent',
        dueDate: '2026-10-25',
        tags: ['kafka', 'backend'],
        estimatedHours: 5,
      }
      const result = createTaskSchema.safeParse(valid)
      expect(result.success).toBe(true)
    })

    it('rejects task with missing project id', () => {
      const invalid = {
        projectId: '',
        title: 'Orphan Task',
        dueDate: '2026-10-25',
      }
      const result = createTaskSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('rejects negative estimated hours', () => {
      const invalid = {
        projectId: 'proj_123',
        title: 'Negative Time Task',
        dueDate: '2026-10-25',
        estimatedHours: -5,
      }
      const result = createTaskSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })
  })

  describe('devTrackBackupSchema', () => {
    it('accepts valid backup export payload', () => {
      const validBackup = {
        version: 1,
        exportedAt: '2026-10-10T00:00:00Z',
        projects: [
          {
            id: 'proj_1',
            name: 'Valid Project',
            description: '',
            status: 'active',
            priority: 'medium',
            startDate: '2026-10-01',
            deadline: '2026-10-31',
            createdAt: '2026-10-01T00:00:00Z',
            updatedAt: '2026-10-01T00:00:00Z',
            color: '#6366f1',
            tags: [],
          },
        ],
        tasks: [
          {
            id: 'task_1',
            projectId: 'proj_1',
            title: 'Valid Task',
            description: '',
            status: 'todo',
            priority: 'medium',
            dueDate: '2026-10-15',
            createdAt: '2026-10-01T00:00:00Z',
            updatedAt: '2026-10-01T00:00:00Z',
            completedAt: null,
            tags: [],
            estimatedHours: null,
          },
        ],
      }
      const result = devTrackBackupSchema.safeParse(validBackup)
      expect(result.success).toBe(true)
    })

    it('rejects backup with invalid version or corrupt data format', () => {
      const corrupt = {
        version: 'not-a-number',
        projects: 'not-an-array',
      }
      const result = devTrackBackupSchema.safeParse(corrupt)
      expect(result.success).toBe(false)
    })
  })
})

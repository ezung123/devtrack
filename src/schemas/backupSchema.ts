import { z } from 'zod'
import { projectSchema } from './projectSchema'
import { taskSchema } from './taskSchema'
import { userSettingsSchema } from './settingsSchema'

export const activityActionSchema = z.enum([
  'task_created',
  'task_updated',
  'task_deleted',
  'task_status_changed',
  'project_created',
  'project_updated',
  'project_deleted',
  'data_imported',
  'data_reset',
])

export const activityLogSchema = z.object({
  id: z.string(),
  action: activityActionSchema,
  entityId: z.string(),
  entityTitle: z.string(),
  entityType: z.enum(['task', 'project', 'system']),
  details: z.string(),
  timestamp: z.string(),
})

export const devTrackBackupSchema = z.object({
  version: z.number().int().min(1),
  exportedAt: z.string(),
  projects: z.array(projectSchema),
  tasks: z.array(taskSchema),
  settings: userSettingsSchema.optional(),
  activityLogs: z.array(activityLogSchema).optional(),
})

export type DevTrackBackup = z.infer<typeof devTrackBackupSchema>

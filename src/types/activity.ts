export type ActivityAction =
  | 'task_created'
  | 'task_updated'
  | 'task_deleted'
  | 'task_status_changed'
  | 'project_created'
  | 'project_updated'
  | 'project_deleted'
  | 'data_imported'
  | 'data_reset'

export interface ActivityLog {
  id: string
  action: ActivityAction
  entityId: string
  entityTitle: string
  entityType: 'task' | 'project' | 'system'
  details: string
  timestamp: string // ISO timestamp
}

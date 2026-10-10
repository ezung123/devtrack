import type { ActivityAction, ActivityLog } from '../types/activity'
import { storageService, STORAGE_KEYS } from './storageService'
import { INITIAL_ACTIVITIES } from './demoData'
import { generateId } from '../utils/idGenerator'

const MAX_ACTIVITIES = 50

export class ActivityService {
  public getActivities(): ActivityLog[] {
    const initialized = storageService.getItem<boolean>(STORAGE_KEYS.INITIALIZED, false)
    if (!initialized) {
      storageService.setItem(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES)
      return INITIAL_ACTIVITIES
    }
    return storageService.getItem<ActivityLog[]>(STORAGE_KEYS.ACTIVITIES, [])
  }

  public log(
    action: ActivityAction,
    entityId: string,
    entityTitle: string,
    entityType: 'task' | 'project' | 'system',
    details: string
  ): ActivityLog {
    const newEntry: ActivityLog = {
      id: generateId('act'),
      action,
      entityId,
      entityTitle,
      entityType,
      details,
      timestamp: new Date().toISOString(),
    }

    const current = this.getActivities()
    const updated = [newEntry, ...current].slice(0, MAX_ACTIVITIES)
    storageService.setItem(STORAGE_KEYS.ACTIVITIES, updated)
    return newEntry
  }

  public clear(): void {
    storageService.setItem(STORAGE_KEYS.ACTIVITIES, [])
  }

  public saveAll(activities: ActivityLog[]): void {
    storageService.setItem(STORAGE_KEYS.ACTIVITIES, activities.slice(0, MAX_ACTIVITIES))
  }
}

export const activityService = new ActivityService()

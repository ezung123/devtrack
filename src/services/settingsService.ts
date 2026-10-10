import type { UserSettings } from '../types/settings'
import { storageService, STORAGE_KEYS } from './storageService'
import { DEFAULT_USER_SETTINGS, INITIAL_PROJECTS, INITIAL_TASKS, INITIAL_ACTIVITIES } from './demoData'
import { userSettingsSchema } from '../schemas/settingsSchema'
import { devTrackBackupSchema, type DevTrackBackup } from '../schemas/backupSchema'
import { projectService } from './projectService'
import { taskService } from './taskService'
import { activityService } from './activityService'

export class SettingsService {
  public getSettings(): UserSettings {
    const saved = storageService.getItem<UserSettings>(
      STORAGE_KEYS.SETTINGS,
      DEFAULT_USER_SETTINGS
    )
    return saved
  }

  public updateSettings(partial: Partial<UserSettings>): UserSettings {
    const current = this.getSettings()
    const updated = { ...current, ...partial }
    userSettingsSchema.parse(updated)
    storageService.setItem(STORAGE_KEYS.SETTINGS, updated)
    return updated
  }

  /**
   * Generates a complete JSON backup export of all DevTrack data.
   */
  public exportData(): string {
    const backup: DevTrackBackup = {
      version: 1,
      exportedAt: new Date().toISOString(),
      projects: projectService.getProjects(),
      tasks: taskService.getTasks(),
      settings: this.getSettings(),
      activityLogs: activityService.getActivities(),
    }
    return JSON.stringify(backup, null, 2)
  }

  /**
   * Validates and imports a JSON backup string using Zod.
   */
  public importData(jsonString: string): {
    success: boolean
    message: string
    projectCount: number
    taskCount: number
  } {
    let parsed: unknown
    try {
      parsed = JSON.parse(jsonString)
    } catch {
      throw new Error('Invalid JSON format. Please verify the backup file.')
    }

    const validationResult = devTrackBackupSchema.safeParse(parsed)
    if (!validationResult.success) {
      const errorMsg = validationResult.error.issues
        .map((iss) => `${iss.path.join('.')}: ${iss.message}`)
        .join('; ')
      throw new Error(`Data validation failed: ${errorMsg}`)
    }

    const data = validationResult.data

    projectService.saveAllProjects(data.projects)
    taskService.saveAllTasks(data.tasks)
    if (data.settings) {
      this.updateSettings(data.settings)
    }
    if (data.activityLogs) {
      activityService.saveAll(data.activityLogs)
    }

    activityService.log(
      'data_imported',
      'system',
      'Data Backup Restored',
      'system',
      `Imported ${data.projects.length} projects and ${data.tasks.length} tasks`
    )

    return {
      success: true,
      message: `Successfully imported ${data.projects.length} projects and ${data.tasks.length} tasks.`,
      projectCount: data.projects.length,
      taskCount: data.tasks.length,
    }
  }

  /**
   * Resets all application data to default demo state or blank state.
   */
  public resetData(toDemoData = true): void {
    if (toDemoData) {
      storageService.setItem(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS)
      storageService.setItem(STORAGE_KEYS.TASKS, INITIAL_TASKS)
      storageService.setItem(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES)
      storageService.setItem(STORAGE_KEYS.SETTINGS, DEFAULT_USER_SETTINGS)
      storageService.setItem(STORAGE_KEYS.INITIALIZED, true)
    } else {
      storageService.setItem(STORAGE_KEYS.PROJECTS, [])
      storageService.setItem(STORAGE_KEYS.TASKS, [])
      storageService.setItem(STORAGE_KEYS.ACTIVITIES, [])
      storageService.setItem(STORAGE_KEYS.SETTINGS, DEFAULT_USER_SETTINGS)
      storageService.setItem(STORAGE_KEYS.INITIALIZED, true)
    }

    activityService.log(
      'data_reset',
      'system',
      toDemoData ? 'Restored Demo Data' : 'Clean Slate Reset',
      'system',
      toDemoData ? 'Reset to default developer projects' : 'Wiped all tasks and projects'
    )
  }
}

export const settingsService = new SettingsService()

import type { TaskPriority } from './task'

export type ThemeMode = 'light' | 'dark' | 'system'

export interface UserSettings {
  theme: ThemeMode
  userName: string
  userTitle: string
  userEmail: string
  weeklyTargetHours: number
  defaultTaskPriority: TaskPriority
  compactView: boolean
  enableSound: boolean
}

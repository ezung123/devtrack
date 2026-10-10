/**
 * Safe, robust LocalStorage service with quota error handling,
 * corrupt JSON parsing protection, and event dispatching.
 */

const STORAGE_PREFIX = 'devtrack_'

export const STORAGE_KEYS = {
  PROJECTS: `${STORAGE_PREFIX}projects`,
  TASKS: `${STORAGE_PREFIX}tasks`,
  ACTIVITIES: `${STORAGE_PREFIX}activities`,
  SETTINGS: `${STORAGE_PREFIX}settings`,
  INITIALIZED: `${STORAGE_PREFIX}initialized`,
} as const

class SafeStorageService {
  private isAvailable(): boolean {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return false
      }
      const testKey = `${STORAGE_PREFIX}test__`
      window.localStorage.setItem(testKey, '1')
      window.localStorage.removeItem(testKey)
      return true
    } catch {
      return false
    }
  }

  public getItem<T>(key: string, defaultValue: T): T {
    if (!this.isAvailable()) {
      return defaultValue
    }
    try {
      const raw = window.localStorage.getItem(key)
      if (raw === null || raw === undefined) {
        return defaultValue
      }
      return JSON.parse(raw) as T
    } catch (error) {
      console.warn(`[StorageService] Failed to read or parse key "${key}". Using default value.`, error)
      return defaultValue
    }
  }

  public setItem<T>(key: string, value: T): boolean {
    if (!this.isAvailable()) {
      return false
    }
    try {
      const serialized = JSON.stringify(value)
      window.localStorage.setItem(key, serialized)
      return true
    } catch (error) {
      console.error(`[StorageService] Failed to save key "${key}". Possible quota exceeded.`, error)
      return false
    }
  }

  public removeItem(key: string): boolean {
    if (!this.isAvailable()) return false
    try {
      window.localStorage.removeItem(key)
      return true
    } catch {
      return false
    }
  }

  public clearAllDevTrackData(): void {
    if (!this.isAvailable()) return
    try {
      const keysToRemove: string[] = []
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i)
        if (key && key.startsWith(STORAGE_PREFIX)) {
          keysToRemove.push(key)
        }
      }
      keysToRemove.forEach((k) => window.localStorage.removeItem(k))
    } catch (error) {
      console.error('[StorageService] Error clearing DevTrack data:', error)
    }
  }
}

export const storageService = new SafeStorageService()

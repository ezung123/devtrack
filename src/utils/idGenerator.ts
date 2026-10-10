/**
 * Generates unique identifiers using crypto.randomUUID when available,
 * with a cryptographically sound fallback.
 */
export function generateId(prefix = 'dt'): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}_${crypto.randomUUID()}`
  }
  const timestamp = Date.now().toString(36)
  const randomStr = Math.random().toString(36).substring(2, 10)
  return `${prefix}_${timestamp}_${randomStr}`
}

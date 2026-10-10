/**
 * Standard date formatting utilities for DevTrack
 */

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return 'No date'
  // Handle YYYY-MM-DD or full ISO
  const parts = dateStr.split('T')[0]?.split('-')
  if (!parts || parts.length !== 3) return dateStr
  const year = parseInt(parts[0] ?? '0', 10)
  const month = parseInt(parts[1] ?? '0', 10) - 1
  const day = parseInt(parts[2] ?? '0', 10)
  const date = new Date(year, month, day)
  if (isNaN(date.getTime())) return dateStr

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatDateTime(isoString: string | null | undefined): string {
  if (!isoString) return ''
  const date = new Date(isoString)
  if (isNaN(date.getTime())) return isoString
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatRelativeTime(isoString: string | null | undefined): string {
  if (!isoString) return ''
  const date = new Date(isoString)
  if (isNaN(date.getTime())) return isoString

  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) {
    const mins = Math.floor(diffInSeconds / 60)
    return `${mins} ${mins === 1 ? 'min' : 'mins'} ago`
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
  }
  const days = Math.floor(diffInSeconds / 86400)
  if (days < 7) {
    return `${days} ${days === 1 ? 'day' : 'days'} ago`
  }
  return formatDate(isoString)
}

/**
 * Checks if a due date is in the past compared to today (midnight).
 * If status is provided and is 'done', it is not considered overdue.
 */
export function isDateOverdue(dueDateStr: string, status?: string): boolean {
  if (status === 'done') return false
  if (!dueDateStr) return false

  const parts = dueDateStr.split('T')[0]?.split('-')
  if (!parts || parts.length !== 3) return false
  const year = parseInt(parts[0] ?? '0', 10)
  const month = parseInt(parts[1] ?? '0', 10) - 1
  const day = parseInt(parts[2] ?? '0', 10)
  const dueDate = new Date(year, month, day, 23, 59, 59)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return dueDate.getTime() < today.getTime()
}

/**
 * Returns difference in calendar days: positive = days left, negative = days past due, 0 = due today
 */
export function getDaysRemaining(dueDateStr: string): number {
  const parts = dueDateStr.split('T')[0]?.split('-')
  if (!parts || parts.length !== 3) return 0
  const year = parseInt(parts[0] ?? '0', 10)
  const month = parseInt(parts[1] ?? '0', 10) - 1
  const day = parseInt(parts[2] ?? '0', 10)
  const dueDate = new Date(year, month, day)

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  dueDate.setHours(0, 0, 0, 0)

  const diffTime = dueDate.getTime() - today.getTime()
  return Math.round(diffTime / (1000 * 60 * 60 * 24))
}

export function getTodayString(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getFutureDateString(daysAhead: number): string {
  const date = new Date()
  date.setDate(date.getDate() + daysAhead)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getPastDateString(daysAgo: number): string {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

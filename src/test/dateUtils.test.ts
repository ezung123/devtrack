import { describe, it, expect } from 'vitest'
import {
  formatDate,
  formatRelativeTime,
  isDateOverdue,
  getDaysRemaining,
  getTodayString,
  getFutureDateString,
  getPastDateString,
} from '../utils/dateUtils'

describe('Date Utilities', () => {
  it('formats YYYY-MM-DD date strings properly', () => {
    const formatted = formatDate('2026-10-15')
    expect(formatted).toBe('Oct 15, 2026')
  })

  it('handles null and undefined dates gracefully', () => {
    expect(formatDate(null)).toBe('No date')
    expect(formatDate(undefined)).toBe('No date')
  })

  it('detects overdue dates accurately', () => {
    const pastDate = getPastDateString(5)
    const futureDate = getFutureDateString(5)

    expect(isDateOverdue(pastDate)).toBe(true)
    expect(isDateOverdue(futureDate)).toBe(false)
  })

  it('does not treat completed tasks as overdue even if dueDate is past', () => {
    const pastDate = getPastDateString(10)
    expect(isDateOverdue(pastDate, 'done')).toBe(false)
  })

  it('computes days remaining correctly', () => {
    const today = getTodayString()
    expect(getDaysRemaining(today)).toBe(0)

    const inThreeDays = getFutureDateString(3)
    expect(getDaysRemaining(inThreeDays)).toBe(3)
  })

  it('formats relative time strings', () => {
    const nowIso = new Date().toISOString()
    expect(formatRelativeTime(nowIso)).toBe('just now')

    const tenMinsAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString()
    expect(formatRelativeTime(tenMinsAgo)).toBe('10 mins ago')

    const twoHoursAgo = new Date(Date.now() - 2 * 3600 * 1000).toISOString()
    expect(formatRelativeTime(twoHoursAgo)).toBe('2 hours ago')
  })
})

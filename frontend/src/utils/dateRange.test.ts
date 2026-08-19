import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { formatDateRangeLabel, getPresetRange } from './dateRange'

function toLocalDateString(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

describe('formatDateRangeLabel', () => {
  it('returns the placeholder label when startDate is missing', () => {
    expect(formatDateRangeLabel({ startDate: null, endDate: '2026-06-30' })).toBe(
      'Chọn khoảng thời gian',
    )
  })

  it('returns the placeholder label when endDate is missing', () => {
    expect(formatDateRangeLabel({ startDate: '2026-06-01', endDate: null })).toBe(
      'Chọn khoảng thời gian',
    )
  })

  it('formats a full range as "dd/MM/yyyy - dd/MM/yyyy"', () => {
    expect(formatDateRangeLabel({ startDate: '2026-06-01', endDate: '2026-06-30' })).toBe(
      '01/06/2026 - 30/06/2026',
    )
  })
})

describe('getPresetRange', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-15T10:30:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns today start-of-day to today end-of-day for days=0', () => {
    const { from, to } = getPresetRange(0)

    expect(toLocalDateString(from)).toBe('2026-06-15')
    expect(from.getHours()).toBe(0)
    expect(from.getMinutes()).toBe(0)
    expect(to.getHours()).toBe(23)
    expect(to.getMinutes()).toBe(59)
  })

  it('returns a range starting N days before today for days=N', () => {
    const { from, to } = getPresetRange(7)

    expect(toLocalDateString(from)).toBe('2026-06-08')
    expect(toLocalDateString(to)).toBe('2026-06-15')
  })

  it('always anchors "to" at the end of today, regardless of the preset', () => {
    const sevenDays = getPresetRange(7)
    const thirtyDays = getPresetRange(30)

    expect(sevenDays.to.getTime()).toBe(thirtyDays.to.getTime())
  })
})

import { describe, expect, it } from 'vitest'

import { formatDate, formatDateTime } from './date'

describe('formatDateTime', () => {
  it('formats an ISO datetime as "HH:mm dd/MM/yyyy" in the Asia/Ho_Chi_Minh timezone', () => {
    expect(formatDateTime('2026-06-01T08:05:00.000Z')).toBe('15:05 01/06/2026')
  })

  it('pads single-digit day/month/hour/minute with a leading zero', () => {
    expect(formatDateTime('2026-01-02T00:03:00.000Z')).toBe('07:03 02/01/2026')
  })
})

describe('formatDate', () => {
  it('formats an ISO date-only string as "dd/MM/yyyy"', () => {
    expect(formatDate('2026-06-01')).toBe('01/06/2026')
  })

  it('formats an ISO datetime string, taking only the date part', () => {
    expect(formatDate('2026-12-31T23:59:00.000Z')).toBe('01/01/2027')
  })
})

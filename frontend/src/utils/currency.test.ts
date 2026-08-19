import { describe, expect, it } from 'vitest'

import { formatCurrency } from './currency'

describe('formatCurrency', () => {
  it('formats a positive integer with Vietnamese thousands separators and a currency suffix', () => {
    expect(formatCurrency(78500)).toBe('78.500 đ')
  })

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('0 đ')
  })

  it('formats large values (millions)', () => {
    expect(formatCurrency(4050000)).toBe('4.050.000 đ')
  })

  it('formats negative values', () => {
    expect(formatCurrency(-1000)).toBe('-1.000 đ')
  })
})

import { describe, expect, it } from 'vitest'

import { supplierSchema } from './supplier.schema'

describe('supplierSchema', () => {
  it('trims and accepts a valid name', () => {
    expect(supplierSchema.parse({ name: '  Công ty Minh Long  ' }).name).toBe('Công ty Minh Long')
  })

  it('rejects an empty or whitespace-only name', () => {
    expect(supplierSchema.safeParse({ name: '' }).success).toBe(false)
    expect(supplierSchema.safeParse({ name: '   ' }).success).toBe(false)
  })
})

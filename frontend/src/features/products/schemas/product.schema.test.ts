import { describe, expect, it } from 'vitest'

import { productSchema } from './product.schema'

const valid = { name: 'Giấy A4', code: 'VT-001', unit: 'Ram', price: 78500 }

describe('productSchema', () => {
  it('accepts a valid payload', () => {
    expect(productSchema.safeParse(valid).success).toBe(true)
  })

  it('trims string fields', () => {
    const result = productSchema.parse({ ...valid, name: '  Giấy A4  ' })

    expect(result.name).toBe('Giấy A4')
  })

  it.each(['name', 'code', 'unit'])('rejects a blank %s', (field) => {
    expect(productSchema.safeParse({ ...valid, [field]: '  ' }).success).toBe(false)
  })

  it('coerces a numeric string price', () => {
    expect(productSchema.parse({ ...valid, price: '78500' }).price).toBe(78500)
  })

  it('rejects a zero or negative price', () => {
    expect(productSchema.safeParse({ ...valid, price: 0 }).success).toBe(false)
    expect(productSchema.safeParse({ ...valid, price: -1 }).success).toBe(false)
  })

  it('rejects a non-numeric price', () => {
    expect(productSchema.safeParse({ ...valid, price: 'abc' }).success).toBe(false)
  })
})

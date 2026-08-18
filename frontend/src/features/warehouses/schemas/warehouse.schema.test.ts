import { describe, expect, it } from 'vitest'

import { warehouseSchema } from './warehouse.schema'

const valid = { name: 'Kho tổng Hà Nội', location: 'Số 15 Láng Hạ' }

describe('warehouseSchema', () => {
  it('accepts a valid payload and trims fields', () => {
    const result = warehouseSchema.parse({
      name: '  Kho tổng Hà Nội  ',
      location: '  Số 15 Láng Hạ  ',
    })

    expect(result).toEqual(valid)
  })

  it('rejects a missing name', () => {
    expect(warehouseSchema.safeParse({ ...valid, name: '' }).success).toBe(false)
  })

  it('rejects a missing location', () => {
    expect(warehouseSchema.safeParse({ ...valid, location: '' }).success).toBe(false)
  })
})

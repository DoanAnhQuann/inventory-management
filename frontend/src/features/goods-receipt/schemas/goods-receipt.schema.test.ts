import { describe, expect, it } from 'vitest'

import { goodsReceiptItemSchema, goodsReceiptSchema } from './goods-receipt.schema'

function buildValidPayload() {
  return {
    warehouseName: 'Kho tổng Hà Nội',
    supplierName: 'Công ty TNHH Thiết bị Văn phòng Minh Long',
    receiptDate: '2026-06-01',
    items: [
      { productName: 'Giấy A4', productCode: 'VT-001', unit: 'Ram', quantity: 20, price: 78500 },
    ],
    unitName: 'CÔNG TY TNHH GIẢI PHÁP SỐ',
    department: 'Phòng hành chính',
    delivererName: 'Trần Văn Bình',
    invoiceNumber: 'HD-2026-0601',
    invoiceDate: '2026-06-01',
    debitAccount: '1521',
    creditAccount: '331',
    attachedDocuments: 'Hoá đơn GTGT 0601',
    amountInWords: 'Bốn triệu không trăm năm mươi nghìn đồng chẵn',
  }
}

describe('goodsReceiptItemSchema', () => {
  const validItem = {
    productName: 'Giấy A4',
    productCode: 'VT-001',
    unit: 'Ram',
    quantity: 20,
    price: 78500,
  }

  it('accepts a valid item', () => {
    expect(goodsReceiptItemSchema.safeParse(validItem).success).toBe(true)
  })

  it('rejects a non-positive quantity', () => {
    expect(goodsReceiptItemSchema.safeParse({ ...validItem, quantity: 0 }).success).toBe(false)
  })

  it('rejects a negative price but allows zero', () => {
    expect(goodsReceiptItemSchema.safeParse({ ...validItem, price: -1 }).success).toBe(false)
    expect(goodsReceiptItemSchema.safeParse({ ...validItem, price: 0 }).success).toBe(true)
  })

  it('coerces quantity and price from numeric strings', () => {
    const result = goodsReceiptItemSchema.parse({ ...validItem, quantity: '20', price: '78500' })

    expect(result.quantity).toBe(20)
    expect(result.price).toBe(78500)
  })
})

describe('goodsReceiptSchema', () => {
  it('accepts a fully valid payload', () => {
    expect(goodsReceiptSchema.safeParse(buildValidPayload()).success).toBe(true)
  })

  it('requires at least one item', () => {
    expect(goodsReceiptSchema.safeParse({ ...buildValidPayload(), items: [] }).success).toBe(false)
  })

  it('allows note and warehouseLocation to be omitted', () => {
    const result = goodsReceiptSchema.parse(buildValidPayload())

    expect(result.note).toBeUndefined()
    expect(result.warehouseLocation).toBeUndefined()
  })

  it.each([
    'warehouseName',
    'supplierName',
    'receiptDate',
    'unitName',
    'department',
    'delivererName',
    'invoiceNumber',
    'invoiceDate',
    'debitAccount',
    'creditAccount',
    'attachedDocuments',
    'amountInWords',
  ])('rejects when %s is blank', (field) => {
    const payload = { ...buildValidPayload(), [field]: '  ' }

    expect(goodsReceiptSchema.safeParse(payload).success).toBe(false)
  })
})

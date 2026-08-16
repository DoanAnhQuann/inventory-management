import type { GoodsReceiptFormValues } from '../schemas/goods-receipt.schema'
import type { GoodsReceipt } from '../types/goods-receipt.types'

let receipts: GoodsReceipt[] = []

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

function generateCode(): string {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  return `PNK-${today}-${String(receipts.length + 1).padStart(3, '0')}`
}

export async function createGoodsReceipt(payload: GoodsReceiptFormValues): Promise<GoodsReceipt> {
  await delay()
  const totalAmount = payload.items.reduce((sum, item) => sum + item.quantity * item.price, 0)
  const receipt: GoodsReceipt = {
    id: crypto.randomUUID(),
    code: generateCode(),
    ...payload,
    totalAmount,
    createdAt: new Date().toISOString(),
  }
  receipts = [receipt, ...receipts]
  return receipt
}

import { apiClient } from '@/services/api/client'
import type { ApiEnvelope } from '@/services/api/response.type'

import type { GoodsReceiptFormValues } from '../schemas/goods-receipt.schema'
import type { GoodsReceipt } from '../types/goods-receipt.types'

export async function getGoodsReceipts(): Promise<GoodsReceipt[]> {
  const response = await apiClient.get<ApiEnvelope<GoodsReceipt[]>>('/goods-receipts')
  return response.data.data
}

export async function createGoodsReceipt(
  payload: GoodsReceiptFormValues,
): Promise<{ data: GoodsReceipt; message: string }> {
  const response = await apiClient.post<ApiEnvelope<GoodsReceipt>>('/goods-receipts', payload)
  return { data: response.data.data, message: response.data.message }
}

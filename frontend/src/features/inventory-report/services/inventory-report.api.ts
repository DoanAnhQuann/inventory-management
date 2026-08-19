import { apiClient } from '@/services/api/client'
import type { ApiEnvelope } from '@/services/api/response.type'

import type { ProductStockSummary, StockMovement } from '../types/stock-movement.types'

export async function getProductStockSummaries(): Promise<ProductStockSummary[]> {
  const response = await apiClient.get<ApiEnvelope<ProductStockSummary[]>>(
    '/inventory-report/products',
  )
  return response.data.data
}

export async function getProductMovements(productId: string): Promise<StockMovement[]> {
  const response = await apiClient.get<ApiEnvelope<StockMovement[]>>(
    `/inventory-report/products/${productId}/movements`,
  )
  return response.data.data
}

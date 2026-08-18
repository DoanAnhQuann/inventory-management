import { apiClient } from '@/services/api/client'
import type { ApiEnvelope } from '@/services/api/response.type'

import type { WarehouseFormValues } from '../schemas/warehouse.schema'
import type { Warehouse } from '../types/warehouse.types'

export async function getWarehouses(): Promise<Warehouse[]> {
  const response = await apiClient.get<ApiEnvelope<Warehouse[]>>('/warehouses')
  return response.data.data
}

export async function createWarehouse(
  payload: WarehouseFormValues,
): Promise<{ data: Warehouse; message: string }> {
  const response = await apiClient.post<ApiEnvelope<Warehouse>>('/warehouses', payload)
  return { data: response.data.data, message: response.data.message }
}

export async function updateWarehouse(
  id: string,
  payload: WarehouseFormValues,
): Promise<{ data: Warehouse; message: string }> {
  const response = await apiClient.patch<ApiEnvelope<Warehouse>>(`/warehouses/${id}`, payload)
  return { data: response.data.data, message: response.data.message }
}

export async function deleteWarehouse(id: string): Promise<{ message: string }> {
  const response = await apiClient.delete<ApiEnvelope<null>>(`/warehouses/${id}`)
  return { message: response.data.message }
}

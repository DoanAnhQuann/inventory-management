import { apiClient } from '@/services/api/client'
import type { ApiEnvelope } from '@/services/api/response.type'

import type { SupplierFormValues } from '../schemas/supplier.schema'
import type { Supplier } from '../types/supplier.types'

export async function getSuppliers(): Promise<Supplier[]> {
  const response = await apiClient.get<ApiEnvelope<Supplier[]>>('/suppliers')
  return response.data.data
}

export async function createSupplier(
  payload: SupplierFormValues,
): Promise<{ data: Supplier; message: string }> {
  const response = await apiClient.post<ApiEnvelope<Supplier>>('/suppliers', payload)
  return { data: response.data.data, message: response.data.message }
}

export async function updateSupplier(
  id: string,
  payload: SupplierFormValues,
): Promise<{ data: Supplier; message: string }> {
  const response = await apiClient.patch<ApiEnvelope<Supplier>>(`/suppliers/${id}`, payload)
  return { data: response.data.data, message: response.data.message }
}

export async function deleteSupplier(id: string): Promise<{ message: string }> {
  const response = await apiClient.delete<ApiEnvelope<null>>(`/suppliers/${id}`)
  return { message: response.data.message }
}

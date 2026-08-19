import { apiClient } from '@/services/api/client'
import type { ApiEnvelope } from '@/services/api/response.type'

import type { ProductFormValues } from '../schemas/product.schema'
import type { Product } from '../types/product.types'

export async function getProducts(): Promise<Product[]> {
  const response = await apiClient.get<ApiEnvelope<Product[]>>('/products')
  return response.data.data
}

export async function createProduct(
  payload: ProductFormValues,
): Promise<{ data: Product; message: string }> {
  const response = await apiClient.post<ApiEnvelope<Product>>('/products', payload)
  return { data: response.data.data, message: response.data.message }
}

export async function updateProduct(
  id: string,
  payload: ProductFormValues,
): Promise<{ data: Product; message: string }> {
  const response = await apiClient.patch<ApiEnvelope<Product>>(`/products/${id}`, payload)
  return { data: response.data.data, message: response.data.message }
}

export async function deleteProduct(id: string): Promise<{ message: string }> {
  const response = await apiClient.delete<ApiEnvelope<null>>(`/products/${id}`)
  return { message: response.data.message }
}

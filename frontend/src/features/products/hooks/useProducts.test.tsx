import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { toast } from 'sonner'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { createProduct, deleteProduct, getProducts, updateProduct } from '../services/products.api'
import {
  PRODUCTS_KEY,
  useCreateProduct,
  useDeleteProduct,
  useProducts,
  useUpdateProduct,
} from './useProducts'

vi.mock('../services/products.api')
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

const mockedGetProducts = vi.mocked(getProducts)
const mockedCreateProduct = vi.mocked(createProduct)
const mockedUpdateProduct = vi.mocked(updateProduct)
const mockedDeleteProduct = vi.mocked(deleteProduct)

function renderWithQueryClient() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  return { queryClient, wrapper }
}

const sampleProduct = {
  id: 'prod-1',
  code: 'VT-001',
  name: 'Giấy A4',
  unit: 'Ram',
  price: 78500,
  minStockThreshold: null,
  createdAt: '2026-06-01T00:00:00.000Z',
  updatedAt: '2026-06-01T00:00:00.000Z',
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('useProducts', () => {
  it('fetches the product list through getProducts', async () => {
    mockedGetProducts.mockResolvedValue([sampleProduct])
    const { wrapper } = renderWithQueryClient()

    const { result } = renderHook(() => useProducts(), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual([sampleProduct])
    expect(mockedGetProducts).toHaveBeenCalledTimes(1)
  })
})

describe('useCreateProduct', () => {
  it('creates the product, invalidates the list query, and shows a success toast', async () => {
    mockedCreateProduct.mockResolvedValue({
      data: sampleProduct,
      message: 'Tạo sản phẩm thành công',
    })
    const { wrapper, queryClient } = renderWithQueryClient()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    const { result } = renderHook(() => useCreateProduct(), { wrapper })
    result.current.mutate({ name: 'Giấy A4', code: 'VT-001', unit: 'Ram', price: 78500 })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockedCreateProduct).toHaveBeenCalledWith(
      { name: 'Giấy A4', code: 'VT-001', unit: 'Ram', price: 78500 },
      expect.anything(),
    )
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: PRODUCTS_KEY })
    expect(toast.success).toHaveBeenCalledWith('Tạo sản phẩm thành công')
  })

  it('shows an error toast with the backend message when the request fails', async () => {
    mockedCreateProduct.mockRejectedValue(new Error('boom'))
    const { wrapper } = renderWithQueryClient()

    const { result } = renderHook(() => useCreateProduct(), { wrapper })
    result.current.mutate({ name: 'Giấy A4', code: 'VT-001', unit: 'Ram', price: 78500 })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(toast.error).toHaveBeenCalledWith('Có lỗi xảy ra, vui lòng thử lại sau')
  })
})

describe('useUpdateProduct', () => {
  it('calls updateProduct with the id and payload, then invalidates the list', async () => {
    mockedUpdateProduct.mockResolvedValue({
      data: sampleProduct,
      message: 'Cập nhật sản phẩm thành công',
    })
    const { wrapper, queryClient } = renderWithQueryClient()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    const { result } = renderHook(() => useUpdateProduct(), { wrapper })
    result.current.mutate({
      id: 'prod-1',
      payload: { name: 'Giấy A4 mới', code: 'VT-001', unit: 'Ram', price: 80000 },
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockedUpdateProduct).toHaveBeenCalledWith('prod-1', {
      name: 'Giấy A4 mới',
      code: 'VT-001',
      unit: 'Ram',
      price: 80000,
    })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: PRODUCTS_KEY })
  })
})

describe('useDeleteProduct', () => {
  it('calls deleteProduct with the id and shows the success toast', async () => {
    mockedDeleteProduct.mockResolvedValue({ message: 'Xoá sản phẩm thành công' })
    const { wrapper } = renderWithQueryClient()

    const { result } = renderHook(() => useDeleteProduct(), { wrapper })
    result.current.mutate('prod-1')

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockedDeleteProduct).toHaveBeenCalledWith('prod-1', expect.anything())
    expect(toast.success).toHaveBeenCalledWith('Xoá sản phẩm thành công')
  })
})

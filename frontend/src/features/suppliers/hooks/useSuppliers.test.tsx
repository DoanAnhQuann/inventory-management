import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { toast } from 'sonner'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  createSupplier,
  deleteSupplier,
  getSuppliers,
  updateSupplier,
} from '../services/suppliers.api'
import {
  SUPPLIERS_KEY,
  useCreateSupplier,
  useDeleteSupplier,
  useSuppliers,
  useUpdateSupplier,
} from './useSuppliers'

vi.mock('../services/suppliers.api')
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

const mockedGetSuppliers = vi.mocked(getSuppliers)
const mockedCreateSupplier = vi.mocked(createSupplier)
const mockedUpdateSupplier = vi.mocked(updateSupplier)
const mockedDeleteSupplier = vi.mocked(deleteSupplier)

function renderWithQueryClient() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  return { queryClient, wrapper }
}

const sampleSupplier = {
  id: 'sup-1',
  name: 'Công ty TNHH Thiết bị Văn phòng Minh Long',
  createdAt: '2026-05-01T00:00:00.000Z',
  updatedAt: '2026-05-01T00:00:00.000Z',
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('useSuppliers', () => {
  it('fetches the supplier list through getSuppliers', async () => {
    mockedGetSuppliers.mockResolvedValue([sampleSupplier])
    const { wrapper } = renderWithQueryClient()

    const { result } = renderHook(() => useSuppliers(), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual([sampleSupplier])
  })
})

describe('useCreateSupplier', () => {
  it('creates the supplier, invalidates the list query, and shows a success toast', async () => {
    mockedCreateSupplier.mockResolvedValue({
      data: sampleSupplier,
      message: 'Tạo nhà cung cấp thành công',
    })
    const { wrapper, queryClient } = renderWithQueryClient()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    const { result } = renderHook(() => useCreateSupplier(), { wrapper })
    result.current.mutate({ name: 'NCC mới' })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockedCreateSupplier).toHaveBeenCalledWith({ name: 'NCC mới' }, expect.anything())
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: SUPPLIERS_KEY })
    expect(toast.success).toHaveBeenCalledWith('Tạo nhà cung cấp thành công')
  })

  it('shows an error toast when the request fails', async () => {
    mockedCreateSupplier.mockRejectedValue(new Error('boom'))
    const { wrapper } = renderWithQueryClient()

    const { result } = renderHook(() => useCreateSupplier(), { wrapper })
    result.current.mutate({ name: 'NCC mới' })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(toast.error).toHaveBeenCalledWith(
      'Có lỗi xảy ra, vui lòng thử lại sau',
      expect.objectContaining({ duration: expect.any(Number) }),
    )
  })
})

describe('useUpdateSupplier', () => {
  it('calls updateSupplier with the id and payload', async () => {
    mockedUpdateSupplier.mockResolvedValue({
      data: sampleSupplier,
      message: 'Cập nhật nhà cung cấp thành công',
    })
    const { wrapper } = renderWithQueryClient()

    const { result } = renderHook(() => useUpdateSupplier(), { wrapper })
    result.current.mutate({ id: 'sup-1', payload: { name: 'Tên mới' } })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockedUpdateSupplier).toHaveBeenCalledWith('sup-1', { name: 'Tên mới' })
  })
})

describe('useDeleteSupplier', () => {
  it('calls deleteSupplier with the id and shows the success toast', async () => {
    mockedDeleteSupplier.mockResolvedValue({ message: 'Xoá nhà cung cấp thành công' })
    const { wrapper } = renderWithQueryClient()

    const { result } = renderHook(() => useDeleteSupplier(), { wrapper })
    result.current.mutate('sup-1')

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockedDeleteSupplier).toHaveBeenCalledWith('sup-1', expect.anything())
    expect(toast.success).toHaveBeenCalledWith('Xoá nhà cung cấp thành công')
  })
})

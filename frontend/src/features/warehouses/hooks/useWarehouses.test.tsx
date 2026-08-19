import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { toast } from 'sonner'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  createWarehouse,
  deleteWarehouse,
  getWarehouses,
  updateWarehouse,
} from '../services/warehouses.api'
import {
  useCreateWarehouse,
  useDeleteWarehouse,
  useUpdateWarehouse,
  useWarehouses,
  WAREHOUSES_KEY,
} from './useWarehouses'

vi.mock('../services/warehouses.api')
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

const mockedGetWarehouses = vi.mocked(getWarehouses)
const mockedCreateWarehouse = vi.mocked(createWarehouse)
const mockedUpdateWarehouse = vi.mocked(updateWarehouse)
const mockedDeleteWarehouse = vi.mocked(deleteWarehouse)

function renderWithQueryClient() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  return { queryClient, wrapper }
}

const sampleWarehouse = {
  id: 'wh-1',
  name: 'Kho tổng Hà Nội',
  location: 'Số 15 Láng Hạ, Đống Đa, Hà Nội',
  createdAt: '2026-06-03T00:00:00.000Z',
  updatedAt: '2026-06-03T00:00:00.000Z',
  inboundAt: '2026-06-03T00:00:00.000Z',
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('useWarehouses', () => {
  it('fetches the warehouse list through getWarehouses', async () => {
    mockedGetWarehouses.mockResolvedValue([sampleWarehouse])
    const { wrapper } = renderWithQueryClient()

    const { result } = renderHook(() => useWarehouses(), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual([sampleWarehouse])
  })
})

describe('useCreateWarehouse', () => {
  it('creates the warehouse, invalidates the list query, and shows a success toast', async () => {
    mockedCreateWarehouse.mockResolvedValue({
      data: sampleWarehouse,
      message: 'Tạo kho thành công',
    })
    const { wrapper, queryClient } = renderWithQueryClient()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    const { result } = renderHook(() => useCreateWarehouse(), { wrapper })
    result.current.mutate({ name: 'Kho mới', location: 'Địa chỉ mới' })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockedCreateWarehouse).toHaveBeenCalledWith(
      { name: 'Kho mới', location: 'Địa chỉ mới' },
      expect.anything(),
    )
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: WAREHOUSES_KEY })
    expect(toast.success).toHaveBeenCalledWith('Tạo kho thành công')
  })

  it('shows an error toast when the request fails', async () => {
    mockedCreateWarehouse.mockRejectedValue(new Error('boom'))
    const { wrapper } = renderWithQueryClient()

    const { result } = renderHook(() => useCreateWarehouse(), { wrapper })
    result.current.mutate({ name: 'Kho mới', location: 'Địa chỉ mới' })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(toast.error).toHaveBeenCalledWith(
      'Có lỗi xảy ra, vui lòng thử lại sau',
      expect.objectContaining({ duration: expect.any(Number) }),
    )
  })
})

describe('useUpdateWarehouse', () => {
  it('calls updateWarehouse with the id and payload', async () => {
    mockedUpdateWarehouse.mockResolvedValue({
      data: sampleWarehouse,
      message: 'Cập nhật kho thành công',
    })
    const { wrapper } = renderWithQueryClient()

    const { result } = renderHook(() => useUpdateWarehouse(), { wrapper })
    result.current.mutate({ id: 'wh-1', payload: { name: 'Tên mới', location: 'Địa chỉ mới' } })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockedUpdateWarehouse).toHaveBeenCalledWith('wh-1', {
      name: 'Tên mới',
      location: 'Địa chỉ mới',
    })
  })
})

describe('useDeleteWarehouse', () => {
  it('calls deleteWarehouse with the id and shows the success toast', async () => {
    mockedDeleteWarehouse.mockResolvedValue({ message: 'Xoá kho thành công' })
    const { wrapper } = renderWithQueryClient()

    const { result } = renderHook(() => useDeleteWarehouse(), { wrapper })
    result.current.mutate('wh-1')

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockedDeleteWarehouse).toHaveBeenCalledWith('wh-1', expect.anything())
    expect(toast.success).toHaveBeenCalledWith('Xoá kho thành công')
  })
})

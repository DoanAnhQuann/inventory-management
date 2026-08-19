import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { toast } from 'sonner'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { PRODUCTS_KEY } from '@/features/products/hooks/useProducts'
import { SUPPLIERS_KEY } from '@/features/suppliers/hooks/useSuppliers'
import { WAREHOUSES_KEY } from '@/features/warehouses/hooks/useWarehouses'

import { createGoodsReceipt, getGoodsReceipts } from '../services/goods-receipts.api'
import { useCreateGoodsReceipt, useGoodsReceipts } from './useGoodsReceipts'

vi.mock('../services/goods-receipts.api')
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

const mockedGetGoodsReceipts = vi.mocked(getGoodsReceipts)
const mockedCreateGoodsReceipt = vi.mocked(createGoodsReceipt)

function renderWithQueryClient() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  return { queryClient, wrapper }
}

const sampleReceipt = {
  id: 'rec-1',
  code: 'PNK-20260601-001',
  totalAmount: 4050000,
  items: [],
} as never

beforeEach(() => {
  vi.clearAllMocks()
})

describe('useGoodsReceipts', () => {
  it('fetches the list without a date range', async () => {
    mockedGetGoodsReceipts.mockResolvedValue([sampleReceipt])
    const { wrapper } = renderWithQueryClient()

    const { result } = renderHook(() => useGoodsReceipts(), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockedGetGoodsReceipts).toHaveBeenCalledWith(undefined)
    expect(result.current.data).toEqual([sampleReceipt])
  })

  it('forwards the given date range to getGoodsReceipts', async () => {
    mockedGetGoodsReceipts.mockResolvedValue([])
    const { wrapper } = renderWithQueryClient()
    const range = { from: '2026-06-01', to: '2026-06-30' }

    const { result } = renderHook(() => useGoodsReceipts(range), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockedGetGoodsReceipts).toHaveBeenCalledWith(range)
  })
})

describe('useCreateGoodsReceipt', () => {
  it('invalidates goods-receipts, warehouses, suppliers, and products on success', async () => {
    mockedCreateGoodsReceipt.mockResolvedValue({
      data: sampleReceipt,
      message: 'Tạo phiếu nhập kho thành công',
    })
    const { wrapper, queryClient } = renderWithQueryClient()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    const { result } = renderHook(() => useCreateGoodsReceipt(), { wrapper })
    result.current.mutate({
      warehouseName: 'Kho tổng Hà Nội',
      supplierName: 'NCC',
      receiptDate: '2026-06-01',
      items: [
        { productName: 'Giấy A4', productCode: 'VT-001', unit: 'Ram', quantity: 1, price: 1000 },
      ],
      unitName: 'x',
      department: 'x',
      delivererName: 'x',
      invoiceNumber: 'x',
      invoiceDate: '2026-06-01',
      debitAccount: 'x',
      creditAccount: 'x',
      attachedDocuments: 'x',
      amountInWords: 'x',
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['goods-receipts'] })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: WAREHOUSES_KEY })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: SUPPLIERS_KEY })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: PRODUCTS_KEY })
    expect(toast.success).toHaveBeenCalledWith('Tạo phiếu nhập kho thành công')
  })

  it('shows an error toast when creation fails', async () => {
    mockedCreateGoodsReceipt.mockRejectedValue(new Error('boom'))
    const { wrapper } = renderWithQueryClient()

    const { result } = renderHook(() => useCreateGoodsReceipt(), { wrapper })
    result.current.mutate({
      warehouseName: 'Kho tổng Hà Nội',
      supplierName: 'NCC',
      receiptDate: '2026-06-01',
      items: [
        { productName: 'Giấy A4', productCode: 'VT-001', unit: 'Ram', quantity: 1, price: 1000 },
      ],
      unitName: 'x',
      department: 'x',
      delivererName: 'x',
      invoiceNumber: 'x',
      invoiceDate: '2026-06-01',
      debitAccount: 'x',
      creditAccount: 'x',
      attachedDocuments: 'x',
      amountInWords: 'x',
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(toast.error).toHaveBeenCalledWith(
      'Có lỗi xảy ra, vui lòng thử lại sau',
      expect.objectContaining({ duration: expect.any(Number) }),
    )
  })
})

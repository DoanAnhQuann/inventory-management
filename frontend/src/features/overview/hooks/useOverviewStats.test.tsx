import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getGoodsReceipts } from '@/features/goods-receipt/services/goods-receipts.api'

import { getOverviewStats } from '../services/overview.api'
import type { DateRange } from '../types/overview.types'
import { useOverviewStats } from './useOverviewStats'

vi.mock('@/features/goods-receipt/services/goods-receipts.api')
vi.mock('../services/overview.api')

const mockedGetGoodsReceipts = vi.mocked(getGoodsReceipts)
const mockedGetOverviewStats = vi.mocked(getOverviewStats)

function renderWithQueryClient() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  return { queryClient, wrapper }
}

const stats = {
  receiptCount: 11,
  totalValue: 27440000,
  totalQuantity: 288,
  inStockProductCount: 5,
  topProducts: [{ productName: 'Giấy A4', productCode: 'VT-001', unit: 'Ram', totalQuantity: 120 }],
  lowStockProducts: [],
}

const receipts = [{ id: 'rec-1', code: 'PNK-20260601-001' }] as never

beforeEach(() => {
  vi.clearAllMocks()
})

describe('useOverviewStats', () => {
  it('returns zeroed defaults while the stats query has not resolved yet', () => {
    mockedGetOverviewStats.mockReturnValue(new Promise(() => {}))
    mockedGetGoodsReceipts.mockReturnValue(new Promise(() => {}))
    const { wrapper } = renderWithQueryClient()

    const { result } = renderHook(() => useOverviewStats({ from: '', to: '' }), { wrapper })

    expect(result.current.isLoading).toBe(true)
    expect(result.current.receiptCount).toBe(0)
    expect(result.current.totalValue).toBe(0)
    expect(result.current.topProducts).toEqual([])
    expect(result.current.filteredReceipts).toEqual([])
  })

  it('merges resolved stats and filtered receipts once both queries settle', async () => {
    mockedGetOverviewStats.mockResolvedValue(stats)
    mockedGetGoodsReceipts.mockResolvedValue(receipts)
    const { wrapper } = renderWithQueryClient()

    const { result } = renderHook(
      () => useOverviewStats({ from: '2026-06-01', to: '2026-06-30' }),
      { wrapper },
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.receiptCount).toBe(11)
    expect(result.current.totalValue).toBe(27440000)
    expect(result.current.topProducts).toEqual(stats.topProducts)
    expect(result.current.filteredReceipts).toEqual(receipts)
    expect(mockedGetOverviewStats).toHaveBeenCalledWith({ from: '2026-06-01', to: '2026-06-30' })
    expect(mockedGetGoodsReceipts).toHaveBeenCalledWith({ from: '2026-06-01', to: '2026-06-30' })
  })

  it('stays in a loading state if only the receipts query is still pending', async () => {
    mockedGetOverviewStats.mockResolvedValue(stats)
    mockedGetGoodsReceipts.mockReturnValue(new Promise(() => {}))
    const { wrapper } = renderWithQueryClient()

    const { result } = renderHook(() => useOverviewStats({ from: '', to: '' }), { wrapper })

    await waitFor(() => expect(result.current.receiptCount).toBe(11))
    expect(result.current.isLoading).toBe(true)
  })

  it('keeps showing the previous numbers while a new date range is loading', async () => {
    mockedGetOverviewStats.mockResolvedValue(stats)
    mockedGetGoodsReceipts.mockResolvedValue(receipts)
    const { wrapper } = renderWithQueryClient()

    const { result, rerender } = renderHook((range: DateRange) => useOverviewStats(range), {
      wrapper,
      initialProps: { from: '2026-08-12', to: '2026-08-19' },
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.receiptCount).toBe(11)

    mockedGetOverviewStats.mockReturnValue(new Promise(() => {}))
    mockedGetGoodsReceipts.mockReturnValue(new Promise(() => {}))
    rerender({ from: '2026-07-01', to: '2026-07-31' })

    await waitFor(() => expect(result.current.isRefreshing).toBe(true))
    expect(result.current.isLoading).toBe(false)
    expect(result.current.receiptCount).toBe(11)
    expect(result.current.totalValue).toBe(27440000)
    expect(result.current.filteredReceipts).toEqual(receipts)
  })
})

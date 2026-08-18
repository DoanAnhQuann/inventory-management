import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getProductMovements, getProductStockSummaries } from '../services/inventory-report.api'
import { useProductMovements, useProductStockSummaries } from './useInventoryReport'

vi.mock('../services/inventory-report.api')

const mockedGetProductStockSummaries = vi.mocked(getProductStockSummaries)
const mockedGetProductMovements = vi.mocked(getProductMovements)

function renderWithQueryClient() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  return { queryClient, wrapper }
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('useProductStockSummaries', () => {
  it('fetches the product stock summary list', async () => {
    mockedGetProductStockSummaries.mockResolvedValue([
      {
        productId: 'prod_a4',
        productName: 'Giấy A4',
        unit: 'Ram',
        currentStock: 20,
        lastMovementAt: '2026-06-01T00:00:00.000Z',
      },
    ])
    const { wrapper } = renderWithQueryClient()

    const { result } = renderHook(() => useProductStockSummaries(), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(1)
    expect(mockedGetProductStockSummaries).toHaveBeenCalledTimes(1)
  })
})

describe('useProductMovements', () => {
  it('does not fetch when productId is null', () => {
    const { wrapper } = renderWithQueryClient()

    const { result } = renderHook(() => useProductMovements(null), { wrapper })

    expect(result.current.fetchStatus).toBe('idle')
    expect(mockedGetProductMovements).not.toHaveBeenCalled()
  })

  it('fetches the movement history once a productId is provided', async () => {
    mockedGetProductMovements.mockResolvedValue([
      {
        id: 'mov-1',
        productId: 'prod_muc',
        productName: 'Mực in',
        unit: 'Hộp',
        date: '2026-06-01T00:00:00.000Z',
        change: 2,
        balanceAfter: 2,
      },
    ])
    const { wrapper } = renderWithQueryClient()

    const { result } = renderHook(() => useProductMovements('prod_muc'), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockedGetProductMovements).toHaveBeenCalledWith('prod_muc')
    expect(result.current.data).toHaveLength(1)
  })
})

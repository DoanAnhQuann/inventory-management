import { useQuery } from '@tanstack/react-query'

import { useGoodsReceipts } from '@/features/goods-receipt/hooks/useGoodsReceipts'

import { getOverviewStats } from '../services/overview.api'
import type { DateRange } from '../types/overview.types'

export function useOverviewStats(range: DateRange) {
  const { data: filteredReceipts = [], isLoading: receiptsLoading } = useGoodsReceipts({
    from: range.from,
    to: range.to,
  })

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['overview-stats', range.from, range.to],
    queryFn: () => getOverviewStats(range),
  })

  return {
    receiptCount: stats?.receiptCount ?? 0,
    totalValue: stats?.totalValue ?? 0,
    totalQuantity: stats?.totalQuantity ?? 0,
    inStockProductCount: stats?.inStockProductCount ?? 0,
    topProducts: stats?.topProducts ?? [],
    lowStockProducts: stats?.lowStockProducts ?? [],
    filteredReceipts,
    isLoading: statsLoading || receiptsLoading,
  }
}

import { useQuery } from '@tanstack/react-query'

import { getProductMovements, getProductStockSummaries } from '../services/inventory-report.api'

export function useProductStockSummaries() {
  return useQuery({ queryKey: ['inventory-report-products'], queryFn: getProductStockSummaries })
}

export function useProductMovements(productId: string | null) {
  return useQuery({
    queryKey: ['inventory-report-movements', productId],
    queryFn: () => getProductMovements(productId as string),
    enabled: productId !== null,
  })
}

import { useQuery } from '@tanstack/react-query'

import { getStockMovements } from '../services/inventory-report.api'

export function useStockMovements() {
  return useQuery({ queryKey: ['stock-movements'], queryFn: getStockMovements })
}

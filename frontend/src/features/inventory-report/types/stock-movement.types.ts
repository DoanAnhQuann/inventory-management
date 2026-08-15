export interface StockMovement {
  id: string
  productId: string
  productName: string
  unit: string
  date: string
  change: number
  balanceAfter: number
  note?: string
}

export interface ProductStockSummary {
  productId: string
  productName: string
  unit: string
  currentStock: number
  lastMovementAt: string
}

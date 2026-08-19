export interface DateRange {
  from: string
  to: string
}

export interface TopProductStat {
  productName: string
  productCode: string
  unit: string
  totalQuantity: number
}

export interface LowStockProduct {
  productId: string
  productName: string
  productCode: string
  unit: string
  currentStock: number
}

export interface OverviewStats {
  receiptCount: number
  totalValue: number
  totalQuantity: number
  inStockProductCount: number
  topProducts: TopProductStat[]
  lowStockProducts: LowStockProduct[]
}

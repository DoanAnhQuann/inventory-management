import { useMemo } from 'react'

import { useGoodsReceipts } from '@/features/goods-receipt/hooks/useGoodsReceipts'
import type { GoodsReceipt } from '@/features/goods-receipt/types/goods-receipt.types'
import { useProducts } from '@/features/products/hooks/useProducts'

import type { DateRange, LowStockProduct, TopProductStat } from '../types/overview.types'

const LOW_STOCK_COUNT = 3
const TOP_PRODUCTS_COUNT = 3

export function useOverviewStats(range: DateRange) {
  const { data: products = [], isLoading: productsLoading } = useProducts()
  const { data: receipts = [], isLoading: receiptsLoading } = useGoodsReceipts()

  const stats = useMemo(() => {
    const withinPeriod = (receipt: GoodsReceipt) => {
      if (range.from && receipt.receiptDate < range.from) return false
      if (range.to && receipt.receiptDate > range.to) return false
      return true
    }
    const filteredReceipts = receipts.filter(withinPeriod)

    const receiptCount = filteredReceipts.length
    const totalValue = filteredReceipts.reduce((sum, r) => sum + r.totalAmount, 0)
    const totalQuantity = filteredReceipts.reduce(
      (sum, r) => sum + r.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
      0,
    )

    const quantityByProduct = new Map<string, TopProductStat>()
    filteredReceipts.forEach((receipt) => {
      receipt.items.forEach((item) => {
        const existing = quantityByProduct.get(item.productName)
        if (existing) {
          existing.totalQuantity += item.quantity
        } else {
          quantityByProduct.set(item.productName, {
            productName: item.productName,
            productCode: item.productCode,
            unit: item.unit,
            totalQuantity: item.quantity,
          })
        }
      })
    })
    const topProducts = Array.from(quantityByProduct.values())
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, TOP_PRODUCTS_COUNT)

    const receiptsUpToDate = range.to ? receipts.filter((r) => r.receiptDate <= range.to) : receipts
    const stockByProductCode = new Map<string, number>()
    receiptsUpToDate.forEach((receipt) => {
      receipt.items.forEach((item) => {
        stockByProductCode.set(
          item.productCode,
          (stockByProductCode.get(item.productCode) ?? 0) + item.quantity,
        )
      })
    })

    const stockByProduct: LowStockProduct[] = products.map((product) => ({
      productId: product.id,
      productName: product.name,
      productCode: product.code,
      unit: product.unit,
      currentStock: stockByProductCode.get(product.code) ?? 0,
    }))

    const inStockProductCount = stockByProduct.filter((p) => p.currentStock > 0).length
    const lowStockProducts = [...stockByProduct]
      .sort((a, b) => a.currentStock - b.currentStock)
      .slice(0, LOW_STOCK_COUNT)

    return {
      receiptCount,
      totalValue,
      totalQuantity,
      inStockProductCount,
      topProducts,
      lowStockProducts,
      filteredReceipts,
    }
  }, [products, receipts, range.from, range.to])

  return { ...stats, isLoading: productsLoading || receiptsLoading }
}

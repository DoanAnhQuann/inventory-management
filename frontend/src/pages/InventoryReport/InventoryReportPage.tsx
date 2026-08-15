import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { MovementTimeline } from '@/features/inventory-report/components/MovementTimeline'
import { ProductStockList } from '@/features/inventory-report/components/ProductStockList'
import { useStockMovements } from '@/features/inventory-report/hooks/useInventoryReport'
import type { ProductStockSummary } from '@/features/inventory-report/types/stock-movement.types'

export default function InventoryReportPage() {
  const { data: movements = [], isLoading } = useStockMovements()
  const [search, setSearch] = useState('')
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)

  const productsSummary = useMemo(() => {
    const summaryByProduct = new Map<string, ProductStockSummary>()
    for (const movement of movements) {
      const existing = summaryByProduct.get(movement.productId)
      if (!existing || movement.date > existing.lastMovementAt) {
        summaryByProduct.set(movement.productId, {
          productId: movement.productId,
          productName: movement.productName,
          unit: movement.unit,
          currentStock: movement.balanceAfter,
          lastMovementAt: movement.date,
        })
      }
    }
    return Array.from(summaryByProduct.values()).sort((a, b) =>
      a.productName.localeCompare(b.productName),
    )
  }, [movements])

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    if (!keyword) return productsSummary
    return productsSummary.filter((product) => product.productName.toLowerCase().includes(keyword))
  }, [productsSummary, search])

  // Nếu lựa chọn hiện tại không còn nằm trong kết quả tìm kiếm (hoặc chưa chọn gì),
  // tự động dùng sản phẩm đầu tiên — tính ngay lúc render, không đồng bộ qua effect
  // (tránh render thừa 1 lần, xem react-hooks/set-state-in-effect).
  const effectiveProductId =
    selectedProductId && filteredProducts.some((product) => product.productId === selectedProductId)
      ? selectedProductId
      : (filteredProducts[0]?.productId ?? null)

  const selectedProduct = productsSummary.find(
    (product) => product.productId === effectiveProductId,
  )
  const selectedMovements = useMemo(
    () =>
      movements
        .filter((movement) => movement.productId === effectiveProductId)
        .sort((a, b) => (a.date < b.date ? 1 : -1)),
    [movements, effectiveProductId],
  )

  return (
    <div className="flex flex-col gap-6 lg:h-full">
      <div className="shrink-0">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Lịch sử biến động tồn kho
        </h1>
        <p className="text-sm text-muted-foreground">
          Theo dõi lịch sử nhập kho và tồn hiện tại theo từng sản phẩm.
        </p>
      </div>

      <div className="relative max-w-sm shrink-0">
        <Search
          size={16}
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          placeholder="Tìm theo tên sản phẩm..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner size={28} />
        </div>
      ) : filteredProducts.length === 0 ? (
        <Card className="p-10 text-center text-sm text-muted-foreground">
          Không tìm thấy sản phẩm phù hợp với từ khoá "{search}".
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:min-h-0 lg:flex-1 lg:grid-cols-[320px_1fr]">
          <ProductStockList
            products={filteredProducts}
            selectedProductId={effectiveProductId}
            onSelect={setSelectedProductId}
          />

          {selectedProduct && (
            <MovementTimeline
              productName={selectedProduct.productName}
              unit={selectedProduct.unit}
              currentStock={selectedProduct.currentStock}
              movements={selectedMovements}
            />
          )}
        </div>
      )}
    </div>
  )
}

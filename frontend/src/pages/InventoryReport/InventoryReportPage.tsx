import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { MovementTimeline } from '@/features/inventory-report/components/MovementTimeline'
import { ProductStockList } from '@/features/inventory-report/components/ProductStockList'
import {
  useProductMovements,
  useProductStockSummaries,
} from '@/features/inventory-report/hooks/useInventoryReport'

export default function InventoryReportPage() {
  const { data: products = [], isLoading: productsLoading } = useProductStockSummaries()
  const [search, setSearch] = useState('')
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    if (!keyword) return products
    return products.filter((product) => product.productName.toLowerCase().includes(keyword))
  }, [products, search])

  const effectiveProductId =
    selectedProductId && filteredProducts.some((product) => product.productId === selectedProductId)
      ? selectedProductId
      : (filteredProducts[0]?.productId ?? null)

  const selectedProduct = products.find((product) => product.productId === effectiveProductId)
  const { data: movements = [], isLoading: movementsLoading } =
    useProductMovements(effectiveProductId)

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

      {productsLoading ? (
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

          {selectedProduct &&
            (movementsLoading ? (
              <Card className="flex items-center justify-center p-5 lg:h-full lg:min-h-0">
                <Spinner size={24} />
              </Card>
            ) : (
              <MovementTimeline
                productName={selectedProduct.productName}
                unit={selectedProduct.unit}
                currentStock={selectedProduct.currentStock}
                movements={movements}
              />
            ))}
        </div>
      )}
    </div>
  )
}

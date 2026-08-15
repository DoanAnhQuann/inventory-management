import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/cn'
import { formatDateTime } from '@/utils/date'

import type { ProductStockSummary } from '../types/stock-movement.types'

interface ProductStockListProps {
  products: ProductStockSummary[]
  selectedProductId: string | null
  onSelect: (productId: string) => void
}

export function ProductStockList({ products, selectedProductId, onSelect }: ProductStockListProps) {
  if (products.length === 0) {
    return (
      <Card className="p-6 text-center text-sm text-muted-foreground">
        Không tìm thấy sản phẩm phù hợp.
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {products.map((product) => (
        <button
          key={product.productId}
          type="button"
          onClick={() => onSelect(product.productId)}
          className={cn(
            'flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3 text-left transition-colors hover:border-ring',
            selectedProductId === product.productId && 'border-primary bg-accent',
          )}
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{product.productName}</p>
            <p className="text-xs text-muted-foreground">
              Cập nhật {formatDateTime(product.lastMovementAt)}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-base font-bold text-foreground">{product.currentStock}</p>
            <p className="text-[11px] text-muted-foreground">{product.unit}</p>
          </div>
        </button>
      ))}
    </div>
  )
}

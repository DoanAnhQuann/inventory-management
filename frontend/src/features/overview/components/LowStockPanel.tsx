import { Package } from 'lucide-react'

import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/cn'

import type { LowStockProduct } from '../types/overview.types'

interface LowStockPanelProps {
  data: LowStockProduct[]
}
const REFERENCE_STOCK_LEVEL = 100

type Severity = 'critical' | 'warning' | 'ok'

function severityOf(stock: number): Severity {
  if (stock <= 10) return 'critical'
  if (stock <= 50) return 'warning'
  return 'ok'
}

const SEVERITY_ICON_CLASS: Record<Severity, string> = {
  critical: 'bg-destructive/10 text-destructive',
  warning: 'bg-warning/10 text-warning',
  ok: 'bg-success/10 text-success',
}

const SEVERITY_BAR_CLASS: Record<Severity, string> = {
  critical: 'bg-destructive',
  warning: 'bg-warning',
  ok: 'bg-success',
}

export function LowStockPanel({ data }: LowStockPanelProps) {
  return (
    <Card className="flex flex-col gap-1 p-4">
      <div>
        <h2 className="text-sm font-bold text-foreground">Thống kê tồn kho</h2>
        <p className="mt-1 text-xs text-muted-foreground">3 mặt hàng có tồn kho thấp nhất</p>
      </div>

      {data.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">Chưa có sản phẩm nào.</p>
      ) : (
        <div className="mt-1 flex flex-col">
          {data.map((item) => {
            const severity = severityOf(item.currentStock)
            const widthPercent = Math.min(100, (item.currentStock / REFERENCE_STOCK_LEVEL) * 100)
            return (
              <div
                key={item.productId}
                className="flex items-center justify-between gap-4 border-b border-border py-2.5 last:border-0"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <div
                    className={cn(
                      'grid size-8 shrink-0 place-items-center rounded-lg',
                      SEVERITY_ICON_CLASS[severity],
                    )}
                  >
                    <Package size={15} />
                  </div>
                  <div className="min-w-0">
                    <b className="block truncate text-xs text-foreground">{item.productName}</b>
                    <span className="mt-0.5 block text-[10px] text-muted-foreground">
                      {item.productCode} · {item.unit}
                    </span>
                  </div>
                </div>
                <div className="w-[76px] shrink-0 text-right">
                  <b className="text-sm tabular-nums text-foreground">{item.currentStock}</b>
                  <span className="block text-[10px] text-muted-foreground">còn lại</span>
                  <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className={cn('h-full rounded-full', SEVERITY_BAR_CLASS[severity])}
                      style={{ width: `${widthPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}

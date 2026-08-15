import { ArrowDownRight, ArrowUpRight } from 'lucide-react'

import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/cn'
import { formatDateTime } from '@/utils/date'

import type { StockMovement } from '../types/stock-movement.types'

interface MovementTimelineProps {
  productName: string
  unit: string
  currentStock: number
  movements: StockMovement[]
}

export function MovementTimeline({
  productName,
  unit,
  currentStock,
  movements,
}: MovementTimelineProps) {
  return (
    <Card className="flex flex-col gap-5 p-5 lg:h-full lg:min-h-0">
      <div className="flex shrink-0 flex-wrap items-end justify-between gap-4 border-b border-border pb-4">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase">Sản phẩm</p>
          <h2 className="text-lg font-bold text-foreground">{productName}</h2>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Tồn hiện tại</p>
          <p className="text-2xl font-bold text-primary">
            {currentStock}
            <span className="ml-1 text-sm font-normal text-muted-foreground">{unit}</span>
          </p>
        </div>
      </div>

      {movements.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">Chưa có biến động nào.</p>
      ) : (
        <ol className="flex min-h-0 flex-col overflow-y-auto pr-1">
          {movements.map((movement, index) => (
            <li key={movement.id} className="relative flex gap-4 pb-6 pl-1 last:pb-0">
              {index !== movements.length - 1 && (
                <span className="absolute top-5 left-[7px] h-full w-px bg-border" />
              )}
              <span
                className={cn(
                  'relative z-10 mt-1.5 size-3.5 shrink-0 rounded-full border-2 border-card',
                  movement.change >= 0 ? 'bg-success' : 'bg-destructive',
                )}
              />
              <div className="flex flex-1 flex-wrap items-center justify-between gap-x-4 gap-y-1">
                <div>
                  <p className="text-sm text-foreground">{formatDateTime(movement.date)}</p>
                  {movement.note && (
                    <p className="text-xs text-muted-foreground">{movement.note}</p>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 text-sm font-bold',
                      movement.change >= 0 ? 'text-success' : 'text-destructive',
                    )}
                  >
                    {movement.change >= 0 ? (
                      <ArrowUpRight size={14} />
                    ) : (
                      <ArrowDownRight size={14} />
                    )}
                    {movement.change >= 0 ? '+' : ''}
                    {movement.change}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Tồn: {movement.balanceAfter}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </Card>
  )
}

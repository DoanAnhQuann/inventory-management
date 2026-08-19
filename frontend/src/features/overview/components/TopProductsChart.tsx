import { Card } from '@/components/ui/Card'

import type { TopProductStat } from '../types/overview.types'

interface TopProductsChartProps {
  data: TopProductStat[]
}

export function TopProductsChart({ data }: TopProductsChartProps) {
  const maxValue = Math.max(...data.map((item) => item.totalQuantity), 1)

  return (
    <Card className="flex flex-col gap-3 p-4">
      <div>
        <h2 className="text-sm font-bold text-foreground">Top sản phẩm nhập kho</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Xếp hạng theo tổng số lượng đã nhập trong khoảng thời gian đã chọn
        </p>
      </div>

      {data.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          Chưa có dữ liệu nhập kho trong khoảng thời gian này.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {data.map((item) => {
            const widthPercent = (item.totalQuantity / maxValue) * 100
            return (
              <div key={item.productName} className="group flex items-center gap-3">
                <span
                  className="w-[38%] shrink-0 truncate text-xs font-medium text-foreground sm:w-[42%]"
                  title={item.productName}
                >
                  {item.productName}
                </span>
                <div className="relative h-2.5 min-w-0 flex-1 rounded-full bg-secondary">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-primary transition-[width,filter] group-hover:brightness-110"
                    style={{ width: `${widthPercent}%` }}
                  />
                </div>
                <span className="w-16 shrink-0 text-right text-xs font-semibold tabular-nums text-foreground">
                  {item.totalQuantity} {item.unit}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}

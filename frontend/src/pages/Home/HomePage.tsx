import { format } from 'date-fns'
import { ArrowDownToLine, Boxes, PackagePlus, Plus, Wallet } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { TimeFilter } from '@/components/ui/TimeFilter'
import { ROUTES } from '@/constants/routes'
import { GoodsReceiptOverviewTable } from '@/features/overview/components/GoodsReceiptOverviewTable'
import { LowStockPanel } from '@/features/overview/components/LowStockPanel'
import { StatCard } from '@/features/overview/components/StatCard'
import { TopProductsChart } from '@/features/overview/components/TopProductsChart'
import { useOverviewStats } from '@/features/overview/hooks/useOverviewStats'
import { formatCurrency } from '@/utils/currency'
import { formatDate } from '@/utils/date'
import { type DateRangeValue, getPresetRange } from '@/utils/dateRange'

const RECEIPT_PAGE_SIZE = 8

// Mặc định mở trang với 7 ngày gần nhất (khớp preset "7 ngày qua" của TimeFilter) — không mở
// trống "toàn bộ thời gian" vì càng nhiều dữ liệu mock/thật cộng dồn qua thời gian, tải trang
// không lọc gì sẽ càng chậm và số liệu ban đầu càng khó đọc.
function defaultRange(): DateRangeValue {
  const { from, to } = getPresetRange(7)
  return { startDate: format(from, 'yyyy-MM-dd'), endDate: format(to, 'yyyy-MM-dd') }
}

function periodLabel(range: DateRangeValue) {
  if (!range.startDate && !range.endDate) return 'Toàn bộ thời gian'
  const from = range.startDate ? formatDate(range.startDate) : '...'
  const to = range.endDate ? formatDate(range.endDate) : 'nay'
  return `Từ ${from} đến ${to}`
}

function stockAsOfLabel(range: DateRangeValue) {
  return `Tính đến ${range.endDate ? formatDate(range.endDate) : 'hôm nay'}`
}

export default function HomePage() {
  const navigate = useNavigate()
  const [range, setRange] = useState<DateRangeValue>(defaultRange)
  const [page, setPage] = useState(1)

  const stats = useOverviewStats({ from: range.startDate ?? '', to: range.endDate ?? '' })

  const handleRangeChange = (next: DateRangeValue) => {
    setRange(next)
    setPage(1)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Tổng quan</h1>
          <p className="text-sm text-muted-foreground">
            Theo dõi và quản lý luồng hàng hoá trong kho của bạn.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <TimeFilter value={range} onChange={handleRangeChange} label="Ngày nhập" />
          <Button onClick={() => navigate(ROUTES.GOODS_RECEIPT)}>
            <Plus size={16} /> Tạo phiếu nhập kho
          </Button>
        </div>
      </div>

      {stats.isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner size={28} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={ArrowDownToLine}
              iconClassName="bg-accent text-primary"
              label="Phiếu nhập"
              value={new Intl.NumberFormat('vi-VN').format(stats.receiptCount)}
              footnote={periodLabel(range)}
            />
            <StatCard
              icon={Wallet}
              iconClassName="bg-accent text-primary"
              label="Giá trị nhập"
              value={formatCurrency(stats.totalValue)}
              footnote={periodLabel(range)}
            />
            <StatCard
              icon={Boxes}
              iconClassName="bg-success/10 text-success"
              label="Tổng mặt hàng trong kho"
              value={new Intl.NumberFormat('vi-VN').format(stats.inStockProductCount)}
              footnote={stockAsOfLabel(range)}
            />
            <StatCard
              icon={PackagePlus}
              iconClassName="bg-success/10 text-success"
              label="Tổng số lượng nhập"
              value={new Intl.NumberFormat('vi-VN').format(stats.totalQuantity)}
              footnote={periodLabel(range)}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.15fr_0.85fr]">
            <TopProductsChart data={stats.topProducts} />
            <LowStockPanel data={stats.lowStockProducts} />
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <h2 className="text-sm font-bold text-foreground">Quản lý phiếu nhập kho</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Danh sách phiếu nhập trong khoảng thời gian đã chọn
              </p>
            </div>
            <GoodsReceiptOverviewTable
              receipts={stats.filteredReceipts}
              page={page}
              pageSize={RECEIPT_PAGE_SIZE}
              onPageChange={setPage}
            />
          </div>
        </>
      )}
    </div>
  )
}

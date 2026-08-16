import { Eye } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { DataTable } from '@/components/ui/DataTable'
import { Dialog } from '@/components/ui/Dialog'
import { GoodsReceiptPreview } from '@/features/goods-receipt/components/GoodsReceiptPreview'
import type { GoodsReceipt } from '@/features/goods-receipt/types/goods-receipt.types'
import { formatCurrency } from '@/utils/currency'
import { formatDate } from '@/utils/date'

interface GoodsReceiptOverviewTableProps {
  receipts: GoodsReceipt[]
  page: number
  pageSize: number
  onPageChange: (page: number) => void
}

export function GoodsReceiptOverviewTable({
  receipts,
  page,
  pageSize,
  onPageChange,
}: GoodsReceiptOverviewTableProps) {
  const [viewingReceipt, setViewingReceipt] = useState<GoodsReceipt | null>(null)
  const paged = receipts.slice((page - 1) * pageSize, page * pageSize)

  return (
    <>
      <DataTable
        data={paged}
        getRowKey={(receipt) => receipt.id}
        emptyMessage="Chưa có phiếu nhập kho nào trong khoảng thời gian này."
        columns={[
          {
            key: 'code',
            header: 'Số phiếu',
            render: (receipt) => <b className="text-primary">{receipt.code}</b>,
          },
          {
            key: 'date',
            header: 'Ngày nhập',
            render: (receipt) => formatDate(receipt.receiptDate),
          },
          { key: 'warehouse', header: 'Kho nhập', render: (receipt) => receipt.warehouseName },
          { key: 'supplier', header: 'Nhà cung cấp', render: (receipt) => receipt.supplierName },
          {
            key: 'items',
            header: 'Số mặt hàng',
            render: (receipt) => receipt.items.length,
            className: 'text-center',
          },
          {
            key: 'total',
            header: 'Tổng tiền',
            render: (receipt) => (
              <b className="tabular-nums">{formatCurrency(receipt.totalAmount)}</b>
            ),
            className: 'text-right',
          },
        ]}
        renderActions={(receipt) => (
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Xem chi tiết ${receipt.code}`}
            onClick={() => setViewingReceipt(receipt)}
          >
            <Eye size={16} />
          </Button>
        )}
        renderMobileCard={(receipt) => (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <b className="text-sm text-primary">{receipt.code}</b>
              <span className="text-xs text-muted-foreground">
                {formatDate(receipt.receiptDate)}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              {receipt.warehouseName} · {receipt.supplierName}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{receipt.items.length} mặt hàng</span>
              <b className="tabular-nums text-foreground">{formatCurrency(receipt.totalAmount)}</b>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="self-start"
              onClick={() => setViewingReceipt(receipt)}
            >
              <Eye size={14} /> Xem chi tiết
            </Button>
          </div>
        )}
        pagination={{ current: page, pageSize, total: receipts.length, onChange: onPageChange }}
      />

      <Dialog
        open={viewingReceipt !== null}
        onClose={() => setViewingReceipt(null)}
        title={viewingReceipt ? `Chi tiết phiếu ${viewingReceipt.code}` : 'Chi tiết phiếu nhập kho'}
        className="max-h-[calc(100vh-2rem)] max-w-4xl gap-3 p-4"
        footer={
          <Button variant="outline" onClick={() => setViewingReceipt(null)}>
            Đóng
          </Button>
        }
      >
        {viewingReceipt && (
          <div className="min-h-0 flex-1 overflow-y-auto">
            <GoodsReceiptPreview
              values={viewingReceipt}
              grandTotal={viewingReceipt.totalAmount}
              receiptCode={viewingReceipt.code}
            />
          </div>
        )}
      </Dialog>
    </>
  )
}

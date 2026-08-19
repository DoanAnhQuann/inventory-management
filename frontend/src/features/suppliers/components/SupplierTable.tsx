import { Pencil, Trash2 } from 'lucide-react'

import { DataTable } from '@/components/ui/DataTable'
import type { PaginationProps } from '@/components/ui/Pagination'
import { formatDateTime } from '@/utils/date'

import type { Supplier } from '../types/supplier.types'

interface SupplierTableProps {
  suppliers: Supplier[]
  onEdit: (supplier: Supplier) => void
  onDelete: (supplier: Supplier) => void
  pagination?: PaginationProps
}

export function SupplierTable({ suppliers, onEdit, onDelete, pagination }: SupplierTableProps) {
  return (
    <DataTable
      data={suppliers}
      getRowKey={(supplier) => supplier.id}
      emptyMessage='Chưa có nhà cung cấp nào. Bấm "Thêm nhà cung cấp" để tạo mới.'
      pagination={pagination}
      columns={[
        {
          key: 'name',
          header: 'Tên nhà cung cấp',
          render: (supplier) => (
            <span className="font-medium text-foreground">{supplier.name}</span>
          ),
        },
        {
          key: 'createdAt',
          header: 'Ngày tạo',
          render: (supplier) => (
            <span className="text-muted-foreground">{formatDateTime(supplier.createdAt)}</span>
          ),
        },
        {
          key: 'updatedAt',
          header: 'Ngày cập nhật',
          render: (supplier) => (
            <span className="text-muted-foreground">{formatDateTime(supplier.updatedAt)}</span>
          ),
        },
      ]}
      renderActions={(supplier) => (
        <>
          <button
            type="button"
            aria-label={`Sửa ${supplier.name}`}
            className="text-muted-foreground hover:text-foreground"
            onClick={() => onEdit(supplier)}
          >
            <Pencil size={15} />
          </button>
          <button
            type="button"
            aria-label={`Xoá ${supplier.name}`}
            className="text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(supplier)}
          >
            <Trash2 size={15} />
          </button>
        </>
      )}
      renderMobileCard={(supplier) => (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <p className="font-medium text-foreground">{supplier.name}</p>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                aria-label={`Sửa ${supplier.name}`}
                className="text-muted-foreground hover:text-foreground"
                onClick={() => onEdit(supplier)}
              >
                <Pencil size={15} />
              </button>
              <button
                type="button"
                aria-label={`Xoá ${supplier.name}`}
                className="text-muted-foreground hover:text-destructive"
                onClick={() => onDelete(supplier)}
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
          <div className="flex gap-6 border-t border-border pt-3 text-xs">
            <div className="flex flex-col gap-0.5">
              <span className="text-muted-foreground">Ngày tạo</span>
              <span className="text-foreground">{formatDateTime(supplier.createdAt)}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-muted-foreground">Ngày cập nhật</span>
              <span className="text-foreground">{formatDateTime(supplier.updatedAt)}</span>
            </div>
          </div>
        </div>
      )}
    />
  )
}

import { Pencil, Trash2 } from 'lucide-react'

import { DataTable } from '@/components/ui/DataTable'
import type { PaginationProps } from '@/components/ui/Pagination'
import { formatDateTime } from '@/utils/date'

import type { Warehouse } from '../types/warehouse.types'

interface WarehouseTableProps {
  warehouses: Warehouse[]
  onEdit: (warehouse: Warehouse) => void
  onDelete: (warehouse: Warehouse) => void
  pagination?: PaginationProps
}

export function WarehouseTable({ warehouses, onEdit, onDelete, pagination }: WarehouseTableProps) {
  return (
    <DataTable
      data={warehouses}
      getRowKey={(warehouse) => warehouse.id}
      emptyMessage='Chưa có kho nào. Bấm "Thêm kho" để tạo mới.'
      pagination={pagination}
      columns={[
        {
          key: 'name',
          header: 'Tên kho',
          render: (warehouse) => (
            <span className="font-medium text-foreground">{warehouse.name}</span>
          ),
        },
        {
          key: 'location',
          header: 'Địa điểm',
          render: (warehouse) => (
            <span className="text-muted-foreground">{warehouse.location}</span>
          ),
        },
        {
          key: 'createdAt',
          header: 'Ngày tạo',
          render: (warehouse) => (
            <span className="text-muted-foreground">{formatDateTime(warehouse.createdAt)}</span>
          ),
        },
        {
          key: 'inboundAt',
          header: 'Ngày nhập',
          render: (warehouse) => (
            <span className="text-muted-foreground">{formatDateTime(warehouse.inboundAt)}</span>
          ),
        },
      ]}
      renderActions={(warehouse) => (
        <>
          <button
            type="button"
            aria-label={`Sửa ${warehouse.name}`}
            className="text-muted-foreground hover:text-foreground"
            onClick={() => onEdit(warehouse)}
          >
            <Pencil size={15} />
          </button>
          <button
            type="button"
            aria-label={`Xoá ${warehouse.name}`}
            className="text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(warehouse)}
          >
            <Trash2 size={15} />
          </button>
        </>
      )}
      renderMobileCard={(warehouse) => (
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-medium text-foreground">{warehouse.name}</p>
              <p className="text-sm text-muted-foreground">{warehouse.location}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                aria-label={`Sửa ${warehouse.name}`}
                className="text-muted-foreground hover:text-foreground"
                onClick={() => onEdit(warehouse)}
              >
                <Pencil size={15} />
              </button>
              <button
                type="button"
                aria-label={`Xoá ${warehouse.name}`}
                className="text-muted-foreground hover:text-destructive"
                onClick={() => onDelete(warehouse)}
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
          <div className="flex gap-6 border-t border-border pt-3 text-xs">
            <div className="flex flex-col gap-0.5">
              <span className="text-muted-foreground">Ngày tạo</span>
              <span className="text-foreground">{formatDateTime(warehouse.createdAt)}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-muted-foreground">Ngày nhập</span>
              <span className="text-foreground">{formatDateTime(warehouse.inboundAt)}</span>
            </div>
          </div>
        </div>
      )}
    />
  )
}

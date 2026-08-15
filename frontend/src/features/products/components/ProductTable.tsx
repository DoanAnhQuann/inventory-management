import { Pencil, Trash2 } from 'lucide-react'

import { DataTable } from '@/components/ui/DataTable'
import { formatCurrency } from '@/utils/currency'
import { formatDateTime } from '@/utils/date'

import type { Product } from '../types/product.types'

interface ProductTableProps {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
}

export function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  return (
    <DataTable
      data={products}
      getRowKey={(product) => product.id}
      emptyMessage='Chưa có sản phẩm nào. Bấm "Thêm sản phẩm" để tạo mới.'
      columns={[
        {
          key: 'name',
          header: 'Tên sản phẩm',
          render: (product) => <span className="font-medium text-foreground">{product.name}</span>,
        },
        {
          key: 'code',
          header: 'Mã số',
          render: (product) => <span className="text-muted-foreground">{product.code}</span>,
        },
        {
          key: 'unit',
          header: 'Đơn vị tính',
          render: (product) => <span className="text-muted-foreground">{product.unit}</span>,
        },
        {
          key: 'price',
          header: 'Đơn giá',
          className: 'text-right',
          render: (product) => (
            <span className="font-medium text-foreground">{formatCurrency(product.price)}</span>
          ),
        },
        {
          key: 'createdAt',
          header: 'Ngày tạo',
          render: (product) => (
            <span className="text-muted-foreground">{formatDateTime(product.createdAt)}</span>
          ),
        },
        {
          key: 'updatedAt',
          header: 'Ngày cập nhật',
          render: (product) => (
            <span className="text-muted-foreground">{formatDateTime(product.updatedAt)}</span>
          ),
        },
      ]}
      renderActions={(product) => (
        <>
          <button
            type="button"
            aria-label={`Sửa ${product.name}`}
            className="text-muted-foreground hover:text-foreground"
            onClick={() => onEdit(product)}
          >
            <Pencil size={15} />
          </button>
          <button
            type="button"
            aria-label={`Xoá ${product.name}`}
            className="text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(product)}
          >
            <Trash2 size={15} />
          </button>
        </>
      )}
      renderMobileCard={(product) => (
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-medium text-foreground">{product.name}</p>
              <p className="text-sm text-muted-foreground">
                {product.code} · {product.unit}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                aria-label={`Sửa ${product.name}`}
                className="text-muted-foreground hover:text-foreground"
                onClick={() => onEdit(product)}
              >
                <Pencil size={15} />
              </button>
              <button
                type="button"
                aria-label={`Xoá ${product.name}`}
                className="text-muted-foreground hover:text-destructive"
                onClick={() => onDelete(product)}
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-0.5 border-t border-border pt-3 text-xs">
            <span className="text-muted-foreground">Đơn giá</span>
            <span className="text-sm font-medium text-foreground">
              {formatCurrency(product.price)}
            </span>
          </div>
          <div className="flex gap-6 text-xs">
            <div className="flex flex-col gap-0.5">
              <span className="text-muted-foreground">Ngày tạo</span>
              <span className="text-foreground">{formatDateTime(product.createdAt)}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-muted-foreground">Ngày cập nhật</span>
              <span className="text-foreground">{formatDateTime(product.updatedAt)}</span>
            </div>
          </div>
        </div>
      )}
    />
  )
}

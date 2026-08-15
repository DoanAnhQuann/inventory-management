import { Pencil, Trash2 } from 'lucide-react'

import { Card } from '@/components/ui/Card'
import { formatDateTime } from '@/utils/date'

import type { Warehouse } from '../types/warehouse.types'

interface WarehouseTableProps {
  warehouses: Warehouse[]
  onEdit: (warehouse: Warehouse) => void
  onDelete: (warehouse: Warehouse) => void
}

export function WarehouseTable({ warehouses, onEdit, onDelete }: WarehouseTableProps) {
  if (warehouses.length === 0) {
    return (
      <Card className="p-10 text-center text-sm text-muted-foreground">
        Chưa có kho nào. Bấm "Thêm kho" để tạo mới.
      </Card>
    )
  }

  return (
    <>
      <Card className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="bg-secondary text-left text-[11px] tracking-wide text-muted-foreground uppercase">
              <th className="px-5 py-3 font-semibold">Tên kho</th>
              <th className="px-5 py-3 font-semibold">Địa điểm</th>
              <th className="px-5 py-3 font-semibold">Ngày tạo</th>
              <th className="px-5 py-3 font-semibold">Ngày nhập</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {warehouses.map((warehouse) => (
              <tr key={warehouse.id} className="border-t border-border hover:bg-secondary/50">
                <td className="px-5 py-3 font-medium text-foreground">{warehouse.name}</td>
                <td className="px-5 py-3 text-muted-foreground">{warehouse.location}</td>
                <td className="px-5 py-3 text-muted-foreground">
                  {formatDateTime(warehouse.createdAt)}
                </td>
                <td className="px-5 py-3 text-muted-foreground">
                  {formatDateTime(warehouse.inboundAt)}
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-2">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div className="flex flex-col gap-3 md:hidden">
        {warehouses.map((warehouse) => (
          <Card key={warehouse.id} className="flex flex-col gap-3 p-4">
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
          </Card>
        ))}
      </div>
    </>
  )
}

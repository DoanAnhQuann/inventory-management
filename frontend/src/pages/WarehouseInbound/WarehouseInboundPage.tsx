import { Plus } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { DeleteWarehouseDialog } from '@/features/warehouses/components/DeleteWarehouseDialog'
import { WarehouseFormDialog } from '@/features/warehouses/components/WarehouseFormDialog'
import { WarehouseTable } from '@/features/warehouses/components/WarehouseTable'
import {
  useCreateWarehouse,
  useDeleteWarehouse,
  useUpdateWarehouse,
  useWarehouses,
} from '@/features/warehouses/hooks/useWarehouses'
import type { Warehouse } from '@/features/warehouses/types/warehouse.types'

interface FormState {
  mode: 'create' | 'edit'
  warehouse?: Warehouse
}

export default function WarehouseInboundPage() {
  const { data: warehouses = [], isLoading } = useWarehouses()
  const createWarehouse = useCreateWarehouse()
  const updateWarehouse = useUpdateWarehouse()
  const deleteWarehouse = useDeleteWarehouse()

  const [formState, setFormState] = useState<FormState | null>(null)
  const [warehouseToDelete, setWarehouseToDelete] = useState<Warehouse | null>(null)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Quản lý kho nhập
          </h1>
          <p className="text-sm text-muted-foreground">Danh sách kho tiếp nhận hàng hoá.</p>
        </div>
        <Button onClick={() => setFormState({ mode: 'create' })}>
          <Plus size={16} /> Thêm kho
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Đang tải...</p>
      ) : (
        <WarehouseTable
          warehouses={warehouses}
          onEdit={(warehouse) => setFormState({ mode: 'edit', warehouse })}
          onDelete={setWarehouseToDelete}
        />
      )}

      <WarehouseFormDialog
        open={formState !== null}
        mode={formState?.mode ?? 'create'}
        defaultValues={
          formState?.warehouse
            ? { name: formState.warehouse.name, location: formState.warehouse.location }
            : undefined
        }
        submitting={createWarehouse.isPending || updateWarehouse.isPending}
        onClose={() => setFormState(null)}
        onSubmit={(values) => {
          if (formState?.mode === 'edit' && formState.warehouse) {
            updateWarehouse.mutate(
              { id: formState.warehouse.id, payload: values },
              { onSuccess: () => setFormState(null) },
            )
          } else {
            createWarehouse.mutate(values, { onSuccess: () => setFormState(null) })
          }
        }}
      />

      <DeleteWarehouseDialog
        warehouse={warehouseToDelete}
        submitting={deleteWarehouse.isPending}
        onClose={() => setWarehouseToDelete(null)}
        onConfirm={() => {
          if (!warehouseToDelete) return
          deleteWarehouse.mutate(warehouseToDelete.id, {
            onSuccess: () => setWarehouseToDelete(null),
          })
        }}
      />
    </div>
  )
}

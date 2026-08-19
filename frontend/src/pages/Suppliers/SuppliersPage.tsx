import { Plus } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { DeleteSupplierDialog } from '@/features/suppliers/components/DeleteSupplierDialog'
import { SupplierFormDialog } from '@/features/suppliers/components/SupplierFormDialog'
import { SupplierTable } from '@/features/suppliers/components/SupplierTable'
import {
  useCreateSupplier,
  useDeleteSupplier,
  useSuppliers,
  useUpdateSupplier,
} from '@/features/suppliers/hooks/useSuppliers'
import type { Supplier } from '@/features/suppliers/types/supplier.types'

interface FormState {
  mode: 'create' | 'edit'
  supplier?: Supplier
}

const PAGE_SIZE = 10

export default function SuppliersPage() {
  const { data: suppliers = [], isLoading } = useSuppliers()
  const createSupplier = useCreateSupplier()
  const updateSupplier = useUpdateSupplier()
  const deleteSupplier = useDeleteSupplier()

  const [formState, setFormState] = useState<FormState | null>(null)
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null)
  const [page, setPage] = useState(1)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Nhà cung cấp</h1>
          <p className="text-sm text-muted-foreground">Danh sách đối tác cung cấp hàng hoá.</p>
        </div>
        <Button onClick={() => setFormState({ mode: 'create' })}>
          <Plus size={16} /> Thêm nhà cung cấp
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner size={28} />
        </div>
      ) : (
        <SupplierTable
          suppliers={suppliers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)}
          onEdit={(supplier) => setFormState({ mode: 'edit', supplier })}
          onDelete={setSupplierToDelete}
          pagination={{
            current: page,
            pageSize: PAGE_SIZE,
            total: suppliers.length,
            onChange: setPage,
          }}
        />
      )}

      <SupplierFormDialog
        open={formState !== null}
        mode={formState?.mode ?? 'create'}
        defaultValues={formState?.supplier ? { name: formState.supplier.name } : undefined}
        submitting={createSupplier.isPending || updateSupplier.isPending}
        onClose={() => setFormState(null)}
        onSubmit={(values) => {
          if (formState?.mode === 'edit' && formState.supplier) {
            updateSupplier.mutate(
              { id: formState.supplier.id, payload: values },
              { onSuccess: () => setFormState(null) },
            )
          } else {
            createSupplier.mutate(values, { onSuccess: () => setFormState(null) })
          }
        }}
      />

      <DeleteSupplierDialog
        supplier={supplierToDelete}
        submitting={deleteSupplier.isPending}
        onClose={() => setSupplierToDelete(null)}
        onConfirm={() => {
          if (!supplierToDelete) return
          deleteSupplier.mutate(supplierToDelete.id, { onSuccess: () => setSupplierToDelete(null) })
        }}
      />
    </div>
  )
}

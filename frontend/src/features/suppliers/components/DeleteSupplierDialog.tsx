import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'

import type { Supplier } from '../types/supplier.types'

interface DeleteSupplierDialogProps {
  supplier: Supplier | null
  submitting?: boolean
  onClose: () => void
  onConfirm: () => void
}

export function DeleteSupplierDialog({
  supplier,
  submitting,
  onClose,
  onConfirm,
}: DeleteSupplierDialogProps) {
  return (
    <Dialog
      open={supplier !== null}
      onClose={onClose}
      title="Xoá nhà cung cấp"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Huỷ
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={submitting}>
            Xoá nhà cung cấp
          </Button>
        </>
      }
    >
      <p className="text-sm text-muted-foreground">
        Bạn có chắc muốn xoá nhà cung cấp <b className="text-foreground">{supplier?.name}</b>? Hành
        động này không thể hoàn tác.
      </p>
    </Dialog>
  )
}

import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'

import type { Warehouse } from '../types/warehouse.types'

interface DeleteWarehouseDialogProps {
  warehouse: Warehouse | null
  submitting?: boolean
  onClose: () => void
  onConfirm: () => void
}

export function DeleteWarehouseDialog({
  warehouse,
  submitting,
  onClose,
  onConfirm,
}: DeleteWarehouseDialogProps) {
  return (
    <Dialog
      open={warehouse !== null}
      onClose={onClose}
      title="Xoá kho"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Huỷ
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={submitting}>
            Xoá kho
          </Button>
        </>
      }
    >
      <p className="text-sm text-muted-foreground">
        Bạn có chắc muốn xoá kho <b className="text-foreground">{warehouse?.name}</b>? Hành động này
        không thể hoàn tác.
      </p>
    </Dialog>
  )
}

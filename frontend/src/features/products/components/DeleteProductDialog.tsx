import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'

import type { Product } from '../types/product.types'

interface DeleteProductDialogProps {
  product: Product | null
  submitting?: boolean
  onClose: () => void
  onConfirm: () => void
}

export function DeleteProductDialog({
  product,
  submitting,
  onClose,
  onConfirm,
}: DeleteProductDialogProps) {
  return (
    <Dialog
      open={product !== null}
      onClose={onClose}
      title="Xoá sản phẩm"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Huỷ
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={submitting}>
            Xoá sản phẩm
          </Button>
        </>
      }
    >
      <p className="text-sm text-muted-foreground">
        Bạn có chắc muốn xoá sản phẩm <b className="text-foreground">{product?.name}</b>? Hành động
        này không thể hoàn tác.
      </p>
    </Dialog>
  )
}

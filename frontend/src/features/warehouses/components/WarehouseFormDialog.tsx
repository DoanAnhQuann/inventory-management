import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'

import { type WarehouseFormValues, warehouseSchema } from '../schemas/warehouse.schema'

interface WarehouseFormDialogProps {
  open: boolean
  mode: 'create' | 'edit'
  defaultValues?: WarehouseFormValues
  submitting?: boolean
  onClose: () => void
  onSubmit: (values: WarehouseFormValues) => void
}

const EMPTY_VALUES: WarehouseFormValues = { name: '', location: '' }

export function WarehouseFormDialog({
  open,
  mode,
  defaultValues,
  submitting,
  onClose,
  onSubmit,
}: WarehouseFormDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WarehouseFormValues>({
    resolver: zodResolver(warehouseSchema),
    defaultValues: defaultValues ?? EMPTY_VALUES,
  })

  useEffect(() => {
    if (open) reset(defaultValues ?? EMPTY_VALUES)
  }, [open, defaultValues, reset])

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={mode === 'create' ? 'Thêm kho mới' : 'Sửa thông tin kho'}
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Tên kho"
          placeholder="VD: Kho tổng Hà Nội"
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label="Địa điểm"
          placeholder="VD: Số 12, Đường Giải Phóng, Hà Nội"
          error={errors.location?.message}
          {...register('location')}
        />
        <div className="flex justify-end gap-2.5 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Huỷ
          </Button>
          <Button type="submit" disabled={submitting}>
            {mode === 'create' ? 'Tạo kho' : 'Lưu thay đổi'}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}

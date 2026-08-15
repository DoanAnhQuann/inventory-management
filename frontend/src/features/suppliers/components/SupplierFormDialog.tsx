import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'

import { type SupplierFormValues, supplierSchema } from '../schemas/supplier.schema'

interface SupplierFormDialogProps {
  open: boolean
  mode: 'create' | 'edit'
  defaultValues?: SupplierFormValues
  submitting?: boolean
  onClose: () => void
  onSubmit: (values: SupplierFormValues) => void
}

const EMPTY_VALUES: SupplierFormValues = { name: '' }

export function SupplierFormDialog({
  open,
  mode,
  defaultValues,
  submitting,
  onClose,
  onSubmit,
}: SupplierFormDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: defaultValues ?? EMPTY_VALUES,
  })

  useEffect(() => {
    if (open) reset(defaultValues ?? EMPTY_VALUES)
  }, [open, defaultValues, reset])

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={mode === 'create' ? 'Thêm nhà cung cấp mới' : 'Sửa thông tin nhà cung cấp'}
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Tên nhà cung cấp"
          placeholder="VD: Công ty TNHH Thiết bị Văn phòng Minh Long"
          error={errors.name?.message}
          {...register('name')}
        />
        <div className="flex justify-end gap-2.5 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Huỷ
          </Button>
          <Button type="submit" disabled={submitting}>
            {mode === 'create' ? 'Tạo nhà cung cấp' : 'Lưu thay đổi'}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}

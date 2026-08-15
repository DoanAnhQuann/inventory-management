import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'

import { type ProductFormValues, productSchema } from '../schemas/product.schema'

interface ProductFormDialogProps {
  open: boolean
  mode: 'create' | 'edit'
  defaultValues?: ProductFormValues
  submitting?: boolean
  onClose: () => void
  onSubmit: (values: ProductFormValues) => void
}

const EMPTY_VALUES: ProductFormValues = { name: '', code: '', unit: '', price: 0 }

export function ProductFormDialog({
  open,
  mode,
  defaultValues,
  submitting,
  onClose,
  onSubmit,
}: ProductFormDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: defaultValues ?? EMPTY_VALUES,
  })

  useEffect(() => {
    if (open) reset(defaultValues ?? EMPTY_VALUES)
  }, [open, defaultValues, reset])

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={mode === 'create' ? 'Thêm sản phẩm mới' : 'Sửa thông tin sản phẩm'}
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Tên sản phẩm"
          placeholder="VD: Giấy A4 Double A 80gsm"
          error={errors.name?.message}
          {...register('name')}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Mã số"
            placeholder="VD: VT-001"
            error={errors.code?.message}
            {...register('code')}
          />
          <Input
            label="Đơn vị tính"
            placeholder="VD: Ram, Hộp, Cái"
            error={errors.unit?.message}
            {...register('unit')}
          />
        </div>
        <Input
          label="Đơn giá"
          type="number"
          min={0}
          step="1000"
          placeholder="VD: 78500"
          error={errors.price?.message}
          {...register('price')}
        />
        <div className="flex justify-end gap-2.5 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Huỷ
          </Button>
          <Button type="submit" disabled={submitting}>
            {mode === 'create' ? 'Tạo sản phẩm' : 'Lưu thay đổi'}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}

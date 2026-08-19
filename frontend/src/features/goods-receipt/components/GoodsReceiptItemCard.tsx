import { Trash2 } from 'lucide-react'
import { type Control, Controller, type FieldErrors } from 'react-hook-form'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Combobox, type ComboboxOption } from '@/components/ui/Combobox'
import { Input } from '@/components/ui/Input'
import { formatCurrency } from '@/utils/currency'

import type { GoodsReceiptFormInput } from '../schemas/goods-receipt.schema'

interface ProductLookup {
  name: string
  code: string
  unit: string
  price: number
}

interface GoodsReceiptItemCardProps {
  index: number
  control: Control<GoodsReceiptFormInput>
  errors: FieldErrors<GoodsReceiptFormInput>
  productOptions: ComboboxOption[]
  productLookup: ProductLookup[]
  quantity: unknown
  price: unknown
  onSetValue: (
    index: number,
    field: 'productCode' | 'unit' | 'price',
    value: string | number,
  ) => void
  onRemove: () => void
  canRemove: boolean
}

/** Bản card cho mobile — mỗi sản phẩm 1 khối, field có label riêng (không có header bảng
 * để dựa vào như bản desktop). Xem `GoodsReceiptItemTableRow` cho bản bảng desktop. */
export function GoodsReceiptItemCard({
  index,
  control,
  errors,
  productOptions,
  productLookup,
  quantity,
  price,
  onSetValue,
  onRemove,
  canRemove,
}: GoodsReceiptItemCardProps) {
  const itemErrors = errors.items?.[index]
  const lineTotal = (Number(quantity) || 0) * (Number(price) || 0)

  return (
    <Card className="flex flex-col gap-3 p-4 lg:hidden">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Controller
            control={control}
            name={`items.${index}.productName`}
            render={({ field }) => (
              <Combobox
                label="Sản phẩm"
                placeholder="Gõ hoặc chọn sản phẩm"
                value={field.value}
                onChange={field.onChange}
                options={productOptions}
                error={itemErrors?.productName?.message}
                onSelectOption={(selected) => {
                  field.onChange(selected)
                  const matched = productLookup.find(
                    (product) => product.name.toLowerCase() === selected.toLowerCase(),
                  )
                  if (matched) {
                    onSetValue(index, 'productCode', matched.code)
                    onSetValue(index, 'unit', matched.unit)
                    onSetValue(index, 'price', matched.price)
                  }
                }}
              />
            )}
          />
        </div>

        <Controller
          control={control}
          name={`items.${index}.productCode`}
          render={({ field }) => (
            <Input
              label="Mã số"
              placeholder="VD: VT-099"
              error={itemErrors?.productCode?.message}
              {...field}
            />
          )}
        />

        <Controller
          control={control}
          name={`items.${index}.unit`}
          render={({ field }) => (
            <Input
              label="Đơn vị tính"
              placeholder="VD: Cái"
              error={itemErrors?.unit?.message}
              {...field}
            />
          )}
        />

        <Controller
          control={control}
          name={`items.${index}.quantity`}
          render={({ field }) => (
            <Input
              label="Số lượng"
              type="number"
              min={0}
              error={itemErrors?.quantity?.message}
              {...field}
              value={field.value as string | number}
            />
          )}
        />

        <Controller
          control={control}
          name={`items.${index}.price`}
          render={({ field }) => (
            <Input
              label="Đơn giá"
              type="number"
              min={0}
              error={itemErrors?.price?.message}
              {...field}
              value={field.value as string | number}
            />
          )}
        />
      </div>

      <div className="flex items-center justify-between border-t border-border pt-3">
        <span className="text-sm text-muted-foreground">
          Thành tiền: <b className="text-foreground">{formatCurrency(lineTotal)}</b>
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={`Xoá sản phẩm dòng ${index + 1}`}
          disabled={!canRemove}
          onClick={onRemove}
        >
          <Trash2 size={15} />
        </Button>
      </div>
    </Card>
  )
}

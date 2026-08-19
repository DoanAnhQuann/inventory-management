import { Trash2 } from 'lucide-react'
import { type Control, Controller, type FieldErrors } from 'react-hook-form'

import { Button } from '@/components/ui/Button'
import { Combobox, type ComboboxOption } from '@/components/ui/Combobox'
import { cn } from '@/lib/cn'
import { formatCurrency } from '@/utils/currency'

import type { GoodsReceiptFormInput } from '../schemas/goods-receipt.schema'

interface ProductLookup {
  name: string
  code: string
  unit: string
  price: number
}

interface GoodsReceiptItemTableRowProps {
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

const cellInputClass =
  'w-full min-w-0 rounded border border-transparent bg-transparent px-2 py-1.5 text-sm text-foreground outline-none focus:border-ring focus:bg-card align-top'

export function GoodsReceiptItemTableRow({
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
}: GoodsReceiptItemTableRowProps) {
  const itemErrors = errors.items?.[index]
  const lineTotal = (Number(quantity) || 0) * (Number(price) || 0)

  return (
    <tr className="border-t border-border [&>td]:align-top">
      <td className="min-w-[220px] px-2 py-1.5">
        <Controller
          control={control}
          name={`items.${index}.productName`}
          render={({ field }) => (
            <Combobox
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
      </td>

      <td className="w-28 px-2 py-1.5">
        <Controller
          control={control}
          name={`items.${index}.productCode`}
          render={({ field }) => (
            <>
              <input
                className={cn(cellInputClass, itemErrors?.productCode && 'border-destructive')}
                placeholder="VT-099"
                {...field}
              />
              {itemErrors?.productCode && (
                <span className="block px-2 text-[10px] text-destructive">
                  {itemErrors.productCode.message}
                </span>
              )}
            </>
          )}
        />
      </td>

      <td className="w-24 px-2 py-1.5">
        <Controller
          control={control}
          name={`items.${index}.unit`}
          render={({ field }) => (
            <>
              <input
                className={cn(cellInputClass, itemErrors?.unit && 'border-destructive')}
                placeholder="Cái"
                {...field}
              />
              {itemErrors?.unit && (
                <span className="block px-2 text-[10px] text-destructive">
                  {itemErrors.unit.message}
                </span>
              )}
            </>
          )}
        />
      </td>

      <td className="w-24 px-2 py-1.5">
        <Controller
          control={control}
          name={`items.${index}.quantity`}
          render={({ field }) => (
            <>
              <input
                type="number"
                min={0}
                className={cn(cellInputClass, itemErrors?.quantity && 'border-destructive')}
                {...field}
                value={field.value as string | number}
              />
              {itemErrors?.quantity && (
                <span className="block px-2 text-[10px] text-destructive">
                  {itemErrors.quantity.message}
                </span>
              )}
            </>
          )}
        />
      </td>

      <td className="w-32 px-2 py-1.5">
        <Controller
          control={control}
          name={`items.${index}.price`}
          render={({ field }) => (
            <>
              <input
                type="number"
                min={0}
                className={cn(cellInputClass, itemErrors?.price && 'border-destructive')}
                {...field}
                value={field.value as string | number}
              />
              {itemErrors?.price && (
                <span className="block px-2 text-[10px] text-destructive">
                  {itemErrors.price.message}
                </span>
              )}
            </>
          )}
        />
      </td>

      <td className="w-32 px-2 py-1.5 text-right font-medium whitespace-nowrap tabular-nums text-foreground">
        <div className="mt-[7px]">{formatCurrency(lineTotal)}</div>
      </td>

      <td className="w-10 px-2 py-1.5 text-center">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="align-top"
          aria-label={`Xoá sản phẩm dòng ${index + 1}`}
          disabled={!canRemove}
          onClick={onRemove}
        >
          <Trash2 size={15} />
        </Button>
      </td>
    </tr>
  )
}

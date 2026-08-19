import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Combobox } from '@/components/ui/Combobox'
import { Dialog } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'
import { useProducts } from '@/features/products/hooks/useProducts'
import { useSuppliers } from '@/features/suppliers/hooks/useSuppliers'
import { useWarehouses } from '@/features/warehouses/hooks/useWarehouses'
import { cn } from '@/lib/cn'
import { formatCurrency } from '@/utils/currency'
import { numberToVietnameseWords } from '@/utils/numberToWords'

import { useCreateGoodsReceipt } from '../hooks/useGoodsReceipts'
import { type GoodsReceiptFormValues, goodsReceiptSchema } from '../schemas/goods-receipt.schema'
import { GoodsReceiptItemCard } from './GoodsReceiptItemCard'
import { GoodsReceiptItemTableRow } from './GoodsReceiptItemTableRow'
import { GoodsReceiptPreview } from './GoodsReceiptPreview'

const EMPTY_ITEM = { productName: '', productCode: '', unit: '', quantity: 1, price: 0 }

function today() {
  return new Date().toISOString().slice(0, 10)
}

function emptyValues(): GoodsReceiptFormValues {
  return {
    warehouseName: '',
    warehouseLocation: '',
    supplierName: '',
    receiptDate: today(),
    unitName: '',
    department: '',
    delivererName: '',
    invoiceNumber: '',
    invoiceDate: today(),
    debitAccount: '',
    creditAccount: '',
    attachedDocuments: '',
    amountInWords: '',
    note: '',
    items: [{ ...EMPTY_ITEM }],
  }
}

export function GoodsReceiptForm() {
  const [tab, setTab] = useState<'form' | 'preview'>('form')
  const [pendingValues, setPendingValues] = useState<GoodsReceiptFormValues | null>(null)
  const [isConfirming, setIsConfirming] = useState(false)

  const { data: warehouses = [] } = useWarehouses()
  const { data: suppliers = [] } = useSuppliers()
  const { data: products = [] } = useProducts()

  const createGoodsReceipt = useCreateGoodsReceipt()

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(goodsReceiptSchema),
    defaultValues: emptyValues(),
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'items' })
  const liveValues = watch()
  const grandTotal = liveValues.items.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.price) || 0),
    0,
  )
  const lastAutoFilledAmountRef = useRef('')

  useEffect(() => {
    const currentAmount = liveValues.amountInWords ?? ''
    if (currentAmount !== lastAutoFilledAmountRef.current) return

    const words = numberToVietnameseWords(grandTotal)
    if (words === currentAmount) return

    lastAutoFilledAmountRef.current = words
    setValue('amountInWords', words)
  }, [grandTotal, liveValues.amountInWords, setValue])

  const warehouseOptions = warehouses.map((warehouse) => ({ value: warehouse.name }))
  const supplierOptions = suppliers.map((supplier) => ({ value: supplier.name }))
  const productOptions = products.map((product) => ({ value: product.name }))

  const warehouseNameTrimmed = liveValues.warehouseName?.trim() ?? ''
  const isNewWarehouse =
    warehouseNameTrimmed !== '' &&
    !warehouses.some(
      (warehouse) => warehouse.name.toLowerCase() === warehouseNameTrimmed.toLowerCase(),
    )

  const openConfirm = (values: GoodsReceiptFormValues) => {
    const warehouseTrimmed = values.warehouseName.trim()
    const existingWarehouse = warehouses.find(
      (w) => w.name.toLowerCase() === warehouseTrimmed.toLowerCase(),
    )
    if (!existingWarehouse && !values.warehouseLocation?.trim()) {
      setError('warehouseLocation', { message: 'Kho này chưa có — vui lòng nhập địa điểm' })
      return
    }
    setPendingValues(values)
  }

  const closeConfirm = () => setPendingValues(null)

  const handleConfirmCreate = async () => {
    if (!pendingValues) return
    setIsConfirming(true)
    try {
      await createGoodsReceipt.mutateAsync(pendingValues)
      reset(emptyValues())
      setTab('form')
      setPendingValues(null)
    } finally {
      setIsConfirming(false)
    }
  }

  const pendingGrandTotal = pendingValues
    ? pendingValues.items.reduce(
        (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.price) || 0),
        0,
      )
    : 0

  const onSetItemValue = (
    rowIndex: number,
    name: 'productCode' | 'unit' | 'price',
    value: string | number,
  ) => setValue(`items.${rowIndex}.${name}`, value, { shouldValidate: true })

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-5 border-b border-border">
        <button
          type="button"
          className={cn(
            'pb-3 text-sm text-muted-foreground',
            tab === 'form' && 'border-b-2 border-primary font-bold text-primary',
          )}
          onClick={() => setTab('form')}
        >
          Thông tin phiếu
        </button>
        <button
          type="button"
          className={cn(
            'pb-3 text-sm text-muted-foreground',
            tab === 'preview' && 'border-b-2 border-primary font-bold text-primary',
          )}
          onClick={() => setTab('preview')}
        >
          Xem trước phiếu
        </button>
      </div>

      {tab === 'preview' ? (
        <GoodsReceiptPreview values={liveValues} grandTotal={grandTotal} />
      ) : (
        <form className="flex flex-col gap-6" noValidate onSubmit={handleSubmit(openConfirm)}>
          <Card className="flex flex-col gap-4 p-5">
            <h2 className="text-sm font-bold text-foreground">Đơn vị</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Input
                label="Đơn vị"
                placeholder="VD: Công ty TNHH ABC"
                error={errors.unitName?.message}
                {...register('unitName')}
              />
              <Input
                label="Bộ phận"
                placeholder="VD: Phòng hành chính"
                error={errors.department?.message}
                {...register('department')}
              />
              <Input
                label="Ngày nhập"
                type="date"
                error={errors.receiptDate?.message}
                {...register('receiptDate')}
              />
              <Input
                label="Nợ (TK)"
                placeholder="VD: 1521"
                error={errors.debitAccount?.message}
                {...register('debitAccount')}
              />
              <Input
                label="Có (TK)"
                placeholder="VD: 331"
                error={errors.creditAccount?.message}
                {...register('creditAccount')}
              />
            </div>
          </Card>

          <Card className="flex flex-col gap-4 p-5">
            <h2 className="text-sm font-bold text-foreground">Giao nhận</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="sm:col-span-2 lg:col-span-3">
                <Input
                  label="Người giao hàng"
                  placeholder="VD: Nguyễn Văn A"
                  error={errors.delivererName?.message}
                  {...register('delivererName')}
                />
              </div>

              <Input
                label="Số hoá đơn"
                placeholder="VD: HD-2026-0123"
                error={errors.invoiceNumber?.message}
                {...register('invoiceNumber')}
              />
              <Input
                label="Ngày hoá đơn"
                type="date"
                error={errors.invoiceDate?.message}
                {...register('invoiceDate')}
              />

              <Controller
                control={control}
                name="supplierName"
                render={({ field }) => (
                  <Combobox
                    label="Nhà cung cấp"
                    placeholder="Gõ hoặc chọn nhà cung cấp"
                    value={field.value}
                    onChange={field.onChange}
                    onSelectOption={field.onChange}
                    options={supplierOptions}
                    error={errors.supplierName?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="warehouseName"
                render={({ field }) => (
                  <Combobox
                    label="Kho nhập"
                    placeholder="Gõ hoặc chọn kho"
                    value={field.value}
                    onChange={field.onChange}
                    onSelectOption={field.onChange}
                    options={warehouseOptions}
                    error={errors.warehouseName?.message}
                  />
                )}
              />
              {isNewWarehouse && (
                <Input
                  label="Địa điểm kho (kho mới)"
                  placeholder="VD: Số 12, Đường Giải Phóng, Hà Nội"
                  error={errors.warehouseLocation?.message}
                  {...register('warehouseLocation')}
                />
              )}
            </div>
          </Card>

          <Card className="flex flex-col gap-4 p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-foreground">Danh sách sản phẩm nhập kho</h2>
              {errors.items?.message && (
                <span className="text-xs text-destructive">{errors.items.message}</span>
              )}
            </div>

            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[900px] border-collapse text-sm">
                <thead>
                  <tr className="bg-secondary text-left text-[11px] tracking-wide text-muted-foreground uppercase">
                    <th className="px-2 py-2 font-semibold">
                      Tên, nhãn hiệu, quy cách phẩm chất vật tư
                    </th>
                    <th className="px-2 py-2 font-semibold">Mã số</th>
                    <th className="px-2 py-2 font-semibold">Đơn vị tính</th>
                    <th className="px-2 py-2 font-semibold">Số lượng</th>
                    <th className="px-2 py-2 font-semibold">Đơn giá</th>
                    <th className="px-2 py-2 text-right font-semibold">Thành tiền</th>
                    <th className="px-2 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {fields.map((field, index) => (
                    <GoodsReceiptItemTableRow
                      key={field.id}
                      index={index}
                      control={control}
                      errors={errors}
                      productOptions={productOptions}
                      productLookup={products}
                      quantity={liveValues.items[index]?.quantity}
                      price={liveValues.items[index]?.price}
                      onSetValue={onSetItemValue}
                      onRemove={() => remove(index)}
                      canRemove={fields.length > 1}
                    />
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-border">
                    <td colSpan={5} className="px-2 py-3 text-right text-sm text-muted-foreground">
                      Tổng tiền
                    </td>
                    <td className="px-2 py-3 text-right text-base font-bold whitespace-nowrap tabular-nums text-primary">
                      {formatCurrency(grandTotal)}
                    </td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="flex flex-col gap-3 lg:hidden">
              {fields.map((field, index) => (
                <GoodsReceiptItemCard
                  key={field.id}
                  index={index}
                  control={control}
                  errors={errors}
                  productOptions={productOptions}
                  productLookup={products}
                  quantity={liveValues.items[index]?.quantity}
                  price={liveValues.items[index]?.price}
                  onSetValue={onSetItemValue}
                  onRemove={() => remove(index)}
                  canRemove={fields.length > 1}
                />
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              className="self-start"
              onClick={() => append({ ...EMPTY_ITEM })}
            >
              <Plus size={16} /> Thêm sản phẩm
            </Button>

            <div className="flex justify-end gap-3 border-t border-border pt-4 text-sm lg:hidden">
              <span className="text-muted-foreground">Tổng tiền</span>
              <span className="text-lg font-bold text-primary">{formatCurrency(grandTotal)}</span>
            </div>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-muted-foreground">
                Tổng số tiền bằng chữ (tự tính theo tổng tiền, có thể sửa)
              </span>
              <textarea
                className={cn(
                  'min-h-[54px] w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-ring focus:ring-3 focus:ring-ring/20',
                  errors.amountInWords &&
                    'border-destructive focus:border-destructive focus:ring-destructive/20',
                )}
                {...register('amountInWords')}
              />
              {errors.amountInWords && (
                <span className="text-xs text-destructive">{errors.amountInWords.message}</span>
              )}
            </label>

            <Input
              label="Số chứng từ gốc kèm theo"
              placeholder="VD: Hoá đơn GTGT, Biên bản giao nhận"
              error={errors.attachedDocuments?.message}
              {...register('attachedDocuments')}
            />

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-muted-foreground">
                Ghi chú (không bắt buộc)
              </span>
              <textarea
                className="min-h-[54px] w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-ring focus:ring-3 focus:ring-ring/20"
                placeholder="Ghi chú thêm cho phiếu nhập..."
                {...register('note')}
              />
            </label>
          </Card>

          <div className="flex justify-end gap-2.5">
            <Button type="button" variant="outline" onClick={() => reset(emptyValues())}>
              Làm mới
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Tạo phiếu nhập kho
            </Button>
          </div>
        </form>
      )}

      <Dialog
        open={pendingValues !== null}
        onClose={closeConfirm}
        title="Xác nhận tạo phiếu nhập kho"
        className="max-h-[calc(100vh-2rem)] max-w-4xl gap-3 p-4"
        footer={
          <>
            <Button type="button" variant="outline" onClick={closeConfirm} disabled={isConfirming}>
              Huỷ
            </Button>
            <Button type="button" onClick={handleConfirmCreate} disabled={isConfirming}>
              {isConfirming ? 'Đang tạo...' : 'Xác nhận tạo'}
            </Button>
          </>
        }
      >
        {pendingValues && (
          <div className="min-h-0 flex-1 overflow-y-auto">
            <GoodsReceiptPreview values={pendingValues} grandTotal={pendingGrandTotal} />
          </div>
        )}
      </Dialog>
    </div>
  )
}

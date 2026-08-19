import { GoodsReceiptForm } from '@/features/goods-receipt/components/GoodsReceiptForm'

export default function GoodsReceiptPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Phiếu nhập kho</h1>
      </div>

      <GoodsReceiptForm />
    </div>
  )
}

import { formatCurrency } from '@/utils/currency'

import type { GoodsReceiptFormInput } from '../schemas/goods-receipt.schema'

interface GoodsReceiptPreviewProps {
  values: GoodsReceiptFormInput
  grandTotal: number
  receiptCode?: string
}

function formatVietnameseDate(value: string | undefined) {
  if (!value) return { day: '......', month: '......', year: '......' }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return { day: '......', month: '......', year: '......' }
  return {
    day: String(date.getDate()).padStart(2, '0'),
    month: String(date.getMonth() + 1).padStart(2, '0'),
    year: String(date.getFullYear()),
  }
}

export function GoodsReceiptPreview({ values, grandTotal, receiptCode }: GoodsReceiptPreviewProps) {
  const receiptDate = formatVietnameseDate(values.receiptDate)

  return (
    <div className="flex justify-center rounded-lg border border-border bg-secondary p-4 sm:p-8">
      <div
        className="w-full max-w-3xl bg-card p-6 leading-relaxed text-foreground shadow-lg sm:p-10"
        style={{ fontFamily: "'Noto Serif', 'Inter', serif" }}
      >
        <div className="flex justify-between gap-4 text-[11px]">
          <div>
            Đơn vị: <b>{values.unitName || '..........'}</b>
            <br />
            Bộ phận: {values.department || '..........'}
          </div>
          <div className="text-right text-[11px]">
            <b>Mẫu số 01 - VT</b>
            <br />
            <span className="text-[10px]">(Ban hành theo Thông tư số 200/2014/TT-BTC</span>
            <br />
            <span className="text-[10px]">ngày 22/12/2014 của Bộ Tài chính)</span>
          </div>
        </div>

        <h2 className="mt-8 text-center text-lg font-bold tracking-wide uppercase">
          Phiếu nhập kho
        </h2>
        <p className="mt-1 text-center text-[11px]">
          Ngày {receiptDate.day} tháng {receiptDate.month} năm {receiptDate.year}
        </p>

        <div className="mt-3 flex justify-between text-[11px]">
          <span>
            Số: <b>{receiptCode || '(Sẽ cấp tự động khi lưu)'}</b>
          </span>
          <span className="text-right">
            Nợ: {values.debitAccount || '..........'}
            <br />
            Có: {values.creditAccount || '..........'}
          </span>
        </div>

        <p className="mt-3 text-[11px]">
          - Họ và tên người giao: <b>{values.delivererName || '..........'}</b>
        </p>
        <p className="text-[11px]">
          - Theo{' '}
          {values.invoiceNumber ? (
            <>
              hoá đơn số <b>{values.invoiceNumber}</b>
            </>
          ) : (
            '..........'
          )}{' '}
          ngày {formatVietnameseDate(values.invoiceDate).day}/
          {formatVietnameseDate(values.invoiceDate).month}/
          {formatVietnameseDate(values.invoiceDate).year} của{' '}
          <b>{values.supplierName || '..........'}</b>
        </p>
        <p className="text-[11px]">
          - Nhập tại kho: <b>{values.warehouseName || '..........'}</b>
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse text-[10px]">
            <thead>
              <tr>
                <th className="border border-foreground p-1">STT</th>
                <th className="border border-foreground p-1 text-left">
                  Tên, nhãn hiệu, quy cách phẩm chất vật tư
                </th>
                <th className="border border-foreground p-1">Mã số</th>
                <th className="border border-foreground p-1">ĐVT</th>
                <th className="border border-foreground p-1">Số lượng</th>
                <th className="border border-foreground p-1">Đơn giá</th>
                <th className="border border-foreground p-1">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {values.items.map((item, index) => (
                <tr key={index}>
                  <td className="border border-foreground p-1 text-center">{index + 1}</td>
                  <td className="border border-foreground p-1">{item.productName || '—'}</td>
                  <td className="border border-foreground p-1 text-center">
                    {item.productCode || '—'}
                  </td>
                  <td className="border border-foreground p-1 text-center">{item.unit || '—'}</td>
                  <td className="border border-foreground p-1 text-center">
                    {String(item.quantity ?? 0)}
                  </td>
                  <td className="border border-foreground p-1 text-right">
                    {new Intl.NumberFormat('vi-VN').format(Number(item.price) || 0)}
                  </td>
                  <td className="border border-foreground p-1 text-right">
                    {new Intl.NumberFormat('vi-VN').format(
                      (Number(item.quantity) || 0) * (Number(item.price) || 0),
                    )}
                  </td>
                </tr>
              ))}
              <tr>
                <td className="border border-foreground p-1 text-center font-bold" colSpan={6}>
                  Cộng
                </td>
                <td className="border border-foreground p-1 text-right font-bold">
                  {new Intl.NumberFormat('vi-VN').format(grandTotal)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-[11px]">
          - Tổng số tiền (viết bằng chữ): <b>{values.amountInWords || '..........'}</b>
        </p>
        <p className="text-[11px]">
          - Số chứng từ gốc kèm theo: <b>{values.attachedDocuments || '..........'}</b>
        </p>
        <p className="mt-1 text-[10px] text-muted-foreground">
          Tổng tiền quy đổi: <b className="text-foreground">{formatCurrency(grandTotal)}</b>
        </p>

        <div className="mt-10 grid grid-cols-2 gap-6 text-center text-[10px] sm:grid-cols-4">
          <div>
            <b>Người lập phiếu</b>
            <br />
            <i>(Ký, họ tên)</i>
          </div>
          <div>
            <b>Người giao hàng</b>
            <br />
            <i>(Ký, họ tên)</i>
          </div>
          <div>
            <b>Thủ kho</b>
            <br />
            <i>(Ký, họ tên)</i>
          </div>
          <div>
            <b>Kế toán trưởng</b>
            <br />
            <i>(Hoặc bộ phận có nhu cầu nhập)</i>
            <br />
            <i>(Ký, họ tên)</i>
          </div>
        </div>
      </div>
    </div>
  )
}

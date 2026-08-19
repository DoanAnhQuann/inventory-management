import { z } from 'zod'

export const goodsReceiptItemSchema = z.object({
  productName: z.string().trim().min(1, 'Vui lòng nhập hoặc chọn sản phẩm'),
  productCode: z.string().trim().min(1, 'Vui lòng nhập mã số'),
  unit: z.string().trim().min(1, 'Vui lòng nhập đơn vị tính'),
  quantity: z.coerce.number({ error: 'Số lượng phải là số' }).positive('Số lượng phải lớn hơn 0'),
  price: z.coerce.number({ error: 'Đơn giá phải là số' }).min(0, 'Đơn giá không được âm'),
})

export const goodsReceiptSchema = z.object({
  warehouseName: z.string().trim().min(1, 'Vui lòng nhập hoặc chọn kho nhập'),
  supplierName: z.string().trim().min(1, 'Vui lòng nhập hoặc chọn nhà cung cấp'),
  receiptDate: z.string().trim().min(1, 'Vui lòng chọn ngày nhập'),
  items: z.array(goodsReceiptItemSchema).min(1, 'Cần ít nhất 1 sản phẩm trong phiếu nhập'),
  unitName: z.string().trim().min(1, 'Vui lòng nhập đơn vị'),
  department: z.string().trim().min(1, 'Vui lòng nhập bộ phận'),
  delivererName: z.string().trim().min(1, 'Vui lòng nhập họ và tên người giao'),
  invoiceNumber: z.string().trim().min(1, 'Vui lòng nhập số hoá đơn'),
  invoiceDate: z.string().trim().min(1, 'Vui lòng chọn ngày hoá đơn'),
  debitAccount: z.string().trim().min(1, 'Vui lòng nhập tài khoản nợ'),
  creditAccount: z.string().trim().min(1, 'Vui lòng nhập tài khoản có'),
  attachedDocuments: z.string().trim().min(1, 'Vui lòng nhập số chứng từ gốc kèm theo'),
  amountInWords: z.string().trim().min(1, 'Vui lòng nhập tổng số tiền bằng chữ'),
  note: z.string().trim().optional(),
  warehouseLocation: z.string().trim().optional(),
})

export type GoodsReceiptFormValues = z.infer<typeof goodsReceiptSchema>
export type GoodsReceiptFormInput = z.input<typeof goodsReceiptSchema>

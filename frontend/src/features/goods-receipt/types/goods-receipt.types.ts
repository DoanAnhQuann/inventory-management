export interface GoodsReceiptItem {
  productName: string
  productCode: string
  unit: string
  quantity: number
  price: number
}

export interface GoodsReceipt {
  id: string
  code: string
  warehouseName: string
  supplierName: string
  receiptDate: string
  unitName: string
  department: string
  delivererName: string
  invoiceNumber: string
  invoiceDate: string
  debitAccount: string
  creditAccount: string
  attachedDocuments: string
  amountInWords: string
  note?: string
  warehouseLocation?: string
  items: GoodsReceiptItem[]
  totalAmount: number
  createdAt: string
}

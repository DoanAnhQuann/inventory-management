import { z } from 'zod';
import { GOODS_RECEIPT_MESSAGE } from './goods-receipt.message';

export const createGoodsReceiptItemSchema = z.object({
  productName: z
    .string()
    .trim()
    .min(1, GOODS_RECEIPT_MESSAGE.PRODUCT_NAME_REQUIRED),
  productCode: z
    .string()
    .trim()
    .min(1, GOODS_RECEIPT_MESSAGE.PRODUCT_CODE_REQUIRED),
  unit: z.string().trim().min(1, GOODS_RECEIPT_MESSAGE.ITEM_UNIT_REQUIRED),
  quantity: z.coerce
    .number({ error: GOODS_RECEIPT_MESSAGE.QUANTITY_INVALID })
    .positive(GOODS_RECEIPT_MESSAGE.QUANTITY_POSITIVE),
  price: z.coerce
    .number({ error: GOODS_RECEIPT_MESSAGE.PRICE_INVALID })
    .min(0, GOODS_RECEIPT_MESSAGE.PRICE_NOT_NEGATIVE),
});

export const createGoodsReceiptSchema = z.object({
  warehouseName: z
    .string()
    .trim()
    .min(1, GOODS_RECEIPT_MESSAGE.WAREHOUSE_NAME_REQUIRED),
  warehouseLocation: z.string().trim().optional(),
  supplierName: z
    .string()
    .trim()
    .min(1, GOODS_RECEIPT_MESSAGE.SUPPLIER_NAME_REQUIRED),
  receiptDate: z
    .string()
    .trim()
    .min(1, GOODS_RECEIPT_MESSAGE.RECEIPT_DATE_REQUIRED),
  unitName: z.string().trim().min(1, GOODS_RECEIPT_MESSAGE.UNIT_NAME_REQUIRED),
  department: z
    .string()
    .trim()
    .min(1, GOODS_RECEIPT_MESSAGE.DEPARTMENT_REQUIRED),
  delivererName: z
    .string()
    .trim()
    .min(1, GOODS_RECEIPT_MESSAGE.DELIVERER_NAME_REQUIRED),
  invoiceNumber: z
    .string()
    .trim()
    .min(1, GOODS_RECEIPT_MESSAGE.INVOICE_NUMBER_REQUIRED),
  invoiceDate: z
    .string()
    .trim()
    .min(1, GOODS_RECEIPT_MESSAGE.INVOICE_DATE_REQUIRED),
  debitAccount: z
    .string()
    .trim()
    .min(1, GOODS_RECEIPT_MESSAGE.DEBIT_ACCOUNT_REQUIRED),
  creditAccount: z
    .string()
    .trim()
    .min(1, GOODS_RECEIPT_MESSAGE.CREDIT_ACCOUNT_REQUIRED),
  attachedDocuments: z
    .string()
    .trim()
    .min(1, GOODS_RECEIPT_MESSAGE.ATTACHED_DOCUMENTS_REQUIRED),
  amountInWords: z
    .string()
    .trim()
    .min(1, GOODS_RECEIPT_MESSAGE.AMOUNT_IN_WORDS_REQUIRED),
  note: z.string().trim().optional(),
  items: z
    .array(createGoodsReceiptItemSchema)
    .min(1, GOODS_RECEIPT_MESSAGE.ITEMS_REQUIRED),
});

export const goodsReceiptItemResponseSchema = z.object({
  productName: z.string(),
  productCode: z.string(),
  unit: z.string(),
  quantity: z.number(),
  price: z.number(),
});

export const goodsReceiptResponseSchema = z.object({
  id: z.uuid(),
  code: z.string(),
  warehouseName: z.string(),
  supplierName: z.string(),
  receiptDate: z.string(),
  unitName: z.string(),
  department: z.string(),
  delivererName: z.string(),
  invoiceNumber: z.string(),
  invoiceDate: z.string(),
  debitAccount: z.string(),
  creditAccount: z.string(),
  attachedDocuments: z.string(),
  amountInWords: z.string(),
  note: z.string().optional(),
  items: z.array(goodsReceiptItemResponseSchema),
  totalAmount: z.number(),
  createdAt: z.string(),
});

export const goodsReceiptListResponseSchema =
  goodsReceiptResponseSchema.array();

export const goodsReceiptIdParamSchema = z.object({
  id: z.uuid(GOODS_RECEIPT_MESSAGE.ID_INVALID),
});

export type GoodsReceiptItem = z.infer<typeof goodsReceiptItemResponseSchema>;
export type GoodsReceipt = z.infer<typeof goodsReceiptResponseSchema>;

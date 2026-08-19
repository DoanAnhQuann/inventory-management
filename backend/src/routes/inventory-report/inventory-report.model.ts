import { z } from 'zod';
import { INVENTORY_REPORT_MESSAGE } from './inventory-report.message';

export const productStockSummarySchema = z.object({
  productId: z.uuid(),
  productName: z.string(),
  unit: z.string(),
  currentStock: z.number(),
  lastMovementAt: z.string(),
});

export const productStockSummaryListResponseSchema =
  productStockSummarySchema.array();

export const stockMovementSchema = z.object({
  id: z.uuid(),
  productId: z.uuid(),
  productName: z.string(),
  unit: z.string(),
  date: z.string(),
  change: z.number(),
  balanceAfter: z.number(),
  note: z.string().optional(),
});

export const stockMovementListResponseSchema = stockMovementSchema.array();

export const productIdParamSchema = z.object({
  productId: z.uuid(INVENTORY_REPORT_MESSAGE.PRODUCT_ID_INVALID),
});

export type ProductStockSummary = z.infer<typeof productStockSummarySchema>;
export type StockMovementItem = z.infer<typeof stockMovementSchema>;

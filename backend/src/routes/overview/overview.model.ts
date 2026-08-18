import { z } from 'zod';

export const topProductStatSchema = z.object({
  productName: z.string(),
  productCode: z.string(),
  unit: z.string(),
  totalQuantity: z.number(),
});

export const lowStockProductSchema = z.object({
  productId: z.uuid(),
  productName: z.string(),
  productCode: z.string(),
  unit: z.string(),
  currentStock: z.number(),
});

export const overviewStatsResponseSchema = z.object({
  receiptCount: z.number(),
  totalValue: z.number(),
  totalQuantity: z.number(),
  inStockProductCount: z.number(),
  topProducts: z.array(topProductStatSchema),
  lowStockProducts: z.array(lowStockProductSchema),
});

export type TopProductStat = z.infer<typeof topProductStatSchema>;
export type LowStockProduct = z.infer<typeof lowStockProductSchema>;
export type OverviewStats = z.infer<typeof overviewStatsResponseSchema>;

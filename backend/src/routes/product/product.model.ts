import { z } from 'zod';
import { PRODUCT_MESSAGE } from './product.message';

export const createProductSchema = z.object({
  code: z.string().trim().min(1, PRODUCT_MESSAGE.CODE_REQUIRED),
  name: z.string().trim().min(1, PRODUCT_MESSAGE.NAME_REQUIRED),
  unit: z.string().trim().min(1, PRODUCT_MESSAGE.UNIT_REQUIRED),
  price: z.coerce
    .number({ error: PRODUCT_MESSAGE.PRICE_INVALID })
    .positive(PRODUCT_MESSAGE.PRICE_POSITIVE),
  minStockThreshold: z.coerce
    .number({ error: PRODUCT_MESSAGE.MIN_STOCK_THRESHOLD_INVALID })
    .int()
    .min(0, PRODUCT_MESSAGE.MIN_STOCK_THRESHOLD_INVALID)
    .optional(),
});

export const updateProductSchema = createProductSchema;

export const productResponseSchema = z.object({
  id: z.uuid(),
  code: z.string(),
  name: z.string(),
  unit: z.string(),
  price: z.number(),
  minStockThreshold: z.number().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const productListResponseSchema = productResponseSchema.array();

export const productIdParamSchema = z.object({
  id: z.uuid(PRODUCT_MESSAGE.ID_INVALID),
});

export type Product = z.infer<typeof productResponseSchema>;

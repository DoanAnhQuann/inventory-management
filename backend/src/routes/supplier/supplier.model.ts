import { z } from 'zod';
import { SUPPLIER_MESSAGE } from './supplier.message';

export const createSupplierSchema = z.object({
  name: z.string().trim().min(1, SUPPLIER_MESSAGE.NAME_REQUIRED),
});

export const updateSupplierSchema = createSupplierSchema;

export const supplierResponseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const supplierListResponseSchema = supplierResponseSchema.array();

export const supplierIdParamSchema = z.object({
  id: z.uuid(SUPPLIER_MESSAGE.ID_INVALID),
});

export type Supplier = z.infer<typeof supplierResponseSchema>;

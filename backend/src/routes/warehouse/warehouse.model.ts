import { z } from 'zod';
import { WAREHOUSE_MESSAGE } from './warehouse.message';

export const createWarehouseSchema = z.object({
  name: z.string().trim().min(1, WAREHOUSE_MESSAGE.NAME_REQUIRED),
  location: z.string().trim().min(1, WAREHOUSE_MESSAGE.LOCATION_REQUIRED),
});

export const updateWarehouseSchema = createWarehouseSchema;

export const warehouseResponseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  location: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  inboundAt: z.string(),
});

export const warehouseListResponseSchema = warehouseResponseSchema.array();

export const warehouseIdParamSchema = z.object({
  id: z.uuid(WAREHOUSE_MESSAGE.ID_INVALID),
});

export type Warehouse = z.infer<typeof warehouseResponseSchema>;

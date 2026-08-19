import { createZodDto } from 'nestjs-zod';
import {
  createWarehouseSchema,
  updateWarehouseSchema,
  warehouseIdParamSchema,
  warehouseListResponseSchema,
  warehouseResponseSchema,
} from './warehouse.model';

export class CreateWarehouseDto extends createZodDto(createWarehouseSchema) {}
export class UpdateWarehouseDto extends createZodDto(updateWarehouseSchema) {}
export class WarehouseResDto extends createZodDto(warehouseResponseSchema) {}
export class WarehouseListResDto extends createZodDto(
  warehouseListResponseSchema,
) {}
export class WarehouseIdParamDto extends createZodDto(warehouseIdParamSchema) {}

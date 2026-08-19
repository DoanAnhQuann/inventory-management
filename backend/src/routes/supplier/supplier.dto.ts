import { createZodDto } from 'nestjs-zod';
import {
  createSupplierSchema,
  supplierIdParamSchema,
  supplierListResponseSchema,
  supplierResponseSchema,
  updateSupplierSchema,
} from './supplier.model';

export class CreateSupplierDto extends createZodDto(createSupplierSchema) {}
export class UpdateSupplierDto extends createZodDto(updateSupplierSchema) {}
export class SupplierResDto extends createZodDto(supplierResponseSchema) {}
export class SupplierListResDto extends createZodDto(
  supplierListResponseSchema,
) {}
export class SupplierIdParamDto extends createZodDto(supplierIdParamSchema) {}

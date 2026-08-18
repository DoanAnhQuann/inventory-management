import { createZodDto } from 'nestjs-zod';
import {
  productIdParamSchema,
  productStockSummaryListResponseSchema,
  stockMovementListResponseSchema,
} from './inventory-report.model';

export class ProductStockSummaryListResDto extends createZodDto(
  productStockSummaryListResponseSchema,
) {}

export class StockMovementListResDto extends createZodDto(
  stockMovementListResponseSchema,
) {}

export class ProductIdParamDto extends createZodDto(productIdParamSchema) {}

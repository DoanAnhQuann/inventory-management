import { Controller, Get, Param } from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import {
  ProductIdParamDto,
  ProductStockSummaryListResDto,
  StockMovementListResDto,
} from './inventory-report.dto';
import { InventoryReportService } from './inventory-report.service';

@Controller('inventory-report')
export class InventoryReportController {
  constructor(
    private readonly inventoryReportService: InventoryReportService,
  ) {}

  @Get('products')
  @ZodSerializerDto(ProductStockSummaryListResDto)
  getProductSummaries() {
    return this.inventoryReportService.getProductSummaries();
  }

  @Get('products/:productId/movements')
  @ZodSerializerDto(StockMovementListResDto)
  getMovements(@Param() { productId }: ProductIdParamDto) {
    return this.inventoryReportService.getMovements(productId);
  }
}

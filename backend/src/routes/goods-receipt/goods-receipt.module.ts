import { Module } from '@nestjs/common';
import { ProductModule } from '../product/product.module';
import { SupplierModule } from '../supplier/supplier.module';
import { WarehouseModule } from '../warehouse/warehouse.module';
import { GoodsReceiptController } from './goods-receipt.controller';
import { GoodsReceiptRepo } from './goods-receipt.repo';
import { GoodsReceiptService } from './goods-receipt.service';

@Module({
  imports: [ProductModule, SupplierModule, WarehouseModule],
  controllers: [GoodsReceiptController],
  providers: [GoodsReceiptService, GoodsReceiptRepo],
  exports: [GoodsReceiptService],
})
export class GoodsReceiptModule {}

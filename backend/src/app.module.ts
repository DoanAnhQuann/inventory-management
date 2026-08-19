import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';
import { ProductModule } from './routes/product/product.module';
import { SupplierModule } from './routes/supplier/supplier.module';
import { WarehouseModule } from './routes/warehouse/warehouse.module';
import { GoodsReceiptModule } from './routes/goods-receipt/goods-receipt.module';
import { OverviewModule } from './routes/overview/overview.module';
import { InventoryReportModule } from './routes/inventory-report/inventory-report.module';

@Module({
  imports: [
    SharedModule,
    ProductModule,
    SupplierModule,
    WarehouseModule,
    GoodsReceiptModule,
    OverviewModule,
    InventoryReportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

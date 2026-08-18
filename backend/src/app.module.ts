import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';
import { ProductModule } from './routes/product/product.module';
import { SupplierModule } from './routes/supplier/supplier.module';
import { WarehouseModule } from './routes/warehouse/warehouse.module';
import { GoodsReceiptModule } from './routes/goods-receipt/goods-receipt.module';

@Module({
  imports: [
    SharedModule,
    ProductModule,
    SupplierModule,
    WarehouseModule,
    GoodsReceiptModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

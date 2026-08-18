import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';
import { ProductModule } from './routes/product/product.module';
import { SupplierModule } from './routes/supplier/supplier.module';
import { WarehouseModule } from './routes/warehouse/warehouse.module';

@Module({
  imports: [SharedModule, ProductModule, SupplierModule, WarehouseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

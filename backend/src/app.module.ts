import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';
import { ProductsModule } from './routes/product/product.module';
import { SupplierService } from './routes/supplier/supplier.service';
import { SupplierController } from './routes/supplier/supplier.controller';
import { SupplierModule } from './routes/supplier/supplier.module';

@Module({
  imports: [SharedModule, ProductsModule, SupplierModule],
  controllers: [AppController, SupplierController],
  providers: [AppService, SupplierService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { SupplierController } from './supplier.controller';
import { SupplierRepo } from './supplier.repo';
import { SupplierService } from './supplier.service';

@Module({
  controllers: [SupplierController],
  providers: [SupplierService, SupplierRepo],
  exports: [SupplierService, SupplierRepo],
})
export class SupplierModule {}

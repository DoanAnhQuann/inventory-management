import { Module } from '@nestjs/common';
import { WarehouseController } from './warehouse.controller';
import { WarehouseRepo } from './warehouse.repo';
import { WarehouseService } from './warehouse.service';

@Module({
  controllers: [WarehouseController],
  providers: [WarehouseService, WarehouseRepo],
  exports: [WarehouseService],
})
export class WarehouseModule {}

import { Module } from '@nestjs/common';
import { InventoryReportController } from './inventory-report.controller';
import { InventoryReportRepo } from './inventory-report.repo';
import { InventoryReportService } from './inventory-report.service';

@Module({
  controllers: [InventoryReportController],
  providers: [InventoryReportService, InventoryReportRepo],
})
export class InventoryReportModule {}

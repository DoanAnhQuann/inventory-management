import { Module } from '@nestjs/common';
import { OverviewController } from './overview.controller';
import { OverviewRepo } from './overview.repo';
import { OverviewService } from './overview.service';

@Module({
  controllers: [OverviewController],
  providers: [OverviewService, OverviewRepo],
})
export class OverviewModule {}

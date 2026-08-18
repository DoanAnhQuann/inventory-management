import { Controller, Get, Query } from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import { DateRangeQueryDto } from '../../shared/query/date-range-query.dto';
import { ResponseMessage } from '../../shared/response/response-message.decorator';
import { OverviewStatsResDto } from './overview.dto';
import { OVERVIEW_MESSAGE } from './overview.message';
import { OverviewService } from './overview.service';

@Controller('overview')
export class OverviewController {
  constructor(private readonly overviewService: OverviewService) {}

  @Get('stats')
  @ResponseMessage(OVERVIEW_MESSAGE.STATS_SUCCESS)
  @ZodSerializerDto(OverviewStatsResDto)
  getStats(@Query() query: DateRangeQueryDto) {
    return this.overviewService.getStats(query);
  }
}

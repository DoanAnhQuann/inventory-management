import { createZodDto } from 'nestjs-zod';
import { overviewStatsResponseSchema } from './overview.model';

export class OverviewStatsResDto extends createZodDto(
  overviewStatsResponseSchema,
) {}

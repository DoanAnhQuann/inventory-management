import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const dateRangeQuerySchema = z.object({
  from: z.string().trim().optional(),
  to: z.string().trim().optional(),
});

export type DateRangeQuery = z.infer<typeof dateRangeQuerySchema>;

export class DateRangeQueryDto extends createZodDto(dateRangeQuerySchema) {}

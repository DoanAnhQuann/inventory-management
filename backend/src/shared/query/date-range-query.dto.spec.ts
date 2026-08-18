import { dateRangeQuerySchema } from './date-range-query.dto';

describe('dateRangeQuerySchema', () => {
  it('accepts an empty object, leaving both bounds undefined', () => {
    const result = dateRangeQuerySchema.parse({});

    expect(result).toEqual({});
  });

  it('trims from/to string values', () => {
    const result = dateRangeQuerySchema.parse({
      from: '  2026-06-01  ',
      to: '2026-06-30 ',
    });

    expect(result).toEqual({ from: '2026-06-01', to: '2026-06-30' });
  });

  it('accepts only one of the two bounds', () => {
    expect(dateRangeQuerySchema.parse({ from: '2026-06-01' })).toEqual({
      from: '2026-06-01',
    });
    expect(dateRangeQuerySchema.parse({ to: '2026-06-30' })).toEqual({
      to: '2026-06-30',
    });
  });

  it('rejects non-string values', () => {
    const result = dateRangeQuerySchema.safeParse({ from: 12345 });

    expect(result.success).toBe(false);
  });
});

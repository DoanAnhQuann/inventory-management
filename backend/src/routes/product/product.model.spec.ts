import { createProductSchema, productIdParamSchema } from './product.model';
import { PRODUCT_MESSAGE } from './product.message';

describe('createProductSchema', () => {
  const valid = { code: 'VT-001', name: 'Giấy A4', unit: 'Ram', price: 78500 };

  it('accepts a valid payload and trims string fields', () => {
    const result = createProductSchema.parse({
      ...valid,
      code: '  VT-001  ',
      name: '  Giấy A4  ',
    });

    expect(result.code).toBe('VT-001');
    expect(result.name).toBe('Giấy A4');
  });

  it('coerces price from a numeric string', () => {
    const result = createProductSchema.parse({ ...valid, price: '78500' });

    expect(result.price).toBe(78500);
  });

  it.each(['code', 'name', 'unit'])('rejects an empty %s', (field) => {
    const result = createProductSchema.safeParse({ ...valid, [field]: '  ' });

    expect(result.success).toBe(false);
  });

  it('rejects a zero or negative price', () => {
    expect(createProductSchema.safeParse({ ...valid, price: 0 }).success).toBe(
      false,
    );
    expect(createProductSchema.safeParse({ ...valid, price: -1 }).success).toBe(
      false,
    );
  });

  it('allows omitting minStockThreshold', () => {
    const result = createProductSchema.parse(valid);

    expect(result.minStockThreshold).toBeUndefined();
  });

  it('rejects a negative or non-integer minStockThreshold', () => {
    expect(
      createProductSchema.safeParse({ ...valid, minStockThreshold: -1 })
        .success,
    ).toBe(false);
    expect(
      createProductSchema.safeParse({ ...valid, minStockThreshold: 1.5 })
        .success,
    ).toBe(false);
  });

  it('accepts a non-negative integer minStockThreshold', () => {
    const result = createProductSchema.parse({
      ...valid,
      minStockThreshold: 0,
    });

    expect(result.minStockThreshold).toBe(0);
  });
});

describe('productIdParamSchema', () => {
  it('accepts a valid uuid', () => {
    const result = productIdParamSchema.safeParse({
      id: '550e8400-e29b-41d4-a716-446655440000',
    });

    expect(result.success).toBe(true);
  });

  it('rejects a non-uuid id with the product-specific message', () => {
    const result = productIdParamSchema.safeParse({ id: 'not-a-uuid' });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(PRODUCT_MESSAGE.ID_INVALID);
    }
  });
});

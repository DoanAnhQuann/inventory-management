import { createSupplierSchema, supplierIdParamSchema } from './supplier.model';
import { SUPPLIER_MESSAGE } from './supplier.message';

describe('createSupplierSchema', () => {
  it('trims the name and accepts a valid payload', () => {
    const result = createSupplierSchema.parse({
      name: '  Công ty Minh Long  ',
    });

    expect(result.name).toBe('Công ty Minh Long');
  });

  it('rejects an empty or whitespace-only name', () => {
    expect(createSupplierSchema.safeParse({ name: '' }).success).toBe(false);
    expect(createSupplierSchema.safeParse({ name: '   ' }).success).toBe(false);
  });
});

describe('supplierIdParamSchema', () => {
  it('rejects a non-uuid id', () => {
    const result = supplierIdParamSchema.safeParse({ id: '123' });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(SUPPLIER_MESSAGE.ID_INVALID);
    }
  });
});

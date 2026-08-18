import {
  createWarehouseSchema,
  warehouseIdParamSchema,
} from './warehouse.model';
import { WAREHOUSE_MESSAGE } from './warehouse.message';

describe('createWarehouseSchema', () => {
  const valid = { name: 'Kho tổng Hà Nội', location: 'Số 15 Láng Hạ' };

  it('trims name and location and accepts a valid payload', () => {
    const result = createWarehouseSchema.parse({
      name: '  Kho tổng Hà Nội  ',
      location: '  Số 15 Láng Hạ  ',
    });

    expect(result).toEqual(valid);
  });

  it('rejects a missing name', () => {
    const result = createWarehouseSchema.safeParse({ ...valid, name: '' });

    expect(result.success).toBe(false);
  });

  it('rejects a missing location', () => {
    const result = createWarehouseSchema.safeParse({ ...valid, location: '' });

    expect(result.success).toBe(false);
  });
});

describe('warehouseIdParamSchema', () => {
  it('rejects a non-uuid id', () => {
    const result = warehouseIdParamSchema.safeParse({ id: 'abc' });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(WAREHOUSE_MESSAGE.ID_INVALID);
    }
  });
});

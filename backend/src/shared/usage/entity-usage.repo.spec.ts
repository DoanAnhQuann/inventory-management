import type { PrismaClientOrTx } from '../prisma/prisma.types';
import {
  countGoodsReceiptsByProduct,
  countGoodsReceiptsBySupplier,
  countGoodsReceiptsByWarehouse,
} from './entity-usage.repo';

function buildTx(count: jest.Mock): PrismaClientOrTx {
  return { goodsReceipt: { count } } as unknown as PrismaClientOrTx;
}

describe('entity usage counters', () => {
  it('counts receipts containing a product via its items', async () => {
    const count = jest.fn().mockResolvedValue(3);

    await expect(
      countGoodsReceiptsByProduct('prod_a4', buildTx(count)),
    ).resolves.toBe(3);
    expect(count).toHaveBeenCalledWith({
      where: { items: { some: { productId: 'prod_a4' } } },
    });
  });

  it('counts receipts belonging to a supplier', async () => {
    const count = jest.fn().mockResolvedValue(2);

    await expect(
      countGoodsReceiptsBySupplier('sup_minhlong', buildTx(count)),
    ).resolves.toBe(2);
    expect(count).toHaveBeenCalledWith({
      where: { supplierId: 'sup_minhlong' },
    });
  });

  it('counts receipts belonging to a warehouse', async () => {
    const count = jest.fn().mockResolvedValue(0);

    await expect(
      countGoodsReceiptsByWarehouse('wh_hanoi', buildTx(count)),
    ).resolves.toBe(0);
    expect(count).toHaveBeenCalledWith({ where: { warehouseId: 'wh_hanoi' } });
  });
});

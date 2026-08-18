import type { PrismaClientOrTx } from '../prisma/prisma.types';
import { getCurrentStockByProduct } from './product-stock.repo';

describe('getCurrentStockByProduct', () => {
  it('sums current quantity per product across warehouses', async () => {
    const groupBy = jest.fn().mockResolvedValue([
      { productId: 'prod-a4', _sum: { currentQuantity: 20 } },
      { productId: 'prod-muc', _sum: { currentQuantity: 6 } },
    ]);
    const tx = { productStock: { groupBy } } as unknown as PrismaClientOrTx;

    const result = await getCurrentStockByProduct(tx);

    expect(groupBy).toHaveBeenCalledWith({
      by: ['productId'],
      _sum: { currentQuantity: true },
    });
    expect(result).toEqual([
      { productId: 'prod-a4', currentStock: 20 },
      { productId: 'prod-muc', currentStock: 6 },
    ]);
  });

  it('defaults currentStock to 0 when the sum is null', async () => {
    const groupBy = jest
      .fn()
      .mockResolvedValue([
        { productId: 'prod-x', _sum: { currentQuantity: null } },
      ]);
    const tx = { productStock: { groupBy } } as unknown as PrismaClientOrTx;

    const result = await getCurrentStockByProduct(tx);

    expect(result).toEqual([{ productId: 'prod-x', currentStock: 0 }]);
  });

  it('returns an empty array when there is no stock at all', async () => {
    const groupBy = jest.fn().mockResolvedValue([]);
    const tx = { productStock: { groupBy } } as unknown as PrismaClientOrTx;

    await expect(getCurrentStockByProduct(tx)).resolves.toEqual([]);
  });
});

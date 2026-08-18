import type { PrismaClientOrTx } from '../../shared/prisma/prisma.types';
import { buildReceiptDateWhere, GoodsReceiptRepo } from './goods-receipt.repo';

describe('buildReceiptDateWhere', () => {
  it('returns an empty where clause when no bound is given', () => {
    expect(buildReceiptDateWhere({})).toEqual({});
  });

  it('builds a gte-only clause when only "from" is given', () => {
    const result = buildReceiptDateWhere({ from: '2026-06-01' });

    expect(result).toEqual({ receiptDate: { gte: new Date('2026-06-01') } });
  });

  it('builds a lte-only clause when only "to" is given', () => {
    const result = buildReceiptDateWhere({ to: '2026-06-30' });

    expect(result).toEqual({ receiptDate: { lte: new Date('2026-06-30') } });
  });

  it('builds a gte+lte clause when both bounds are given', () => {
    const result = buildReceiptDateWhere({
      from: '2026-06-01',
      to: '2026-06-30',
    });

    expect(result).toEqual({
      receiptDate: { gte: new Date('2026-06-01'), lte: new Date('2026-06-30') },
    });
  });
});

describe('GoodsReceiptRepo.recordInbound', () => {
  it('upserts product_stock and records a stock movement using the upserted balance', async () => {
    const upsert = jest.fn().mockResolvedValue({ currentQuantity: 5 });
    const create = jest.fn().mockResolvedValue({ id: 'mov-1' });
    const tx = {
      productStock: { upsert },
      stockMovement: { create },
    } as unknown as PrismaClientOrTx;
    const repo = new GoodsReceiptRepo({} as never);

    const result = await repo.recordInbound(
      {
        productId: 'prod-muc',
        warehouseId: 'wh-hanoi',
        goodsReceiptItemId: 'item-1',
        quantity: 3,
      },
      tx,
    );

    expect(upsert).toHaveBeenCalledWith({
      where: {
        productId_warehouseId: {
          productId: 'prod-muc',
          warehouseId: 'wh-hanoi',
        },
      },
      create: {
        productId: 'prod-muc',
        warehouseId: 'wh-hanoi',
        currentQuantity: 3,
      },
      update: { currentQuantity: { increment: 3 } },
    });
    expect(create).toHaveBeenCalledWith({
      data: {
        productId: 'prod-muc',
        warehouseId: 'wh-hanoi',
        goodsReceiptItemId: 'item-1',
        movementType: 'IN',
        quantityChange: 3,
        balanceAfter: 5,
      },
    });
    expect(result).toEqual({ id: 'mov-1' });
  });
});

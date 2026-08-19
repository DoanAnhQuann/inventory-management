import type { PrismaClientOrTx } from '../prisma/prisma.types';

export function countGoodsReceiptsByProduct(
  productId: string,
  tx: PrismaClientOrTx,
) {
  return tx.goodsReceipt.count({ where: { items: { some: { productId } } } });
}

export function countGoodsReceiptsBySupplier(
  supplierId: string,
  tx: PrismaClientOrTx,
) {
  return tx.goodsReceipt.count({ where: { supplierId } });
}

export function countGoodsReceiptsByWarehouse(
  warehouseId: string,
  tx: PrismaClientOrTx,
) {
  return tx.goodsReceipt.count({ where: { warehouseId } });
}

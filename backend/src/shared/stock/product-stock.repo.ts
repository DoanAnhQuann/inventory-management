import type { PrismaClientOrTx } from '../prisma/prisma.types';

export interface ProductStockRow {
  productId: string;
  currentStock: number;
}

export async function getCurrentStockByProduct(
  tx: PrismaClientOrTx,
): Promise<ProductStockRow[]> {
  const grouped = await tx.productStock.groupBy({
    by: ['productId'],
    _sum: { currentQuantity: true },
  });
  return grouped.map((row) => ({
    productId: row.productId,
    currentStock: row._sum.currentQuantity ?? 0,
  }));
}

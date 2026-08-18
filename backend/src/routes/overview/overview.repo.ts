import { Injectable } from '@nestjs/common';
import type { Prisma } from '../../../generated/prisma/client';
import type { PrismaClientOrTx } from '../../shared/prisma/prisma.types';
import { PrismaService } from '../../shared/prisma/prisma.service';
import {
  getCurrentStockByProduct,
  type ProductStockRow,
} from '../../shared/stock/product-stock.repo';

@Injectable()
export class OverviewRepo {
  constructor(private readonly prisma: PrismaService) {}

  async getReceiptStats(
    where: Prisma.GoodsReceiptWhereInput,
    tx: PrismaClientOrTx = this.prisma,
  ) {
    const [receiptAgg, itemAgg] = await Promise.all([
      tx.goodsReceipt.aggregate({
        where,
        _count: true,
        _sum: { totalAmount: true },
      }),
      tx.goodsReceiptItem.aggregate({
        where: { goodsReceipt: where },
        _sum: { quantity: true },
      }),
    ]);
    return {
      receiptCount: receiptAgg._count,
      totalValue: receiptAgg._sum.totalAmount?.toNumber() ?? 0,
      totalQuantity: itemAgg._sum.quantity ?? 0,
    };
  }

  getTopProductQuantities(
    where: Prisma.GoodsReceiptWhereInput,
    limit: number,
    tx: PrismaClientOrTx = this.prisma,
  ) {
    return tx.goodsReceiptItem.groupBy({
      by: ['productId'],
      where: { goodsReceipt: where },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: limit,
    });
  }

  getAllProductsBasic(tx: PrismaClientOrTx = this.prisma) {
    return tx.product.findMany({
      select: {
        id: true,
        code: true,
        name: true,
        unit: true,
        minStockThreshold: true,
      },
    });
  }

  getCurrentStockByProduct(
    tx: PrismaClientOrTx = this.prisma,
  ): Promise<ProductStockRow[]> {
    return getCurrentStockByProduct(tx);
  }

  async getStockAsOfDate(
    asOfDate: Date,
    tx: PrismaClientOrTx = this.prisma,
  ): Promise<ProductStockRow[]> {
    const rows = await tx.$queryRaw<
      { productId: string; currentStock: bigint }[]
    >`
      SELECT product_id AS "productId", SUM(balance_after) AS "currentStock"
      FROM (
        SELECT DISTINCT ON (sm.product_id, sm.warehouse_id)
          sm.product_id, sm.warehouse_id, sm.balance_after
        FROM stock_movements sm
        JOIN goods_receipt_items gri ON gri.id = sm.goods_receipt_item_id
        JOIN goods_receipts gr ON gr.id = gri.goods_receipt_id
        WHERE gr.receipt_date <= ${asOfDate}
        ORDER BY sm.product_id, sm.warehouse_id, sm.created_at DESC
      ) latest
      GROUP BY product_id
    `;
    return rows.map((row) => ({
      productId: row.productId,
      currentStock: Number(row.currentStock),
    }));
  }
}

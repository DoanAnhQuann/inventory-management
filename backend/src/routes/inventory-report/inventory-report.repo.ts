import { Injectable } from '@nestjs/common';
import type { PrismaClientOrTx } from '../../shared/prisma/prisma.types';
import { PrismaService } from '../../shared/prisma/prisma.service';
import {
  getCurrentStockByProduct,
  type ProductStockRow,
} from '../../shared/stock/product-stock.repo';

@Injectable()
export class InventoryReportRepo {
  constructor(private readonly prisma: PrismaService) {}

  getMovementSummaryByProduct(tx: PrismaClientOrTx = this.prisma) {
    return tx.stockMovement.groupBy({
      by: ['productId'],
      _max: { createdAt: true },
    });
  }

  getCurrentStockByProduct(
    tx: PrismaClientOrTx = this.prisma,
  ): Promise<ProductStockRow[]> {
    return getCurrentStockByProduct(tx);
  }

  getProductsBasicByIds(ids: string[], tx: PrismaClientOrTx = this.prisma) {
    return tx.product.findMany({
      where: { id: { in: ids } },
      select: { id: true, name: true, unit: true },
    });
  }

  findProductBasic(productId: string, tx: PrismaClientOrTx = this.prisma) {
    return tx.product.findUnique({
      where: { id: productId },
      select: { id: true, name: true, unit: true },
    });
  }

  getMovementsByProduct(productId: string, tx: PrismaClientOrTx = this.prisma) {
    return tx.stockMovement.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        quantityChange: true,
        balanceAfter: true,
        note: true,
        createdAt: true,
      },
    });
  }
}

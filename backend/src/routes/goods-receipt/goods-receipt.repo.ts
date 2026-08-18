import { Injectable } from '@nestjs/common';
import type { Prisma } from '../../../generated/prisma/client';
import type {
  PrismaClientOrTx,
  PrismaTransaction,
} from '../../shared/prisma/prisma.types';
import { PrismaService } from '../../shared/prisma/prisma.service';

interface RecordInboundData {
  productId: string;
  warehouseId: string;
  goodsReceiptItemId: string;
  quantity: number;
}

@Injectable()
export class GoodsReceiptRepo {
  constructor(private readonly prisma: PrismaService) {}

  runInTransaction<T>(fn: (tx: PrismaTransaction) => Promise<T>) {
    return this.prisma.$transaction(fn);
  }

  findAll(tx: PrismaClientOrTx = this.prisma) {
    return tx.goodsReceipt.findMany({
      include: { items: true, warehouse: true, supplier: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  findById(id: string, tx: PrismaClientOrTx = this.prisma) {
    return tx.goodsReceipt.findUnique({
      where: { id },
      include: { items: true, warehouse: true, supplier: true },
    });
  }

  countCreatedBetween(
    start: Date,
    end: Date,
    tx: PrismaClientOrTx = this.prisma,
  ) {
    return tx.goodsReceipt.count({
      where: { createdAt: { gte: start, lt: end } },
    });
  }

  createReceipt(
    data: Prisma.GoodsReceiptUncheckedCreateInput,
    tx: PrismaClientOrTx = this.prisma,
  ) {
    return tx.goodsReceipt.create({ data });
  }

  createItem(
    data: Prisma.GoodsReceiptItemUncheckedCreateInput,
    tx: PrismaClientOrTx = this.prisma,
  ) {
    return tx.goodsReceiptItem.create({ data });
  }

  async recordInbound(
    data: RecordInboundData,
    tx: PrismaClientOrTx = this.prisma,
  ) {
    const stock = await tx.productStock.upsert({
      where: {
        productId_warehouseId: {
          productId: data.productId,
          warehouseId: data.warehouseId,
        },
      },
      create: {
        productId: data.productId,
        warehouseId: data.warehouseId,
        currentQuantity: data.quantity,
      },
      update: {
        currentQuantity: { increment: data.quantity },
      },
    });

    return tx.stockMovement.create({
      data: {
        productId: data.productId,
        warehouseId: data.warehouseId,
        goodsReceiptItemId: data.goodsReceiptItemId,
        movementType: 'IN',
        quantityChange: data.quantity,
        balanceAfter: stock.currentQuantity,
      },
    });
  }
}

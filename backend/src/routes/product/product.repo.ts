import { Injectable } from '@nestjs/common';
import type { PrismaClientOrTx } from '../../shared/prisma/prisma.types';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { countGoodsReceiptsByProduct } from '../../shared/usage/entity-usage.repo';
import { CreateProductDto, UpdateProductDto } from './product.dto';

@Injectable()
export class ProductRepo {
  constructor(private readonly prisma: PrismaService) {}

  findAll(tx: PrismaClientOrTx = this.prisma) {
    return tx.product.findMany({ orderBy: { createdAt: 'desc' } });
  }

  findById(id: string, tx: PrismaClientOrTx = this.prisma) {
    return tx.product.findUnique({ where: { id } });
  }

  findByCodeInsensitive(code: string, tx: PrismaClientOrTx = this.prisma) {
    return tx.product.findFirst({
      where: { code: { equals: code, mode: 'insensitive' } },
    });
  }

  findByNameInsensitive(name: string, tx: PrismaClientOrTx = this.prisma) {
    return tx.product.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
    });
  }

  create(data: CreateProductDto, tx: PrismaClientOrTx = this.prisma) {
    return tx.product.create({ data });
  }

  update(
    id: string,
    data: UpdateProductDto,
    tx: PrismaClientOrTx = this.prisma,
  ) {
    return tx.product.update({ where: { id }, data });
  }

  delete(id: string, tx: PrismaClientOrTx = this.prisma) {
    return tx.product.delete({ where: { id } });
  }

  countGoodsReceipts(id: string, tx: PrismaClientOrTx = this.prisma) {
    return countGoodsReceiptsByProduct(id, tx);
  }
}

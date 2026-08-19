import { Injectable } from '@nestjs/common';
import type { PrismaClientOrTx } from '../../shared/prisma/prisma.types';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { countGoodsReceiptsBySupplier } from '../../shared/usage/entity-usage.repo';
import { CreateSupplierDto, UpdateSupplierDto } from './supplier.dto';

@Injectable()
export class SupplierRepo {
  constructor(private readonly prisma: PrismaService) {}

  findAll(tx: PrismaClientOrTx = this.prisma) {
    return tx.supplier.findMany({ orderBy: { createdAt: 'desc' } });
  }

  findById(id: string, tx: PrismaClientOrTx = this.prisma) {
    return tx.supplier.findUnique({ where: { id } });
  }

  findByNameInsensitive(name: string, tx: PrismaClientOrTx = this.prisma) {
    return tx.supplier.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
    });
  }

  create(data: CreateSupplierDto, tx: PrismaClientOrTx = this.prisma) {
    return tx.supplier.create({ data });
  }

  update(
    id: string,
    data: UpdateSupplierDto,
    tx: PrismaClientOrTx = this.prisma,
  ) {
    return tx.supplier.update({ where: { id }, data });
  }

  delete(id: string, tx: PrismaClientOrTx = this.prisma) {
    return tx.supplier.delete({ where: { id } });
  }

  countGoodsReceipts(id: string, tx: PrismaClientOrTx = this.prisma) {
    return countGoodsReceiptsBySupplier(id, tx);
  }
}

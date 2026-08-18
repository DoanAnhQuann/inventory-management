import { Injectable } from '@nestjs/common';
import type { PrismaClientOrTx } from '../../shared/prisma/prisma.types';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CreateWarehouseDto, UpdateWarehouseDto } from './warehouse.dto';

@Injectable()
export class WarehouseRepo {
  constructor(private readonly prisma: PrismaService) {}

  findAll(tx: PrismaClientOrTx = this.prisma) {
    return tx.warehouse.findMany({ orderBy: { createdAt: 'desc' } });
  }

  findById(id: string, tx: PrismaClientOrTx = this.prisma) {
    return tx.warehouse.findUnique({ where: { id } });
  }

  findByNameInsensitive(name: string, tx: PrismaClientOrTx = this.prisma) {
    return tx.warehouse.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
    });
  }

  create(data: CreateWarehouseDto, tx: PrismaClientOrTx = this.prisma) {
    return tx.warehouse.create({ data });
  }

  update(
    id: string,
    data: UpdateWarehouseDto,
    tx: PrismaClientOrTx = this.prisma,
  ) {
    return tx.warehouse.update({ where: { id }, data });
  }

  delete(id: string, tx: PrismaClientOrTx = this.prisma) {
    return tx.warehouse.delete({ where: { id } });
  }
}

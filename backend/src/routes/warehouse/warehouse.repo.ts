import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CreateWarehouseDto, UpdateWarehouseDto } from './warehouse.dto';

@Injectable()
export class WarehouseRepo {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.warehouse.findMany({ orderBy: { createdAt: 'desc' } });
  }

  findById(id: string) {
    return this.prisma.warehouse.findUnique({ where: { id } });
  }

  findByNameInsensitive(name: string) {
    return this.prisma.warehouse.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
    });
  }

  create(data: CreateWarehouseDto) {
    return this.prisma.warehouse.create({ data });
  }

  update(id: string, data: UpdateWarehouseDto) {
    return this.prisma.warehouse.update({ where: { id }, data });
  }

  delete(id: string) {
    return this.prisma.warehouse.delete({ where: { id } });
  }
}

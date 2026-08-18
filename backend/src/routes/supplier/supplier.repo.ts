import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CreateSupplierDto, UpdateSupplierDto } from './supplier.dto';

@Injectable()
export class SupplierRepo {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.supplier.findMany({ orderBy: { createdAt: 'desc' } });
  }

  findById(id: string) {
    return this.prisma.supplier.findUnique({ where: { id } });
  }

  findByNameInsensitive(name: string) {
    return this.prisma.supplier.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
    });
  }

  create(data: CreateSupplierDto) {
    return this.prisma.supplier.create({ data });
  }

  update(id: string, data: UpdateSupplierDto) {
    return this.prisma.supplier.update({ where: { id }, data });
  }

  delete(id: string) {
    return this.prisma.supplier.delete({ where: { id } });
  }
}

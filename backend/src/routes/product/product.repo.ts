import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './product.dto';

@Injectable()
export class ProductRepo {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
  }

  findById(id: string) {
    return this.prisma.product.findUnique({ where: { id } });
  }

  findByCodeInsensitive(code: string) {
    return this.prisma.product.findFirst({
      where: { code: { equals: code, mode: 'insensitive' } },
    });
  }

  findByNameInsensitive(name: string) {
    return this.prisma.product.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
    });
  }

  create(data: CreateProductDto) {
    return this.prisma.product.create({ data });
  }

  update(id: string, data: UpdateProductDto) {
    return this.prisma.product.update({ where: { id }, data });
  }

  delete(id: string) {
    return this.prisma.product.delete({ where: { id } });
  }
}

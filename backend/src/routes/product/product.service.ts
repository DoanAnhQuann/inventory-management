import { HttpStatus, Injectable } from '@nestjs/common';
import type { Product as ProductRow } from '../../../generated/prisma/client';
import { RESPONSE_CODE } from '../../shared/constants/response-code.constant';
import { AppException } from '../../shared/exceptions/app.exception';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import type { Product } from './product.model';
import { PRODUCT_MESSAGE } from './product.message';
import { ProductRepo } from './product.repo';

function toProductModel(row: ProductRow): Product {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    unit: row.unit,
    price: row.price.toNumber(),
    minStockThreshold: row.minStockThreshold,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

@Injectable()
export class ProductService {
  constructor(private readonly productRepo: ProductRepo) {}

  async findAll(): Promise<Product[]> {
    const rows = await this.productRepo.findAll();
    return rows.map(toProductModel);
  }

  async findOne(id: string): Promise<Product> {
    const row = await this.productRepo.findById(id);
    if (!row) {
      throw new AppException({
        code: RESPONSE_CODE.NOT_FOUND,
        message: PRODUCT_MESSAGE.NOT_FOUND,
        status: HttpStatus.NOT_FOUND,
      });
    }
    return toProductModel(row);
  }

  async create(dto: CreateProductDto): Promise<Product> {
    await this.assertNoDuplicate(dto.code, dto.name);
    const created = await this.productRepo.create(dto);
    return toProductModel(created);
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    await this.findOne(id);
    await this.assertNoDuplicate(dto.code, dto.name, id);
    const updated = await this.productRepo.update(id, dto);
    return toProductModel(updated);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.assertNotInUse(id);
    await this.productRepo.delete(id);
  }

  private async assertNotInUse(id: string) {
    const receiptCount = await this.productRepo.countGoodsReceipts(id);
    if (receiptCount > 0) {
      throw new AppException({
        code: RESPONSE_CODE.CONFLICT,
        message: PRODUCT_MESSAGE.DELETE_IN_USE(receiptCount),
        status: HttpStatus.CONFLICT,
      });
    }
  }

  private async assertNoDuplicate(
    code: string,
    name: string,
    excludeId?: string,
  ) {
    const [existingCode, existingName] = await Promise.all([
      this.productRepo.findByCodeInsensitive(code),
      this.productRepo.findByNameInsensitive(name),
    ]);
    if (existingCode && existingCode.id !== excludeId) {
      throw new AppException({
        code: RESPONSE_CODE.CONFLICT,
        message: PRODUCT_MESSAGE.CODE_DUPLICATE,
        status: HttpStatus.CONFLICT,
      });
    }
    if (existingName && existingName.id !== excludeId) {
      throw new AppException({
        code: RESPONSE_CODE.CONFLICT,
        message: PRODUCT_MESSAGE.NAME_DUPLICATE,
        status: HttpStatus.CONFLICT,
      });
    }
  }
}

import { HttpStatus, Injectable } from '@nestjs/common';
import type { Supplier as SupplierRow } from '../../../generated/prisma/client';
import { RESPONSE_CODE } from '../../shared/constants/response-code.constant';
import { AppException } from '../../shared/exceptions/app.exception';
import { CreateSupplierDto, UpdateSupplierDto } from './supplier.dto';
import type { Supplier } from './supplier.model';
import { SUPPLIER_MESSAGE } from './supplier.message';
import { SupplierRepo } from './supplier.repo';

function toSupplierModel(row: SupplierRow): Supplier {
  return {
    id: row.id,
    name: row.name,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

@Injectable()
export class SupplierService {
  constructor(private readonly supplierRepo: SupplierRepo) {}

  async findAll(): Promise<Supplier[]> {
    const rows = await this.supplierRepo.findAll();
    return rows.map(toSupplierModel);
  }

  async findOne(id: string): Promise<Supplier> {
    const row = await this.supplierRepo.findById(id);
    if (!row) {
      throw new AppException({
        code: RESPONSE_CODE.NOT_FOUND,
        message: SUPPLIER_MESSAGE.NOT_FOUND,
        status: HttpStatus.NOT_FOUND,
      });
    }
    return toSupplierModel(row);
  }

  async create(dto: CreateSupplierDto): Promise<Supplier> {
    await this.assertNoDuplicate(dto.name);
    const created = await this.supplierRepo.create(dto);
    return toSupplierModel(created);
  }

  async update(id: string, dto: UpdateSupplierDto): Promise<Supplier> {
    await this.findOne(id);
    await this.assertNoDuplicate(dto.name, id);
    const updated = await this.supplierRepo.update(id, dto);
    return toSupplierModel(updated);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.assertNotInUse(id);
    await this.supplierRepo.delete(id);
  }

  private async assertNotInUse(id: string) {
    const receiptCount = await this.supplierRepo.countGoodsReceipts(id);
    if (receiptCount > 0) {
      throw new AppException({
        code: RESPONSE_CODE.CONFLICT,
        message: SUPPLIER_MESSAGE.DELETE_IN_USE(receiptCount),
        status: HttpStatus.CONFLICT,
      });
    }
  }

  private async assertNoDuplicate(name: string, excludeId?: string) {
    const existing = await this.supplierRepo.findByNameInsensitive(name);
    if (existing && existing.id !== excludeId) {
      throw new AppException({
        code: RESPONSE_CODE.CONFLICT,
        message: SUPPLIER_MESSAGE.NAME_DUPLICATE,
        status: HttpStatus.CONFLICT,
      });
    }
  }
}

import { HttpStatus, Injectable } from '@nestjs/common';
import type { Warehouse as WarehouseRow } from '../../../generated/prisma/client';
import { RESPONSE_CODE } from '../../shared/constants/response-code.constant';
import { AppException } from '../../shared/exceptions/app.exception';
import { CreateWarehouseDto, UpdateWarehouseDto } from './warehouse.dto';
import type { Warehouse } from './warehouse.model';
import { WAREHOUSE_MESSAGE } from './warehouse.message';
import { WarehouseRepo } from './warehouse.repo';

function toWarehouseModel(row: WarehouseRow): Warehouse {
  return {
    id: row.id,
    name: row.name,
    location: row.location,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    inboundAt: row.inboundAt.toISOString(),
  };
}

@Injectable()
export class WarehouseService {
  constructor(private readonly warehouseRepo: WarehouseRepo) {}

  async findAll(): Promise<Warehouse[]> {
    const rows = await this.warehouseRepo.findAll();
    return rows.map(toWarehouseModel);
  }

  async findOne(id: string): Promise<Warehouse> {
    const row = await this.warehouseRepo.findById(id);
    if (!row) {
      throw new AppException({
        code: RESPONSE_CODE.NOT_FOUND,
        message: WAREHOUSE_MESSAGE.NOT_FOUND,
        status: HttpStatus.NOT_FOUND,
      });
    }
    return toWarehouseModel(row);
  }

  async create(dto: CreateWarehouseDto): Promise<Warehouse> {
    await this.assertNoDuplicate(dto.name);
    const created = await this.warehouseRepo.create(dto);
    return toWarehouseModel(created);
  }

  async update(id: string, dto: UpdateWarehouseDto): Promise<Warehouse> {
    await this.findOne(id);
    await this.assertNoDuplicate(dto.name, id);
    const updated = await this.warehouseRepo.update(id, dto);
    return toWarehouseModel(updated);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.assertNotInUse(id);
    await this.warehouseRepo.delete(id);
  }

  private async assertNotInUse(id: string) {
    const receiptCount = await this.warehouseRepo.countGoodsReceipts(id);
    if (receiptCount > 0) {
      throw new AppException({
        code: RESPONSE_CODE.CONFLICT,
        message: WAREHOUSE_MESSAGE.DELETE_IN_USE(receiptCount),
        status: HttpStatus.CONFLICT,
      });
    }
  }

  private async assertNoDuplicate(name: string, excludeId?: string) {
    const existing = await this.warehouseRepo.findByNameInsensitive(name);
    if (existing && existing.id !== excludeId) {
      throw new AppException({
        code: RESPONSE_CODE.CONFLICT,
        message: WAREHOUSE_MESSAGE.NAME_DUPLICATE,
        status: HttpStatus.CONFLICT,
      });
    }
  }
}

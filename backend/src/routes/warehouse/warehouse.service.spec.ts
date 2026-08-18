import { HttpStatus } from '@nestjs/common';
import type { Warehouse as WarehouseRow } from '../../../generated/prisma/client';
import { RESPONSE_CODE } from '../../shared/constants/response-code.constant';
import { CreateWarehouseDto, UpdateWarehouseDto } from './warehouse.dto';
import { WAREHOUSE_MESSAGE } from './warehouse.message';
import { WarehouseRepo } from './warehouse.repo';
import { WarehouseService } from './warehouse.service';

function buildWarehouseRow(
  overrides: Partial<WarehouseRow> = {},
): WarehouseRow {
  return {
    id: 'wh-1',
    name: 'Kho tổng Hà Nội',
    location: 'Số 15 Láng Hạ, Đống Đa, Hà Nội',
    createdAt: new Date('2026-06-03T00:00:00.000Z'),
    updatedAt: new Date('2026-06-03T00:00:00.000Z'),
    inboundAt: new Date('2026-06-03T00:00:00.000Z'),
    ...overrides,
  };
}

describe('WarehouseService', () => {
  let repo: jest.Mocked<WarehouseRepo>;
  let service: WarehouseService;

  beforeEach(() => {
    repo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByNameInsensitive: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<WarehouseRepo>;
    service = new WarehouseService(repo);
  });

  describe('findAll', () => {
    it('maps rows to warehouse models including inboundAt', async () => {
      repo.findAll.mockResolvedValue([buildWarehouseRow()]);

      const result = await service.findAll();

      expect(result).toEqual([
        {
          id: 'wh-1',
          name: 'Kho tổng Hà Nội',
          location: 'Số 15 Láng Hạ, Đống Đa, Hà Nội',
          createdAt: '2026-06-03T00:00:00.000Z',
          updatedAt: '2026-06-03T00:00:00.000Z',
          inboundAt: '2026-06-03T00:00:00.000Z',
        },
      ]);
    });
  });

  describe('findOne', () => {
    it('throws NOT_FOUND when missing', async () => {
      repo.findById.mockResolvedValue(null);

      await expect(service.findOne('missing')).rejects.toMatchObject({
        code: RESPONSE_CODE.NOT_FOUND,
        message: WAREHOUSE_MESSAGE.NOT_FOUND,
        status: HttpStatus.NOT_FOUND,
      });
    });
  });

  describe('create', () => {
    const dto: CreateWarehouseDto = {
      name: 'Kho mới',
      location: 'Địa chỉ mới',
    };

    it('creates warehouse when name is unique', async () => {
      repo.findByNameInsensitive.mockResolvedValue(null);
      repo.create.mockResolvedValue(
        buildWarehouseRow({ name: dto.name, location: dto.location }),
      );

      const result = await service.create(dto);

      expect(repo.create).toHaveBeenCalledWith(dto);
      expect(result.name).toBe(dto.name);
    });

    it('throws CONFLICT when name already exists', async () => {
      repo.findByNameInsensitive.mockResolvedValue(
        buildWarehouseRow({ id: 'other' }),
      );

      await expect(service.create(dto)).rejects.toMatchObject({
        code: RESPONSE_CODE.CONFLICT,
        message: WAREHOUSE_MESSAGE.NAME_DUPLICATE,
        status: HttpStatus.CONFLICT,
      });
      expect(repo.create).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    const dto: UpdateWarehouseDto = {
      name: 'Tên mới',
      location: 'Địa chỉ mới',
    };

    it('updates warehouse when found and no conflict', async () => {
      repo.findById.mockResolvedValue(buildWarehouseRow());
      repo.findByNameInsensitive.mockResolvedValue(null);
      repo.update.mockResolvedValue(buildWarehouseRow({ name: dto.name }));

      const result = await service.update('wh-1', dto);

      expect(repo.update).toHaveBeenCalledWith('wh-1', dto);
      expect(result.name).toBe(dto.name);
    });

    it('throws NOT_FOUND when target warehouse missing', async () => {
      repo.findById.mockResolvedValue(null);

      await expect(service.update('missing', dto)).rejects.toMatchObject({
        code: RESPONSE_CODE.NOT_FOUND,
      });
      expect(repo.update).not.toHaveBeenCalled();
    });

    it('throws CONFLICT when another warehouse owns the name', async () => {
      repo.findById.mockResolvedValue(buildWarehouseRow());
      repo.findByNameInsensitive.mockResolvedValue(
        buildWarehouseRow({ id: 'other' }),
      );

      await expect(service.update('wh-1', dto)).rejects.toMatchObject({
        code: RESPONSE_CODE.CONFLICT,
        message: WAREHOUSE_MESSAGE.NAME_DUPLICATE,
      });
      expect(repo.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('deletes warehouse when it exists', async () => {
      repo.findById.mockResolvedValue(buildWarehouseRow());
      repo.delete.mockResolvedValue(buildWarehouseRow());

      await service.remove('wh-1');

      expect(repo.delete).toHaveBeenCalledWith('wh-1');
    });

    it('throws NOT_FOUND without deleting when missing', async () => {
      repo.findById.mockResolvedValue(null);

      await expect(service.remove('missing')).rejects.toMatchObject({
        code: RESPONSE_CODE.NOT_FOUND,
      });
      expect(repo.delete).not.toHaveBeenCalled();
    });
  });
});

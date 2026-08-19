import { HttpStatus } from '@nestjs/common';
import type { Supplier as SupplierRow } from '../../../generated/prisma/client';
import { RESPONSE_CODE } from '../../shared/constants/response-code.constant';
import { CreateSupplierDto, UpdateSupplierDto } from './supplier.dto';
import { SUPPLIER_MESSAGE } from './supplier.message';
import { SupplierRepo } from './supplier.repo';
import { SupplierService } from './supplier.service';

function buildSupplierRow(overrides: Partial<SupplierRow> = {}): SupplierRow {
  return {
    id: 'sup-1',
    name: 'Công ty TNHH Thiết bị Văn phòng Minh Long',
    createdAt: new Date('2026-05-01T00:00:00.000Z'),
    updatedAt: new Date('2026-05-01T00:00:00.000Z'),
    ...overrides,
  };
}

describe('SupplierService', () => {
  let repo: jest.Mocked<SupplierRepo>;
  let service: SupplierService;

  beforeEach(() => {
    repo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByNameInsensitive: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      countGoodsReceipts: jest.fn().mockResolvedValue(0),
    } as unknown as jest.Mocked<SupplierRepo>;
    service = new SupplierService(repo);
  });

  describe('findAll', () => {
    it('maps rows to supplier models', async () => {
      repo.findAll.mockResolvedValue([buildSupplierRow()]);

      const result = await service.findAll();

      expect(result).toEqual([
        {
          id: 'sup-1',
          name: 'Công ty TNHH Thiết bị Văn phòng Minh Long',
          createdAt: '2026-05-01T00:00:00.000Z',
          updatedAt: '2026-05-01T00:00:00.000Z',
        },
      ]);
    });
  });

  describe('findOne', () => {
    it('throws NOT_FOUND when missing', async () => {
      repo.findById.mockResolvedValue(null);

      await expect(service.findOne('missing')).rejects.toMatchObject({
        code: RESPONSE_CODE.NOT_FOUND,
        message: SUPPLIER_MESSAGE.NOT_FOUND,
        status: HttpStatus.NOT_FOUND,
      });
    });
  });

  describe('create', () => {
    const dto: CreateSupplierDto = { name: 'Nhà cung cấp mới' };

    it('creates supplier when name is unique', async () => {
      repo.findByNameInsensitive.mockResolvedValue(null);
      repo.create.mockResolvedValue(buildSupplierRow({ name: dto.name }));

      const result = await service.create(dto);

      expect(repo.create).toHaveBeenCalledWith(dto);
      expect(result.name).toBe(dto.name);
    });

    it('throws CONFLICT when name already exists (case-insensitive)', async () => {
      repo.findByNameInsensitive.mockResolvedValue(
        buildSupplierRow({ id: 'other' }),
      );

      await expect(service.create(dto)).rejects.toMatchObject({
        code: RESPONSE_CODE.CONFLICT,
        message: SUPPLIER_MESSAGE.NAME_DUPLICATE,
        status: HttpStatus.CONFLICT,
      });
      expect(repo.create).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    const dto: UpdateSupplierDto = { name: 'Tên mới' };

    it('updates supplier when found and no conflict', async () => {
      repo.findById.mockResolvedValue(buildSupplierRow());
      repo.findByNameInsensitive.mockResolvedValue(null);
      repo.update.mockResolvedValue(buildSupplierRow({ name: dto.name }));

      const result = await service.update('sup-1', dto);

      expect(repo.update).toHaveBeenCalledWith('sup-1', dto);
      expect(result.name).toBe(dto.name);
    });

    it('throws NOT_FOUND when target supplier missing', async () => {
      repo.findById.mockResolvedValue(null);

      await expect(service.update('missing', dto)).rejects.toMatchObject({
        code: RESPONSE_CODE.NOT_FOUND,
      });
      expect(repo.update).not.toHaveBeenCalled();
    });

    it('throws CONFLICT when another supplier owns the name', async () => {
      repo.findById.mockResolvedValue(buildSupplierRow());
      repo.findByNameInsensitive.mockResolvedValue(
        buildSupplierRow({ id: 'other' }),
      );

      await expect(service.update('sup-1', dto)).rejects.toMatchObject({
        code: RESPONSE_CODE.CONFLICT,
        message: SUPPLIER_MESSAGE.NAME_DUPLICATE,
      });
      expect(repo.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('deletes supplier when it exists', async () => {
      repo.findById.mockResolvedValue(buildSupplierRow());
      repo.delete.mockResolvedValue(buildSupplierRow());

      await service.remove('sup-1');

      expect(repo.delete).toHaveBeenCalledWith('sup-1');
    });

    it('throws NOT_FOUND without deleting when missing', async () => {
      repo.findById.mockResolvedValue(null);

      await expect(service.remove('missing')).rejects.toMatchObject({
        code: RESPONSE_CODE.NOT_FOUND,
      });
      expect(repo.delete).not.toHaveBeenCalled();
    });

    it('refuses to delete a supplier used by goods receipts, naming how many', async () => {
      repo.findById.mockResolvedValue(buildSupplierRow());
      repo.countGoodsReceipts.mockResolvedValue(2);

      await expect(service.remove('sup-1')).rejects.toMatchObject({
        code: RESPONSE_CODE.CONFLICT,
        message: SUPPLIER_MESSAGE.DELETE_IN_USE(2),
        status: HttpStatus.CONFLICT,
      });
      expect(repo.delete).not.toHaveBeenCalled();
    });
  });
});

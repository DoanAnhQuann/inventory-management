import { HttpStatus } from '@nestjs/common';
import type { Product as ProductRow } from '../../../generated/prisma/client';
import { Prisma } from '../../../generated/prisma/client';
import { RESPONSE_CODE } from '../../shared/constants/response-code.constant';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { PRODUCT_MESSAGE } from './product.message';
import { ProductRepo } from './product.repo';
import { ProductService } from './product.service';

function buildProductRow(overrides: Partial<ProductRow> = {}): ProductRow {
  return {
    id: 'prod-1',
    code: 'VT-001',
    name: 'Giấy A4 Double A 80gsm',
    unit: 'Ram',
    price: new Prisma.Decimal(78500),
    minStockThreshold: 10,
    createdAt: new Date('2026-06-01T00:00:00.000Z'),
    updatedAt: new Date('2026-06-01T00:00:00.000Z'),
    ...overrides,
  };
}

describe('ProductService', () => {
  let repo: jest.Mocked<ProductRepo>;
  let service: ProductService;

  beforeEach(() => {
    repo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByCodeInsensitive: jest.fn(),
      findByNameInsensitive: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<ProductRepo>;
    service = new ProductService(repo);
  });

  describe('findAll', () => {
    it('maps rows to product models, converting Decimal price to number', async () => {
      repo.findAll.mockResolvedValue([buildProductRow()]);

      const result = await service.findAll();

      expect(result).toEqual([
        {
          id: 'prod-1',
          code: 'VT-001',
          name: 'Giấy A4 Double A 80gsm',
          unit: 'Ram',
          price: 78500,
          minStockThreshold: 10,
          createdAt: '2026-06-01T00:00:00.000Z',
          updatedAt: '2026-06-01T00:00:00.000Z',
        },
      ]);
    });
  });

  describe('findOne', () => {
    it('returns mapped product when found', async () => {
      repo.findById.mockResolvedValue(buildProductRow());

      const result = await service.findOne('prod-1');

      expect(repo.findById).toHaveBeenCalledWith('prod-1');
      expect(result.id).toBe('prod-1');
    });

    it('throws NOT_FOUND AppException when missing', async () => {
      repo.findById.mockResolvedValue(null);

      await expect(service.findOne('missing')).rejects.toMatchObject({
        code: RESPONSE_CODE.NOT_FOUND,
        message: PRODUCT_MESSAGE.NOT_FOUND,
        status: HttpStatus.NOT_FOUND,
      });
    });
  });

  describe('create', () => {
    const dto: CreateProductDto = {
      code: 'VT-001',
      name: 'Giấy A4 Double A 80gsm',
      unit: 'Ram',
      price: 78500,
    };

    it('creates product when code and name are unique', async () => {
      repo.findByCodeInsensitive.mockResolvedValue(null);
      repo.findByNameInsensitive.mockResolvedValue(null);
      repo.create.mockResolvedValue(buildProductRow());

      const result = await service.create(dto);

      expect(repo.create).toHaveBeenCalledWith(dto);
      expect(result.code).toBe('VT-001');
    });

    it('throws CONFLICT when code already exists', async () => {
      repo.findByCodeInsensitive.mockResolvedValue(
        buildProductRow({ id: 'other' }),
      );
      repo.findByNameInsensitive.mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toMatchObject({
        code: RESPONSE_CODE.CONFLICT,
        message: PRODUCT_MESSAGE.CODE_DUPLICATE,
        status: HttpStatus.CONFLICT,
      });
      expect(repo.create).not.toHaveBeenCalled();
    });

    it('throws CONFLICT when name already exists', async () => {
      repo.findByCodeInsensitive.mockResolvedValue(null);
      repo.findByNameInsensitive.mockResolvedValue(
        buildProductRow({ id: 'other' }),
      );

      await expect(service.create(dto)).rejects.toMatchObject({
        code: RESPONSE_CODE.CONFLICT,
        message: PRODUCT_MESSAGE.NAME_DUPLICATE,
        status: HttpStatus.CONFLICT,
      });
      expect(repo.create).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    const dto: UpdateProductDto = {
      code: 'VT-001',
      name: 'Giấy A4 Double A 80gsm (mới)',
      unit: 'Ram',
      price: 80000,
    };

    it('updates product when no conflicting duplicate exists', async () => {
      repo.findById.mockResolvedValue(buildProductRow());
      repo.findByCodeInsensitive.mockResolvedValue(buildProductRow());
      repo.findByNameInsensitive.mockResolvedValue(null);
      repo.update.mockResolvedValue(buildProductRow({ name: dto.name }));

      const result = await service.update('prod-1', dto);

      expect(repo.update).toHaveBeenCalledWith('prod-1', dto);
      expect(result.name).toBe(dto.name);
    });

    it('throws NOT_FOUND when target product does not exist', async () => {
      repo.findById.mockResolvedValue(null);

      await expect(service.update('missing', dto)).rejects.toMatchObject({
        code: RESPONSE_CODE.NOT_FOUND,
      });
      expect(repo.update).not.toHaveBeenCalled();
    });

    it('allows keeping the same code/name for the same product (excludeId)', async () => {
      repo.findById.mockResolvedValue(buildProductRow());
      repo.findByCodeInsensitive.mockResolvedValue(buildProductRow());
      repo.findByNameInsensitive.mockResolvedValue(buildProductRow());
      repo.update.mockResolvedValue(buildProductRow());

      await expect(service.update('prod-1', dto)).resolves.toBeDefined();
      expect(repo.update).toHaveBeenCalled();
    });

    it('throws CONFLICT when another product already owns the code', async () => {
      repo.findById.mockResolvedValue(buildProductRow());
      repo.findByCodeInsensitive.mockResolvedValue(
        buildProductRow({ id: 'other' }),
      );
      repo.findByNameInsensitive.mockResolvedValue(null);

      await expect(service.update('prod-1', dto)).rejects.toMatchObject({
        code: RESPONSE_CODE.CONFLICT,
        message: PRODUCT_MESSAGE.CODE_DUPLICATE,
      });
      expect(repo.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('deletes product when it exists', async () => {
      repo.findById.mockResolvedValue(buildProductRow());
      repo.delete.mockResolvedValue(buildProductRow());

      await service.remove('prod-1');

      expect(repo.delete).toHaveBeenCalledWith('prod-1');
    });

    it('throws NOT_FOUND without calling delete when missing', async () => {
      repo.findById.mockResolvedValue(null);

      await expect(service.remove('missing')).rejects.toMatchObject({
        code: RESPONSE_CODE.NOT_FOUND,
      });
      expect(repo.delete).not.toHaveBeenCalled();
    });
  });
});

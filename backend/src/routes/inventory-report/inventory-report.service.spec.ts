import { HttpStatus } from '@nestjs/common';
import { RESPONSE_CODE } from '../../shared/constants/response-code.constant';
import { InventoryReportRepo } from './inventory-report.repo';
import { InventoryReportService } from './inventory-report.service';
import { INVENTORY_REPORT_MESSAGE } from './inventory-report.message';

describe('InventoryReportService', () => {
  let repo: jest.Mocked<InventoryReportRepo>;
  let service: InventoryReportService;

  beforeEach(() => {
    repo = {
      getMovementSummaryByProduct: jest.fn(),
      getCurrentStockByProduct: jest.fn(),
      getProductsBasicByIds: jest.fn(),
      findProductBasic: jest.fn(),
      getMovementsByProduct: jest.fn(),
    } as unknown as jest.Mocked<InventoryReportRepo>;
    service = new InventoryReportService(repo);
  });

  describe('getProductSummaries', () => {
    it('merges movement summaries with product info and current stock', async () => {
      repo.getMovementSummaryByProduct.mockResolvedValue([
        {
          productId: 'prod_a4',
          _max: { createdAt: new Date('2026-06-01T00:00:00.000Z') },
        },
      ] as never);
      repo.getProductsBasicByIds.mockResolvedValue([
        { id: 'prod_a4', name: 'Giấy A4 Double A 80gsm', unit: 'Ram' },
      ] as never);
      repo.getCurrentStockByProduct.mockResolvedValue([
        { productId: 'prod_a4', currentStock: 20 },
      ]);

      const result = await service.getProductSummaries();

      expect(repo.getProductsBasicByIds).toHaveBeenCalledWith(['prod_a4']);
      expect(result).toEqual([
        {
          productId: 'prod_a4',
          productName: 'Giấy A4 Double A 80gsm',
          unit: 'Ram',
          currentStock: 20,
          lastMovementAt: '2026-06-01T00:00:00.000Z',
        },
      ]);
    });

    it('drops movement groups whose product no longer exists', async () => {
      repo.getMovementSummaryByProduct.mockResolvedValue([
        { productId: 'prod-deleted', _max: { createdAt: new Date() } },
      ] as never);
      repo.getProductsBasicByIds.mockResolvedValue([]);
      repo.getCurrentStockByProduct.mockResolvedValue([]);

      const result = await service.getProductSummaries();

      expect(result).toEqual([]);
    });

    it('defaults current stock to 0 when the product has no stock row', async () => {
      repo.getMovementSummaryByProduct.mockResolvedValue([
        {
          productId: 'prod_a4',
          _max: { createdAt: new Date('2026-06-01T00:00:00.000Z') },
        },
      ] as never);
      repo.getProductsBasicByIds.mockResolvedValue([
        { id: 'prod_a4', name: 'Giấy A4 Double A 80gsm', unit: 'Ram' },
      ] as never);
      repo.getCurrentStockByProduct.mockResolvedValue([]);

      const result = await service.getProductSummaries();

      expect(result[0].currentStock).toBe(0);
    });

    it('sorts results alphabetically by product name using Vietnamese collation', async () => {
      repo.getMovementSummaryByProduct.mockResolvedValue([
        { productId: 'prod_muc', _max: { createdAt: new Date() } },
        { productId: 'prod_an', _max: { createdAt: new Date() } },
        { productId: 'prod_but', _max: { createdAt: new Date() } },
      ] as never);
      repo.getProductsBasicByIds.mockResolvedValue([
        { id: 'prod_muc', name: 'Mực in laser', unit: 'Hộp' },
        { id: 'prod_an', name: 'Ấm siêu tốc', unit: 'Cái' },
        { id: 'prod_but', name: 'Bút bi', unit: 'Cây' },
      ] as never);
      repo.getCurrentStockByProduct.mockResolvedValue([]);

      const result = await service.getProductSummaries();

      expect(result.map((item) => item.productName)).toEqual([
        'Ấm siêu tốc',
        'Bút bi',
        'Mực in laser',
      ]);
    });
  });

  describe('getMovements', () => {
    it('throws NOT_FOUND when the product does not exist', async () => {
      repo.findProductBasic.mockResolvedValue(null);

      await expect(service.getMovements('missing')).rejects.toMatchObject({
        code: RESPONSE_CODE.NOT_FOUND,
        message: INVENTORY_REPORT_MESSAGE.PRODUCT_NOT_FOUND,
        status: HttpStatus.NOT_FOUND,
      });
      expect(repo.getMovementsByProduct).not.toHaveBeenCalled();
    });

    it('maps movement rows to stock movement items, defaulting note to undefined', async () => {
      repo.findProductBasic.mockResolvedValue({
        id: 'prod_muc',
        name: 'Mực in laser',
        unit: 'Hộp',
      });
      repo.getMovementsByProduct.mockResolvedValue([
        {
          id: 'mov_001',
          quantityChange: 2,
          balanceAfter: 2,
          note: null,
          createdAt: new Date('2026-06-01T00:00:00.000Z'),
        },
        {
          id: 'mov_002',
          quantityChange: 3,
          balanceAfter: 5,
          note: 'Nhập bổ sung',
          createdAt: new Date('2026-06-20T10:00:00.100Z'),
        },
      ] as never);

      const result = await service.getMovements('prod_muc');

      expect(result).toEqual([
        {
          id: 'mov_001',
          productId: 'prod_muc',
          productName: 'Mực in laser',
          unit: 'Hộp',
          date: '2026-06-01T00:00:00.000Z',
          change: 2,
          balanceAfter: 2,
          note: undefined,
        },
        {
          id: 'mov_002',
          productId: 'prod_muc',
          productName: 'Mực in laser',
          unit: 'Hộp',
          date: '2026-06-20T10:00:00.100Z',
          change: 3,
          balanceAfter: 5,
          note: 'Nhập bổ sung',
        },
      ]);
    });
  });
});

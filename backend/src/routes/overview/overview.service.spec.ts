import { OverviewRepo } from './overview.repo';
import { OverviewService } from './overview.service';

const products = [
  {
    id: 'prod_a4',
    code: 'VT-001',
    name: 'Giấy A4 Double A 80gsm',
    unit: 'Ram',
    minStockThreshold: null,
  },
  {
    id: 'prod_muc',
    code: 'VT-014',
    name: 'Mực in laser đen HP 76A',
    unit: 'Hộp',
    minStockThreshold: null,
  },
  {
    id: 'prod_but',
    code: 'VT-020',
    name: 'Bút bi Thiên Long',
    unit: 'Cây',
    minStockThreshold: null,
  },
];

const receiptStats = {
  receiptCount: 11,
  totalValue: 27440000,
  totalQuantity: 288,
};

describe('OverviewService.getStats', () => {
  let repo: jest.Mocked<OverviewRepo>;
  let service: OverviewService;

  beforeEach(() => {
    repo = {
      getReceiptStats: jest.fn().mockResolvedValue(receiptStats),
      getTopProductQuantities: jest.fn().mockResolvedValue([]),
      getAllProductsBasic: jest.fn().mockResolvedValue(products),
      getCurrentStockByProduct: jest.fn().mockResolvedValue([]),
      getStockAsOfDate: jest.fn().mockResolvedValue([]),
    } as unknown as jest.Mocked<OverviewRepo>;
    service = new OverviewService(repo);
  });

  it('passes through receipt-level aggregate stats untouched', async () => {
    const result = await service.getStats({});

    expect(result.receiptCount).toBe(11);
    expect(result.totalValue).toBe(27440000);
    expect(result.totalQuantity).toBe(288);
  });

  it('maps top-product groups to their product info and drops unknown products', async () => {
    repo.getTopProductQuantities.mockResolvedValue([
      { productId: 'prod_a4', _sum: { quantity: 120 } },
      { productId: 'prod-deleted', _sum: { quantity: 999 } },
    ] as never);

    const result = await service.getStats({});

    expect(result.topProducts).toEqual([
      {
        productName: 'Giấy A4 Double A 80gsm',
        productCode: 'VT-001',
        unit: 'Ram',
        totalQuantity: 120,
      },
    ]);
  });

  it('defaults a top-product quantity to 0 when the sum is null', async () => {
    repo.getTopProductQuantities.mockResolvedValue([
      { productId: 'prod_a4', _sum: { quantity: null } },
    ] as never);

    const result = await service.getStats({});

    expect(result.topProducts[0].totalQuantity).toBe(0);
  });

  it('counts only products with positive current stock as in-stock', async () => {
    repo.getCurrentStockByProduct.mockResolvedValue([
      { productId: 'prod_a4', currentStock: 20 },
      { productId: 'prod_muc', currentStock: 0 },
    ]);

    const result = await service.getStats({});

    expect(result.inStockProductCount).toBe(1);
  });

  it('sorts low-stock products ascending by current stock and limits to 3', async () => {
    repo.getCurrentStockByProduct.mockResolvedValue([
      { productId: 'prod_a4', currentStock: 20 },
      { productId: 'prod_muc', currentStock: 6 },
      { productId: 'prod_but', currentStock: 1 },
    ]);

    const result = await service.getStats({});

    expect(result.lowStockProducts.map((item) => item.productId)).toEqual([
      'prod_but',
      'prod_muc',
      'prod_a4',
    ]);
  });

  it('treats products absent from the stock map as having zero stock', async () => {
    repo.getCurrentStockByProduct.mockResolvedValue([
      { productId: 'prod_a4', currentStock: 20 },
    ]);

    const result = await service.getStats({});

    const mucEntry = result.lowStockProducts.find(
      (item) => item.productId === 'prod_muc',
    );
    expect(mucEntry?.currentStock).toBe(0);
  });

  it('reads point-in-time stock via getStockAsOfDate when "to" is a past date', async () => {
    await service.getStats({ to: '2020-01-01' });

    expect(repo.getStockAsOfDate).toHaveBeenCalledWith(new Date('2020-01-01'));
    expect(repo.getCurrentStockByProduct).not.toHaveBeenCalled();
  });

  it('reads live stock via getCurrentStockByProduct when "to" is absent', async () => {
    await service.getStats({});

    expect(repo.getCurrentStockByProduct).toHaveBeenCalled();
    expect(repo.getStockAsOfDate).not.toHaveBeenCalled();
  });

  it('reads live stock via getCurrentStockByProduct when "to" is not in the past', async () => {
    await service.getStats({ to: '2099-01-01' });

    expect(repo.getCurrentStockByProduct).toHaveBeenCalled();
    expect(repo.getStockAsOfDate).not.toHaveBeenCalled();
  });

  it('builds the receipt-date where clause from the query and forwards it to the repo', async () => {
    await service.getStats({ from: '2026-06-01', to: '2099-01-01' });

    expect(repo.getReceiptStats).toHaveBeenCalledWith({
      receiptDate: { gte: new Date('2026-06-01'), lte: new Date('2099-01-01') },
    });
  });
});

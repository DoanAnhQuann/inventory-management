import { Injectable } from '@nestjs/common';
import { buildReceiptDateWhere } from '../goods-receipt/goods-receipt.repo';
import type { DateRangeQuery } from '../../shared/query/date-range-query.dto';
import type {
  LowStockProduct,
  OverviewStats,
  TopProductStat,
} from './overview.model';
import { OverviewRepo } from './overview.repo';

const TOP_PRODUCTS_LIMIT = 3;
const LOW_STOCK_LIMIT = 3;

function isPastDate(dateStr: string): boolean {
  const todayStr = new Date().toISOString().slice(0, 10);
  return dateStr < todayStr;
}

@Injectable()
export class OverviewService {
  constructor(private readonly overviewRepo: OverviewRepo) {}

  async getStats(query: DateRangeQuery): Promise<OverviewStats> {
    const where = buildReceiptDateWhere(query);

    const [receiptStats, topProductGroups, products, stockRows] =
      await Promise.all([
        this.overviewRepo.getReceiptStats(where),
        this.overviewRepo.getTopProductQuantities(where, TOP_PRODUCTS_LIMIT),
        this.overviewRepo.getAllProductsBasic(),
        query.to && isPastDate(query.to)
          ? this.overviewRepo.getStockAsOfDate(new Date(query.to))
          : this.overviewRepo.getCurrentStockByProduct(),
      ]);

    const productById = new Map(
      products.map((product) => [product.id, product]),
    );

    const topProducts: TopProductStat[] = topProductGroups
      .map((group) => {
        const product = productById.get(group.productId);
        if (!product) return null;
        return {
          productName: product.name,
          productCode: product.code,
          unit: product.unit,
          totalQuantity: group._sum.quantity ?? 0,
        };
      })
      .filter((item): item is TopProductStat => item !== null);

    const stockByProductId = new Map(
      stockRows.map((row) => [row.productId, row.currentStock]),
    );

    const stockByProduct: LowStockProduct[] = products.map((product) => ({
      productId: product.id,
      productName: product.name,
      productCode: product.code,
      unit: product.unit,
      currentStock: stockByProductId.get(product.id) ?? 0,
    }));

    const inStockProductCount = stockByProduct.filter(
      (item) => item.currentStock > 0,
    ).length;
    const lowStockProducts = [...stockByProduct]
      .sort((a, b) => a.currentStock - b.currentStock)
      .slice(0, LOW_STOCK_LIMIT);

    return {
      receiptCount: receiptStats.receiptCount,
      totalValue: receiptStats.totalValue,
      totalQuantity: receiptStats.totalQuantity,
      inStockProductCount,
      topProducts,
      lowStockProducts,
    };
  }
}

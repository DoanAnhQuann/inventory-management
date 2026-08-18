import { HttpStatus, Injectable } from '@nestjs/common';
import { RESPONSE_CODE } from '../../shared/constants/response-code.constant';
import { AppException } from '../../shared/exceptions/app.exception';
import { INVENTORY_REPORT_MESSAGE } from './inventory-report.message';
import type {
  ProductStockSummary,
  StockMovementItem,
} from './inventory-report.model';
import { InventoryReportRepo } from './inventory-report.repo';

@Injectable()
export class InventoryReportService {
  constructor(private readonly inventoryReportRepo: InventoryReportRepo) {}

  async getProductSummaries(): Promise<ProductStockSummary[]> {
    const movementGroups =
      await this.inventoryReportRepo.getMovementSummaryByProduct();
    const productIds = movementGroups.map((group) => group.productId);

    const [products, stockRows] = await Promise.all([
      this.inventoryReportRepo.getProductsBasicByIds(productIds),
      this.inventoryReportRepo.getCurrentStockByProduct(),
    ]);

    const productById = new Map(
      products.map((product) => [product.id, product]),
    );
    const stockByProductId = new Map(
      stockRows.map((row) => [row.productId, row.currentStock]),
    );

    return movementGroups
      .map((group) => {
        const product = productById.get(group.productId);
        if (!product) return null;
        return {
          productId: group.productId,
          productName: product.name,
          unit: product.unit,
          currentStock: stockByProductId.get(group.productId) ?? 0,
          lastMovementAt: group._max.createdAt!.toISOString(),
        };
      })
      .filter((item): item is ProductStockSummary => item !== null)
      .sort((a, b) => a.productName.localeCompare(b.productName, 'vi'));
  }

  async getMovements(productId: string): Promise<StockMovementItem[]> {
    const product = await this.inventoryReportRepo.findProductBasic(productId);
    if (!product) {
      throw new AppException({
        code: RESPONSE_CODE.NOT_FOUND,
        message: INVENTORY_REPORT_MESSAGE.PRODUCT_NOT_FOUND,
        status: HttpStatus.NOT_FOUND,
      });
    }

    const movements =
      await this.inventoryReportRepo.getMovementsByProduct(productId);

    return movements.map((movement) => ({
      id: movement.id,
      productId,
      productName: product.name,
      unit: product.unit,
      date: movement.createdAt.toISOString(),
      change: movement.quantityChange,
      balanceAfter: movement.balanceAfter,
      note: movement.note ?? undefined,
    }));
  }
}

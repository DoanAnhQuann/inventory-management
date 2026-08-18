import { HttpStatus, Injectable } from '@nestjs/common';
import type {
  Prisma,
  Product as ProductRow,
} from '../../../generated/prisma/client';
import { COMMON_MESSAGE } from '../../shared/constants/message.constant';
import { RESPONSE_CODE } from '../../shared/constants/response-code.constant';
import { AppException } from '../../shared/exceptions/app.exception';
import type { PrismaTransaction } from '../../shared/prisma/prisma.types';
import type { DateRangeQuery } from '../../shared/query/date-range-query.dto';
import { ProductRepo } from '../product/product.repo';
import { SupplierRepo } from '../supplier/supplier.repo';
import { WarehouseRepo } from '../warehouse/warehouse.repo';
import { CreateGoodsReceiptDto } from './goods-receipt.dto';
import { GOODS_RECEIPT_MESSAGE } from './goods-receipt.message';
import type { GoodsReceipt } from './goods-receipt.model';
import { buildReceiptDateWhere, GoodsReceiptRepo } from './goods-receipt.repo';

type GoodsReceiptRow = Prisma.GoodsReceiptGetPayload<{
  include: { items: true; warehouse: true; supplier: true };
}>;

function toGoodsReceiptModel(row: GoodsReceiptRow): GoodsReceipt {
  return {
    id: row.id,
    code: row.code,
    warehouseName: row.warehouse.name,
    supplierName: row.supplier.name,
    receiptDate: row.receiptDate.toISOString().slice(0, 10),
    unitName: row.unitName,
    department: row.department,
    delivererName: row.delivererName,
    invoiceNumber: row.invoiceNumber,
    invoiceDate: row.invoiceDate.toISOString().slice(0, 10),
    debitAccount: row.debitAccount,
    creditAccount: row.creditAccount,
    attachedDocuments: row.attachedDocuments,
    amountInWords: row.amountInWords,
    note: row.note ?? undefined,
    items: row.items.map((item) => ({
      productName: item.productNameSnapshot,
      productCode: item.productCodeSnapshot,
      unit: item.unitSnapshot,
      quantity: item.quantity,
      price: item.unitPrice.toNumber(),
    })),
    totalAmount: row.totalAmount.toNumber(),
    createdAt: row.createdAt.toISOString(),
  };
}

function generateCode(sequence: number, now: Date): string {
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  return `PNK-${year}${month}${day}-${String(sequence).padStart(3, '0')}`;
}

interface PrismaUniqueConstraintError {
  code?: unknown;
  meta?: {
    target?: unknown;
    driverAdapterError?: {
      cause?: {
        kind?: unknown;
        constraint?: { fields?: unknown };
      };
    };
  };
}

function isDuplicateCodeError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const candidate = error as PrismaUniqueConstraintError;
  if (candidate.code !== 'P2002') return false;

  if (Array.isArray(candidate.meta?.target)) {
    return candidate.meta.target.includes('code');
  }

  const constraintFields =
    candidate.meta?.driverAdapterError?.cause?.constraint?.fields;
  return Array.isArray(constraintFields) && constraintFields.includes('code');
}

const CREATE_RETRY_ATTEMPTS = 3;

@Injectable()
export class GoodsReceiptService {
  constructor(
    private readonly goodsReceiptRepo: GoodsReceiptRepo,
    private readonly productRepo: ProductRepo,
    private readonly supplierRepo: SupplierRepo,
    private readonly warehouseRepo: WarehouseRepo,
  ) {}

  async findAll(query: DateRangeQuery = {}): Promise<GoodsReceipt[]> {
    const rows = await this.goodsReceiptRepo.findAll(
      buildReceiptDateWhere(query),
    );
    return rows.map(toGoodsReceiptModel);
  }

  async findOne(id: string): Promise<GoodsReceipt> {
    const row = await this.goodsReceiptRepo.findById(id);
    if (!row) {
      throw new AppException({
        code: RESPONSE_CODE.NOT_FOUND,
        message: GOODS_RECEIPT_MESSAGE.NOT_FOUND,
        status: HttpStatus.NOT_FOUND,
      });
    }
    return toGoodsReceiptModel(row);
  }

  async create(dto: CreateGoodsReceiptDto): Promise<GoodsReceipt> {
    for (let attempt = 1; attempt <= CREATE_RETRY_ATTEMPTS; attempt++) {
      try {
        const row = await this.goodsReceiptRepo.runInTransaction((tx) =>
          this.createWithinTransaction(dto, tx),
        );
        return toGoodsReceiptModel(row);
      } catch (error) {
        if (!isDuplicateCodeError(error) || attempt === CREATE_RETRY_ATTEMPTS)
          throw error;
      }
    }
    throw new AppException({
      code: RESPONSE_CODE.INTERNAL_SERVER_ERROR,
      message: COMMON_MESSAGE.INTERNAL_SERVER_ERROR,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }

  private async createWithinTransaction(
    dto: CreateGoodsReceiptDto,
    tx: PrismaTransaction,
  ): Promise<GoodsReceiptRow> {
    const warehouse = await this.resolveWarehouse(dto, tx);
    const supplier = await this.resolveSupplier(dto, tx);
    const products = await this.resolveProducts(dto, tx);

    const now = new Date();
    const startOfDay = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
    );
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
    const countToday = await this.goodsReceiptRepo.countCreatedBetween(
      startOfDay,
      endOfDay,
      tx,
    );
    const code = generateCode(countToday + 1, now);

    const totalAmount = dto.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0,
    );

    const receipt = await this.goodsReceiptRepo.createReceipt(
      {
        code,
        warehouseId: warehouse.id,
        supplierId: supplier.id,
        receiptDate: new Date(dto.receiptDate),
        unitName: dto.unitName,
        department: dto.department,
        delivererName: dto.delivererName,
        invoiceNumber: dto.invoiceNumber,
        invoiceDate: new Date(dto.invoiceDate),
        debitAccount: dto.debitAccount,
        creditAccount: dto.creditAccount,
        attachedDocuments: dto.attachedDocuments,
        amountInWords: dto.amountInWords,
        note: dto.note,
        totalAmount,
      },
      tx,
    );

    for (const item of dto.items) {
      const product = products.get(item.productName.trim().toLowerCase());
      if (!product) continue;
      const lineTotal = item.quantity * item.price;

      const itemRow = await this.goodsReceiptRepo.createItem(
        {
          goodsReceiptId: receipt.id,
          productId: product.id,
          productCodeSnapshot: product.code,
          productNameSnapshot: product.name,
          unitSnapshot: product.unit,
          quantity: item.quantity,
          unitPrice: item.price,
          lineTotal,
        },
        tx,
      );

      await this.goodsReceiptRepo.recordInbound(
        {
          productId: product.id,
          warehouseId: warehouse.id,
          goodsReceiptItemId: itemRow.id,
          quantity: item.quantity,
        },
        tx,
      );
    }

    const created = await this.goodsReceiptRepo.findById(receipt.id, tx);
    if (!created) {
      throw new AppException({
        code: RESPONSE_CODE.INTERNAL_SERVER_ERROR,
        message: COMMON_MESSAGE.INTERNAL_SERVER_ERROR,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
    return created;
  }

  private async resolveWarehouse(
    dto: CreateGoodsReceiptDto,
    tx: PrismaTransaction,
  ) {
    const existing = await this.warehouseRepo.findByNameInsensitive(
      dto.warehouseName,
      tx,
    );
    if (existing) return existing;

    const location = dto.warehouseLocation?.trim();
    if (!location) {
      throw new AppException({
        code: RESPONSE_CODE.VALIDATION_ERROR,
        message: GOODS_RECEIPT_MESSAGE.WAREHOUSE_LOCATION_REQUIRED_FOR_NEW,
        status: HttpStatus.BAD_REQUEST,
        errors: [
          {
            field: 'warehouseLocation',
            message: GOODS_RECEIPT_MESSAGE.WAREHOUSE_LOCATION_REQUIRED_FOR_NEW,
          },
        ],
      });
    }
    return this.warehouseRepo.create({ name: dto.warehouseName, location }, tx);
  }

  private async resolveSupplier(
    dto: CreateGoodsReceiptDto,
    tx: PrismaTransaction,
  ) {
    const existing = await this.supplierRepo.findByNameInsensitive(
      dto.supplierName,
      tx,
    );
    if (existing) return existing;
    return this.supplierRepo.create({ name: dto.supplierName }, tx);
  }

  private async resolveProducts(
    dto: CreateGoodsReceiptDto,
    tx: PrismaTransaction,
  ): Promise<Map<string, ProductRow>> {
    const resolved = new Map<string, ProductRow>();
    for (const item of dto.items) {
      const key = item.productName.trim().toLowerCase();
      if (resolved.has(key)) continue;
      const existing = await this.productRepo.findByNameInsensitive(
        item.productName,
        tx,
      );
      const product =
        existing ??
        (await this.productRepo.create(
          {
            code: item.productCode,
            name: item.productName,
            unit: item.unit,
            price: item.price,
          },
          tx,
        ));
      resolved.set(key, product);
    }
    return resolved;
  }
}

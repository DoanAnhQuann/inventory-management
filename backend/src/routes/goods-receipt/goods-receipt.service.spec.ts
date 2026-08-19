import { HttpStatus } from '@nestjs/common';
import { Prisma } from '../../../generated/prisma/client';
import { RESPONSE_CODE } from '../../shared/constants/response-code.constant';
import { ProductRepo } from '../product/product.repo';
import { SupplierRepo } from '../supplier/supplier.repo';
import { WarehouseRepo } from '../warehouse/warehouse.repo';
import { CreateGoodsReceiptDto } from './goods-receipt.dto';
import { GOODS_RECEIPT_MESSAGE } from './goods-receipt.message';
import { GoodsReceiptRepo } from './goods-receipt.repo';
import { GoodsReceiptService } from './goods-receipt.service';

function buildDto(
  overrides: Partial<CreateGoodsReceiptDto> = {},
): CreateGoodsReceiptDto {
  return {
    warehouseName: 'Kho tổng Hà Nội',
    supplierName: 'Công ty TNHH Thiết bị Văn phòng Minh Long',
    receiptDate: '2026-06-01',
    unitName: 'CÔNG TY TNHH GIẢI PHÁP SỐ',
    department: 'Phòng hành chính',
    delivererName: 'Trần Văn Bình',
    invoiceNumber: 'HD-2026-0601',
    invoiceDate: '2026-06-01',
    debitAccount: '1521',
    creditAccount: '331',
    attachedDocuments: 'Hoá đơn GTGT 0601',
    amountInWords: 'Bốn triệu không trăm năm mươi nghìn đồng chẵn',
    items: [
      {
        productName: 'Giấy A4 Double A 80gsm',
        productCode: 'VT-001',
        unit: 'Ram',
        quantity: 20,
        price: 78500,
      },
      {
        productName: 'Mực in laser đen HP 76A',
        productCode: 'VT-014',
        unit: 'Hộp',
        quantity: 2,
        price: 1240000,
      },
    ],
    ...overrides,
  };
}

const warehouseRow = {
  id: 'wh_hanoi',
  name: 'Kho tổng Hà Nội',
  location: 'Số 15 Láng Hạ',
};
const supplierRow = {
  id: 'sup_minhlong',
  name: 'Công ty TNHH Thiết bị Văn phòng Minh Long',
};
const productA4Row = {
  id: 'prod_a4',
  code: 'VT-001',
  name: 'Giấy A4 Double A 80gsm',
  unit: 'Ram',
  price: new Prisma.Decimal(78500),
};
const productMucRow = {
  id: 'prod_muc',
  code: 'VT-014',
  name: 'Mực in laser đen HP 76A',
  unit: 'Hộp',
  price: new Prisma.Decimal(1240000),
};

function buildReceiptRow() {
  return {
    id: 'rec_001',
    code: 'PNK-20260601-001',
    warehouseId: warehouseRow.id,
    warehouse: warehouseRow,
    supplierId: supplierRow.id,
    supplier: supplierRow,
    receiptDate: new Date('2026-06-01T00:00:00.000Z'),
    unitName: 'CÔNG TY TNHH GIẢI PHÁP SỐ',
    department: 'Phòng hành chính',
    delivererName: 'Trần Văn Bình',
    invoiceNumber: 'HD-2026-0601',
    invoiceDate: new Date('2026-06-01T00:00:00.000Z'),
    debitAccount: '1521',
    creditAccount: '331',
    attachedDocuments: 'Hoá đơn GTGT 0601',
    amountInWords: 'Bốn triệu không trăm năm mươi nghìn đồng chẵn',
    note: null,
    totalAmount: new Prisma.Decimal(4050000),
    createdAt: new Date('2026-06-01T08:00:00.000Z'),
    items: [
      {
        id: 'item_001',
        productId: productA4Row.id,
        productCodeSnapshot: productA4Row.code,
        productNameSnapshot: productA4Row.name,
        unitSnapshot: productA4Row.unit,
        quantity: 20,
        unitPrice: new Prisma.Decimal(78500),
        lineTotal: new Prisma.Decimal(1570000),
      },
      {
        id: 'item_002',
        productId: productMucRow.id,
        productCodeSnapshot: productMucRow.code,
        productNameSnapshot: productMucRow.name,
        unitSnapshot: productMucRow.unit,
        quantity: 2,
        unitPrice: new Prisma.Decimal(1240000),
        lineTotal: new Prisma.Decimal(2480000),
      },
    ],
  };
}

describe('GoodsReceiptService', () => {
  let goodsReceiptRepo: jest.Mocked<GoodsReceiptRepo>;
  let productRepo: jest.Mocked<ProductRepo>;
  let supplierRepo: jest.Mocked<SupplierRepo>;
  let warehouseRepo: jest.Mocked<WarehouseRepo>;
  let service: GoodsReceiptService;

  beforeEach(() => {
    goodsReceiptRepo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      countCreatedBetween: jest.fn(),
      createReceipt: jest.fn(),
      createItem: jest.fn(),
      recordInbound: jest.fn(),
      runInTransaction: jest.fn((fn: (tx: unknown) => unknown) => fn({})),
    } as unknown as jest.Mocked<GoodsReceiptRepo>;
    productRepo = {
      findByNameInsensitive: jest.fn(),
      create: jest.fn(),
    } as unknown as jest.Mocked<ProductRepo>;
    supplierRepo = {
      findByNameInsensitive: jest.fn(),
      create: jest.fn(),
    } as unknown as jest.Mocked<SupplierRepo>;
    warehouseRepo = {
      findByNameInsensitive: jest.fn(),
      create: jest.fn(),
    } as unknown as jest.Mocked<WarehouseRepo>;
    service = new GoodsReceiptService(
      goodsReceiptRepo,
      productRepo,
      supplierRepo,
      warehouseRepo,
    );
  });

  describe('findAll / findOne', () => {
    it('findAll maps repo rows to goods receipt models', async () => {
      goodsReceiptRepo.findAll.mockResolvedValue([buildReceiptRow() as never]);

      const result = await service.findAll({ from: '2026-06-01' });

      expect(goodsReceiptRepo.findAll).toHaveBeenCalledWith({
        receiptDate: { gte: new Date('2026-06-01') },
      });
      expect(result[0].code).toBe('PNK-20260601-001');
      expect(result[0].totalAmount).toBe(4050000);
      expect(result[0].items).toHaveLength(2);
    });

    it('findOne throws NOT_FOUND when the receipt does not exist', async () => {
      goodsReceiptRepo.findById.mockResolvedValue(null);

      await expect(service.findOne('missing')).rejects.toMatchObject({
        code: RESPONSE_CODE.NOT_FOUND,
        message: GOODS_RECEIPT_MESSAGE.NOT_FOUND,
        status: HttpStatus.NOT_FOUND,
      });
    });
  });

  describe('create — happy path with existing warehouse/supplier/products', () => {
    it('reuses existing entities, computes total, and writes items + stock movements in order', async () => {
      warehouseRepo.findByNameInsensitive.mockResolvedValue(
        warehouseRow as never,
      );
      supplierRepo.findByNameInsensitive.mockResolvedValue(
        supplierRow as never,
      );
      productRepo.findByNameInsensitive
        .mockResolvedValueOnce(productA4Row as never)
        .mockResolvedValueOnce(productMucRow as never);
      goodsReceiptRepo.countCreatedBetween.mockResolvedValue(0);
      goodsReceiptRepo.createReceipt.mockResolvedValue({
        id: 'rec_001',
      } as never);
      goodsReceiptRepo.createItem
        .mockResolvedValueOnce({ id: 'item_001' } as never)
        .mockResolvedValueOnce({ id: 'item_002' } as never);
      goodsReceiptRepo.recordInbound.mockResolvedValue(undefined as never);
      goodsReceiptRepo.findById.mockResolvedValue(buildReceiptRow() as never);

      const result = await service.create(buildDto());

      expect(warehouseRepo.create).not.toHaveBeenCalled();
      expect(supplierRepo.create).not.toHaveBeenCalled();
      expect(productRepo.create).not.toHaveBeenCalled();

      expect(goodsReceiptRepo.createReceipt).toHaveBeenCalledWith(
        expect.objectContaining({
          warehouseId: 'wh_hanoi',
          supplierId: 'sup_minhlong',
          totalAmount: 4050000,
          code: expect.stringMatching(/^PNK-\d{8}-001$/),
        }),
        expect.anything(),
      );

      expect(goodsReceiptRepo.createItem).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          goodsReceiptId: 'rec_001',
          productId: 'prod_a4',
          quantity: 20,
          unitPrice: 78500,
          lineTotal: 1570000,
        }),
        expect.anything(),
      );
      expect(goodsReceiptRepo.createItem).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          goodsReceiptId: 'rec_001',
          productId: 'prod_muc',
          quantity: 2,
          unitPrice: 1240000,
          lineTotal: 2480000,
        }),
        expect.anything(),
      );

      expect(goodsReceiptRepo.recordInbound).toHaveBeenNthCalledWith(
        1,
        {
          productId: 'prod_a4',
          warehouseId: 'wh_hanoi',
          goodsReceiptItemId: 'item_001',
          quantity: 20,
        },
        expect.anything(),
      );
      expect(goodsReceiptRepo.recordInbound).toHaveBeenNthCalledWith(
        2,
        {
          productId: 'prod_muc',
          warehouseId: 'wh_hanoi',
          goodsReceiptItemId: 'item_002',
          quantity: 2,
        },
        expect.anything(),
      );

      expect(result.totalAmount).toBe(4050000);
      expect(result.items).toHaveLength(2);
    });
  });

  describe('create — resolving new warehouse/supplier/product', () => {
    it('creates a new warehouse using the given location when none matches', async () => {
      warehouseRepo.findByNameInsensitive.mockResolvedValue(null);
      warehouseRepo.create.mockResolvedValue({
        ...warehouseRow,
        id: 'wh_new',
      } as never);
      supplierRepo.findByNameInsensitive.mockResolvedValue(
        supplierRow as never,
      );
      productRepo.findByNameInsensitive
        .mockResolvedValueOnce(productA4Row as never)
        .mockResolvedValueOnce(productMucRow as never);
      goodsReceiptRepo.countCreatedBetween.mockResolvedValue(0);
      goodsReceiptRepo.createReceipt.mockResolvedValue({
        id: 'rec_001',
      } as never);
      goodsReceiptRepo.createItem.mockResolvedValue({
        id: 'item_001',
      } as never);
      goodsReceiptRepo.recordInbound.mockResolvedValue(undefined as never);
      goodsReceiptRepo.findById.mockResolvedValue(buildReceiptRow() as never);

      await service.create(
        buildDto({
          warehouseName: 'Kho mới',
          warehouseLocation: 'Địa chỉ mới',
        }),
      );

      expect(warehouseRepo.create).toHaveBeenCalledWith(
        { name: 'Kho mới', location: 'Địa chỉ mới' },
        expect.anything(),
      );
    });

    it('rejects with a VALIDATION_ERROR when a new warehouse has no location, without retrying', async () => {
      warehouseRepo.findByNameInsensitive.mockResolvedValue(null);

      await expect(
        service.create(
          buildDto({ warehouseName: 'Kho mới', warehouseLocation: undefined }),
        ),
      ).rejects.toMatchObject({
        code: RESPONSE_CODE.VALIDATION_ERROR,
        message: GOODS_RECEIPT_MESSAGE.WAREHOUSE_LOCATION_REQUIRED_FOR_NEW,
        status: HttpStatus.BAD_REQUEST,
      });
      expect(goodsReceiptRepo.runInTransaction).toHaveBeenCalledTimes(1);
      expect(warehouseRepo.create).not.toHaveBeenCalled();
    });

    it('creates a brand-new supplier when none matches by name', async () => {
      warehouseRepo.findByNameInsensitive.mockResolvedValue(
        warehouseRow as never,
      );
      supplierRepo.findByNameInsensitive.mockResolvedValue(null);
      supplierRepo.create.mockResolvedValue({
        id: 'sup_new',
        name: 'NCC mới',
      } as never);
      productRepo.findByNameInsensitive
        .mockResolvedValueOnce(productA4Row as never)
        .mockResolvedValueOnce(productMucRow as never);
      goodsReceiptRepo.countCreatedBetween.mockResolvedValue(0);
      goodsReceiptRepo.createReceipt.mockResolvedValue({
        id: 'rec_001',
      } as never);
      goodsReceiptRepo.createItem.mockResolvedValue({
        id: 'item_001',
      } as never);
      goodsReceiptRepo.recordInbound.mockResolvedValue(undefined as never);
      goodsReceiptRepo.findById.mockResolvedValue(buildReceiptRow() as never);

      await service.create(buildDto({ supplierName: 'NCC mới' }));

      expect(supplierRepo.create).toHaveBeenCalledWith(
        { name: 'NCC mới' },
        expect.anything(),
      );
    });

    it('creates a brand-new product using the item price as its reference price', async () => {
      warehouseRepo.findByNameInsensitive.mockResolvedValue(
        warehouseRow as never,
      );
      supplierRepo.findByNameInsensitive.mockResolvedValue(
        supplierRow as never,
      );
      productRepo.findByNameInsensitive.mockResolvedValue(null);
      productRepo.create.mockResolvedValue({
        id: 'prod_new',
        code: 'VT-999',
        name: 'Sản phẩm mới',
        unit: 'Cái',
        price: new Prisma.Decimal(50000),
      } as never);
      goodsReceiptRepo.countCreatedBetween.mockResolvedValue(0);
      goodsReceiptRepo.createReceipt.mockResolvedValue({
        id: 'rec_001',
      } as never);
      goodsReceiptRepo.createItem.mockResolvedValue({
        id: 'item_001',
      } as never);
      goodsReceiptRepo.recordInbound.mockResolvedValue(undefined as never);
      goodsReceiptRepo.findById.mockResolvedValue(buildReceiptRow() as never);

      await service.create(
        buildDto({
          items: [
            {
              productName: 'Sản phẩm mới',
              productCode: 'VT-999',
              unit: 'Cái',
              quantity: 5,
              price: 50000,
            },
          ],
        }),
      );

      expect(productRepo.create).toHaveBeenCalledWith(
        { code: 'VT-999', name: 'Sản phẩm mới', unit: 'Cái', price: 50000 },
        expect.anything(),
      );
    });

    it('resolves each distinct product name only once even if it repeats across items', async () => {
      warehouseRepo.findByNameInsensitive.mockResolvedValue(
        warehouseRow as never,
      );
      supplierRepo.findByNameInsensitive.mockResolvedValue(
        supplierRow as never,
      );
      productRepo.findByNameInsensitive.mockResolvedValue(
        productA4Row as never,
      );
      goodsReceiptRepo.countCreatedBetween.mockResolvedValue(0);
      goodsReceiptRepo.createReceipt.mockResolvedValue({
        id: 'rec_001',
      } as never);
      goodsReceiptRepo.createItem.mockResolvedValue({
        id: 'item_001',
      } as never);
      goodsReceiptRepo.recordInbound.mockResolvedValue(undefined as never);
      goodsReceiptRepo.findById.mockResolvedValue(buildReceiptRow() as never);

      await service.create(
        buildDto({
          items: [
            {
              productName: '  Giấy A4 Double A 80gsm  ',
              productCode: 'VT-001',
              unit: 'Ram',
              quantity: 5,
              price: 78500,
            },
            {
              productName: 'giấy a4 double a 80gsm',
              productCode: 'VT-001',
              unit: 'Ram',
              quantity: 3,
              price: 78500,
            },
          ],
        }),
      );

      expect(productRepo.findByNameInsensitive).toHaveBeenCalledTimes(1);
    });
  });

  describe('create — duplicate receipt code retry', () => {
    const duplicateCodeError = { code: 'P2002', meta: { target: ['code'] } };

    it('retries the whole transaction and succeeds once the code no longer collides', async () => {
      goodsReceiptRepo.runInTransaction
        .mockRejectedValueOnce(duplicateCodeError)
        .mockResolvedValueOnce(buildReceiptRow());

      const result = await service.create(buildDto());

      expect(goodsReceiptRepo.runInTransaction).toHaveBeenCalledTimes(2);
      expect(result.code).toBe('PNK-20260601-001');
    });

    it('rethrows the original duplicate error after exhausting all retry attempts', async () => {
      goodsReceiptRepo.runInTransaction.mockRejectedValue(duplicateCodeError);

      await expect(service.create(buildDto())).rejects.toBe(duplicateCodeError);
      expect(goodsReceiptRepo.runInTransaction).toHaveBeenCalledTimes(3);
    });

    it('does not retry for errors unrelated to a duplicate code', async () => {
      const otherError = new Error('connection lost');
      goodsReceiptRepo.runInTransaction.mockRejectedValue(otherError);

      await expect(service.create(buildDto())).rejects.toBe(otherError);
      expect(goodsReceiptRepo.runInTransaction).toHaveBeenCalledTimes(1);
    });
  });
});

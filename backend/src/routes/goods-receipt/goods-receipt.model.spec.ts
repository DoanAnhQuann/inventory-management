import { createGoodsReceiptSchema } from './goods-receipt.model';

function buildValidPayload() {
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
    ],
  };
}

describe('createGoodsReceiptSchema', () => {
  it('accepts a fully valid payload', () => {
    const result = createGoodsReceiptSchema.safeParse(buildValidPayload());

    expect(result.success).toBe(true);
  });

  it('requires at least one item', () => {
    const result = createGoodsReceiptSchema.safeParse({
      ...buildValidPayload(),
      items: [],
    });

    expect(result.success).toBe(false);
  });

  it.each([
    'warehouseName',
    'supplierName',
    'receiptDate',
    'unitName',
    'department',
    'delivererName',
    'invoiceNumber',
    'invoiceDate',
    'debitAccount',
    'creditAccount',
    'attachedDocuments',
    'amountInWords',
  ])('rejects when %s is missing', (field) => {
    const payload = { ...buildValidPayload(), [field]: '' };

    expect(createGoodsReceiptSchema.safeParse(payload).success).toBe(false);
  });

  it('allows note and warehouseLocation to be omitted', () => {
    const result = createGoodsReceiptSchema.parse(buildValidPayload());

    expect(result.note).toBeUndefined();
    expect(result.warehouseLocation).toBeUndefined();
  });

  it('rejects a non-positive item quantity', () => {
    const payload = buildValidPayload();
    payload.items[0].quantity = 0;

    expect(createGoodsReceiptSchema.safeParse(payload).success).toBe(false);
  });

  it('rejects a negative item price but allows zero', () => {
    const negative = buildValidPayload();
    negative.items[0].price = -1;
    expect(createGoodsReceiptSchema.safeParse(negative).success).toBe(false);

    const zero = buildValidPayload();
    zero.items[0].price = 0;
    expect(createGoodsReceiptSchema.safeParse(zero).success).toBe(true);
  });

  it('coerces quantity and price from numeric strings', () => {
    const payload = buildValidPayload();
    (payload.items[0] as unknown as Record<string, unknown>).quantity = '20';
    (payload.items[0] as unknown as Record<string, unknown>).price = '78500';

    const result = createGoodsReceiptSchema.parse(payload);

    expect(result.items[0].quantity).toBe(20);
    expect(result.items[0].price).toBe(78500);
  });
});

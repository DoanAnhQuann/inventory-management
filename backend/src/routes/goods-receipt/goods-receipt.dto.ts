import { createZodDto } from 'nestjs-zod';
import {
  createGoodsReceiptSchema,
  goodsReceiptIdParamSchema,
  goodsReceiptListResponseSchema,
  goodsReceiptResponseSchema,
} from './goods-receipt.model';

export class CreateGoodsReceiptDto extends createZodDto(
  createGoodsReceiptSchema,
) {}
export class GoodsReceiptResDto extends createZodDto(
  goodsReceiptResponseSchema,
) {}
export class GoodsReceiptListResDto extends createZodDto(
  goodsReceiptListResponseSchema,
) {}
export class GoodsReceiptIdParamDto extends createZodDto(
  goodsReceiptIdParamSchema,
) {}

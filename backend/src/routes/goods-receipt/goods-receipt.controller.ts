import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import { DateRangeQueryDto } from '../../shared/query/date-range-query.dto';
import { ResponseMessage } from '../../shared/response/response-message.decorator';
import {
  CreateGoodsReceiptDto,
  GoodsReceiptIdParamDto,
  GoodsReceiptListResDto,
  GoodsReceiptResDto,
} from './goods-receipt.dto';
import { GOODS_RECEIPT_MESSAGE } from './goods-receipt.message';
import { GoodsReceiptService } from './goods-receipt.service';

@Controller('goods-receipts')
export class GoodsReceiptController {
  constructor(private readonly goodsReceiptService: GoodsReceiptService) {}

  @Get()
  @ZodSerializerDto(GoodsReceiptListResDto)
  findAll(@Query() query: DateRangeQueryDto) {
    return this.goodsReceiptService.findAll(query);
  }

  @Get(':id')
  @ZodSerializerDto(GoodsReceiptResDto)
  findOne(@Param() { id }: GoodsReceiptIdParamDto) {
    return this.goodsReceiptService.findOne(id);
  }

  @Post()
  @ResponseMessage(GOODS_RECEIPT_MESSAGE.CREATED)
  @ZodSerializerDto(GoodsReceiptResDto)
  create(@Body() dto: CreateGoodsReceiptDto) {
    return this.goodsReceiptService.create(dto);
  }
}

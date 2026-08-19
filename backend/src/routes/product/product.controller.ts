import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import { ResponseMessage } from '../../shared/response/response-message.decorator';
import {
  CreateProductDto,
  ProductIdParamDto,
  ProductListResDto,
  ProductResDto,
  UpdateProductDto,
} from './product.dto';
import { PRODUCT_MESSAGE } from './product.message';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ZodSerializerDto(ProductListResDto)
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  @ZodSerializerDto(ProductResDto)
  findOne(@Param() { id }: ProductIdParamDto) {
    return this.productService.findOne(id);
  }

  @Post()
  @ResponseMessage(PRODUCT_MESSAGE.CREATED)
  @ZodSerializerDto(ProductResDto)
  create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  @Patch(':id')
  @ResponseMessage(PRODUCT_MESSAGE.UPDATED)
  @ZodSerializerDto(ProductResDto)
  update(@Param() { id }: ProductIdParamDto, @Body() dto: UpdateProductDto) {
    return this.productService.update(id, dto);
  }

  @Delete(':id')
  @ResponseMessage(PRODUCT_MESSAGE.DELETED)
  remove(@Param() { id }: ProductIdParamDto) {
    return this.productService.remove(id);
  }
}

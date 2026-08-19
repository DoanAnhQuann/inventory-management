import { createZodDto } from 'nestjs-zod';
import {
  createProductSchema,
  productIdParamSchema,
  productListResponseSchema,
  productResponseSchema,
  updateProductSchema,
} from './product.model';

export class CreateProductDto extends createZodDto(createProductSchema) {}
export class UpdateProductDto extends createZodDto(updateProductSchema) {}
export class ProductResDto extends createZodDto(productResponseSchema) {}
export class ProductListResDto extends createZodDto(
  productListResponseSchema,
) {}
export class ProductIdParamDto extends createZodDto(productIdParamSchema) {}

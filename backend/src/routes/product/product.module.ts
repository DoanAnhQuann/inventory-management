import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductRepo } from './product.repo';
import { ProductService } from './product.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService, ProductRepo],
  exports: [ProductService, ProductRepo],
})
export class ProductModule {}

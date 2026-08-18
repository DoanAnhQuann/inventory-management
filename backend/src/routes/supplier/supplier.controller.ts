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
  CreateSupplierDto,
  SupplierIdParamDto,
  SupplierListResDto,
  SupplierResDto,
  UpdateSupplierDto,
} from './supplier.dto';
import { SUPPLIER_MESSAGE } from './supplier.message';
import { SupplierService } from './supplier.service';

@Controller('suppliers')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Get()
  @ZodSerializerDto(SupplierListResDto)
  findAll() {
    return this.supplierService.findAll();
  }

  @Get(':id')
  @ZodSerializerDto(SupplierResDto)
  findOne(@Param() { id }: SupplierIdParamDto) {
    return this.supplierService.findOne(id);
  }

  @Post()
  @ResponseMessage(SUPPLIER_MESSAGE.CREATED)
  @ZodSerializerDto(SupplierResDto)
  create(@Body() dto: CreateSupplierDto) {
    return this.supplierService.create(dto);
  }

  @Patch(':id')
  @ResponseMessage(SUPPLIER_MESSAGE.UPDATED)
  @ZodSerializerDto(SupplierResDto)
  update(@Param() { id }: SupplierIdParamDto, @Body() dto: UpdateSupplierDto) {
    return this.supplierService.update(id, dto);
  }

  @Delete(':id')
  @ResponseMessage(SUPPLIER_MESSAGE.DELETED)
  remove(@Param() { id }: SupplierIdParamDto) {
    return this.supplierService.remove(id);
  }
}

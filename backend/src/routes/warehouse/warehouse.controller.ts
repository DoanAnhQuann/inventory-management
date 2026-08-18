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
  CreateWarehouseDto,
  UpdateWarehouseDto,
  WarehouseIdParamDto,
  WarehouseListResDto,
  WarehouseResDto,
} from './warehouse.dto';
import { WAREHOUSE_MESSAGE } from './warehouse.message';
import { WarehouseService } from './warehouse.service';

@Controller('warehouses')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Get()
  @ZodSerializerDto(WarehouseListResDto)
  findAll() {
    return this.warehouseService.findAll();
  }

  @Get(':id')
  @ZodSerializerDto(WarehouseResDto)
  findOne(@Param() { id }: WarehouseIdParamDto) {
    return this.warehouseService.findOne(id);
  }

  @Post()
  @ResponseMessage(WAREHOUSE_MESSAGE.CREATED)
  @ZodSerializerDto(WarehouseResDto)
  create(@Body() dto: CreateWarehouseDto) {
    return this.warehouseService.create(dto);
  }

  @Patch(':id')
  @ResponseMessage(WAREHOUSE_MESSAGE.UPDATED)
  @ZodSerializerDto(WarehouseResDto)
  update(
    @Param() { id }: WarehouseIdParamDto,
    @Body() dto: UpdateWarehouseDto,
  ) {
    return this.warehouseService.update(id, dto);
  }

  @Delete(':id')
  @ResponseMessage(WAREHOUSE_MESSAGE.DELETED)
  remove(@Param() { id }: WarehouseIdParamDto) {
    return this.warehouseService.remove(id);
  }
}

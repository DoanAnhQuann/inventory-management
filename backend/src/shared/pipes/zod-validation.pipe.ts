import { HttpStatus, PipeTransform } from '@nestjs/common';
import { ZodType } from 'zod';
import { COMMON_MESSAGE } from '../constants/message.constant';
import { RESPONSE_CODE } from '../constants/response-code.constant';
import { AppException } from '../exceptions/app.exception';

export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodType) {}

  transform(value: unknown) {
    const result = this.schema.safeParse(value);

    if (!result.success) {
      throw new AppException({
        code: RESPONSE_CODE.VALIDATION_ERROR,
        message: COMMON_MESSAGE.VALIDATION_ERROR,
        status: HttpStatus.BAD_REQUEST,
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    return result.data;
  }
}

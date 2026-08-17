import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ZodError } from 'zod';
import { COMMON_MESSAGE } from '../constants/message.constant';
import {
  RESPONSE_CODE,
  ResponseCode,
} from '../constants/response-code.constant';
import { ErrorResponse } from '../response/response.type';
import { AppException } from './app.exception';

const HTTP_STATUS_DEFAULT: Record<
  number,
  { code: ResponseCode; message: string }
> = {
  [HttpStatus.BAD_REQUEST]: {
    code: RESPONSE_CODE.BAD_REQUEST,
    message: COMMON_MESSAGE.BAD_REQUEST,
  },
  [HttpStatus.UNAUTHORIZED]: {
    code: RESPONSE_CODE.UNAUTHORIZED,
    message: COMMON_MESSAGE.UNAUTHORIZED,
  },
  [HttpStatus.FORBIDDEN]: {
    code: RESPONSE_CODE.FORBIDDEN,
    message: COMMON_MESSAGE.FORBIDDEN,
  },
  [HttpStatus.NOT_FOUND]: {
    code: RESPONSE_CODE.NOT_FOUND,
    message: COMMON_MESSAGE.NOT_FOUND,
  },
  [HttpStatus.CONFLICT]: {
    code: RESPONSE_CODE.CONFLICT,
    message: COMMON_MESSAGE.CONFLICT,
  },
};

interface ResolvedException {
  status: number;
  code: ResponseCode;
  message: string;
  errors: unknown;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const resolved = this.resolve(exception);

    if (resolved.status >= 500) {
      this.logger.error(
        exception instanceof Error ? exception.stack : exception,
      );
    }

    const body: ErrorResponse = {
      success: false,
      code: resolved.code,
      message: resolved.message,
      status: resolved.status,
      errors: resolved.errors,
    };

    response.status(resolved.status).json(body);
  }

  private resolve(exception: unknown): ResolvedException {
    if (exception instanceof AppException) {
      return {
        status: exception.getStatus(),
        code: exception.code,
        message: exception.message,
        errors: exception.errors,
      };
    }

    if (exception instanceof ZodError) {
      return {
        status: HttpStatus.BAD_REQUEST,
        code: RESPONSE_CODE.VALIDATION_ERROR,
        message: COMMON_MESSAGE.VALIDATION_ERROR,
        errors: exception.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      };
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const defaults = HTTP_STATUS_DEFAULT[status];
      return {
        status,
        code: defaults?.code ?? RESPONSE_CODE.BAD_REQUEST,
        message: defaults?.message ?? exception.message,
        errors: [],
      };
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      code: RESPONSE_CODE.INTERNAL_SERVER_ERROR,
      message: COMMON_MESSAGE.INTERNAL_SERVER_ERROR,
      errors: [],
    };
  }
}

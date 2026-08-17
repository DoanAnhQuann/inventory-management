import { HttpException } from '@nestjs/common';
import { ResponseCode } from '../constants/response-code.constant';

export interface AppExceptionParams {
  code: ResponseCode;
  message: string;
  status: number;
  errors?: unknown;
}

export class AppException extends HttpException {
  readonly code: ResponseCode;
  readonly errors: unknown;

  constructor({ code, message, status, errors }: AppExceptionParams) {
    super(message, status);
    this.code = code;
    this.errors = errors ?? [];
  }
}

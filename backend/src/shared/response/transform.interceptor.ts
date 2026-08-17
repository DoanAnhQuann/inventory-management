import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';
import { map, Observable } from 'rxjs';
import {
  DEFAULT_SUCCESS_MESSAGE_BY_STATUS,
  COMMON_MESSAGE,
} from '../constants/message.constant';
import { RESPONSE_CODE } from '../constants/response-code.constant';
import { RESPONSE_MESSAGE_KEY } from './response-message.decorator';
import { SuccessResponse } from './response.type';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<SuccessResponse> {
    const response = context.switchToHttp().getResponse<Response>();
    const customMessage = this.reflector.get<string | undefined>(
      RESPONSE_MESSAGE_KEY,
      context.getHandler(),
    );

    return next.handle().pipe(
      map((data: unknown) => {
        const status = response.statusCode;
        return {
          success: true,
          code: RESPONSE_CODE.SUCCESS,
          message:
            customMessage ??
            DEFAULT_SUCCESS_MESSAGE_BY_STATUS[status] ??
            COMMON_MESSAGE.SUCCESS,
          status,
          data: data ?? null,
        };
      }),
    );
  }
}

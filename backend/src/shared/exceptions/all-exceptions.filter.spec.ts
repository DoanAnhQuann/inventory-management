import {
  ArgumentsHost,
  BadRequestException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ZodValidationException } from 'nestjs-zod';
import { z, ZodError } from 'zod';
import { COMMON_MESSAGE } from '../constants/message.constant';
import { RESPONSE_CODE } from '../constants/response-code.constant';
import { ErrorResponse } from '../response/response.type';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { AppException } from './app.exception';

function buildHost(): { host: ArgumentsHost; response: jest.Mocked<Response> } {
  const response = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as jest.Mocked<Response>;

  const host = {
    switchToHttp: () => ({
      getResponse: () => response,
    }),
  } as unknown as ArgumentsHost;

  return { host, response };
}

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;

  beforeEach(() => {
    filter = new AllExceptionsFilter();
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('formats AppException using its own code/message/status/errors', () => {
    const { host, response } = buildHost();
    const exception = new AppException({
      code: RESPONSE_CODE.CONFLICT,
      message: 'Tên đã tồn tại',
      status: HttpStatus.CONFLICT,
      errors: [{ field: 'name', message: 'Tên đã tồn tại' }],
    });

    filter.catch(exception, host);

    expect(response.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
    expect(response.json).toHaveBeenCalledWith({
      success: false,
      code: RESPONSE_CODE.CONFLICT,
      message: 'Tên đã tồn tại',
      status: HttpStatus.CONFLICT,
      errors: [{ field: 'name', message: 'Tên đã tồn tại' }],
    });
  });

  it('formats plain ZodError as VALIDATION_ERROR with mapped issues', () => {
    const { host, response } = buildHost();
    const schema = z.object({ name: z.string().min(1, 'required') });
    const result = schema.safeParse({ name: '' });
    const zodError = result.success ? undefined : result.error;
    expect(zodError).toBeInstanceOf(ZodError);

    filter.catch(zodError, host);

    expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    const body = response.json.mock.calls[0][0] as ErrorResponse;
    expect(body.success).toBe(false);
    expect(body.code).toBe(RESPONSE_CODE.VALIDATION_ERROR);
    expect(body.errors).toEqual([{ field: 'name', message: 'required' }]);
  });

  it('formats ZodValidationException by unwrapping its ZodError', () => {
    const { host, response } = buildHost();
    const schema = z.object({ price: z.number().positive('positive') });
    const result = schema.safeParse({ price: -1 });
    const zodError = result.success ? undefined : result.error;
    const exception = new ZodValidationException(zodError);

    filter.catch(exception, host);

    expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    const body = response.json.mock.calls[0][0] as ErrorResponse;
    expect(body.code).toBe(RESPONSE_CODE.VALIDATION_ERROR);
    expect(body.errors).toEqual([{ field: 'price', message: 'positive' }]);
  });

  it('maps a known HttpException status to its default code/message', () => {
    const { host, response } = buildHost();
    const exception = new BadRequestException('bad input');

    filter.catch(exception, host);

    expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(response.json).toHaveBeenCalledWith({
      success: false,
      code: RESPONSE_CODE.BAD_REQUEST,
      message: COMMON_MESSAGE.BAD_REQUEST,
      status: HttpStatus.BAD_REQUEST,
      errors: [],
    });
  });

  it('falls back to INTERNAL_SERVER_ERROR for unknown thrown values', () => {
    const { host, response } = buildHost();

    filter.catch(new Error('boom'), host);

    expect(response.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(response.json).toHaveBeenCalledWith({
      success: false,
      code: RESPONSE_CODE.INTERNAL_SERVER_ERROR,
      message: COMMON_MESSAGE.INTERNAL_SERVER_ERROR,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      errors: [],
    });
  });
});

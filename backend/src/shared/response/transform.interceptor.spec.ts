import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { firstValueFrom, of } from 'rxjs';
import { COMMON_MESSAGE } from '../constants/message.constant';
import { RESPONSE_CODE } from '../constants/response-code.constant';
import { RESPONSE_MESSAGE_KEY } from './response-message.decorator';
import { TransformInterceptor } from './transform.interceptor';

function buildContext(statusCode: number): ExecutionContext {
  return {
    switchToHttp: () => ({
      getResponse: () => ({ statusCode }),
    }),
    getHandler: () => jest.fn(),
  } as unknown as ExecutionContext;
}

function buildCallHandler(data: unknown): CallHandler {
  return { handle: () => of(data) };
}

describe('TransformInterceptor', () => {
  it('wraps data into the success envelope using the default message for the status', async () => {
    const reflector = new Reflector();
    jest.spyOn(reflector, 'get').mockReturnValue(undefined);
    const interceptor = new TransformInterceptor(reflector);

    const result = await firstValueFrom(
      interceptor.intercept(buildContext(201), buildCallHandler({ id: '1' })),
    );

    expect(result).toEqual({
      success: true,
      code: RESPONSE_CODE.SUCCESS,
      message: COMMON_MESSAGE.CREATED,
      status: 201,
      data: { id: '1' },
    });
  });

  it('uses the custom @ResponseMessage override when present', async () => {
    const reflector = new Reflector();
    jest
      .spyOn(reflector, 'get')
      .mockReturnValue('Tạo phiếu nhập kho thành công');
    const interceptor = new TransformInterceptor(reflector);

    const result = await firstValueFrom(
      interceptor.intercept(buildContext(201), buildCallHandler({ id: '1' })),
    );

    expect(result.message).toBe('Tạo phiếu nhập kho thành công');
    expect(reflector.get).toHaveBeenCalledWith(
      RESPONSE_MESSAGE_KEY,
      expect.anything(),
    );
  });

  it('falls back to the generic success message for statuses without a default', async () => {
    const reflector = new Reflector();
    jest.spyOn(reflector, 'get').mockReturnValue(undefined);
    const interceptor = new TransformInterceptor(reflector);

    const result = await firstValueFrom(
      interceptor.intercept(buildContext(207), buildCallHandler([])),
    );

    expect(result.message).toBe(COMMON_MESSAGE.SUCCESS);
  });

  it('defaults data to null when the handler returns undefined', async () => {
    const reflector = new Reflector();
    jest.spyOn(reflector, 'get').mockReturnValue(undefined);
    const interceptor = new TransformInterceptor(reflector);

    const result = await firstValueFrom(
      interceptor.intercept(buildContext(204), buildCallHandler(undefined)),
    );

    expect(result.data).toBeNull();
  });
});

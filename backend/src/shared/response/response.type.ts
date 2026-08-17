import { ResponseCode } from '../constants/response-code.constant';

export interface SuccessResponse<T = unknown> {
  success: true;
  code: ResponseCode;
  message: string;
  status: number;
  data: T;
}

export interface ErrorResponse<E = unknown> {
  success: false;
  code: ResponseCode;
  message: string;
  status: number;
  errors: E;
}

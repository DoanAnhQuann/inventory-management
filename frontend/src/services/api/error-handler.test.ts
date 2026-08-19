import { AxiosError, AxiosHeaders } from 'axios'
import { toast } from 'sonner'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getApiErrorMessage, notifyApiError } from './error-handler'

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

function buildAxiosError(data?: { message?: string }, status = 400): AxiosError {
  return new AxiosError('Request failed', 'ERR_BAD_REQUEST', undefined, undefined, {
    status,
    statusText: 'Bad Request',
    headers: {},
    config: { headers: new AxiosHeaders() },
    data,
  })
}

describe('getApiErrorMessage', () => {
  it('returns the backend-provided message when present in the error envelope', () => {
    const error = buildAxiosError({ message: 'Tên sản phẩm đã tồn tại' })

    expect(getApiErrorMessage(error)).toBe('Tên sản phẩm đã tồn tại')
  })

  it('falls back to the default message when the axios error has no response data', () => {
    const error = buildAxiosError(undefined)

    expect(getApiErrorMessage(error)).toBe('Có lỗi xảy ra, vui lòng thử lại sau')
  })

  it('falls back to the default message when the response has no message field', () => {
    const error = buildAxiosError({})

    expect(getApiErrorMessage(error)).toBe('Có lỗi xảy ra, vui lòng thử lại sau')
  })

  it('falls back to the default message for a non-axios error', () => {
    expect(getApiErrorMessage(new Error('network down'))).toBe(
      'Có lỗi xảy ra, vui lòng thử lại sau',
    )
  })

  it('falls back to the default message for a non-error thrown value', () => {
    expect(getApiErrorMessage('boom')).toBe('Có lỗi xảy ra, vui lòng thử lại sau')
  })
})

describe('notifyApiError', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows the backend message as an error toast', () => {
    const message = 'Không thể xoá sản phẩm này vì đang được sử dụng trong 3 phiếu nhập kho.'

    notifyApiError(buildAxiosError({ message }, 409))

    expect(toast.error).toHaveBeenCalledWith(message, expect.any(Object))
  })

  it('keeps the toast on screen long enough to read a long message', () => {
    notifyApiError(buildAxiosError({ message: 'Lỗi nghiệp vụ dài' }, 409))

    const [, options] = vi.mocked(toast.error).mock.calls[0]
    expect(options?.duration).toBeGreaterThanOrEqual(5000)
  })
})

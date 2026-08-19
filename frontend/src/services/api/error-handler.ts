import { isAxiosError } from 'axios'

const DEFAULT_ERROR_MESSAGE = 'Có lỗi xảy ra, vui lòng thử lại sau'

export function getApiErrorMessage(error: unknown): string {
  if (isAxiosError<{ message?: string }>(error) && error.response?.data?.message) {
    return error.response.data.message
  }
  return DEFAULT_ERROR_MESSAGE
}

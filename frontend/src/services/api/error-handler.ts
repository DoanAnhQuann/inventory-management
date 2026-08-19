import { isAxiosError } from 'axios'
import { toast } from 'sonner'

const DEFAULT_ERROR_MESSAGE = 'Có lỗi xảy ra, vui lòng thử lại sau'
const ERROR_TOAST_DURATION = 8000

export function getApiErrorMessage(error: unknown): string {
  if (isAxiosError<{ message?: string }>(error) && error.response?.data?.message) {
    return error.response.data.message
  }
  return DEFAULT_ERROR_MESSAGE
}

export function notifyApiError(error: unknown) {
  toast.error(getApiErrorMessage(error), { duration: ERROR_TOAST_DURATION })
}

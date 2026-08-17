export const COMMON_MESSAGE = {
  SUCCESS: 'Thành công',
  CREATED: 'Tạo mới thành công',
  UPDATED: 'Cập nhật thành công',
  DELETED: 'Xoá thành công',
  BAD_REQUEST: 'Yêu cầu không hợp lệ',
  VALIDATION_ERROR: 'Dữ liệu không hợp lệ',
  UNAUTHORIZED: 'Chưa xác thực',
  FORBIDDEN: 'Không có quyền truy cập',
  NOT_FOUND: 'Không tìm thấy dữ liệu',
  CONFLICT: 'Dữ liệu đã tồn tại',
  INTERNAL_SERVER_ERROR: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
} as const;

export const DEFAULT_SUCCESS_MESSAGE_BY_STATUS: Record<number, string> = {
  200: COMMON_MESSAGE.SUCCESS,
  201: COMMON_MESSAGE.CREATED,
  204: COMMON_MESSAGE.SUCCESS,
};

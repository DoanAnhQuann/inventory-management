export const WAREHOUSE_MESSAGE = {
  CREATED: 'Tạo kho thành công',
  UPDATED: 'Cập nhật kho thành công',
  DELETED: 'Xoá kho thành công',
  NOT_FOUND: 'Không tìm thấy kho',
  NAME_DUPLICATE: 'Tên kho đã tồn tại',
  NAME_REQUIRED: 'Vui lòng nhập tên kho',
  LOCATION_REQUIRED: 'Vui lòng nhập địa điểm',
  ID_INVALID: 'ID kho không hợp lệ',
  DELETE_IN_USE: (receiptCount: number) =>
    `Không thể xoá kho này vì đang được sử dụng trong ${receiptCount} phiếu nhập kho. Xoá kho sẽ làm sai lệch dữ liệu tồn kho và số liệu thống kê của các phiếu đã lập.`,
} as const;

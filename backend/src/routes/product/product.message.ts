export const PRODUCT_MESSAGE = {
  CREATED: 'Tạo sản phẩm thành công',
  UPDATED: 'Cập nhật sản phẩm thành công',
  DELETED: 'Xoá sản phẩm thành công',
  NOT_FOUND: 'Không tìm thấy sản phẩm',
  CODE_DUPLICATE: 'Mã sản phẩm đã tồn tại',
  NAME_DUPLICATE: 'Tên sản phẩm đã tồn tại',
  CODE_REQUIRED: 'Vui lòng nhập mã số',
  NAME_REQUIRED: 'Vui lòng nhập tên sản phẩm',
  UNIT_REQUIRED: 'Vui lòng nhập đơn vị tính',
  PRICE_INVALID: 'Đơn giá phải là số',
  PRICE_POSITIVE: 'Đơn giá phải lớn hơn 0',
  MIN_STOCK_THRESHOLD_INVALID:
    'Ngưỡng tồn kho tối thiểu phải là số nguyên không âm',
  ID_INVALID: 'ID sản phẩm không hợp lệ',
  DELETE_IN_USE: (receiptCount: number) =>
    `Không thể xoá sản phẩm này vì đang được sử dụng trong ${receiptCount} phiếu nhập kho. Xoá sản phẩm sẽ làm sai lệch dữ liệu tồn kho và số liệu thống kê của các phiếu đã lập.`,
} as const;

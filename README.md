# Hệ thống Quản lý Kho (Inventory Management)

Đây là một ứng dụng web mô phỏng công việc quản lý kho hàng thực tế của một doanh nghiệp: khi
hàng về, nhân viên kho lập phiếu nhập; hệ thống tự động cộng vào tồn kho theo từng sản phẩm, từng
kho; người quản lý có thể xem báo cáo tổng quan, biết sản phẩm nào sắp hết hàng, và tra lại lịch
sử nhập/xuất của từng mặt hàng bất cứ lúc nào.

## Ứng dụng làm được những gì?

| Màn hình                      | Mô tả                                                                                                                                                 |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Tổng quan**                 | Trang chủ tóm tắt số liệu: số phiếu nhập, tổng giá trị hàng đã nhập, sản phẩm bán chạy nhất, sản phẩm sắp hết hàng — có thể lọc theo khoảng thời gian |
| **Phiếu nhập kho**            | Lập phiếu mỗi khi có lô hàng mới nhập vào kho (theo đúng mẫu chứng từ kế toán thật — Mẫu 01-VT), có xem trước phiếu trước khi lưu                     |
| **Sản phẩm**                  | Danh sách toàn bộ sản phẩm đang quản lý — thêm, sửa, xoá                                                                                              |
| **Nhà cung cấp**              | Danh sách các nhà cung cấp hàng — thêm, sửa, xoá                                                                                                      |
| **Quản lý kho nhập**          | Danh sách các kho hàng đang sử dụng — thêm, sửa, xoá                                                                                                  |
| **Lịch sử biến động tồn kho** | Tra cứu từng sản phẩm đã được nhập vào lúc nào, số lượng bao nhiêu, tồn kho hiện tại là bao nhiêu                                                     |

Toàn bộ dữ liệu (sản phẩm, kho, nhà cung cấp, số lượng tồn) đều được cập nhật tự động và nhất quán
với nhau — ví dụ khi tạo 1 phiếu nhập kho, số liệu ở trang Tổng quan và Lịch sử biến động tồn kho
sẽ tự động phản ánh ngay, không cần thao tác thêm.

## Dữ liệu demo có sẵn

Hệ thống **đã được nạp sẵn dữ liệu** mô phỏng một tuần vận hành thật của kho (12/08 – 19/08/2026),
nên có thể vào xem ngay mọi màn hình với số liệu thật, không cần tự nhập liệu từ đầu:

| Hạng mục       | Số lượng                            |
| -------------- | ----------------------------------- |
| Kho hàng       | 3 (Hà Nội, TP.HCM, Đà Nẵng)         |
| Nhà cung cấp   | 5                                   |
| Mặt hàng       | 14 (văn phòng phẩm, thiết bị)       |
| Phiếu nhập kho | 15 phiếu, rải đều đủ 8 ngày         |
| Tổng giá trị   | ~104 triệu đồng / 2.008 đơn vị hàng |

Dữ liệu được thiết kế giống một kho đang hoạt động thật: mặt hàng tiêu hao (giấy, bút) nhập số
lượng lớn và nhiều lần, mặt hàng giá trị cao (mực in, thiết bị) nhập ít hơn nên tồn kho thấp — nhờ
vậy các biểu đồ, cảnh báo sắp hết hàng và lịch sử biến động tồn kho đều hiển thị đúng như thực tế.

## Cấu trúc dự án

Dự án gồm 2 phần độc lập, nằm trong cùng 1 thư mục:

- **`frontend/`** — phần giao diện người dùng, là những gì hiển thị và tương tác trên trình duyệt.
- **`backend/`** — phần xử lý dữ liệu phía sau, chịu trách nhiệm lưu trữ và tính toán mọi nghiệp vụ
  (tạo phiếu, cộng trừ tồn kho, tổng hợp báo cáo...).

Hai phần này nói chuyện với nhau qua API, tách biệt rõ ràng để dễ bảo trì và mở rộng sau này.

## Muốn thử chạy?

Hướng dẫn cài đặt và chạy chi tiết cho từng phần nằm ở:

- [`backend/README.md`](backend/README.md)
- [`frontend/README.md`](frontend/README.md)

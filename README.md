# Shop Phụ Kiện Thú Cưng (QuangHaCMS)

Dự án website quản lý cửa hàng phụ kiện thú cưng (Pet Accessories Shop) với đầy đủ tính năng dành cho quản trị viên và khách hàng.
Hệ thống được phát triển theo cấu trúc 3 phân tầng chuẩn: 
- `CMS.Data`: Quản lý Entities và DbContext (Entity Framework Core).
- `CMS.Backend`: Cung cấp Web API và trang Quản trị Admin (ASP.NET Core MVC).
- `cms.frontend`: Giao diện khách hàng mua sắm (ReactJS).

## Hướng dẫn chạy dự án

### 1. Chạy Backend (ASP.NET Core)
1. Mở Solution `QuangHaCMS_solution.slnx` (hoặc mở thư mục dự án) bằng **Visual Studio**.
2. Đặt `CMS.Backend` làm Startup Project.
3. Nhấn phím **F5** để build và chạy Backend. (Hoặc mở Terminal tại thư mục `CMS.Backend` và gõ `dotnet run`).

### 2. Chạy Frontend (ReactJS)
1. Mở Terminal và di chuyển vào thư mục Frontend:
   ```bash
   cd cms.frontend
   ```
2. Cài đặt các gói phụ thuộc (chỉ cần chạy lần đầu):
   ```bash
   npm install
   ```
3. Khởi động ứng dụng ReactJS:
   ```bash
   npm start
   ```

*Lưu ý: Môi trường Node.js và .NET SDK cần được cài đặt sẵn trên máy của bạn.*

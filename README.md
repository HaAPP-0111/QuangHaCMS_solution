# 🐾 Shop Phụ Kiện Thú Cưng (QuangHaCMS)

Dự án website **Shop Phụ Kiện Thú Cưng (Pet Accessories Shop)** là một hệ thống thương mại điện tử chuyên cung cấp các mặt hàng dành cho thú cưng. Hệ thống cung cấp đầy đủ các tính năng mạnh mẽ dành cho cả Quản trị viên (Admin) và Khách hàng, với giao diện hiện đại, dễ sử dụng và tối ưu hiệu suất.

Hệ thống được phát triển theo **cấu trúc 3 phân tầng (Decoupled Architecture)** chuyên nghiệp, tách biệt hoàn toàn giữa Frontend và Backend.

---

## 🏗️ Kiến trúc Hệ thống

Dự án tuân thủ mô hình 3 lớp chặt chẽ:
- 🗄️ **`CMS.Data`**: Tầng quản lý Dữ liệu, định nghĩa các Entities và DbContext giao tiếp với SQL Server thông qua Entity Framework Core.
- ⚙️ **`CMS.Backend`**: Tầng API & Quản trị. Cung cấp hệ thống RESTful API cho Frontend gọi đến, đồng thời chứa giao diện Admin Panel (ASP.NET Core MVC) để quản lý toàn bộ hệ thống.
- 🎨 **`cms.frontend`**: Tầng Giao diện Khách hàng (Client-side). Ứng dụng Single Page Application (SPA) xây dựng bằng ReactJS, đem lại trải nghiệm mua sắm mượt mà, không cần reload trang.

---

## ✨ Tính năng Nổi bật

### 👤 Khách hàng (Frontend - ReactJS)
- **Trang chủ & Danh mục:** Hiển thị sản phẩm mới nhất, bán chạy nhất. Danh mục sản phẩm trực quan bằng hình ảnh khối tròn/vuông.
- **Tìm kiếm & Bộ lọc:** Lọc sản phẩm theo khoảng giá (`minPrice`, `maxPrice`) và tìm kiếm từ khóa trực tiếp từ API Backend (Tối ưu hóa Database).
- **Giỏ hàng & Đặt hàng:** Xử lý thêm vào giỏ hàng, cảnh báo hết hàng/vượt số lượng tồn kho. Luồng checkout rõ ràng.
- **Tài khoản cá nhân:** Đăng ký, đăng nhập an toàn với mã hóa mật khẩu `BCrypt`.
- **Gửi Email Tự động:** Tự động gửi email xác nhận ngay khi đặt hàng thành công và hỗ trợ khôi phục mật khẩu qua tính năng "Quên mật khẩu".
- **Blog / Tin tức:** Đọc tin tức, cẩm nang chăm sóc thú cưng được phân trang đầy đủ.

### 🛡️ Quản trị viên (Backend - ASP.NET Core MVC)
- **Quản lý Sản phẩm & Danh mục:** Thêm, sửa, xóa sản phẩm, tải lên hình ảnh sản phẩm/danh mục.
- **Quản lý Đơn hàng:** Xem danh sách đơn, duyệt đơn hàng, xem chi tiết hóa đơn (khách mua những gì, số lượng, tổng tiền).
- **Quản lý Tin bài:** Viết bài bằng trình soạn thảo Rich Text (CKEditor).
- **Quản lý Khách hàng:** Quản lý danh sách người dùng đã đăng ký.

---

## 🛠️ Công nghệ Sử dụng

- **Backend:** C#, ASP.NET Core MVC, Web API, Entity Framework Core 8.0.
- **Frontend:** ReactJS, React Router DOM, Axios, Bootstrap 5.
- **Cơ sở dữ liệu:** Microsoft SQL Server.
- **Bảo mật:** Hash mật khẩu với `BCrypt.Net-Next`.
- **Dịch vụ khác:** Gửi mail SMTP (System.Net.Mail).

---

## 🚀 Hướng dẫn Cài đặt & Chạy Dự án

### Yêu cầu hệ thống (Prerequisites)
- [Visual Studio 2022](https://visualstudio.microsoft.com/) (Hỗ trợ .NET 8.0 SDK).
- [Node.js](https://nodejs.org/) (Phiên bản LTS) và npm.
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) (hoặc SQL Server Express).

### Bước 1: Cấu hình Cơ sở dữ liệu (Database Setup)
1. Mở file `appsettings.json` trong thư mục `CMS.Backend`.
2. Kiểm tra chuỗi kết nối cơ sở dữ liệu (`ConnectionStrings` -> `DefaultConnection`). Mặc định đang sử dụng `Server=.;Database=QuangHaCMS_DB;Trusted_Connection=True;...`. Bạn có thể thay đổi `Server` cho phù hợp với máy tính của mình (ví dụ `Server=.\\SQLEXPRESS`).
3. Mở **Package Manager Console** trong Visual Studio, chọn Default project là `CMS.DataNew` hoặc `CMS.Backend` (tuỳ thuộc vào vị trí thư mục Migrations của bạn).
4. Chạy lệnh để tạo database:
   ```powershell
   Update-Database
   ```

### Bước 2: Chạy Backend (ASP.NET Core API & Admin)
1. Mở Solution `QuangHaCMS_solution.slnx` bằng **Visual Studio**.
2. Thiết lập dự án `CMS.Backend` làm **Startup Project** (Chuột phải vào project -> *Set as Startup Project*).
3. Nhấn phím **F5** (hoặc nút Run) để biên dịch và chạy Backend.
4. Trình duyệt sẽ mở ra hiển thị Swagger UI cho API (ví dụ: `https://localhost:7087/swagger`) và trang Admin tại `/`.

*(Hoặc dùng Terminal tại thư mục `CMS.Backend`: `dotnet run`)*

### Bước 3: Chạy Frontend (ReactJS)
1. Mở một Terminal / Command Prompt mới.
2. Di chuyển vào thư mục Frontend:
   ```bash
   cd cms.frontend
   ```
3. Cài đặt các thư viện Node modules (chỉ cần làm lần đầu):
   ```bash
   npm install
   ```
4. Khởi động ứng dụng ReactJS:
   ```bash
   npm start
   ```
5. Trang web khách hàng sẽ tự động mở tại địa chỉ `http://localhost:3000`.

*Lưu ý: Nếu API Backend chạy ở port khác `7087`, hãy kiểm tra và cấu hình lại địa chỉ URL API trong file `.env` hoặc cấu hình `axiosClient` của Frontend.*

---

## 👨‍🎓 Tác giả
- **Sinh Viên:** Đinh Quang Hà
- **MSSV:** 2123110066
- **Khóa học:** Lập trình Web nâng cao - Đồ án kết thúc học phần.

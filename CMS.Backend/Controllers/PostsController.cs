/*
 * Sinh Viên: Đinh Quang Hà
 * MSSV: 2123110066
 * Version: 5.0 (Hoàn chỉnh hệ thống API lấy danh sách, lọc theo danh mục và xem chi tiết bài viết cho ReactJS)
 */
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using System.Linq;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    // 1. Định nghĩa đường dẫn để gọi API. [controller] sẽ tự lấy tên là "Posts"
    // Địa chỉ truy cập thực tế: https://localhost:xxxx/api/posts
    [Route("api/[controller]")]

    // 2. Đánh dấu đây là một API Controller để kích hoạt các tính năng tự động kiểm tra dữ liệu
    [ApiController]

    // 3. API Controller kế thừa từ ControllerBase (bỏ qua phần hỗ trợ giao diện View của MVC)
    public class PostsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        // 4. Hàm khởi tạo (Constructor): "Tiêm" ngữ cảnh dữ liệu SQL Server vào Controller
        public PostsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================================================================
        // BƯỚC 1: API LẤY TOÀN BỘ BÀI VIẾT (GET: api/posts)
        // =========================================================================
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            // Lấy toàn bộ dữ liệu từ bảng Posts trong SQL Server
            var posts = await _context.Posts
                .OrderByDescending(p => p.Id) // Sắp xếp bài viết mới nhất lên đầu
                .Select(p => new {            // "Gọt tỉa" dữ liệu: chỉ lấy những trường cần thiết ra trang chủ 
                    p.Id,
                    p.Title,
                    p.ImageUrl,
                    p.CreatedDate,            // Sử dụng thuộc tính CreatedDate theo cấu trúc DB của bạn
                    CategoryName = p.Category.Name // Kéo trực tiếp tên chuyên mục thay vì chỉ lấy mã ID cộc lốc 
                })
                .ToListAsync();

            // Trả về kết quả cho Frontend kèm mã trạng thái HTTP 200 OK (Thành công)
            return Ok(posts);
        }

        // =========================================================================
        // BƯỚC 2: API LẤY BÀI VIẾT THEO DANH MỤC (GET: api/posts/category/{categoryId})
        // =========================================================================
        [HttpGet("category/{categoryId}")]
        public async Task<IActionResult> GetByCategory(int categoryId)
        {
            // Lọc các bài viết có CategoryId trùng với ID truyền vào từ thanh URL
            var posts = await _context.Posts
                .Where(p => p.CategoryId == categoryId)
                .OrderByDescending(p => p.Id) // Sắp xếp bài mới nhất thuộc danh mục lên đầu
                .Select(p => new {
                    p.Id,
                    p.Title,
                    p.ImageUrl,
                    p.CreatedDate
                })
                .ToListAsync();

            return Ok(posts);
        }

        // =========================================================================
        // BƯỚC 3: API LẤY CHI TIẾT MỘT BÀI VIẾT (GET: api/posts/{id})
        // =========================================================================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetail(int id)
        {
            // 3.1. Quét bảng Posts để tìm bài viết đầu tiên có Id khớp với tham số
            var post = await _context.Posts
                .FirstOrDefaultAsync(p => p.Id == id);

            // 3.2 Xử lý kịch bản lỗi bảo vệ hệ thống: ID không tồn tại trong Database
            if (post == null)
            {
                // Trả về mã lỗi 404 kèm một "gói tin" JSON thông báo nhỏ gọn để Frontend tự xử lý UI
                return NotFound(new { message = "Không tìm thấy bài viết này trong hệ thống" });
            }

            // 3.3. Trả về toàn bộ đối tượng bài viết (bao gồm cả trường Content chứa mã HTML) kèm mã 200 OK
            return Ok(post);
        }
    }
}
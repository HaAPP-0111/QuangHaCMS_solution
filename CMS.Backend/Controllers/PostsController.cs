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
        public async Task<IActionResult> GetAll(int page = 1, int pageSize = 12)
        {
            var query = _context.Posts
                .OrderByDescending(p => p.Id)
                .Select(p => new {
                    p.Id,
                    p.Title,
                    p.ImageUrl,
                    p.CreatedDate,
                    CategoryName = p.Category.Name
                });

            int totalItems = await query.CountAsync();
            int totalPages = (int)System.Math.Ceiling(totalItems / (double)pageSize);

            var posts = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(new {
                Posts = posts,
                TotalPages = totalPages,
                CurrentPage = page
            });
        }

        // =========================================================================
        // BƯỚC 2: API LẤY BÀI VIẾT THEO DANH MỤC (GET: api/posts/category/{categoryId})
        // =========================================================================
        [HttpGet("category/{categoryId}")]
        public async Task<IActionResult> GetByCategory(int categoryId, int page = 1, int pageSize = 12)
        {
            var query = _context.Posts
                .Where(p => p.CategoryId == categoryId)
                .OrderByDescending(p => p.Id)
                .Select(p => new {
                    p.Id,
                    p.Title,
                    p.ImageUrl,
                    p.CreatedDate
                });

            int totalItems = await query.CountAsync();
            int totalPages = (int)System.Math.Ceiling(totalItems / (double)pageSize);

            var posts = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(new {
                Posts = posts,
                TotalPages = totalPages,
                CurrentPage = page
            });
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
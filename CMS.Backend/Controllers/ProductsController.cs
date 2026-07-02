/*
 * Sinh Viên: Đinh Quang Hà
 * MSSV: 2123110066
 * Version: 5.0 (Hoàn chỉnh hệ thống API lấy danh sách, lọc theo danh mục sản phẩm và xem chi tiết sản phẩm cho ReactJS)
 */
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using System.Linq;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    // 1. Định nghĩa đường dẫn để gọi API. [controller] sẽ tự lấy tên là "Products"
    // Địa chỉ truy cập thực tế: https://localhost:xxxx/api/products
    [Route("api/[controller]")]

    // 2. Đánh dấu đây là một API Controller để kích hoạt các tính năng tự động kiểm tra dữ liệu
    [ApiController]

    // 3. API Controller kế thừa từ ControllerBase (bỏ qua phần hỗ trợ giao diện View của MVC)
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        // 4. Hàm khởi tạo (Constructor): "Tiêm" ngữ cảnh dữ liệu SQL Server vào Controller
        public ProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================================================================
        // BƯỚC 1: API LẤY TOÀN BỘ SẢN PHẨM (GET: api/products) (CÓ LỌC)
        // =========================================================================
        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] string? keyword = null,
            [FromQuery] decimal? minPrice = null,
            [FromQuery] decimal? maxPrice = null,
            [FromQuery] int? categoryId = null,
            int page = 1, 
            int pageSize = 12)
        {
            // Bắt đầu với IQueryable để có thể nối tiếp các điều kiện lọc (chưa chạy DB ngay)
            var baseQuery = _context.Products.AsQueryable();

            if (categoryId.HasValue)
            {
                baseQuery = baseQuery.Where(p => p.CategoryProductId == categoryId.Value);
            }

            // Lọc theo tên (Tiêu chí 40)
            if (!string.IsNullOrEmpty(keyword))
            {
                baseQuery = baseQuery.Where(p => p.Name.Contains(keyword));
            }

            // Lọc theo khoảng giá (Tiêu chí 39)
            if (minPrice.HasValue)
            {
                baseQuery = baseQuery.Where(p => p.Price >= minPrice.Value);
            }
            if (maxPrice.HasValue)
            {
                baseQuery = baseQuery.Where(p => p.Price <= maxPrice.Value);
            }

            var query = baseQuery
                .OrderByDescending(p => p.Id)
                .Select(p => new {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.StockQuantity,
                    p.ImageUrl,
                    CategoryProductId = p.CategoryProductId,
                    CategoryName = p.CategoryProduct != null ? p.CategoryProduct.Name : "Chưa phân loại"
                });

            int totalItems = await query.CountAsync();
            int totalPages = (int)System.Math.Ceiling(totalItems / (double)pageSize);

            var products = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(new {
                Products = products,
                TotalPages = totalPages,
                CurrentPage = page
            });
        }

        // =========================================================================
        // BƯỚC 2: API LẤY SẢN PHẨM THEO DANH MỤC (GET: api/products/category/{categoryId})
        // =========================================================================
        [HttpGet("category/{categoryId}")]
        public async Task<IActionResult> GetByCategory(int categoryId)
        {
            // Lọc các sản phẩm có CategoryProductId trùng với ID truyền vào từ thanh URL
            var products = await _context.Products
                .Where(p => p.CategoryProductId == categoryId)
                .OrderByDescending(p => p.Id) // Sắp xếp sản phẩm mới nhất thuộc danh mục lên đầu
                .Select(p => new {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.StockQuantity,
                    p.ImageUrl
                })
                .ToListAsync();

            return Ok(products);
        }

        // =========================================================================
        // BƯỚC 3: API LẤY CHI TIẾT MỘT SẢN PHẨM (GET: api/products/{id})
        // =========================================================================
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetDetail(int id)
        {
            // 3.1. Quét bảng Products để tìm sản phẩm đầu tiên có Id khớp với tham số
            var product = await _context.Products
                .Include(p => p.CategoryProduct) // Nạp kèm đầy đủ thông tin danh mục nếu cần
                .FirstOrDefaultAsync(p => p.Id == id);

            // 3.2 Xử lý kịch bản lỗi bảo vệ hệ thống: ID không tồn tại trong Database
            if (product == null)
            {
                // Trả về mã lỗi 404 kèm một "gói tin" JSON thông báo nhỏ gọn để Frontend tự xử lý UI
                return NotFound(new { message = "Không tìm thấy sản phẩm này trong hệ thống" });
            }

            // 3.3. Trả về toàn bộ đối tượng sản phẩm (bao gồm cả trường Description) kèm mã 200 OK
            return Ok(product);
        }
        // =========================================================================
        // BƯỚC 4: API LẤY 3 SẢN PHẨM MỚI NHẤT (GET: api/products/latest) (Tiêu chí 36)
        // =========================================================================
        [HttpGet("latest")]
        public async Task<IActionResult> GetLatest()
        {
            var products = await _context.Products
                .OrderByDescending(p => p.Id)
                .Take(3)
                .Select(p => new {
                    p.Id, p.Name, p.Price, p.StockQuantity, p.ImageUrl
                })
                .ToListAsync();

            return Ok(products);
        }

        // =========================================================================
        // BƯỚC 5: API LẤY 3 SẢN PHẨM BÁN CHẠY (GET: api/products/bestselling) (Tiêu chí 37)
        // =========================================================================
        [HttpGet("bestselling")]
        public async Task<IActionResult> GetBestSelling()
        {
            // Sắp xếp theo số lượng bán được trong bảng OrderDetails
            var products = await _context.Products
                .OrderByDescending(p => _context.OrderDetails
                                        .Where(od => od.ProductId == p.Id)
                                        .Sum(od => (int?)od.Quantity) ?? 0)
                .Take(3)
                .Select(p => new {
                    p.Id, p.Name, p.Price, p.StockQuantity, p.ImageUrl
                })
                .ToListAsync();

            return Ok(products);
        }
    }
}
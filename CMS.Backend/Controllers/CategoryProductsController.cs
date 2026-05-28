/*
 * Sinh Viên: Đinh Quang Hà
 * MSSV: 2123110066
 * Version: 5.0 (Hoàn chỉnh hệ thống API lấy danh sách, thêm, sửa, xóa danh mục sản phẩm cho Swagger và ReactJS)
 */
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;
using System.Linq;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    // 1. Định nghĩa đường dẫn gọi API. Địa chỉ truy cập thực tế: https://localhost:xxxx/api/categoryproducts
    [Route("api/[controller]")]

    // 2. Đánh dấu đây là một API Controller để Swagger tự động nhận diện và quét sơ đồ endpoint
    [ApiController]

    // 3. Kế thừa từ ControllerBase (bỏ qua phần trả về giao diện View HTML của hệ thống MVC cũ)
    public class CategoryProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        // 4. Hàm khởi tạo (Constructor): "Tiêm" ngữ cảnh dữ liệu SQL Server vào Controller
        public CategoryProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================================================================
        // 1. API: LẤY TOÀN BỘ DANH MỤC SẢN PHẨM (GET: api/categoryproducts)
        // =========================================================================
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            // Lấy toàn bộ danh mục sản phẩm thực tế từ Database
            var categories = await _context.CategoriesProducts
                .OrderByDescending(c => c.Id) // Danh mục mới tạo xếp lên đầu
                .Select(c => new {
                    c.Id,
                    c.Name,
                    c.Description,
                    TotalProducts = c.Products != null ? c.Products.Count : 0 // Đếm số lượng sản phẩm thuộc danh mục
                })
                .ToListAsync();

            // Trả về gói dữ liệu định dạng JSON kèm mã trạng thái HTTP 200 OK
            return Ok(categories);
        }

        // =========================================================================
        // 2. API: LẤY CHI TIẾT MỘT DANH MỤC THEO ID (GET: api/categoryproducts/{id})
        // =========================================================================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var category = await _context.CategoriesProducts
                .FirstOrDefaultAsync(c => c.Id == id);

            if (category == null)
            {
                return NotFound(new { message = "Không tìm thấy danh mục sản phẩm này!" });
            }

            return Ok(category);
        }

        // =========================================================================
        // 3. API: THÊM MỚI DANH MỤC SẢN PHẨM (POST: api/categoryproducts)
        // =========================================================================
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CategoryProduct model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState); // Trả về lỗi 400 nếu dữ liệu không hợp lệ (trống tên)
            }

            try
            {
                _context.CategoriesProducts.Add(model);
                await _context.SaveChangesAsync();

                // Trả về bản ghi vừa tạo kèm mã 201 Created
                return CreatedAtAction(nameof(GetById), new { id = model.Id }, model);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống database: " + ex.Message });
            }
        }

        // =========================================================================
        // 4. API: CẬP NHẬT DANH MỤC SẢN PHẨM (PUT: api/categoryproducts/{id})
        // =========================================================================
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CategoryProduct model)
        {
            if (id != model.Id)
            {
                return BadRequest(new { message = "Mã ID không đồng nhất!" });
            }

            try
            {
                _context.Entry(model).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return Ok(new { message = "Cập nhật danh mục thành công!", data = model });
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.CategoriesProducts.Any(c => c.Id == id))
                {
                    return NotFound(new { message = "Danh mục không tồn tại để cập nhật!" });
                }
                throw;
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi cập nhật dữ liệu: " + ex.Message });
            }
        }

        // =========================================================================
        // 5. API: XÓA DANH MỤC SẢN PHẨM (DELETE: api/categoryproducts/{id})
        // =========================================================================
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var category = await _context.CategoriesProducts.FindAsync(id);
                if (category == null)
                {
                    return NotFound(new { message = "Không tìm thấy danh mục cần xóa!" });
                }

                _context.CategoriesProducts.Remove(category);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Xóa danh mục sản phẩm thành công!" });
            }
            catch (System.Exception ex)
            {
                // Nếu danh mục đang ràng buộc với bảng Products (đang có giày thuộc danh mục này), SQL sẽ chặn lại
                return StatusCode(500, new { message = "Không thể xóa danh mục này do đang có sản phẩm liên kết! Lỗi: " + ex.Message });
            }
        }
    }
}
/*
 * Sinh Viên: Đinh Quang Hà
 * MSSV: 2123110066
 * Version: 5.0 (Hoàn chỉnh hệ thống API lấy danh sách, thêm, sửa, xóa thông tin khách hàng cho Swagger và ReactJS)
 */
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;
using System.Linq;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    // 1. Định nghĩa đường dẫn gọi API. Địa chỉ truy cập thực tế: https://localhost:xxxx/api/customersapi
    [Route("api/[controller]")]

    // 2. Đánh dấu đây là một API Controller để Swagger quét endpoint tự động
    [ApiController]

    // 3. Kế thừa từ ControllerBase (Dành riêng cho xây dựng Web API trả về JSON)
    public class CustomersApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        // 4. Hàm khởi tạo: "Tiêm" ngữ cảnh dữ liệu SQL Server vào Controller
        public CustomersApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================================================================
        // 1. API: LẤY TOÀN BỘ DANH SÁCH KHÁCH HÀNG (GET: api/customersapi)
        // =========================================================================
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            // Lấy danh sách khách hàng và bảo mật: Không trả mật khẩu (Password) về Frontend
            var customers = await _context.Customers
                .OrderByDescending(c => c.Id) // Khách hàng mới đăng ký lên đầu
                .Select(c => new {
                    c.Id,
                    c.FullName,
                    c.Email,
                    c.Phone,
                    c.Address
                    // Tuyệt đối không Select trường Password ở đây để đảm bảo an toàn an ninh mạng
                })
                .ToListAsync();

            // Trả về chuỗi JSON kèm mã trạng thái HTTP 200 OK
            return Ok(customers);
        }

        // =========================================================================
        // 2. API: LẤY CHI TIẾT MỘT KHÁCH HÀNG THEO ID (GET: api/customersapi/{id})
        // =========================================================================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            // Tìm khách hàng và ẩn mật khẩu đi
            var customer = await _context.Customers
                .Select(c => new {
                    c.Id,
                    c.FullName,
                    c.Email,
                    c.Phone,
                    c.Address
                })
                .FirstOrDefaultAsync(c => c.Id == id);

            if (customer == null)
            {
                return NotFound(new { message = "Không tìm thấy thông tin khách hàng này!" });
            }

            return Ok(customer);
        }

        // =========================================================================
        // 3. API: ĐĂNG KÝ / THÊM MỚI KHÁCH HÀNG (POST: api/customersapi)
        // =========================================================================
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Customer model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState); // Trả về lỗi 400 nếu thiếu trường bắt buộc
            }

            try
            {
                // Kiểm tra trùng lặp Email trước khi cho đăng ký
                bool isEmailExist = await _context.Customers.AnyAsync(c => c.Email == model.Email);
                if (isEmailExist)
                {
                    return BadRequest(new { message = "Email này đã được đăng ký trong hệ thống!" });
                }

                if (!string.IsNullOrEmpty(model.Password))
                {
                    model.Password = BCrypt.Net.BCrypt.HashPassword(model.Password);
                }
                
                _context.Customers.Add(model);
                await _context.SaveChangesAsync();

                // Ẩn mật khẩu trước khi trả về dữ liệu kết quả phản hồi
                var result = new
                {
                    model.Id,
                    model.FullName,
                    model.Email,
                    model.Phone,
                    model.Address
                };

                return CreatedAtAction(nameof(GetById), new { id = model.Id }, result);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi lưu database: " + ex.Message });
            }
        }

        // =========================================================================
        // 4. API: CẬP NHẬT THÔNG TIN KHÁCH HÀNG (PUT: api/customersapi/{id})
        // =========================================================================
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Customer model)
        {
            if (id != model.Id)
            {
                return BadRequest(new { message = "Mã ID khách hàng không trùng khớp!" });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                _context.Entry(model).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return Ok(new { message = "Cập nhật thông tin khách hàng thành công!" });
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Customers.Any(c => c.Id == id))
                {
                    return NotFound(new { message = "Khách hàng không tồn tại để cập nhật!" });
                }
                throw;
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi cập nhật dữ liệu: " + ex.Message });
            }
        }

        // =========================================================================
        // 5. API: XÓA TÀI KHOẢN KHÁCH HÀNG (DELETE: api/customersapi/{id})
        // =========================================================================
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var customer = await _context.Customers.FindAsync(id);
                if (customer == null)
                {
                    return NotFound(new { message = "Không tìm thấy khách hàng cần xóa!" });
                }

                _context.Customers.Remove(customer);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Xóa tài khoản khách hàng thành công!" });
            }
            catch (System.Exception ex)
            {
                // Nếu khách hàng đã từng đặt đơn hàng (Orders), SQL Server sẽ chặn lại không cho xóa
                return StatusCode(500, new { message = "Không thể xóa khách hàng này do đã có dữ liệu đơn hàng! Lỗi: " + ex.Message });
            }
        } // ĐÓNG HÀM DELETE Ở ĐÂY

        // =========================================================================
        // 6. API: ĐĂNG NHẬP KHÁCH HÀNG (POST: api/customersapi/login)
        // =========================================================================
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto model)
        {
            if (string.IsNullOrEmpty(model.Email) || string.IsNullOrEmpty(model.Password))
            {
                return BadRequest(new { message = "Vui lòng nhập đầy đủ Email và Mật khẩu!" });
            }

            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Email == model.Email);
            if (customer == null)
            {
                return Unauthorized(new { message = "Email hoặc mật khẩu không chính xác!" });
            }

            // Kiểm tra mật khẩu (BCrypt)
            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(model.Password, customer.Password);
            
            // Fallback: Kiểm tra cả mật khẩu thô (nếu database cũ chưa mã hóa)
            if (!isPasswordValid && model.Password == customer.Password)
            {
                isPasswordValid = true;
            }

            if (!isPasswordValid)
            {
                return Unauthorized(new { message = "Email hoặc mật khẩu không chính xác!" });
            }

            // Đăng nhập thành công, trả về thông tin user (không bao gồm password)
            return Ok(new
            {
                message = "Đăng nhập thành công!",
                user = new {
                    id = customer.Id,
                    fullName = customer.FullName,
                    email = customer.Email,
                    phone = customer.Phone,
                    address = customer.Address
                }
            });
        }
        // =========================================================================
        // 7. API: YÊU CẦU QUÊN MẬT KHẨU (POST: api/customersapi/forgot-password)
        // =========================================================================
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto model)
        {
            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Email == model.Email);
            if (customer == null)
            {
                // Để bảo mật, không trả về lỗi "Không tìm thấy email" để tránh kẻ gian dò quét email
                return Ok(new { message = "Nếu email hợp lệ, hướng dẫn khôi phục mật khẩu đã được gửi (Giả lập)." });
            }

            // Ở môi trường thực tế: Tạo Token -> Gửi link vào email. 
            // Ở đồ án này: Ta trả về mã thành công để Frontend làm giao diện Reset trực tiếp
            return Ok(new { message = "Email hợp lệ. Cho phép đặt lại mật khẩu!" });
        }

        // =========================================================================
        // 8. API: ĐẶT LẠI MẬT KHẨU MỚI (POST: api/customersapi/reset-password)
        // =========================================================================
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto model)
        {
            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Email == model.Email);
            if (customer == null)
            {
                return BadRequest(new { message = "Email không hợp lệ!" });
            }

            // Mã hóa mật khẩu mới và lưu vào DB
            customer.Password = BCrypt.Net.BCrypt.HashPassword(model.NewPassword);
            _context.Customers.Update(customer);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay." });
        }
    }

    // DTO cho chức năng Đăng nhập
    public class LoginDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    // DTO cho chức năng Quên mật khẩu
    public class ForgotPasswordDto
    {
        public string Email { get; set; } = string.Empty;
    }

    public class ResetPasswordDto
    {
        public string Email { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
}
/*
 * Sinh Viên: Đinh Quang Hà
 * MSSV: 2123110066
 * Version: 1.0 (Hoàn chỉnh chức năng Đăng nhập hệ thống & Đăng xuất bằng Cookie Authentication)
 */

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using System;
using CMS.Data; // Thư mục chứa ApplicationDbContext của dự án

namespace CMS.Backend.Controllers
{
    public class AccountController : Controller
    {
        private readonly ApplicationDbContext _context;

        // Constructor Injection để tiêm DbContext vào Controller dữ liệu
        public AccountController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================================================================
        // 1. GIAO DIỆN ĐĂNG NHẬP (GET: /Account/Login)
        // =========================================================================
        [HttpGet]
        public IActionResult Login()
        {
            // Nếu người dùng đã đăng nhập rồi thì tự động chuyển về trang chủ luôn, không bắt đăng nhập lại
            if (User.Identity != null && User.Identity.IsAuthenticated)
            {
                return RedirectToAction("Index", "Home");
            }
            return View();
        }

        // =========================================================================
        // 2. XỬ LÝ LOGIC ĐĂNG NHẬP (POST: /Account/Login)
        // =========================================================================
        [HttpPost]
        [ValidateAntiForgeryToken] // Tăng cường bảo mật, chống tấn công giả mạo CSRF
        public async Task<IActionResult> Login(string username, string password)
        {
            try
            {
                // Kiểm tra dữ liệu đầu vào trống
                if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
                {
                    ViewBag.Error = "Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!";
                    return View();
                }

                // 1. Tìm tài khoản theo username trong DB
                var user = _context.Users.FirstOrDefault(u => u.Username == username);

                bool passwordOk = false;
                if (user != null)
                {
                    // Kiểm tra mật khẩu: Hỗ trợ cả 2 trường hợp
                    // TH1: Mật khẩu đã được mã hóa bằng BCrypt (bắt đầu bằng "$2")
                    if (user.PasswordHash.StartsWith("$2"))
                    {
                        passwordOk = BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);
                    }
                    else
                    {
                        // TH2: Mật khẩu vẫn đang là plain text (chưa mã hóa)
                        passwordOk = (password == user.PasswordHash);

                        // Tự động mã hóa lại bằng BCrypt để lần sau dùng chuẩn hơn
                        if (passwordOk)
                        {
                            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(password);
                            _context.SaveChanges();
                        }
                    }
                }

                if (passwordOk && user != null)
                {
                    // 2. Thiết lập danh tính người dùng (Claims) để lưu vào Cookie
                    var claims = new List<Claim>
                    {
                        new Claim(ClaimTypes.Name, user.Username),
                        new Claim(ClaimTypes.Role, user.Role), // Lưu vai trò phân quyền: Administrator, Editor...
                        new Claim("FullName", user.FullName ?? "") // Tránh lỗi null nếu FullName trống
                    };

                    var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

                    // Cấu hình thêm thuộc tính Cookie (ví dụ: tự động ghi nhớ tài khoản)
                    var authProperties = new AuthenticationProperties
                    {
                        IsPersistent = true, // Giữ trạng thái đăng nhập ngay cả khi tắt trình duyệt
                        ExpiresUtc = DateTimeOffset.UtcNow.AddMinutes(30) // Cookie hết hạn sau 30 phút idle
                    };

                    // 3. Tiến hành đăng nhập và cấp mã Cookie ghi vào trình duyệt người dùng
                    await HttpContext.SignInAsync(
                        CookieAuthenticationDefaults.AuthenticationScheme,
                        new ClaimsPrincipal(claimsIdentity),
                        authProperties
                    );

                    // Đăng nhập thành công -> Chuyển hướng về trang chủ Admin
                    return RedirectToAction("Index", "Home");
                }

                // Nếu sai tài khoản hoặc mật khẩu
                ViewBag.Error = "Tên đăng nhập hoặc mật khẩu không chính xác!";
                return View();
            }
            catch (Exception ex)
            {
                ViewBag.Error = "Hệ thống đăng nhập đang gặp sự cố: " + ex.Message;
                return View();
            }
        }

        // =========================================================================
        // 3. XỬ LÝ ĐĂNG XUẤT TÀI KHOẢN (GET/POST: /Account/Logout)
        // =========================================================================
        public async Task<IActionResult> Logout()
        {
            // Xóa sạch mã Cookie danh tính khỏi trình duyệt người dùng
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);

            // Quay trở lại trang Đăng nhập
            return RedirectToAction("Login");
        }
        [HttpGet]
        public IActionResult AccessDenied()
        {
            return View();
        }

    }
}
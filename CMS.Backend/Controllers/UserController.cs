/*
 * Sinh Viên: Đinh Quang Hà
 * MSSV: 2123110066
 * Version: 3.0 (Hoàn chỉnh toàn diện CRUD và tích hợp bộ lọc phân quyền bảo mật cấp cao)
 */

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // QUAN TRỌNG: Cần để sử dụng .AsNoTracking()
using Microsoft.AspNetCore.Authorization; // QUAN TRỌNG: Để sử dụng thuộc tính [Authorize]
using CMS.Data.Entities;             // Sử dụng thực thể User
using CMS.Data;                      // Sử dụng ApplicationDbContext
using System;
using System.Linq;

namespace CMS.Backend.Controllers
{
    // Chỉ tài khoản có chức vụ (Role) là Admin mới được phép truy cập vào quản lý thành viên
    [Authorize(Roles = "Admin")]
    public class UserController : Controller
    {
        // Khai báo biến làm cầu nối xuống Cơ sở dữ liệu
        private readonly ApplicationDbContext _context;

        // Constructor Injection để tiêm DbContext vào Controller
        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================================================================
        // 1. CHỨC NĂNG HIỂN THỊ DANH SÁCH THÀNH VIÊN (INDEX)
        // =========================================================================
        public IActionResult Index()
        {
            // Lấy toàn bộ danh sách người dùng thực tế từ Database
            var users = _context.Users.ToList();
            return View(users);
        }

        // =========================================================================
        // 2. CHỨC NĂNG THÊM THÀNH VIÊN - BƯỚC 1: GET (Hiển thị Form)
        // =========================================================================
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        // =========================================================================
        // 2. CHỨC NĂNG THÊM THÀNH VIÊN - BƯỚC 2: POST (Xử lý lưu dữ liệu)
        // =========================================================================
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(User model)
        {
            try
            {
                // Kiểm tra xem tên đăng nhập đã tồn tại trong hệ thống chưa
                var checkExist = _context.Users.Any(u => u.Username == model.Username);
                if (checkExist)
                {
                    ModelState.AddModelError("Username", "Tên đăng nhập này đã có người sử dụng!");
                    return View(model);
                }

                // Lưu User mới vào Database (Mã hóa mật khẩu)
                if(!string.IsNullOrEmpty(model.PasswordHash))
                {
                    model.PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.PasswordHash);
                }
                _context.Users.Add(model);
                _context.SaveChanges();

                return RedirectToAction("Index");
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("", "Lỗi hệ thống khi tạo mới: " + ex.Message);
                return View(model);
            }
        }

        // =========================================================================
        // 3. CHỨC NĂNG SỬA THÀNH VIÊN - BƯỚC 1: GET (Lấy dữ liệu cũ đổ lên Form)
        // =========================================================================
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null)
            {
                return NotFound();
            }

            return View(user);
        }

        // =========================================================================
        // 3. CHỨC NĂNG SỬA THÀNH VIÊN - BƯỚC 2: POST (Xử lý cập nhật thông tin & mật khẩu)
        // =========================================================================
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(User model, string NewPassword)
        {
            try
            {
                // 1. Tìm User gốc trong Database bằng AsNoTracking để lấy lại mật khẩu cũ mà không làm xung đột bộ nhớ tạm
                var existingUser = _context.Users.AsNoTracking().FirstOrDefault(u => u.Id == model.Id);

                if (existingUser == null)
                {
                    return NotFound();
                }

                // 2. Xử lý logic mật khẩu: Nếu người dùng nhập mới thì lấy cái mới, nếu để trống thì giữ nguyên mật khẩu cũ
                if (!string.IsNullOrEmpty(NewPassword))
                {
                    model.PasswordHash = BCrypt.Net.BCrypt.HashPassword(NewPassword);
                }
                else
                {
                    model.PasswordHash = existingUser.PasswordHash;
                }

                // Kiểm tra trùng lặp Username với người khác khi đổi tên (Tránh sửa trùng với người có sẵn)
                var checkExist = _context.Users.Any(u => u.Username == model.Username && u.Id != model.Id);
                if (checkExist)
                {
                    ModelState.AddModelError("Username", "Tên đăng nhập này đã bị thành viên khác sử dụng!");
                    return View(model);
                }

                // 3. Cập nhật thực thể vào Database
                _context.Users.Update(model);
                _context.SaveChanges();

                return RedirectToAction("Index");
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("", "Lỗi hệ thống khi cập nhật: " + ex.Message);
                return View(model);
            }
        }

        // =========================================================================
        // 4. CHỨC NĂNG XÓA THÀNH VIÊN (DELETE) - POST 
        // =========================================================================
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Delete(int id)
        {
            try
            {
                var user = _context.Users.Find(id);
                if (user != null)
                {
                    _context.Users.Remove(user);
                    _context.SaveChanges();
                }
                return RedirectToAction("Index");
            }
            catch (Exception ex)
            {
                // Đẩy thông báo lỗi sang TempData nếu dính ràng buộc dữ liệu (ví dụ tài khoản này đã đăng bài viết)
                TempData["ErrorMessage"] = "Không thể xóa thành viên này! Chi tiết lỗi: " + ex.Message;
                return RedirectToAction("Index");
            }
        }
    }
}
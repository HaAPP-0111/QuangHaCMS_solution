/*
 * Sinh Viên: Đinh Quang Hà
 * MSSV: 2123110066
 * Version: 4.0 (Hoàn chỉnh đầy đủ chức năng Xem, Lọc, Thêm có Upload ảnh, Xóa bài viết và Tích hợp bộ lọc bảo mật)
 */
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering; // QUAN TRỌNG: Phải có để dùng được SelectList
using Microsoft.EntityFrameworkCore;    // QUAN TRỌNG: Phải có để dùng được lệnh .Include()
using Microsoft.AspNetCore.Authorization; // QUAN TRỌNG: Để sử dụng thuộc tính [Authorize]
using CMS.Data.Entities;
using CMS.Data;
using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Linq;

namespace CMS.Backend.Controllers
{
    // Bắt buộc phải đăng nhập mới được vào xem dữ liệu và thao tác bài viết
    [Authorize]
    public class PostController : Controller
    {
        // Khai báo đối tượng kết nối Database
        private readonly ApplicationDbContext _context;

        // Constructor Injection: Tiêm DbContext vào Controller
        public PostController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================================================================
        // 1. CHỨC NĂNG HIỂN THỊ DANH SÁCH BÀI VIẾT (Có lọc theo Category ID)
        // URL mẫu: /Post/Index/1 hoặc /Post/Index/2
        // =========================================================================
        public IActionResult Index(int? id)
        {
            // Nếu không có id truyền vào từ URL, lấy toàn bộ bài viết trong DB
            if (id == null)
            {
                var allPosts = _context.Posts
                                .OrderByDescending(p => p.Id)
                                .Include(p => p.Category)
                                .ToList();
                return View(allPosts);
            }

            // Sử dụng LINQ kết hợp điều kiện Where để lọc dữ liệu thực tế từ Database theo danh mục
            var posts = _context.Posts
                            .Where(p => p.CategoryId == id)
                            .OrderByDescending(p => p.Id) // Sắp xếp bài viết mới nhất lên đầu
                            .Include(p => p.Category)     // Nạp kèm dữ liệu của bảng Categories sang để hiển thị tên danh mục
                            .ToList();

            return View(posts);
        }

        // =========================================================================
        // 2. CHỨC NĂNG XEM CHI TIẾT BÀI VIẾT (DETAILS)
        // URL mẫu: /Post/Details/5
        // =========================================================================
        public IActionResult Details(int id)
        {
            // Truy vấn bài viết theo ID và kèm thông tin Danh mục (Join bảng)
            var post = _context.Posts
                .Include(p => p.Category)
                .FirstOrDefault(p => p.Id == id);

            // Kiểm tra nếu không tìm thấy bài viết (tránh lỗi màn hình trắng)
            if (post == null)
            {
                return NotFound(); // Trả về trang lỗi 404
            }

            return View(post);
        }

        // =========================================================================
        // 3. CHỨC NĂNG TẠO MỚI BÀI VIẾT - BƯỚC 1: GET (Hiển thị Form)
        // =========================================================================
        [HttpGet]
        public IActionResult Create()
        {
            // Lấy danh sách Category đổ vào ViewBag để làm thẻ <select> (Dropdown list) chọn danh mục ngoài giao diện
            ViewBag.CategoryList = new SelectList(_context.Categories, "Id", "Name");
            return View();
        }

        // =========================================================================
        // 3. CHỨC NĂNG TẠO MỚI BÀI VIẾT - BƯỚC 2: POST (Xử lý file ảnh và lưu SQL)
        // =========================================================================
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(Post model, IFormFile uploadImage)
        {
            try
            {
                if (uploadImage != null && uploadImage.Length > 0)
                {
                    // 1. Định nghĩa đường dẫn lưu file: wwwroot/uploads
                    string folder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");

                    // Tạo thư mục nếu chưa tồn tại trên ổ đĩa
                    if (!Directory.Exists(folder))
                    {
                        Directory.CreateDirectory(folder);
                    }

                    // 2. Tạo tên file duy nhất bằng GUID để không bị đè dữ liệu khi trùng tên
                    string fileName = Guid.NewGuid().ToString() + Path.GetExtension(uploadImage.FileName);
                    string filePath = Path.Combine(folder, fileName);

                    // 3. Chép file vào thư mục wwwroot/uploads
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        uploadImage.CopyTo(stream);
                    }

                    // 4. Lưu đường dẫn tương đối vào thuộc tính ImageUrl của đối tượng Post để ghi vào CSDL
                    model.ImageUrl = "/uploads/" + fileName;
                }

                // Lưu thực thể Post mới vào database
                _context.Posts.Add(model);
                _context.SaveChanges();

                // Lưu thành công sẽ nhảy về trang danh sách bài viết ngay lập tức
                return RedirectToAction("Index");
            }
            catch (Exception ex)
            {
                // Nếu xảy ra lỗi (SQL hoặc IO), nạp thông báo lỗi và load lại dữ liệu dropdown cho form
                ModelState.AddModelError("", "Lỗi hệ thống: " + (ex.InnerException?.Message ?? ex.Message));
                ViewBag.CategoryList = new SelectList(_context.Categories, "Id", "Name");
                return View(model);
            }
        }

        // =========================================================================
        // 4. CHỨC NĂNG SỬA BÀI VIẾT (EDIT) - GET (Hiển thị form kèm dữ liệu cũ)
        // =========================================================================
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var post = _context.Posts.Find(id);
            if (post == null) return NotFound();

            // Chuẩn bị lại danh sách danh mục để người dùng có thể đổi chuyên mục
            ViewBag.CategoryList = new SelectList(_context.Categories, "Id", "Name", post.CategoryId);
            return View(post);
        }

        // =========================================================================
        // 4. CHỨC NĂNG SỬA BÀI VIẾT (EDIT) - POST (Thực hiện cập nhật)
        // =========================================================================
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(Post model, IFormFile uploadImage)
        {
            try
            {
                // Bước 1: Kiểm tra xem người dùng có chọn file ảnh mới không
                if (uploadImage != null && uploadImage.Length > 0)
                {
                    // Thực hiện quy trình upload giống như trang Create
                    string folder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                    if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);

                    string fileName = Guid.NewGuid().ToString() + Path.GetExtension(uploadImage.FileName);
                    string filePath = Path.Combine(folder, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        uploadImage.CopyTo(stream);
                    }

                    // Cập nhật đường dẫn ảnh mới vào model
                    model.ImageUrl = "/uploads/" + fileName;
                }
                else
                {
                    // Bước quan trọng: Nếu không upload ảnh mới, chúng ta phải giữ lại ảnh cũ
                    // Chúng ta cần lấy lại giá trị ImageUrl từ Database để tránh bị ghi đè thành rỗng
                    var oldPost = _context.Posts.AsNoTracking().FirstOrDefault(p => p.Id == model.Id);
                    if (oldPost != null && string.IsNullOrEmpty(model.ImageUrl))
                    {
                        model.ImageUrl = oldPost.ImageUrl;
                    }
                }

                _context.Posts.Update(model);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("", "Lỗi cập nhật: " + ex.Message);
                ViewBag.CategoryList = new SelectList(_context.Categories, "Id", "Name", model.CategoryId);
                return View(model);
            }
        }

        // =========================================================================
        // 5. CHỨC NĂNG XÓA BÀI VIẾT (DELETE) - POST
        // =========================================================================
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Delete(int id)
        {
            try
            {
                // 1. Tìm bài viết theo Id trong Database
                var post = _context.Posts.Find(id);

                if (post != null)
                {
                    // 2. Xóa khỏi bộ nhớ tạm
                    _context.Posts.Remove(post);

                    // 3. Cập nhật dữ liệu thực tế xuống SQL Server
                    _context.SaveChanges();
                }

                return RedirectToAction("Index");
            }
            catch (Exception ex)
            {
                // Nếu lỗi phát sinh (ví dụ lỗi ràng buộc dữ liệu hoặc lỗi kết nối DB), đẩy thông báo ra TempData
                TempData["ErrorMessage"] = "Không thể xóa bài viết này! Chi tiết lỗi: " + ex.Message;
                return RedirectToAction("Index");
            }
        }
    }
}
/*
 * Sinh Viên: Đinh Quang Hà
 * MSSV: 2123110066
 * BÀI TẬP 4: LIỆT KÊ DANH SÁCH PRODUCTS
 */
using Microsoft.AspNetCore.Mvc;
using CMS.Data.Entities; // Namespace chứa thực thể Product của bạn
using CMS.Data;          // Namespace chứa ApplicationDbContext

namespace CMS.Backend.Controllers
{
    public class ProductController : Controller
    {
        private readonly ApplicationDbContext _context;

        // Constructor Injection để tiêm kết nối Database
        public ProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Action lấy danh sách sản phẩm từ SQL Server đưa sang View
        public IActionResult Index()
        {
            // Lấy toàn bộ sản phẩm thực tế từ bảng Products
            var products = _context.Products.ToList();

            return View(products);
        }
    }
}
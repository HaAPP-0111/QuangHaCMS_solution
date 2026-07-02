/*
 * Sinh Viên: Đinh Quang Hà
 * MSSV: 2123110066
 * MVC Controller quản lý Danh mục sản phẩm (giao diện Admin)
 */
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using CMS.Data;
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Authorize]
    [ApiExplorerSettings(IgnoreApi = true)]
    public class CategoryProductsMvcController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CategoryProductsMvcController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Dùng route đặc biệt để URL vẫn là /CategoryProducts
        [Route("CategoryProducts")]
        [Route("CategoryProducts/Index")]
        public IActionResult Index()
        {
            var data = _context.CategoriesProducts.ToList();
            return View("~/Views/CategoryProducts/Index.cshtml", data);
        }

        [HttpGet]
        [Route("CategoryProducts/Create")]
        public IActionResult Create()
        {
            return View("~/Views/CategoryProducts/Create.cshtml");
        }

        [HttpPost]
        [Route("CategoryProducts/Create")]
        [ValidateAntiForgeryToken]
        public IActionResult Create(CategoryProduct model)
        {
            try
            {
                _context.CategoriesProducts.Add(model);
                _context.SaveChanges();
                return Redirect("/CategoryProducts");
            }
            catch (System.Exception ex)
            {
                ModelState.AddModelError("", "Lỗi hệ thống database: " + (ex.InnerException?.Message ?? ex.Message));
                return View("~/Views/CategoryProducts/Create.cshtml", model);
            }
        }

        [HttpGet]
        [Route("CategoryProducts/Edit/{id}")]
        public IActionResult Edit(int id)
        {
            var category = _context.CategoriesProducts.Find(id);
            if (category == null) return NotFound();
            return View("~/Views/CategoryProducts/Edit.cshtml", category);
        }

        [HttpPost]
        [Route("CategoryProducts/Edit/{id}")]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(CategoryProduct model)
        {
            try
            {
                _context.CategoriesProducts.Update(model);
                _context.SaveChanges();
                return Redirect("/CategoryProducts");
            }
            catch (System.Exception ex)
            {
                ModelState.AddModelError("", "Lỗi cập nhật: " + ex.Message);
                return View("~/Views/CategoryProducts/Edit.cshtml", model);
            }
        }

        [HttpPost]
        [Route("CategoryProducts/Delete/{id}")]
        [ValidateAntiForgeryToken]
        public IActionResult Delete(int id)
        {
            try
            {
                var category = _context.CategoriesProducts.Find(id);
                if (category != null)
                {
                    _context.CategoriesProducts.Remove(category);
                    _context.SaveChanges();
                }
                return Redirect("/CategoryProducts");
            }
            catch (System.Exception ex)
            {
                TempData["ErrorMessage"] = "Không thể xóa danh mục này vì đang có sản phẩm thuộc danh mục! Lỗi: " + ex.Message;
                return Redirect("/CategoryProducts");
            }
        }
    }
}

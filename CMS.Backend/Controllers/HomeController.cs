using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using CMS.Data;
using System.Linq;

[Authorize]
public class HomeController : Controller
{
    private readonly ApplicationDbContext _context;

    public HomeController(ApplicationDbContext context)
    {
        _context = context;
    }

    public IActionResult Index()
    {
        // Thống kê tổng quan cho Dashboard
        ViewBag.TotalProducts = _context.Products.Count();
        ViewBag.TotalPosts = _context.Posts.Count();
        ViewBag.TotalCategoryProducts = _context.CategoriesProducts.Count();
        ViewBag.TotalCategories = _context.Categories.Count();
        ViewBag.TotalCustomers = _context.Customers.Count();
        ViewBag.TotalOrders = _context.Orders.Count();

        // 5 sản phẩm mới nhất
        ViewBag.LatestProducts = _context.Products
            .Include(p => p.CategoryProduct)
            .OrderByDescending(p => p.Id)
            .Take(5)
            .ToList();

        // 5 bài viết mới nhất
        ViewBag.LatestPosts = _context.Posts
            .Include(p => p.Category)
            .OrderByDescending(p => p.CreatedDate)
            .Take(5)
            .ToList();

        return View();
    }
}

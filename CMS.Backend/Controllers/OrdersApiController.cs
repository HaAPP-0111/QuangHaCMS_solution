using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;
using System;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly CMS.Backend.Services.IEmailService _emailService;

        public OrdersApiController(ApplicationDbContext context, CMS.Backend.Services.IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        public class CheckoutRequest
        {
            public int CustomerId { get; set; }
            public string? Notes { get; set; }
            public List<CartItem> Items { get; set; } = new List<CartItem>();
        }

        public class CartItem
        {
            public int ProductId { get; set; }
            public int Quantity { get; set; }
            public decimal Price { get; set; }
        }

        [HttpPost("checkout")]
        public async Task<IActionResult> Checkout([FromBody] CheckoutRequest request)
        {
            if (request == null || request.Items == null || request.Items.Count == 0)
            {
                return BadRequest(new { message = "Giỏ hàng trống hoặc thông tin không hợp lệ." });
            }

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // Tạo đơn hàng mới
                var order = new Order
                {
                    CustomerId = request.CustomerId,
                    OrderDate = DateTime.Now,
                    Status = 0,         // 0 = Chờ duyệt
                    Notes = request.Notes
                };

                _context.Orders.Add(order);
                await _context.SaveChangesAsync();

                // Tạo chi tiết đơn hàng và TRỪ TỒN KHO
                foreach (var item in request.Items)
                {
                    var orderDetail = new OrderDetail
                    {
                        OrderId = order.Id,
                        ProductId = item.ProductId,
                        Quantity = item.Quantity,
                        UnitPrice = item.Price
                    };
                    _context.OrderDetails.Add(orderDetail);

                    // Lấy sản phẩm từ DB để trừ tồn kho
                    var product = await _context.Products.FindAsync(item.ProductId);
                    if (product != null)
                    {
                        // Kiểm tra an toàn: nếu tồn kho không đủ, có thể rollback (Tùy chọn)
                        if (product.StockQuantity < item.Quantity)
                        {
                            await transaction.RollbackAsync();
                            return BadRequest(new { message = $"Sản phẩm '{product.Name}' không đủ số lượng trong kho!" });
                        }
                        
                        // Trừ tồn kho
                        product.StockQuantity -= item.Quantity;
                        _context.Products.Update(product);
                    }
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                // GỬI EMAIL THÔNG BÁO CHO KHÁCH HÀNG
                var customer = await _context.Customers.FindAsync(request.CustomerId);
                if (customer != null && !string.IsNullOrEmpty(customer.Email))
                {
                    string subject = $"Xác nhận đặt hàng thành công - Đơn hàng #{order.Id}";
                    string body = $"<h2>Cảm ơn {customer.FullName} đã mua sắm tại cửa hàng của chúng tôi!</h2>" +
                                  $"<p>Đơn hàng <b>#{order.Id}</b> của bạn đã được ghi nhận hệ thống thành công.</p>" +
                                  $"<p>Ghi chú đơn hàng: {order.Notes}</p>" +
                                  $"<p>Chúng tôi sẽ sớm liên hệ lại với bạn.</p>";
                    try
                    {
                        await _emailService.SendEmailAsync(customer.Email, subject, body);
                    }
                    catch (Exception emailEx)
                    {
                        Console.WriteLine("Không thể gửi email: " + emailEx.Message);
                    }
                }

                return Ok(new { message = "Đặt hàng thành công!", orderId = order.Id });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = "Lỗi xử lý đặt hàng: " + ex.Message });
            }
        }
    }
}

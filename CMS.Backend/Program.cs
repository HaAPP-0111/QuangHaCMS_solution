using Microsoft.EntityFrameworkCore;
using CMS.Data;
using Microsoft.AspNetCore.Authentication.Cookies;

var builder = WebApplication.CreateBuilder(args);

// --- 1. DỊCH VỤ: Cấu hình CORS ---
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins(
                "http://localhost:3000",
                "http://localhost:3001",  // React có thể chạy port 3001 nếu 3000 đã bị chiếm
                "https://localhost:3000",
                "https://localhost:3001"
              )
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddControllersWithViews()
    .AddJsonOptions(options =>
    {
        // Bỏ qua lỗi vòng lặp dữ liệu (Object Cycle) khi Include các bảng có liên kết 2 chiều
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

// --- 2. DỊCH VỤ: Swagger ---
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// --- 3. DỊCH VỤ: Database ---
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// --- 3.1 DỊCH VỤ: Email ---
builder.Services.AddScoped<CMS.Backend.Services.IEmailService, CMS.Backend.Services.EmailService>();

// --- 4. DỊCH VỤ: Authentication ---
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/Account/Login";
        options.AccessDeniedPath = "/Account/AccessDenied";
    });

var app = builder.Build();

// --- 5. PIPELINE: Cấu hình Middleware (ĐÚNG THỨ TỰ) ---

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

// CẤU HÌNH CORS (Bắt buộc đặt sau UseRouting và trước Authentication/Authorization)
app.UseCors("AllowReactApp");

app.UseAuthentication();
app.UseAuthorization();

// Kích hoạt Swagger chỉ khi ở môi trường Development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
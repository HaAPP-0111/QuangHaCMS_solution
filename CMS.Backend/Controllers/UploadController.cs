using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UploadController : ControllerBase
    {
        [HttpPost("ckeditor")]
        public async Task<IActionResult> UploadImage(IFormFile upload)
        {
            if (upload != null && upload.Length > 0)
            {
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(upload.FileName);
                var savePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads", fileName);

                // Create directory if not exists
                var directory = Path.GetDirectoryName(savePath);
                if (!Directory.Exists(directory))
                {
                    Directory.CreateDirectory(directory);
                }

                using (var stream = new FileStream(savePath, FileMode.Create))
                {
                    await upload.CopyToAsync(stream);
                }

                var url = $"/uploads/{fileName}";

                return Ok(new { url = url });
            }

            return BadRequest(new { error = new { message = "Lỗi khi upload ảnh!" } });
        }
    }
}

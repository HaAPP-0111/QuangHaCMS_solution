using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace CMS.Backend.Services
{
    public interface IEmailService
    {
        Task SendEmailAsync(string toEmail, string subject, string body);
    }

    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            var smtpSettings = _configuration.GetSection("SmtpSettings");
            var host = smtpSettings["Host"];
            var port = int.Parse(smtpSettings["Port"] ?? "587");
            var username = smtpSettings["Username"];
            var password = smtpSettings["Password"];

            // Nếu chưa cấu hình thật, in ra console để giả lập chức năng
            if (string.IsNullOrEmpty(host) || host == "smtp.example.com")
            {
                System.Console.WriteLine("================== MOCK EMAIL ==================");
                System.Console.WriteLine($"TO: {toEmail}");
                System.Console.WriteLine($"SUBJECT: {subject}");
                System.Console.WriteLine($"BODY: {body}");
                System.Console.WriteLine("================================================");
                return;
            }

            var message = new MailMessage();
            message.From = new MailAddress(username);
            message.To.Add(new MailAddress(toEmail));
            message.Subject = subject;
            message.Body = body;
            message.IsBodyHtml = true;

            using var client = new SmtpClient(host, port)
            {
                Credentials = new NetworkCredential(username, password),
                EnableSsl = true
            };

            await client.SendMailAsync(message);
        }
    }
}

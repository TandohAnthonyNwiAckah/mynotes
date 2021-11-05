using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;

public class EmailHelper
{
    private readonly IConfiguration Config;
    public EmailHelper(IConfiguration configuration)
    {
        Config = configuration;
    }
    public void SendEmail(string email, string subject, string message)
    {
        using (var client = new SmtpClient())
        {
            var credential = new NetworkCredential
            {
                UserName = Config["Email:Email"],
                Password = Config["Email:Password"]
            };

            client.Credentials = credential;
            client.Host = Config["Email:Host"];
            client.Port = int.Parse(Config["Email:Port"]);
            client.EnableSsl = true;
            using (var emailMessage = new MailMessage())
            {
                emailMessage.To.Add(new MailAddress(email));
                emailMessage.From = new MailAddress(Config["Email:Email"], Config["Email:Name"]);
                emailMessage.Subject = subject;
                emailMessage.Body = message;
                client.Send(emailMessage);
            }
        }
           
    }
}

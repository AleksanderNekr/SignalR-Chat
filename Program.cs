using Microsoft.AspNetCore.SignalR;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSignalR(options => options.EnableDetailedErrors = true);
builder.Services.AddCors();

WebApplication app = builder.Build();

app.UseHttpsRedirection();

app.UseCors(policyBuilder =>
{
    policyBuilder.WithOrigins("http://localhost:4200")
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
});
app.MapHub<ChatHub>("/chat");

app.Run();

public class ChatHub : Hub
{
    public Task SendMessageAsync(string user, string text)
    {
        return Clients.All.SendAsync("Receive", user, text);
    }
}

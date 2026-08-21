using Cartas.Web.Hubs;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews();
builder.Services.AddSignalR().AddJsonProtocol(options =>
{
    // Keep PascalCase property names over the wire to match the existing
    // TypeScript client (e.g. card.Num, player.PlayerId).
    options.PayloadSerializerOptions.PropertyNamingPolicy = null;
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/Error");
}

app.UseStaticFiles();

app.UseRouting();

app.MapControllerRoute(
    name: "Default",
    pattern: "{controller=Game}/{action=Index}/{id?}");

app.MapHub<GameHub>("/hubs/game");

app.Run();

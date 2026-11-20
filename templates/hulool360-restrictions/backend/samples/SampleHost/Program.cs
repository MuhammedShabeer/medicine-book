// Sample host used to run and test the module on its own.
// It uses a development-only sign-in (headers X-Dev-User / X-Dev-Roles) so it runs without extra packages.
// In Hulool 360° keep your existing JWT authentication; see README "Backend integration".
using System.Security.Claims;
using System.Text.Encodings.Web;
using Hulool.FormularyRestrictions;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAuthentication("Dev").AddScheme<AuthenticationSchemeOptions, DevAuthHandler>("Dev", _ => { });
builder.Services.AddAuthorization();

builder.Services
    .AddFormularyRestrictions(o => o.AdminRoles = ["Admin"])
    .UseJsonFileStore(Path.Combine(builder.Environment.ContentRootPath, "App_Data", "formulary"));

builder.Services.AddCors(o => o.AddDefaultPolicy(p => p.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin().WithExposedHeaders("ETag")));

var app = builder.Build();
await app.Services.InitializeFormularyRestrictionsAsync();

app.UseCors();
app.UseDefaultFiles();
app.UseStaticFiles();
app.UseAuthentication();
app.UseAuthorization();
app.MapFormularyRestrictions();
app.MapFallbackToFile("index.html");
app.Run();

/// <summary>DEVELOPMENT ONLY. Reads the signed-in user from request headers.</summary>
internal sealed class DevAuthHandler(IOptionsMonitor<AuthenticationSchemeOptions> options, ILoggerFactory logger, UrlEncoder encoder)
    : AuthenticationHandler<AuthenticationSchemeOptions>(options, logger, encoder)
{
    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        var user = Request.Headers["X-Dev-User"].ToString();
        if (string.IsNullOrWhiteSpace(user)) return Task.FromResult(AuthenticateResult.NoResult());
        var claims = new List<Claim> { new(ClaimTypes.NameIdentifier, user), new("name", user) };
        claims.AddRange(Request.Headers["X-Dev-Roles"].ToString().Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries).Select(r => new Claim(ClaimTypes.Role, r)));
        var principal = new ClaimsPrincipal(new ClaimsIdentity(claims, "Dev"));
        return Task.FromResult(AuthenticateResult.Success(new AuthenticationTicket(principal, "Dev")));
    }
}

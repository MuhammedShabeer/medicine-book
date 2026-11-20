using Microsoft.AspNetCore.Authorization;
using System.Text;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Hulool.FormularyRestrictions;

public static class FormularyServiceCollectionExtensions
{
    /// <summary>
    /// Registers the module services. Call one storage method as well:
    /// <c>.UseJsonFileStore(path)</c> here, or <c>AddFormularyRestrictionsEntityFramework(...)</c> from the EF Core package.
    /// </summary>
    public static FormularyBuilder AddFormularyRestrictions(this IServiceCollection services, Action<FormularyOptions>? configure = null)
    {
        var options = new FormularyOptions();
        configure?.Invoke(options);
        services.TryAddSingleton(options);
        services.TryAddEnumerable(ServiceDescriptor.Singleton<IFormularyActivitySink, NoActivitySink>());
        services.TryAddScoped<FormularyService>();
        services.AddAuthorization(a =>
        {
            if (a.GetPolicy(options.AdminPolicy) is null)
                a.AddPolicy(options.AdminPolicy, p => p.RequireAuthenticatedUser().RequireRole(options.AdminRoles));
        });
        return new FormularyBuilder(services, options);
    }
}

public sealed class FormularyBuilder(IServiceCollection services, FormularyOptions options)
{
    public IServiceCollection Services { get; } = services;
    public FormularyOptions Options { get; } = options;

    /// <summary>Stores data as JSON files under <paramref name="directory"/> (no database needed).</summary>
    public FormularyBuilder UseJsonFileStore(string directory)
    {
        Services.RemoveAll<IFormularyStore>();
        Services.AddSingleton<IFormularyStore>(new JsonFileFormularyStore(directory));
        return this;
    }

    /// <summary>Copies every usage event into your own activity log (see <see cref="IFormularyActivitySink"/>).</summary>
    public FormularyBuilder AddActivitySink<TSink>() where TSink : class, IFormularyActivitySink
    {
        Services.AddScoped<IFormularyActivitySink, TSink>();
        return this;
    }
}

public static class FormularyEndpointExtensions
{
    /// <summary>Seeds the store from the embedded HMC lists if it is empty. Call once at startup, after storage is ready.</summary>
    public static async Task InitializeFormularyRestrictionsAsync(this IServiceProvider services, CancellationToken ct = default)
    {
        await using var scope = services.CreateAsyncScope();
        var options = scope.ServiceProvider.GetRequiredService<FormularyOptions>();
        if (!options.SeedOnStartup) return;
        var seeded = await scope.ServiceProvider.GetRequiredService<FormularyService>().SeedIfEmptyAsync(ct);
        if (seeded)
            scope.ServiceProvider.GetService<ILoggerFactory>()?.CreateLogger("Hulool.FormularyRestrictions")
                .LogInformation("Formulary restriction data seeded from the embedded HMC lists.");
    }

    public static RouteGroupBuilder MapFormularyRestrictions(this IEndpointRouteBuilder app)
    {
        var options = app.ServiceProvider.GetRequiredService<FormularyOptions>();
        var root = app.MapGroup(options.RoutePrefix).WithTags("Formulary restrictions");

        // ---------- read (any signed-in user) ----------
        var read = root.MapGroup("");
        if (options.RequireSignedInUserForReads) read.RequireAuthorization();

        read.MapGet("/dataset", async (HttpContext http, FormularyService svc, CancellationToken ct) =>
        {
            var data = await svc.GetDatasetAsync(false, ct);
            var etag = $"\"{data.Version}\"";
            http.Response.Headers.ETag = etag;
            http.Response.Headers.CacheControl = "private, no-cache";
            if (http.Request.Headers.IfNoneMatch.Any(v => v == etag)) return Results.StatusCode(StatusCodes.Status304NotModified);
            return Results.Ok(data);
        });

        root.MapPost("/usage", async (UsageBatch batch, HttpContext http, FormularyService svc, CancellationToken ct) =>
        {
            var n = await svc.RecordUsageAsync(batch.Events ?? [], http.User, ct);
            return Results.Ok(new { recorded = n });
        }).RequireAuthorization();

        root.MapGet("/me", async (HttpContext http, FormularyService svc, IAuthorizationService auth) =>
        {
            var (id, name) = svc.WhoIs(http.User);
            var isAdmin = (await auth.AuthorizeAsync(http.User, options.AdminPolicy)).Succeeded;
            return Results.Ok(new { id, name, isAdmin });
        }).RequireAuthorization();

        // ---------- admin ----------
        var admin = root.MapGroup("/admin").RequireAuthorization(options.AdminPolicy);

        admin.MapGet("/dataset", async (FormularyService svc, CancellationToken ct) => Results.Ok(await svc.GetDatasetAsync(true, ct)));

        admin.MapPut("/items/{itemNo}", (string itemNo, ItemInput input, HttpContext http, FormularyService svc, CancellationToken ct) =>
            Guard(async () => Results.Ok(await svc.SaveItemAsync(itemNo, input, http.User, ct))));
        admin.MapDelete("/items/{itemNo}", async (string itemNo, HttpContext http, FormularyService svc, CancellationToken ct) =>
            await svc.SetItemDeletedAsync(itemNo, true, http.User, ct) is { } dto ? Results.Ok(dto) : Results.NotFound(new ProblemDto("Medicine not found.")));
        admin.MapPost("/items/{itemNo}/restore", async (string itemNo, HttpContext http, FormularyService svc, CancellationToken ct) =>
            await svc.SetItemDeletedAsync(itemNo, false, http.User, ct) is { } dto ? Results.Ok(dto) : Results.NotFound(new ProblemDto("Medicine not found.")));

        admin.MapPost("/restrictions", (RestrictionInput input, HttpContext http, FormularyService svc, CancellationToken ct) =>
            Guard(async () => Results.Ok(await svc.SaveRestrictionAsync(null, input, http.User, ct))));
        admin.MapPut("/restrictions/{id}", (string id, RestrictionInput input, HttpContext http, FormularyService svc, CancellationToken ct) =>
            Guard(async () => Results.Ok(await svc.SaveRestrictionAsync(id, input, http.User, ct))));
        admin.MapDelete("/restrictions/{id}", async (string id, HttpContext http, FormularyService svc, CancellationToken ct) =>
            await svc.SetRestrictionDeletedAsync(id, true, http.User, ct) is { } dto ? Results.Ok(dto) : Results.NotFound(new ProblemDto("Restriction not found.")));
        admin.MapPost("/restrictions/{id}/restore", async (string id, HttpContext http, FormularyService svc, CancellationToken ct) =>
            await svc.SetRestrictionDeletedAsync(id, false, http.User, ct) is { } dto ? Results.Ok(dto) : Results.NotFound(new ProblemDto("Restriction not found.")));
        admin.MapPut("/restrictions/{id}/links", (string id, LinksInput input, HttpContext http, FormularyService svc, CancellationToken ct) =>
            Guard(async () => Results.Ok(new { changed = await svc.SetLinksAsync(id, input.ItemNos ?? [], http.User, ct) })));

        admin.MapGet("/analytics", async (int? days, FormularyService svc, CancellationToken ct) => Results.Ok(await svc.GetAnalyticsAsync(days ?? 30, ct)));
        admin.MapGet("/analytics/users/{userId}", async (string userId, int? days, FormularyService svc, CancellationToken ct) =>
            Results.Ok(await svc.GetUserEventsAsync(userId, days ?? 30, ct)));
        admin.MapGet("/audit", async (int? take, FormularyService svc, CancellationToken ct) => Results.Ok(await svc.GetAuditAsync(take ?? 200, ct)));
        admin.MapGet("/export.csv", async (FormularyService svc, CancellationToken ct) =>
            Results.File(Encoding.UTF8.GetBytes(await svc.ExportCsvAsync(ct)), "text/csv; charset=utf-8", $"hulool360-formulary-{DateTime.UtcNow:yyyy-MM-dd}.csv"));
        admin.MapGet("/export.json", async (FormularyService svc, CancellationToken ct) =>
            Results.Json(await svc.GetDatasetAsync(false, ct), contentType: "application/json", statusCode: 200));

        return root;
    }

    private static async Task<IResult> Guard(Func<Task<IResult>> action)
    {
        try { return await action(); }
        catch (FormularyValidationException ex) { return Results.BadRequest(new ProblemDto(ex.Message)); }
    }
}

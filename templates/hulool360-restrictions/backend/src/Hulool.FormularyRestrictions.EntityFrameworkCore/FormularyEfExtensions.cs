using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace Hulool.FormularyRestrictions.EntityFrameworkCore;

public static class FormularyEfExtensions
{
    /// <summary>
    /// Stores data with the module's own <see cref="FormularyDbContext"/>. Pass the same provider call you use for your
    /// main context, e.g. <c>o =&gt; o.UseSqlServer(connectionString)</c>, <c>o.UseNpgsql(...)</c> or <c>o.UseSqlite(...)</c>.
    /// Then call <see cref="MigrateFormularyRestrictionsAsync"/> at startup to create the tables.
    /// </summary>
    public static FormularyBuilder UseEntityFrameworkCore(this FormularyBuilder builder, Action<DbContextOptionsBuilder> configureDb)
    {
        builder.Services.AddDbContext<FormularyDbContext>(configureDb);
        builder.Services.RemoveAll<IFormularyStore>();
        builder.Services.AddScoped<IFormularyStore, EfFormularyStore<FormularyDbContext>>();
        return builder;
    }

    /// <summary>
    /// Stores data in your existing context. Add <c>modelBuilder.ApplyFormularyRestrictionsModel()</c> to its
    /// OnModelCreating and create the tables with your own migration (dotnet ef migrations add AddFormularyRestrictions).
    /// </summary>
    public static FormularyBuilder UseEntityFrameworkCore<TContext>(this FormularyBuilder builder) where TContext : DbContext
    {
        builder.Services.RemoveAll<IFormularyStore>();
        builder.Services.AddScoped<IFormularyStore, EfFormularyStore<TContext>>();
        return builder;
    }

    /// <summary>Applies the module's migration (creates its four tables) when using <see cref="FormularyDbContext"/>.</summary>
    public static async Task MigrateFormularyRestrictionsAsync(this IServiceProvider services, CancellationToken ct = default)
    {
        await using var scope = services.CreateAsyncScope();
        await scope.ServiceProvider.GetRequiredService<FormularyDbContext>().Database.MigrateAsync(ct);
    }
}

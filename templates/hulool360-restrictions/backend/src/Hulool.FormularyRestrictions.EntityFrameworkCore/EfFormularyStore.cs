using Microsoft.EntityFrameworkCore;

namespace Hulool.FormularyRestrictions.EntityFrameworkCore;

/// <summary>EF Core implementation of <see cref="IFormularyStore"/>. Works with any context whose model includes the module's tables.</summary>
public sealed class EfFormularyStore<TContext>(TContext db) : IFormularyStore where TContext : DbContext
{
    private DbSet<FormularyItem> Items => db.Set<FormularyItem>();
    private DbSet<FormularyRestriction> Restrictions => db.Set<FormularyRestriction>();
    private DbSet<FormularyUsageEvent> Usage => db.Set<FormularyUsageEvent>();
    private DbSet<FormularyAuditEntry> Audit => db.Set<FormularyAuditEntry>();

    private async Task SaveAsync(CancellationToken ct)
    {
        await db.SaveChangesAsync(ct);
        db.ChangeTracker.Clear();
    }

    public async Task<bool> HasDataAsync(CancellationToken ct) =>
        await Items.AnyAsync(ct) || await Restrictions.AnyAsync(ct);

    public async Task SeedAsync(IReadOnlyList<FormularyItem> items, IReadOnlyList<FormularyRestriction> restrictions, CancellationToken ct)
    {
        Restrictions.AddRange(restrictions);
        Items.AddRange(items);
        await SaveAsync(ct);
    }

    public async Task<IReadOnlyList<FormularyItem>> GetItemsAsync(CancellationToken ct) =>
        await Items.AsNoTracking().ToListAsync(ct);

    public async Task<IReadOnlyList<FormularyRestriction>> GetRestrictionsAsync(CancellationToken ct) =>
        await Restrictions.AsNoTracking().ToListAsync(ct);

    public Task<FormularyItem?> FindItemAsync(string itemNo, CancellationToken ct) =>
        Items.AsNoTracking().FirstOrDefaultAsync(i => i.ItemNo == itemNo, ct);

    public Task<FormularyRestriction?> FindRestrictionAsync(string id, CancellationToken ct) =>
        Restrictions.AsNoTracking().FirstOrDefaultAsync(r => r.Id == id, ct);

    public async Task SaveItemAsync(FormularyItem item, CancellationToken ct)
    {
        if (await Items.AnyAsync(i => i.ItemNo == item.ItemNo, ct)) Items.Update(item);
        else Items.Add(item);
        await SaveAsync(ct);
    }

    public async Task SaveRestrictionAsync(FormularyRestriction restriction, CancellationToken ct)
    {
        if (await Restrictions.AnyAsync(r => r.Id == restriction.Id, ct)) Restrictions.Update(restriction);
        else Restrictions.Add(restriction);
        await SaveAsync(ct);
    }

    public async Task AddUsageAsync(IReadOnlyList<FormularyUsageEvent> events, CancellationToken ct)
    {
        if (events.Count == 0) return;
        Usage.AddRange(events);
        await SaveAsync(ct);
    }

    public async Task<IReadOnlyList<FormularyUsageEvent>> GetUsageAsync(DateTime sinceUtc, string? userId, CancellationToken ct)
    {
        var q = Usage.AsNoTracking().Where(e => e.AtUtc >= sinceUtc);
        if (userId is not null) q = q.Where(e => e.UserId == userId);
        return await q.ToListAsync(ct);
    }

    public Task<int> PruneUsageAsync(DateTime olderThanUtc, CancellationToken ct) =>
        Usage.Where(e => e.AtUtc < olderThanUtc).ExecuteDeleteAsync(ct);

    public async Task AddAuditAsync(FormularyAuditEntry entry, CancellationToken ct)
    {
        Audit.Add(entry);
        await SaveAsync(ct);
    }

    public async Task<IReadOnlyList<FormularyAuditEntry>> GetAuditAsync(int take, CancellationToken ct) =>
        await Audit.AsNoTracking().OrderByDescending(a => a.AtUtc).Take(take).ToListAsync(ct);
}

using System.Text.Json;

namespace Hulool.FormularyRestrictions;

/// <summary>
/// Persistence used by the module. Two implementations ship:
/// <see cref="JsonFileFormularyStore"/> (no database; good for a single server or shared hosting) and
/// the Entity Framework Core store in Hulool.FormularyRestrictions.EntityFrameworkCore (SQL Server, PostgreSQL, SQLite).
/// </summary>
public interface IFormularyStore
{
    Task<bool> HasDataAsync(CancellationToken ct);
    Task SeedAsync(IReadOnlyList<FormularyItem> items, IReadOnlyList<FormularyRestriction> restrictions, CancellationToken ct);

    Task<IReadOnlyList<FormularyItem>> GetItemsAsync(CancellationToken ct);
    Task<IReadOnlyList<FormularyRestriction>> GetRestrictionsAsync(CancellationToken ct);
    Task<FormularyItem?> FindItemAsync(string itemNo, CancellationToken ct);
    Task<FormularyRestriction?> FindRestrictionAsync(string id, CancellationToken ct);
    Task SaveItemAsync(FormularyItem item, CancellationToken ct);
    Task SaveRestrictionAsync(FormularyRestriction restriction, CancellationToken ct);

    Task AddUsageAsync(IReadOnlyList<FormularyUsageEvent> events, CancellationToken ct);
    Task<IReadOnlyList<FormularyUsageEvent>> GetUsageAsync(DateTime sinceUtc, string? userId, CancellationToken ct);
    Task<int> PruneUsageAsync(DateTime olderThanUtc, CancellationToken ct);

    Task AddAuditAsync(FormularyAuditEntry entry, CancellationToken ct);
    Task<IReadOnlyList<FormularyAuditEntry>> GetAuditAsync(int take, CancellationToken ct);
}

/// <summary>
/// File-based store: formulary data in one JSON document, usage events in monthly JSON-lines files.
/// Safe for one application instance (it serialises writes with a lock). For web farms use the EF Core store.
/// </summary>
public sealed class JsonFileFormularyStore : IFormularyStore
{
    private sealed class Doc
    {
        public List<FormularyItem> Items { get; set; } = [];
        public List<FormularyRestriction> Restrictions { get; set; } = [];
        public List<FormularyAuditEntry> Audit { get; set; } = [];
    }

    private static readonly JsonSerializerOptions Json = new(JsonSerializerDefaults.Web);
    private readonly string _dir;
    private readonly string _dataFile;
    private readonly SemaphoreSlim _gate = new(1, 1);
    private Doc? _doc;

    public JsonFileFormularyStore(string directory)
    {
        _dir = directory;
        Directory.CreateDirectory(Path.Combine(_dir, "usage"));
        _dataFile = Path.Combine(_dir, "formulary-data.json");
    }

    private async Task<Doc> LoadAsync(CancellationToken ct)
    {
        if (_doc is not null) return _doc;
        if (File.Exists(_dataFile))
        {
            await using var s = File.OpenRead(_dataFile);
            _doc = await JsonSerializer.DeserializeAsync<Doc>(s, Json, ct) ?? new Doc();
        }
        else _doc = new Doc();
        return _doc;
    }

    private async Task PersistAsync(Doc doc, CancellationToken ct)
    {
        var tmp = _dataFile + ".tmp";
        await using (var s = File.Create(tmp))
            await JsonSerializer.SerializeAsync(s, doc, Json, ct);
        File.Move(tmp, _dataFile, overwrite: true);
    }

    private async Task<T> ReadAsync<T>(Func<Doc, T> read, CancellationToken ct)
    {
        await _gate.WaitAsync(ct);
        try { return read(await LoadAsync(ct)); }
        finally { _gate.Release(); }
    }

    private async Task WriteAsync(Action<Doc> change, CancellationToken ct)
    {
        await _gate.WaitAsync(ct);
        try
        {
            var doc = await LoadAsync(ct);
            change(doc);
            await PersistAsync(doc, ct);
        }
        finally { _gate.Release(); }
    }

    private static T Clone<T>(T value) => JsonSerializer.Deserialize<T>(JsonSerializer.Serialize(value, Json), Json)!;

    public Task<bool> HasDataAsync(CancellationToken ct) => ReadAsync(d => d.Items.Count > 0 || d.Restrictions.Count > 0, ct);

    public Task SeedAsync(IReadOnlyList<FormularyItem> items, IReadOnlyList<FormularyRestriction> restrictions, CancellationToken ct) =>
        WriteAsync(d => { d.Items = [.. items]; d.Restrictions = [.. restrictions]; }, ct);

    public Task<IReadOnlyList<FormularyItem>> GetItemsAsync(CancellationToken ct) =>
        ReadAsync<IReadOnlyList<FormularyItem>>(d => d.Items.Select(Clone).ToList(), ct);

    public Task<IReadOnlyList<FormularyRestriction>> GetRestrictionsAsync(CancellationToken ct) =>
        ReadAsync<IReadOnlyList<FormularyRestriction>>(d => d.Restrictions.Select(Clone).ToList(), ct);

    public Task<FormularyItem?> FindItemAsync(string itemNo, CancellationToken ct) =>
        ReadAsync(d => d.Items.FirstOrDefault(i => i.ItemNo == itemNo) is { } i ? Clone(i) : null, ct);

    public Task<FormularyRestriction?> FindRestrictionAsync(string id, CancellationToken ct) =>
        ReadAsync(d => d.Restrictions.FirstOrDefault(r => r.Id == id) is { } r ? Clone(r) : null, ct);

    public Task SaveItemAsync(FormularyItem item, CancellationToken ct) => WriteAsync(d =>
    {
        var i = d.Items.FindIndex(x => x.ItemNo == item.ItemNo);
        if (i >= 0) d.Items[i] = Clone(item); else d.Items.Add(Clone(item));
    }, ct);

    public Task SaveRestrictionAsync(FormularyRestriction restriction, CancellationToken ct) => WriteAsync(d =>
    {
        var i = d.Restrictions.FindIndex(x => x.Id == restriction.Id);
        if (i >= 0) d.Restrictions[i] = Clone(restriction); else d.Restrictions.Add(Clone(restriction));
    }, ct);

    private string UsageFile(DateTime utc) => Path.Combine(_dir, "usage", $"usage-{utc:yyyy-MM}.jsonl");

    public async Task AddUsageAsync(IReadOnlyList<FormularyUsageEvent> events, CancellationToken ct)
    {
        if (events.Count == 0) return;
        await _gate.WaitAsync(ct);
        try
        {
            foreach (var group in events.GroupBy(e => UsageFile(e.AtUtc)))
                await File.AppendAllLinesAsync(group.Key, group.Select(e => JsonSerializer.Serialize(e, Json)), ct);
        }
        finally { _gate.Release(); }
    }

    public async Task<IReadOnlyList<FormularyUsageEvent>> GetUsageAsync(DateTime sinceUtc, string? userId, CancellationToken ct)
    {
        var result = new List<FormularyUsageEvent>();
        await _gate.WaitAsync(ct);
        try
        {
            var first = new DateTime(sinceUtc.Year, sinceUtc.Month, 1, 0, 0, 0, DateTimeKind.Utc);
            for (var m = first; m <= DateTime.UtcNow; m = m.AddMonths(1))
            {
                var f = UsageFile(m);
                if (!File.Exists(f)) continue;
                foreach (var line in await File.ReadAllLinesAsync(f, ct))
                {
                    if (string.IsNullOrWhiteSpace(line)) continue;
                    FormularyUsageEvent? e;
                    try { e = JsonSerializer.Deserialize<FormularyUsageEvent>(line, Json); }
                    catch (JsonException) { continue; }
                    if (e is null || e.AtUtc < sinceUtc) continue;
                    if (userId is not null && e.UserId != userId) continue;
                    result.Add(e);
                }
            }
        }
        finally { _gate.Release(); }
        return result;
    }

    public async Task<int> PruneUsageAsync(DateTime olderThanUtc, CancellationToken ct)
    {
        await _gate.WaitAsync(ct);
        try
        {
            var cutoff = new DateTime(olderThanUtc.Year, olderThanUtc.Month, 1, 0, 0, 0, DateTimeKind.Utc);
            var removed = 0;
            foreach (var f in Directory.GetFiles(Path.Combine(_dir, "usage"), "usage-*.jsonl"))
            {
                var name = Path.GetFileNameWithoutExtension(f)[6..];
                if (DateTime.TryParseExact(name + "-01", "yyyy-MM-dd", null, System.Globalization.DateTimeStyles.AssumeUniversal | System.Globalization.DateTimeStyles.AdjustToUniversal, out var month) && month < cutoff)
                {
                    File.Delete(f);
                    removed++;
                }
            }
            return removed;
        }
        finally { _gate.Release(); }
    }

    public Task AddAuditAsync(FormularyAuditEntry entry, CancellationToken ct) => WriteAsync(d =>
    {
        d.Audit.Add(entry);
        if (d.Audit.Count > 5000) d.Audit.RemoveRange(0, d.Audit.Count - 5000);
    }, ct);

    public Task<IReadOnlyList<FormularyAuditEntry>> GetAuditAsync(int take, CancellationToken ct) =>
        ReadAsync<IReadOnlyList<FormularyAuditEntry>>(d => d.Audit.OrderByDescending(a => a.AtUtc).Take(take).ToList(), ct);
}

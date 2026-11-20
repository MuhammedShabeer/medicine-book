using System.Globalization;
using System.Reflection;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace Hulool.FormularyRestrictions;

public sealed class FormularyOptions
{
    /// <summary>Route prefix for every endpoint. Default "/api/formulary-restrictions".</summary>
    public string RoutePrefix { get; set; } = "/api/formulary-restrictions";
    /// <summary>Authorization policy required for admin endpoints. Created automatically from <see cref="AdminRoles"/> unless the host defines it.</summary>
    public string AdminPolicy { get; set; } = "FormularyAdmin";
    /// <summary>Roles that satisfy the admin policy (used only when the module creates the policy).</summary>
    public string[] AdminRoles { get; set; } = ["Admin", "SystemAdmin", "FormularyAdmin"];
    /// <summary>When true, reading the dataset needs any signed-in user. Default true.</summary>
    public bool RequireSignedInUserForReads { get; set; } = true;
    /// <summary>Usage events older than this are deleted automatically. Default 365 days.</summary>
    public int UsageRetentionDays { get; set; } = 365;
    /// <summary>Claim types tried, in order, for the user id and display name.</summary>
    public string[] UserIdClaimTypes { get; set; } = [ClaimTypes.NameIdentifier, "sub", "uid", "userId"];
    public string[] UserNameClaimTypes { get; set; } = ["name", ClaimTypes.Name, "unique_name", "preferred_username", ClaimTypes.Email, "email"];
    /// <summary>Seed the store from the embedded HMC lists on first start. Default true.</summary>
    public bool SeedOnStartup { get; set; } = true;
}

/// <summary>
/// Optional bridge into Hulool 360°'s existing User Analytics activity log.
/// Register your own implementation to copy each formulary search and look-up into it.
/// </summary>
public interface IFormularyActivitySink
{
    Task OnUsageAsync(FormularyUsageEvent usage, CancellationToken ct);
}

internal sealed class NoActivitySink : IFormularyActivitySink
{
    public Task OnUsageAsync(FormularyUsageEvent usage, CancellationToken ct) => Task.CompletedTask;
}

public sealed class FormularyValidationException(string message) : Exception(message);

public sealed class FormularyService(IFormularyStore store, IEnumerable<IFormularyActivitySink> sinks, FormularyOptions options)
{
    private static readonly Regex ItemNoRx = new("^[A-Za-z0-9-]{3,40}$", RegexOptions.Compiled);
    private static readonly Regex UomRx = new("^[A-Za-z]{1,10}$", RegexOptions.Compiled);
    private static readonly Regex IdRx = new("^[A-Za-z0-9_-]{1,40}$", RegexOptions.Compiled);
    private static DateTime _lastPrune = DateTime.MinValue;

    // ---------- identity ----------
    public (string Id, string Name) WhoIs(ClaimsPrincipal user)
    {
        string? Find(string[] types) => types.Select(t => user.FindFirst(t)?.Value).FirstOrDefault(v => !string.IsNullOrWhiteSpace(v));
        var id = Find(options.UserIdClaimTypes) ?? user.Identity?.Name ?? "anonymous";
        var name = Find(options.UserNameClaimTypes) ?? id;
        return (Trim(id, 120), Trim(name, 160));
    }

    private static string Trim(string? s, int max) => string.IsNullOrEmpty(s) ? "" : (s.Length <= max ? s : s[..max]);
    private static string? TrimOrNull(string? s, int max) => string.IsNullOrWhiteSpace(s) ? null : Trim(s.Trim(), max);

    // ---------- seeding ----------
    private sealed record SeedFile(string Source, List<SeedItem> Items, List<SeedRestriction> Restrictions);
    private sealed record SeedItem(string ItemNo, string Name, string Uom, string? RestrictionId, bool QatariOnly, string? QatariWording, string? QatariExceptions);
    private sealed record SeedRestriction(string Id, string Generic, string Status, string Wording, string Type, string[] Conditions, string[] Specialties, string Approved, string Available);

    public const string SourceNote = "HMC Formulary list (30 Dec 2024); HMC Formulary Restrictions register (1 Jan 2025); HMC list of items restricted to Qatari patients (1 Jan 2025)";

    public async Task<bool> SeedIfEmptyAsync(CancellationToken ct)
    {
        if (await store.HasDataAsync(ct)) return false;
        var asm = typeof(FormularyService).Assembly;
        await using var s = asm.GetManifestResourceStream("Hulool.FormularyRestrictions.Seed.formulary-seed.json")
            ?? throw new InvalidOperationException("Embedded seed data is missing.");
        var seed = await JsonSerializer.DeserializeAsync<SeedFile>(s, new JsonSerializerOptions(JsonSerializerDefaults.Web), ct)
            ?? throw new InvalidOperationException("Embedded seed data could not be read.");
        var now = DateTime.UtcNow;
        var items = seed.Items.Select(i => new FormularyItem
        {
            ItemNo = i.ItemNo, Name = i.Name, Uom = i.Uom, RestrictionId = i.RestrictionId,
            QatariOnly = i.QatariOnly, QatariWording = i.QatariWording, QatariExceptions = i.QatariExceptions,
            Source = "seed", UpdatedAtUtc = now,
        }).ToList();
        var restrictions = seed.Restrictions.Select(r => new FormularyRestriction
        {
            Id = r.Id, Generic = r.Generic, Status = r.Status, Wording = r.Wording, Type = r.Type,
            Conditions = FormularyVocabulary.Join(r.Conditions), Specialties = FormularyVocabulary.Join(r.Specialties),
            Approved = r.Approved, Available = r.Available, Source = "seed", UpdatedAtUtc = now,
        }).ToList();
        await store.SeedAsync(items, restrictions, ct);
        return true;
    }

    // ---------- reads ----------
    /// <summary>Some databases return DateTime without a kind; everything stored here is UTC.</summary>
    internal static DateTime Utc(DateTime d) => d.Kind == DateTimeKind.Utc ? d : DateTime.SpecifyKind(d, DateTimeKind.Utc);
    public static ItemDto ToDto(FormularyItem i) => new(i.ItemNo, i.Name, i.Uom, i.RestrictionId, i.QatariOnly, i.QatariWording, i.QatariExceptions, i.IsDeleted, i.Source, Utc(i.UpdatedAtUtc));
    public static RestrictionDto ToDto(FormularyRestriction r) => new(r.Id, r.Generic, r.Status, r.Wording, r.Type,
        FormularyVocabulary.Split(r.Conditions), FormularyVocabulary.Split(r.Specialties), r.Approved, r.Available, r.IsDeleted, r.Source, Utc(r.UpdatedAtUtc));

    public async Task<DatasetDto> GetDatasetAsync(bool includeDeleted, CancellationToken ct)
    {
        var items = await store.GetItemsAsync(ct);
        var restrictions = await store.GetRestrictionsAsync(ct);
        var latest = items.Select(i => Utc(i.UpdatedAtUtc)).Concat(restrictions.Select(r => Utc(r.UpdatedAtUtc))).DefaultIfEmpty(DateTime.MinValue).Max();
        var version = $"{latest.Ticks:x}-{items.Count:x}-{restrictions.Count:x}";
        return new DatasetDto(version, SourceNote,
            items.Where(i => includeDeleted || !i.IsDeleted).OrderBy(i => i.Name, StringComparer.OrdinalIgnoreCase).Select(ToDto).ToList(),
            restrictions.Where(r => includeDeleted || !r.IsDeleted).OrderBy(r => r.Generic, StringComparer.OrdinalIgnoreCase).Select(ToDto).ToList());
    }

    // ---------- admin writes ----------
    private async Task AuditAsync(ClaimsPrincipal user, string action, string kind, string key, string label, CancellationToken ct)
    {
        var (id, name) = WhoIs(user);
        await store.AddAuditAsync(new FormularyAuditEntry
        {
            Id = Guid.NewGuid(), AtUtc = DateTime.UtcNow, UserId = id, UserName = name,
            Action = action, Kind = kind, Key = key, Label = Trim(label, 200),
        }, ct);
    }

    public async Task<ItemDto> SaveItemAsync(string itemNo, ItemInput input, ClaimsPrincipal user, CancellationToken ct)
    {
        itemNo = (itemNo ?? "").Trim();
        if (!ItemNoRx.IsMatch(itemNo)) throw new FormularyValidationException("Item number must be 3 to 40 letters, digits or hyphens.");
        var name = Regex.Replace(input.Name ?? "", @"\s+", " ").Trim();
        if (name.Length is < 2 or > 300) throw new FormularyValidationException("Enter the medicine name (2 to 300 characters).");
        var uom = (input.Uom ?? "").Trim().ToUpperInvariant();
        if (!UomRx.IsMatch(uom)) throw new FormularyValidationException("Unit of measure must be 1 to 10 letters, for example TAB or VIA.");
        var rid = string.IsNullOrWhiteSpace(input.RestrictionId) ? null : input.RestrictionId.Trim();
        if (rid is not null && await store.FindRestrictionAsync(rid, ct) is null)
            throw new FormularyValidationException("The selected restriction entry does not exist.");
        if (input.QatariOnly && string.IsNullOrWhiteSpace(input.QatariWording))
            throw new FormularyValidationException("Enter the Qatari-only restriction wording, or untick Qatari patients only.");

        var existing = await store.FindItemAsync(itemNo, ct);
        var (uid, _) = WhoIs(user);
        var item = existing ?? new FormularyItem { ItemNo = itemNo };
        item.Name = name; item.Uom = uom; item.RestrictionId = rid;
        item.QatariOnly = input.QatariOnly;
        item.QatariWording = input.QatariOnly ? TrimOrNull(input.QatariWording, 4000) : null;
        item.QatariExceptions = input.QatariOnly ? TrimOrNull(input.QatariExceptions, 2000) : null;
        item.IsDeleted = false; item.Source = "admin"; item.UpdatedAtUtc = DateTime.UtcNow; item.UpdatedBy = uid;
        await store.SaveItemAsync(item, ct);
        await AuditAsync(user, existing is null ? "Added medicine" : existing.IsDeleted ? "Restored medicine" : "Edited medicine", "medicine", itemNo, name, ct);
        return ToDto(item);
    }

    public async Task<ItemDto?> SetItemDeletedAsync(string itemNo, bool deleted, ClaimsPrincipal user, CancellationToken ct)
    {
        var item = await store.FindItemAsync(itemNo, ct);
        if (item is null) return null;
        if (item.IsDeleted == deleted) return ToDto(item);
        item.IsDeleted = deleted; item.Source = "admin"; item.UpdatedAtUtc = DateTime.UtcNow; item.UpdatedBy = WhoIs(user).Id;
        await store.SaveItemAsync(item, ct);
        await AuditAsync(user, deleted ? "Removed medicine" : "Restored medicine", "medicine", itemNo, item.Name, ct);
        return ToDto(item);
    }

    public async Task<RestrictionDto> SaveRestrictionAsync(string? id, RestrictionInput input, ClaimsPrincipal user, CancellationToken ct)
    {
        var generic = Regex.Replace(input.Generic ?? "", @"\s+", " ").Trim();
        if (generic.Length is < 2 or > 200) throw new FormularyValidationException("Enter the generic name (2 to 200 characters).");
        var wording = (input.Wording ?? "").Replace("\r\n", "\n").Trim();
        if (wording.Length is < 5 or > 20000) throw new FormularyValidationException("Enter the register wording (at least 5 characters).");
        var type = (input.Type ?? "").Trim();
        if (!FormularyVocabulary.RestrictionTypes.Contains(type)) throw new FormularyValidationException("Choose a valid restriction type.");
        var conditions = (input.Conditions ?? []).Where(c => FormularyVocabulary.Conditions.Contains(c)).ToArray();
        var specialties = (input.Specialties ?? []).Select(s => Trim(s?.Trim(), 80)).Where(s => s.Length > 0).ToArray();

        FormularyRestriction? existing = null;
        if (id is not null)
        {
            if (!IdRx.IsMatch(id)) throw new FormularyValidationException("Invalid restriction id.");
            existing = await store.FindRestrictionAsync(id, ct);
        }
        var r = existing ?? new FormularyRestriction { Id = id ?? ("n" + DateTime.UtcNow.Ticks.ToString("x", CultureInfo.InvariantCulture)) };
        r.Generic = generic; r.Status = Trim(input.Status?.Trim(), 80); r.Wording = wording; r.Type = type;
        r.Conditions = FormularyVocabulary.Join(conditions); r.Specialties = FormularyVocabulary.Join(specialties);
        r.Approved = Trim(input.Approved?.Trim(), 60); r.Available = Trim(input.Available?.Trim(), 60);
        r.IsDeleted = false; r.Source = "admin"; r.UpdatedAtUtc = DateTime.UtcNow; r.UpdatedBy = WhoIs(user).Id;
        await store.SaveRestrictionAsync(r, ct);
        await AuditAsync(user, existing is null ? "Added restriction" : "Edited restriction", "restriction", r.Id, generic, ct);
        return ToDto(r);
    }

    public async Task<RestrictionDto?> SetRestrictionDeletedAsync(string id, bool deleted, ClaimsPrincipal user, CancellationToken ct)
    {
        var r = await store.FindRestrictionAsync(id, ct);
        if (r is null) return null;
        if (r.IsDeleted == deleted) return ToDto(r);
        r.IsDeleted = deleted; r.Source = "admin"; r.UpdatedAtUtc = DateTime.UtcNow; r.UpdatedBy = WhoIs(user).Id;
        await store.SaveRestrictionAsync(r, ct);
        await AuditAsync(user, deleted ? "Removed restriction" : "Restored restriction", "restriction", id, r.Generic, ct);
        return ToDto(r);
    }

    /// <summary>Makes exactly <paramref name="itemNos"/> point at restriction <paramref name="id"/>; items previously linked but not listed are unlinked.</summary>
    public async Task<int> SetLinksAsync(string id, string[] itemNos, ClaimsPrincipal user, CancellationToken ct)
    {
        var r = await store.FindRestrictionAsync(id, ct) ?? throw new FormularyValidationException("Restriction entry not found.");
        var wanted = itemNos.Select(n => n.Trim()).Where(n => n.Length > 0).ToHashSet(StringComparer.Ordinal);
        var items = await store.GetItemsAsync(ct);
        var missing = wanted.Except(items.Select(i => i.ItemNo)).ToList();
        if (missing.Count > 0) throw new FormularyValidationException($"Unknown item numbers: {string.Join(", ", missing.Take(5))}.");
        var uid = WhoIs(user).Id;
        var changed = 0;
        foreach (var item in items)
        {
            var should = wanted.Contains(item.ItemNo);
            var linked = item.RestrictionId == id;
            if (should == linked) continue;
            item.RestrictionId = should ? id : null;
            item.Source = "admin"; item.UpdatedAtUtc = DateTime.UtcNow; item.UpdatedBy = uid;
            await store.SaveItemAsync(item, ct);
            await AuditAsync(user, should ? "Linked medicine" : "Unlinked medicine", "medicine", item.ItemNo, $"{item.Name} → {r.Generic}", ct);
            changed++;
        }
        return changed;
    }

    // ---------- usage ----------
    public async Task<int> RecordUsageAsync(UsageEventInput[] events, ClaimsPrincipal user, CancellationToken ct)
    {
        var (id, name) = WhoIs(user);
        var now = DateTime.UtcNow;
        var rows = events.Take(200)
            .Where(e => e.Type is not null && FormularyVocabulary.EventTypes.Contains(e.Type))
            .Select(e => new FormularyUsageEvent
            {
                Id = Guid.NewGuid(),
                // accept client timestamps (offline queue) but never from the future or older than 7 days
                AtUtc = e.AtUtc is { } t && t.ToUniversalTime() <= now && t.ToUniversalTime() > now.AddDays(-7) ? t.ToUniversalTime() : now,
                UserId = id, UserName = name, Type = e.Type!,
                Term = TrimOrNull(e.Term?.ToLowerInvariant(), 120), ZeroResult = e.ZeroResult,
                ItemNo = TrimOrNull(e.ItemNo, 40), RestrictionType = TrimOrNull(e.RestrictionType, 20), Detail = TrimOrNull(e.Detail, 200),
            }).ToList();
        await store.AddUsageAsync(rows, ct);
        foreach (var row in rows)
            foreach (var sink in sinks)
                await sink.OnUsageAsync(row, ct);
        if ((now - _lastPrune).TotalHours > 24)
        {
            _lastPrune = now;
            await store.PruneUsageAsync(now.AddDays(-Math.Max(30, options.UsageRetentionDays)), ct);
        }
        return rows.Count;
    }

    public async Task<AnalyticsDto> GetAnalyticsAsync(int days, CancellationToken ct)
    {
        days = Math.Clamp(days, 1, 366);
        var since = DateTime.UtcNow.Date.AddDays(-(days - 1));
        var ev = (await store.GetUsageAsync(since, null, ct)).Select(e => { e.AtUtc = Utc(e.AtUtc); return e; }).ToList();
        static List<CountDto> Top(IEnumerable<string?> keys, int n) => keys.Where(k => !string.IsNullOrEmpty(k))
            .GroupBy(k => k!).Select(g => new CountDto(g.Key, g.Count())).OrderByDescending(c => c.Count).ThenBy(c => c.Key).Take(n).ToList();
        var searches = ev.Where(e => e.Type == "search").ToList();
        var views = ev.Where(e => e.Type == "view").ToList();
        var daily = Enumerable.Range(0, days).Select(i => since.AddDays(i)).Select(d =>
        {
            var dayEv = ev.Where(e => e.AtUtc.Date == d).ToList();
            return new DayDto(d.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture), dayEv.Count(e => e.Type == "search"), dayEv.Count(e => e.Type == "view"), dayEv.Select(e => e.UserId).Distinct().Count());
        }).ToList();
        var users = ev.GroupBy(e => e.UserId).Select(g => new UserUsageDto(g.Key, g.OrderByDescending(e => e.AtUtc).First().UserName,
            g.Count(e => e.Type == "search"), g.Count(e => e.Type == "view"), g.Count(e => e.Type == "search" && e.ZeroResult), g.Max(e => e.AtUtc)))
            .OrderByDescending(u => u.Searches + u.Views).ToList();
        return new AnalyticsDto(days, since, searches.Count, views.Count, searches.Count(e => e.ZeroResult), users.Count, daily,
            Top(searches.Select(e => e.Term), 15), Top(searches.Where(e => e.ZeroResult).Select(e => e.Term), 15),
            Top(views.Select(e => e.ItemNo), 15), Top(views.Select(e => e.RestrictionType ?? "free"), 10),
            Top(ev.Where(e => e.Type == "filter").Select(e => e.Detail), 12), users);
    }

    public async Task<IReadOnlyList<UserEventDto>> GetUserEventsAsync(string userId, int days, CancellationToken ct)
    {
        var since = DateTime.UtcNow.Date.AddDays(-(Math.Clamp(days, 1, 366) - 1));
        var ev = await store.GetUsageAsync(since, userId, ct);
        return ev.OrderByDescending(e => e.AtUtc).Take(1000).Select(e => new UserEventDto(Utc(e.AtUtc), e.Type, e.Term, e.ZeroResult, e.ItemNo, e.Detail)).ToList();
    }

    public async Task<IReadOnlyList<AuditDto>> GetAuditAsync(int take, CancellationToken ct) =>
        (await store.GetAuditAsync(Math.Clamp(take, 1, 1000), ct)).Select(a => new AuditDto(Utc(a.AtUtc), a.UserId, a.UserName, a.Action, a.Kind, a.Key, a.Label)).ToList();

    // ---------- export ----------
    private static readonly Dictionary<string, string> TypeLabels = new()
    {
        ["ams"] = "ID / antimicrobial", ["init"] = "Initial prescribing", ["spec"] = "Specialty or team",
        ["senior"] = "Consultant or specialist", ["note"] = "Approval record",
    };

    public async Task<string> ExportCsvAsync(CancellationToken ct)
    {
        var data = await GetDatasetAsync(false, ct);
        var rmap = data.Restrictions.ToDictionary(r => r.Id);
        static string Q(string? v) => "\"" + (v ?? "").Replace("\"", "\"\"") + "\"";
        var sb = new StringBuilder("﻿Item No,Medicine,UOM,Restriction type,Generic (register),Conditions,Specialties,Register wording,Qatari only,Qatari-only wording,Exceptions\r\n");
        foreach (var i in data.Items)
        {
            rmap.TryGetValue(i.RestrictionId ?? "", out var r);
            var type = r is not null ? TypeLabels.GetValueOrDefault(r.Type, r.Type) : i.QatariOnly ? "Qatari patients only" : "No restriction listed";
            sb.AppendJoin(',', Q(i.ItemNo), Q(i.Name), Q(i.Uom), Q(type), Q(r?.Generic), Q(r is null ? "" : string.Join("; ", r.Conditions)),
                Q(r is null ? "" : string.Join("; ", r.Specialties)), Q(r?.Wording), Q(i.QatariOnly ? "Yes" : "No"), Q(i.QatariWording), Q(i.QatariExceptions));
            sb.Append("\r\n");
        }
        return sb.ToString();
    }
}

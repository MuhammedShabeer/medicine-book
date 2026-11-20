namespace Hulool.FormularyRestrictions;

/// <summary>A formulary item (one row of the HMC formulary list).</summary>
public sealed class FormularyItem
{
    public string ItemNo { get; set; } = "";
    public string Name { get; set; } = "";
    public string Uom { get; set; } = "";
    /// <summary>Id of the linked restriction entry, or null when none is linked.</summary>
    public string? RestrictionId { get; set; }
    public bool QatariOnly { get; set; }
    public string? QatariWording { get; set; }
    public string? QatariExceptions { get; set; }
    public bool IsDeleted { get; set; }
    /// <summary>"seed" for rows loaded from the source lists, "admin" for rows created or changed by an admin.</summary>
    public string Source { get; set; } = "seed";
    public DateTime UpdatedAtUtc { get; set; }
    public string? UpdatedBy { get; set; }
}

/// <summary>A restriction-register entry.</summary>
public sealed class FormularyRestriction
{
    public string Id { get; set; } = "";
    public string Generic { get; set; } = "";
    public string Status { get; set; } = "";
    /// <summary>The approved wording, kept verbatim. One update per line.</summary>
    public string Wording { get; set; } = "";
    /// <summary>One of: ams, init, spec, senior, note.</summary>
    public string Type { get; set; } = "note";
    /// <summary>Semicolon-separated condition flags: qatari, cd, nominated, form, criteria, consultant.</summary>
    public string Conditions { get; set; } = "";
    /// <summary>Semicolon-separated specialty names.</summary>
    public string Specialties { get; set; } = "";
    public string Approved { get; set; } = "";
    public string Available { get; set; } = "";
    public bool IsDeleted { get; set; }
    public string Source { get; set; } = "seed";
    public DateTime UpdatedAtUtc { get; set; }
    public string? UpdatedBy { get; set; }
}

/// <summary>One usage event (search, look-up or filter) recorded for per-user traceability.</summary>
public sealed class FormularyUsageEvent
{
    public Guid Id { get; set; }
    public DateTime AtUtc { get; set; }
    public string UserId { get; set; } = "";
    public string UserName { get; set; } = "";
    /// <summary>search, view or filter.</summary>
    public string Type { get; set; } = "";
    public string? Term { get; set; }
    public bool ZeroResult { get; set; }
    public string? ItemNo { get; set; }
    public string? RestrictionType { get; set; }
    public string? Detail { get; set; }
}

/// <summary>One admin change, for the change log.</summary>
public sealed class FormularyAuditEntry
{
    public Guid Id { get; set; }
    public DateTime AtUtc { get; set; }
    public string UserId { get; set; } = "";
    public string UserName { get; set; } = "";
    public string Action { get; set; } = "";
    public string Kind { get; set; } = "";
    public string Key { get; set; } = "";
    public string Label { get; set; } = "";
}

public static class FormularyVocabulary
{
    public static readonly string[] RestrictionTypes = ["ams", "init", "spec", "senior", "note"];
    public static readonly string[] Conditions = ["qatari", "cd", "nominated", "form", "criteria", "consultant"];
    public static readonly string[] EventTypes = ["search", "view", "filter"];

    public static string Join(IEnumerable<string>? values) =>
        string.Join(';', (values ?? []).Select(v => v.Trim()).Where(v => v.Length > 0).Distinct());

    public static string[] Split(string? value) =>
        string.IsNullOrWhiteSpace(value) ? [] : value.Split(';', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
}

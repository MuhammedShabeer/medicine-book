namespace Hulool.FormularyRestrictions;

public sealed record ItemDto(
    string ItemNo, string Name, string Uom, string? RestrictionId,
    bool QatariOnly, string? QatariWording, string? QatariExceptions,
    bool IsDeleted, string Source, DateTime UpdatedAtUtc);

public sealed record RestrictionDto(
    string Id, string Generic, string Status, string Wording, string Type,
    string[] Conditions, string[] Specialties, string Approved, string Available,
    bool IsDeleted, string Source, DateTime UpdatedAtUtc);

public sealed record DatasetDto(string Version, string SourceNote, IReadOnlyList<ItemDto> Items, IReadOnlyList<RestrictionDto> Restrictions);

public sealed record ItemInput(string? Name, string? Uom, string? RestrictionId, bool QatariOnly, string? QatariWording, string? QatariExceptions);

public sealed record RestrictionInput(
    string? Generic, string? Status, string? Wording, string? Type,
    string[]? Conditions, string[]? Specialties, string? Approved, string? Available);

public sealed record LinksInput(string[]? ItemNos);

public sealed record UsageEventInput(string? Type, string? Term, bool ZeroResult, string? ItemNo, string? RestrictionType, string? Detail, DateTime? AtUtc);

public sealed record UsageBatch(UsageEventInput[]? Events);

public sealed record CountDto(string Key, int Count);

public sealed record DayDto(string Date, int Searches, int Views, int Users);

public sealed record UserUsageDto(string UserId, string UserName, int Searches, int Views, int ZeroResults, DateTime LastSeenUtc);

public sealed record AnalyticsDto(
    int Days, DateTime SinceUtc, int Searches, int Views, int ZeroResults, int ActiveUsers,
    IReadOnlyList<DayDto> Daily,
    IReadOnlyList<CountDto> TopTerms, IReadOnlyList<CountDto> ZeroResultTerms,
    IReadOnlyList<CountDto> TopItems, IReadOnlyList<CountDto> ViewsByRestrictionType,
    IReadOnlyList<CountDto> Filters, IReadOnlyList<UserUsageDto> Users);

public sealed record UserEventDto(DateTime AtUtc, string Type, string? Term, bool ZeroResult, string? ItemNo, string? Detail);

public sealed record AuditDto(DateTime AtUtc, string UserId, string UserName, string Action, string Kind, string Key, string Label);

public sealed record ProblemDto(string Error);

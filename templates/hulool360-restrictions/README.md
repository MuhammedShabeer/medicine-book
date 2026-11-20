# Hulool 360° · Restrictions module

A drop-in module for Hulool 360° (React 19 + Vite, ASP.NET Core 8, EF Core 8, JWT/RBAC). It contains:

- **Search screen** ("Who can prescribe it?") with an instant answer card, keyboard navigation, spelling-tolerant search, pinned and recent items, deep links, and a layout for both PC and phone.
- **Admin workspace** with per-user usage analytics, add/edit/remove medicines and restrictions (no coding), a change log, and CSV/JSON export.
- **Data** from the HMC Formulary list (30 Dec 2024, 2,127 items), the HMC Formulary Restrictions register (1 Jan 2025, 397 entries) and the list of items restricted to Qatari patients (1 Jan 2025, 66 items). These are seeded into your database on first start.

```
backend/
  src/Hulool.FormularyRestrictions/                     API endpoints, validation, analytics, seeding (no extra NuGet packages)
  src/Hulool.FormularyRestrictions.EntityFrameworkCore/ EF Core storage + migration (SQL Server, PostgreSQL, SQLite)
  samples/SampleHost/                                   runnable demo host (development sign-in only)
frontend/
  src/modules/formulary-restrictions/                   the React module: copy this folder into Hulool
  src/demo/                                             demo shell used for testing
brand/                                                  Restrictions logo: app icon (SVG + PNG 512/192/96/48) and white mark for dark headers
tests/e2e_playwright.py                                 the end-to-end test suite used before delivery
```

**Logo.** A medicine capsule held inside a protective shield, with a padlock for access-controlled prescribing, on the Hulool maroon, plum and teal gradient. Use `brand/restrictions-app-icon-*.png` for the Hulool menu tile or home-screen icon, and `brand/restrictions-mark-white.svg` on coloured backgrounds. The same mark is built into the module's header.

---

## 1. Try it first (5 minutes)

Requires the .NET 8 SDK. Node is only needed if you want to rebuild the front end.

```bash
cd backend/samples/SampleHost
dotnet run --urls http://localhost:5080
```

Open `http://localhost:5080/?as=pharmacist` or `http://localhost:5080/?as=admin`. The bar at the top switches between demo users. The demo stores data under `App_Data/formulary` (delete that folder to reset).

> The sample host signs users in from `X-Dev-User` / `X-Dev-Roles` headers. That is for local testing only: never deploy SampleHost.

**No .NET installed?** `cd frontend && npm install && npm run build:demo`, then serve `frontend/dist-demo` with any static web server (for example `npx vite preview -c vite.demo.config.js`; copy `formulary-seed.json` from `backend/src/Hulool.FormularyRestrictions/Seed` into `dist-demo` first). This browser-only demo runs the same module against a simulated server (`src/demo/mockServer.js`), keeping data in the browser. It is for demonstration only.

---

## 2. Backend integration (Hulool API project)

### 2.1 Add the projects

Copy both folders from `backend/src` into your solution, then:

```bash
dotnet sln add backend/src/Hulool.FormularyRestrictions/Hulool.FormularyRestrictions.csproj
dotnet sln add backend/src/Hulool.FormularyRestrictions.EntityFrameworkCore/Hulool.FormularyRestrictions.EntityFrameworkCore.csproj
dotnet add <YourApi>.csproj reference backend/src/Hulool.FormularyRestrictions.EntityFrameworkCore/Hulool.FormularyRestrictions.EntityFrameworkCore.csproj
```

The EF project targets `Microsoft.EntityFrameworkCore.Relational` 8.0.11. If your API uses a different 8.0.x patch, set the same version in its `.csproj` so the two match.

### 2.2 Program.cs

```csharp
using Hulool.FormularyRestrictions;
using Hulool.FormularyRestrictions.EntityFrameworkCore;

// ... your existing AddAuthentication().AddJwtBearer(...) and AddAuthorization() stay as they are

builder.Services
    .AddFormularyRestrictions(o =>
    {
        o.AdminRoles = ["Admin", "SystemAdmin"];          // roles in your JWT that may edit and see analytics
        // o.RoutePrefix = "/api/formulary-restrictions"; // default
    })
    .UseEntityFrameworkCore(db => db.UseSqlServer(builder.Configuration.GetConnectionString("Default")));
    //                             db.UseNpgsql(...)  or  db.UseSqlite(...)  — same provider package you already use

builder.Services.AddResponseCompression(o => o.EnableForHttps = true); // recommended: dataset ~700 KB → ~110 KB

var app = builder.Build();

await app.Services.MigrateFormularyRestrictionsAsync();   // creates 4 tables (first run only)
await app.Services.InitializeFormularyRestrictionsAsync(); // seeds the HMC lists if the tables are empty

app.UseResponseCompression();
app.UseAuthentication();
app.UseAuthorization();
app.MapFormularyRestrictions();
```

Tables created: `FormularyItems`, `FormularyRestrictions`, `FormularyUsageEvents`, `FormularyAuditLog`. The migration hard-codes no column types, so SQL Server, PostgreSQL and SQLite each use their own types.

**Prefer one DbContext?** Instead of `UseEntityFrameworkCore(db => ...)`, add `modelBuilder.ApplyFormularyRestrictionsModel();` to your context's `OnModelCreating`, then call `.UseEntityFrameworkCore<YourDbContext>()`. Create the tables with your own migration (`dotnet ef migrations add AddFormularyRestrictions`), and skip `MigrateFormularyRestrictionsAsync`.

**Shared hosting with no database?** Use `.UseJsonFileStore(Path.Combine(builder.Environment.ContentRootPath, "App_Data", "formulary"))`. This suits a single server instance.

### 2.3 Users and roles

- The user id is read from the first claim present among `nameidentifier`, `sub`, `uid` and `userId`. The display name comes from `name`, `unique_name`, `preferred_username` or `email`. Change these with `o.UserIdClaimTypes` / `o.UserNameClaimTypes`.
- Admin access uses the policy `FormularyAdmin`. The module creates it from `o.AdminRoles` unless you define a policy with that name first.
- Every endpoint requires a signed-in user. Only the admin endpoints need the admin policy.

### 2.4 Analytics go to Hulool 360°'s own Analytics screen

The module has **no separate analytics dashboard** when it is connected to Hulool. Every event is sent to Hulool's existing User Analytics activity log (User · Action · Details · Time). There are two ways to connect it. Use **one** of them.

**A. Front end (recommended, no backend code).** Pass Hulool's own logger as `onActivity` (see section 3). The module calls it for every event:

| Action | Details (example) |
|---|---|
| `Restrictions search` | `“linezolid” — 2 results` / `“qqzzxy” — no result` |
| `Restrictions look-up` | `LINEZOLID 2MG/1ML 300ML I.V. INF. (#8900003321) — ID / antimicrobial` |
| `Restrictions filter` | `Specialty: Infectious diseases` |
| `Restrictions admin` | `Medicine added: … (#…)`, `Restriction saved: … (3 linked items)`, `Medicine removed: …` |

The event object is `{ module, action, details, data, at }`. `data` holds structured fields (term, resultCount, zeroResult, itemNo, restrictionType…) if your log stores them. Searches are recorded once the typing stops (1.5 s) or a result is opened, so each keystroke does not create a row. If your logger throws an error, the module ignores it.

**B. Back end.** Keep `moduleAnalytics` on and add a sink. The module then posts events to `/usage`, and the sink writes each one into your activity log on the server:

```csharp
public sealed class HuloolActivitySink(AppDbContext db) : IFormularyActivitySink
{
    public async Task OnUsageAsync(FormularyUsageEvent e, CancellationToken ct)
    {
        db.ActivityLogs.Add(new ActivityLog
        {
            UserId = e.UserId,
            Action = e.Type == "view" ? "Restrictions look-up" : e.Type == "search" ? "Restrictions search" : "Restrictions filter",
            Details = e.Type == "view" ? e.ItemNo : e.Type == "search" ? e.Term : e.Detail,
            Time = e.AtUtc,
        });
        await db.SaveChangesAsync(ct);
    }
}
// registration:
builder.Services.AddFormularyRestrictions(...).UseEntityFrameworkCore(...).AddActivitySink<HuloolActivitySink>();
```

Rename `ActivityLog` and its fields to match your entity. Admin changes are always kept in the module's own change log (Admin → Change log), whichever option you choose.

### 2.5 API on a different origin?

If the API is not on the same origin as the web app, your CORS policy must expose the ETag header: `.WithExposedHeaders("ETag")`. This lets the app skip downloading the dataset when nothing has changed.

---

## 3. Front-end integration (Hulool React app)

1. Copy `frontend/src/modules/formulary-restrictions` into your app (for example `src/modules/formulary-restrictions`).
2. Install the icon set if you don't have it: `npm i lucide-react` (v1 or later).
3. Add a route:

```jsx
import { FormularyRestrictions } from '@/modules/formulary-restrictions';

<Route
  path="/formulary-restrictions"
  element={
    <FormularyRestrictions
      apiBaseUrl={`${import.meta.env.VITE_API_URL ?? ''}/api/formulary-restrictions`}
      getToken={() => authStore.getAccessToken()}   // whatever returns your JWT; may return a Promise
      onActivity={(e) => analytics.log({ action: e.action, details: e.details })}  // Hulool's existing User Analytics logger
    />
  }
/>
```

| Prop | Default | Purpose |
|---|---|---|
| `apiBaseUrl` | `/api/formulary-restrictions` | Where `MapFormularyRestrictions()` is served |
| `getToken` | none | Returns the JWT for `Authorization: Bearer`. Omit if you use cookies |
| `credentials` | none | `"include"` for cookie authentication |
| `headers` | none | Extra request headers |
| `theme` | `"auto"` | `auto` follows Tailwind's `dark` class on `<html>`, then the OS. `light` / `dark` force it |
| `showThemeToggle` | `false` | Shows a light/dark button, for when the host has none |
| `hotkeys` | `true` | `/` focus · ↑↓ move · Enter details · Shift+Enter copy item no. · 1–6 type · Esc clear |
| `syncUrl` | `true` | Keeps `?q=` and `?item=` in the address bar; these links reopen the same view |
| `onActivity` | none | Hulool analytics hook: receives `{ module, action, details, data, at }` for every search, look-up, filter and admin change (section 2.4) |
| `moduleAnalytics` | `false` with `onActivity`, otherwise `true` | Also keeps the module's own usage log and its Admin → Analytics tab |
| `trackUsage` | `true` | `false` records nothing at all |
| `initialView` | `"search"` | `"admin"` opens the admin workspace (admins only); `?view=admin` does the same |
| `moduleName` | `Restrictions` | Main heading of the page and of the admin workspace |
| `title` | `Hulool 360°` | App name shown in the small top bar |

**How it fits your app**
- **Styling:** every style is scoped under `.hfr` / `.hfr-layer`. It does not depend on Tailwind and does not affect Tailwind. Text uses your app's font, and no web fonts are downloaded.
- **Overlays:** detail panels, dialogs and toasts render at the end of `<body>`, so your layout's overflow and z-index cannot clip them.
- **Offline-first:** the last dataset is kept on the device. The module opens instantly and works without a connection (the header then shows "Offline copy"). Usage events wait in a queue and are sent once the device is back online. Admin changes need a connection.
- **Phone and PC:** layouts tested at 390 px (phone), 1366×768 (laptop) and 1440 px. On phones the type tiles fold away while searching, so the answer sits directly under the search bar. Details open as a full-screen panel.

**Links from other Hulool screens:** `/formulary-restrictions?item=8900003324` opens a drug's details, and `/formulary-restrictions?q=linezolid` opens a search.

---

## 4. API reference

All routes are under `/api/formulary-restrictions` and require a signed-in user. Routes under `/admin` also require the `FormularyAdmin` policy.

| Method | Route | Purpose |
|---|---|---|
| GET | `/dataset` | Active items and restrictions. Supports `If-None-Match` and returns 304 when unchanged |
| GET | `/me` | `{ id, name, isAdmin }` |
| POST | `/usage` | `{ events: [{ type: "search"\|"view"\|"filter", term, zeroResult, itemNo, restrictionType, detail, atUtc }] }`, at most 200 per call |
| GET | `/admin/dataset` | Same as `/dataset`, including removed rows |
| PUT | `/admin/items/{itemNo}` | Create or update `{ name, uom, restrictionId, qatariOnly, qatariWording, qatariExceptions }` |
| DELETE / POST | `/admin/items/{itemNo}` · `/restore` | Remove (soft delete) / restore |
| POST / PUT | `/admin/restrictions` · `/admin/restrictions/{id}` | Create / update `{ generic, status, wording, type, conditions[], specialties[], approved, available }` |
| DELETE / POST | `/admin/restrictions/{id}` · `/restore` | Remove / restore |
| PUT | `/admin/restrictions/{id}/links` | `{ itemNos: [...] }`: exactly these items point to this entry |
| GET | `/admin/analytics?days=30` | Totals, daily series, top terms, zero-result terms, top items, per-user table |
| GET | `/admin/analytics/users/{userId}?days=30` | Every event for one user (who searched what, and when) |
| GET | `/admin/audit?take=200` | Change log |
| GET | `/admin/export.csv` · `/admin/export.json` | Exports |

`type` takes these values: `ams` (ID / antimicrobial), `init` (initial prescribing), `spec` (specialty or team), `senior` (consultant or specialist), `note` (approval record). `conditions` takes these values: `qatari`, `cd`, `nominated`, `form`, `criteria`, `consultant`. Usage events are kept for 365 days by default (`o.UsageRetentionDays`).

---

## 5. Testing before delivery

| Check | Result |
|---|---|
| Core module and sample host compile with .NET 8.0.134, warnings treated as errors | Passed |
| Every API endpoint: 401 anonymous, 403 non-admin, 304 ETag, validation, links, soft delete/restore, analytics, audit, CSV | Passed |
| Production front-end build with Vite 8.3.8 + React 19.3.1 | Passed (98 KB gzipped incl. React) |
| End-to-end browser suite (`tests/e2e_playwright.py`): 39 checks covering pharmacist search, keyboard use, spelling tolerance, Qatari-only items, pins, usage tracking, admin analytics and per-user drill-down, add/edit/remove/restore, restriction linking, change log, CSV export, phone layout (no horizontal overflow, answer under search, full-screen details), offline copy, dark mode | 39 / 39 passed, no browser errors |

**Not verified here (please check in your environment):**
1. **The EF Core project was not compiled here.** The workspace has no access to NuGet, so it could not download EF Core. Its code was type-checked against stand-ins with the same signatures as the EF Core 8 APIs it uses. Your `dotnet build` is the first real compile. Then run it once against a copy of your database.
2. **Your real JWT tokens.** The tests used the sample host's development sign-in. Confirm that your token's claim names and roles match section 2.3.
3. **Real iPhone and Android browsers.** Phone layouts were tested in Chromium at phone size, so a quick check on actual devices is worthwhile.

The register wording is shown word for word. The restriction type, specialties and flags are derived from it automatically, and admins can correct any of them in the Restrictions editor.

# Spectra content administration (system administrators only)

A Hulool system administrator can **add, edit and remove drugs, organisms, coverage, pharmacist notes and references** from inside the app, with no coding and no new release. Ordinary users cannot edit anything. They only ever see content that an administrator has **published**.

## 1. How it works

```
verified base data (js/app.js)  +  published content pack (append-only list of audited changes)  =  what users see
```

- **Base data stays intact.** The verified data in `app.js` is never overwritten. Each edit is stored as a *change* recording the item, the new value, the previous value, the author, the time and the reason.
- **Packs.** Changes are bundled into a versioned **content pack** (v1, v2, v3 …) and applied over the base data when Spectra loads.
- **History is append-only.** Undoing a change adds a reversing change; nothing is deleted from the record.
- **Traceability.** Every analytics event records the base content version *and* the pack version (`2026-11-17+<hash>|pack-v3`). For any period you can therefore state exactly which content clinicians were viewing.
- **Audit view.** Published changes also appear in the **What changed** tab, labelled "Local update", with the reason, date and author, for transparency to users.

## 2. What an administrator can do

| Area | Add | Edit | Remove |
|---|---|---|---|
| Drugs, in all 5 groups | ✓ | name, class, label, source; **coverage for every organism** (not covered / active / first line / limited, with condition text and references); WHO AWaRe (antibacterial); IV→PO or oral-use note; boxed warning, monitoring, interactions and pharmacist points | ✓ (two-tap confirm) |
| Organisms, in all 5 groups | ✓ | name, short name, subtitle, family, common sites, clinical note with references | ✓ (also clears its coverage) |
| References | ✓ | citation text and URL (https only) | — (deleting a reference could break citations) |
| History | — | **Undo** any published change | — |

**Built-in safeguards:**
- A reason is required for every change.
- Every reference key used must exist.
- Duplicate names and IDs are refused.
- A group must keep at least one drug and one organism.
- Text has length limits and all of it is escaped, so no HTML or script can be injected.
- If a save is refused, the form keeps everything that was typed.

**Not editable here (still needs a code release):**
- the *Pharmacist toolkit* tables and glossary;
- intro texts;
- the archived **Original 2019** chart coverage.

Organism names, sites and notes edited for antibacterials also appear in the 2019 archive view.

## 3. Who can edit: the permission model

1. **Client gate (hides the editor).**
   - The editor button appears only after the Hulool host grants a role listed in `config.js → admin.roles` (default `["sysadmin"]`).
   - Ordinary users have no editor button.
   - `Spectra.admin.grant()` with any other role is refused.
   - An iframe parent can grant only if `analytics.parentOrigin` is set to the exact Hulool origin; with `"*"`, grant requests are refused.
2. **Server gate (the real security boundary).**
   - Publishing is a `POST` to `content.saveUrl`. **The Hulool server must accept it only from an authenticated session whose role is system administrator**, and must reject everything else with 401/403.
   - A technically skilled user could unhide the editor in a desktop browser. They could alter only their own screen and could never publish.
   - Tested: a forged grant with a wrong token was refused by the server, and nothing changed for other users.

How Hulool grants the role, only after its own login confirms that the user is a system administrator:

| Platform | Call |
|---|---|
| Web (iframe) | `frame.contentWindow.postMessage({source:"hulool", type:"spectra:grantAdmin", role:"sysadmin", user:"HGH-SA-01", token:"<session token>"}, SPECTRA_ORIGIN)` |
| React Native | `webRef.current.injectJavaScript('Spectra.admin.grant({role:"sysadmin",user:"HGH-SA-01",token:"…"}); true;')` |
| Flutter | `controller.runJavaScript('Spectra.admin.grant({role:"sysadmin", user:"HGH-SA-01", token:"…"});')` |
| Remove access | `Spectra.admin.revoke()` or message `spectra:revokeAdmin` |

The `token` is sent only as `Authorization: Bearer …` on the publish request. Alternatively, leave it out and let the server rely on the Hulool session cookie (`credentials: "include"`).

## 4. Administrator workflow
1. Open Spectra and tap the **pencil button** next to the theme switch.
2. Choose **Drugs**, **Organisms** or **References**, pick a drug group, and select an item (or **+ Add**).
3. Edit and enter the **reason and source** (for example "IDSA 2027 update; P&T approval 03/2027"). Then press **Save to draft**.
4. The change shows immediately **on your device only**, so you can check it in the normal screens. It is listed under **Draft**, where you can discard it.
5. Press **Publish (n)**. The pack goes to the Hulool server, and all users receive it the next time they open Spectra.
6. **History** lists every published change. **Undo** adds a reversing change to the draft; publish again to apply it.

Recommended governance: publish only content approved through HMC P&T / antimicrobial stewardship. Record the approval in the reason. Hulool can add a two-person sign-off in its publish endpoint if required.

## 5. Server contract (Hulool backend)

See `examples/endpoint-receiver.js` for a working reference.

| Endpoint | Who | Behaviour |
|---|---|---|
| `GET content.url` | any signed-in user | Returns the latest pack (JSON), or 404 if none. Spectra caches it on the device for offline use. |
| `POST content.saveUrl` | **system administrators only** | Body = the full new pack. Accept only if `version == current + 1` (otherwise **409**) and every previously published change is still present (append-only). Store every version (audit / rollback). Reply 200. |

Pack format:
```json
{"format":"spectra-content-pack","schema":1,"id":"uuid","version":3,"base":"<app.js hash>",
 "published":"2026-12-01T09:12:00Z","publishedBy":"HGH-SA-01",
 "changes":[{"id":"uuid","op":"drug.put","group":"bac","key":"Cefiderocol",
   "value":{…new state…},"before":{…previous state…},"reason":"…","by":"HGH-SA-01","role":"sysadmin","at":"…"}]}
```
Change types: `drug.put`, `drug.del`, `org.put`, `org.del`, `ref.put`.

## 6. Deploying without a server (bundled pack)
1. With no `content.url`/`saveUrl`, **Publish** sends the pack to the Hulool app (bridge message `content-published`) and keeps it on this device.
2. Then go to **History → Download content-pack.js**, replace `js/content-pack.js` in the app bundle (for the standalone build, the second `<script>` in `standalone/spectra.html`), and release the app update.
3. Whoever controls the app release controls the content.
4. **Import pack** loads a pack JSON, for example to move edits between test and production.

## 7. Analytics of admin activity
The following are recorded with the administrator ID:
- `admin_granted`, `admin_denied` and `admin_open`;
- `admin_draft` (change type, group, item);
- `admin_published` (version, number of changes, server or host).

Every user session records `content_loaded` (pack id, version, source and whether the pack matches the base release).

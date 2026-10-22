# Plan — One nav rail

**Raised:** 2026-10-22, the user in session. Points: SideNav has an outdated name and should be a variant of NavRail; padding differs between the two; kol-branding's rail has no enter/exit, odd sub-row alignment and no icons; open width differs between fxr, mirror and monitor; brand.kolkrabbi.io needs override CSS to use a KOL package; a category should be able to be a page as well as a folder ("like foldernote in obsidian"), opt-in.
**Status:** W1 · W2 · W3 built 2026-10-22. Open: W4 (publish).
**Shape:** W › phase › list.
**Laws carried:** ARCHITECTURE §3 2026-10-01 (same job → a variant, the old name an alias on the ledger) · carry-through means verbatim (the site variant ports SideNav class-for-class) · kol-workshop's doc rail (`ShellNavColumn` · `RailSection` · `RailRow`) is out of scope.
**How a phase closes:** acceptance line first, gates green, then Playwright against his own words.

## W1 — One rail, two variants

### 1.1 — Site variant on NavRail — ✅ built 2026-10-22 (host: kol-component, ruled)
- `NavRail` takes `variant="site"`, drawing what `SideNav` draws today: geometry, padding, type, collapse.
- The app variant stays the default and keeps NavRail's current geometry.
- **Acceptance:** brand's rail rendered on the site variant matches `SideNav` pixel for pixel, light and dark.

### 1.2 — Retire the SideNav name — ✅ built 2026-10-22
- `SideNav` in kol-framework becomes an alias of `NavRail variant="site"`, on the retirement ledger.
- Docs and the showcase page move to `NavRail`; the alias keeps every consumer resolving.
- **Why TALK:** `SideNav` lives in kol-framework and `NavRail` in kol-shell; neither depends on the other. Every host breaks ARCHITECTURE §3 as written: kol-shell hosting it makes kol-framework import kol-shell (a reverse dependency, and a site would install the app shell — the reason `PageHeader` moved to kol-component); kol-component or kol-framework hosting it folds shell's rail out of kol-shell. Recommendation: kol-component, the `PageHeader` precedent — kol-shell and kol-framework both re-export it, the router read stays in kol-framework's `SideNav` wrapper.
- **Acceptance:** a consumer importing `SideNav` renders unchanged; the component page shows both variants.

## W2 — Behaviour, all opt-in

### 2.1 — Enter/exit stays opt-in — ✅ already so 2026-10-22
- `sections="fold"` stays the default; `"enter"` (labs) carries over to both variants.
- **Acceptance:** labs still enters and exits; an app with no prop still folds in place.

### 2.2 — Folder note: a category that is also a page — ✅ built 2026-10-22
- A category item with `to` makes its label open the page and its chevron fold the sub pages, as `RailSection`'s `to` does in kol-workshop.
- Without `to` the category stays a label that only folds, as today.
- **Acceptance:** with `to`, clicking the label navigates and the chevron folds; without it, behaviour is unchanged.

### 2.3 — Sub rows without icons align — ✅ built 2026-10-22
- Label-only sub rows line up with the main row labels instead of sitting under the icon column.
- **Acceptance:** kol-branding's research rows align to the RESEARCH label's left edge.

## W3 — Width and overrides

### 3.1 — The rail owns its open width — ✅ built 2026-10-22
- Open width moves into kol-theme's shell CSS (264, 320 from 1536), no longer borrowed from `kol-framework.css`.
- **Acceptance:** fxr, mirror and monitor open to the same width at the same window size.

### 3.2 — Brand drops its override file — ✅ built 2026-10-22, ticket filed
- The site variant paints its own surface, so brand's background rule is no longer needed.
- Active icon is ink, no accent (user ruling 2026-10-22: "follow brand just using white"), read from one CSS variable a repo can set to change it.
- Ticket kol-website to retire the file once it upgrades.
- **Acceptance:** brand renders the same with the override file moved out.

## W4 — Ship
- Publish kol-shell, kol-framework and kol-theme after the user's yes; tickets to kol-website (brand) and kol-branding.

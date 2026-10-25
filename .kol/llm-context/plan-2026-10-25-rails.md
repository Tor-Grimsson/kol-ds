# Plan — rails, every rail on one frame

**Raised:** 2026-10-25, his review of `apps/rails` (two screenshots: the tabbed page with its patch rail, and studio-hub's settings rail). Points verbatim: *"where are the siderails? this rails is for all rails, I want to see a regular left navrail then I want P , H all to work on shortcuts, I want all to open on top of each other if you want, the action menu just chooses variant like app or site rail"* · *"what you made IS BROKEN, wrong color wrong everything!!!"* · *"this is how settings look!! just look at apps/studio-hub … this is a fucking RAIL"*. The brief before it: *"they keep making variations old and new and I want to standardize rails both in labs which uses rails alot for settings, mirror mixer, monitor rack and stage. they have patch rail P, per page settings H, regular settings [,] … then we have the bottom rail on monitor stage and rack"* · *"make a apps/rails to reference a fully thought out system, that also deals with labs and randomise on mobile"*.
**Status:** W1 · W2 · 4.1 built 2026-10-25, for his review (`_tmp/2026-10-25-rail-roles/walk2.mjs` 25/25: the 48 rail, the settings rail measured against studio-hub's, P · H · E stacking, Escape top-first, the bottom rail beside the nav rail, the site frame, the phone rule). W3 is answered on round 19 (no edge, `edge` the opt-in) — his first review is `plan-2026-10-25-rails-review-1.md`. Retired: the tabbed page → `_tmp/2026-10-25-rails-tabbed/`. In the tree and kept: `Rail role` · `RAIL_ROLES` · `useRailKey` · the phone rule (kol-component, unpublished), the 20px site-rail gutter (kol-framework, unpublished).
**Published 2026-10-25:** kol-theme 0.190.0 · kol-framework 0.56.0 · kol-component 0.302.0 (*"ok lets call it, its fine for now"*).
**Shape:** W › phase › list.
**Laws carried:** find the shipped component first — studio-hub's settings rail IS the rail, nothing is redrawn; the reference app is dummy data on the shipped packages, never a fork; the Dev row on every rail; visual calls go on the open-questions page as live specimens, never argued in prose; removed code to `_tmp/<date>-<what>/`; no publish until he reviews.
**How a phase closes:** acceptance line first, gates green, then Playwright against his own words.

## W1 — The frame: one app, the left rail, the Hub's settings

### 1.1 — `apps/rails` on `AppHub` — ✅ built 2026-10-25 (P: *"I want to see a regular left navrail"*, *"this is how settings look"*)
- The app is built the way studio-hub is: `AppHub` with the 48px left rail (app variant), a **Stage** page (a live canvas stand-in, the rack's place), the Hub's Settings, and `dev={{ tabs }}`.
- The settings rail is the Hub's — `,` opens `SettingsPanel variant="rail"` exactly as studio-hub shows it (the scrim, 320, the header, Settings · Shortcuts · About · Repo). Nothing of it is rewritten here.
- The Variants button (top right, catalog's) carries ONE axis, **Rail: app · site** — apps/shell's switch: site swaps the frame for `SiteLayout` with the site rail on the same pages.
- Acceptance: at 1440 `/stage` shows the left rail; `,` opens a settings rail that measures and reads as studio-hub's (scrim present, 320 wide, `RailHeader` + tabs); Variants → site shows the site rail with its 20 gutter; the Dev row is on the rail.

### 1.2 — The tabbed page retires — ✅ built 2026-10-25
- `apps/rails/src/App.jsx` (the one-page-per-role build) → `_tmp/2026-10-25-rails-tabbed/App.jsx`; its walk stays in `_tmp/2026-10-25-rail-roles/`.

## W2 — The rails on their keys, stacking

### 2.1 — P · H · E on the Stage — ✅ built 2026-10-25 (P: *"I want P , H all to work on shortcuts, I want all to open on top of each other"*)
- `useRailKey` binds P (patch), H (page), E (bottom) on the Stage; each toggles its own open state, independent of the others; `,` stays the Hub's.
- Rails stack: a later one opens over an earlier one, Escape closes the top one first (`layerStack` already does this); `,` over all of them with its scrim.
- Content: the patch rail is monitor's patch table (rows with their remove, Add a cable); the page rail is the Stage's own settings (fxr's anatomy — tabs, label · control rows, the foot); the bottom rail is the Workbench shape (resizable from its top edge, a push side rail of Edit · Rack · Library inside it).
- The bottom rail docks right of the nav rail, not under it: the app passes `md:!left-[var(--kol-shell-rail-width)]` (monitor's `besideSidebar` override) — not the role, because the var on `:root` says 48 even where the shell has no rail.
- Acceptance: on `/stage`, P then H then E leaves three rails open at once, each measured at its role's side and size; Escape closes them top-first; the bottom rail's left edge is the nav rail's right edge.

## W3 — What a scrimless rail is made of — TALK (visual, open questions round 19)

- The patch and page rails take no scrim — monitor's own ticket (SettingsPanelBackdrop: the rack stays live so a cable can be patched with the table open). With no scrim and `edge={false}`, the rail is the page's own ground and nothing says where it begins — the screenshot. *"wrong color wrong everything."*
- Round 19 on open questions, the same patch rail three ways, live: (a) the hairline edge on its page-facing side, (b) a `surface-secondary` ground, (c) the scrim after all. In the tree until he rules: (a) — the role sets `edge: true` for patch and page; the settings rail is untouched.
- Acceptance: round 19 renders the three specimens; the tree's patch rail at 1440 shows a 1px `oq-08` edge on its left and is otherwise studio-hub's rail (same header, same padding, same width).

## W4 — The phone

### 4.1 — The phone rule on the frame — ✅ built 2026-10-25 (P: *"also deals with labs and randomise on mobile"*)
- Below 768 on the Hub's phone frame: P and H turn bottom at 70dvh with their top edge; `,` fills the screen; E stands at 50dvh. No framed phone view in the app — the dev server is on the network, he opens the LAN URL on his phone.
- Acceptance: at 390, the four rails measure the rule; the Hub's phone bar stays usable with every rail closed.

### 4.2 — labs · randomiser — PARKED: their rails live in the design editor's source, developed in kol-fxr; adoption is fxr's step once kol-component ships.

## W5 — Docs, then the apps

- `19-rails.md`: the reference section rewritten (one frame, every rail on its key), the roles table kept; `Rail.mdx`; the `Apps.jsx` row; `validate-render`'s rails routes (`/stage` and each key's rail pressed open).
- Tickets to monitor (role patch · page · bottom, `useRailKey` for its P · H · E handler), mirror (the 440 patch table → `role="patch"` + `RailHeader`), fxr (labs and randomiser on the phone rule) — PARKED until he has reviewed and the packages are live.
- Closes into `docs/operations/09-phase-log/`.

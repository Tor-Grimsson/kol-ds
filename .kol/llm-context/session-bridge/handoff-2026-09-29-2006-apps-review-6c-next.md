# Handoff — 2026-09-29 20:06

## Goal of the current arc
The apps tier: every app named by its layer, checked by rendering, and every screen reachable. Phases 1–5 of `plan-2026-09-29-apps-review.md` are BUILT; the next push is **§6c — the six-phase build list**, which the user has reviewed and is about to give GO on at the start of the next session.

## Last actions taken (causal trail, newest first)
- Plan §6c finalised with the user (phases below). User restarting the session before saying go.
- Masthead default REMOVED from `AppShell` / `AppHub` (user: fxr · mirror · monitor stay mono); only `apps/media-hub` sets `masthead="display"`.
- D5 built: the touch rung — `--kol-ctl-xs/sm/md/lg` tokens (22·26·32·40 → 32·32·36·40 on `pointer: coarse`), every text control 16/22 on touch; `Input`/`SearchInput` pin `pointer-coarse:h-[22px]`. `09-sizes.md § Touch rung`.
- Phases 1–5 (items 1–25) built: `pnpm validate:render` (R0–R3, playwright), `validate:control-type`, Button unknown-variant fix, media on kol-search, phone bar (`AppShell touch="bar"`, `PhoneNav`), masthead context, AppHub home/settings opt-in, renames (`media-shell`→`media-hub`, `apps/shell`→`apps/hub`, new `apps/shell`), `notes-hub` · `presentation-hub` · `catalog`, blank-editor notes/decks, `tagGraph` in kol-search, `/apps` by layer + `/app/<name>` homes, PWA manifests, docs.
- Bumped + changelogged, **NOT published**: component 0.229.0 · theme 0.156.0 · shell 0.59.0 · search 0.2.0 · markdown 0.1.1 · notes 0.2.0 · deck 0.2.0 · hardware 0.3.1 · workshop 0.30.1 · design-editor 0.16.1 · store 0.3.1.

## Current state / open decision points
- Gates 30/30 clean · render 16 apps / 50 views clean (3 allowed: editor SwatchStack, editor @phone) · `pnpm build` ✓.
- Nothing open for the user in §6c — it is waiting on GO only.
- Still parked (not this arc): the `brand.<domain>` sites are now covered by §6c phase 6 (brand-hub); the editor review (unreachable modulation button, other editor bugs); the workshop + showcase review (incl. the control-preview pattern — tone/variant/size dropdowns on every control page — and the 3D editor to be homed here).
- AGENT-CONTEXT.md has NOT been updated this session (no /log-work yet) — this handoff and the playbook carry the state.

## Next intended action
On GO, run §6c in order (set /kol-goal + /playbook as this session did):
1. **Editor screens** — `apps/editor` routes `/` · `/labs` · `/randomiser` · `/core`. Randomiser = Generator + Effects; Effects picks the input media first and keeps it while browsing (today it falls back to empty). Desktop and phone. `LabsView` + `MobileView` are exported by `packages/design-editor` but mounted nowhere here.
2. **Nothing hidden** — a gate: every top-level view a package exports is reachable from an app or a showcase page. Then `11-shell-system.md` (phone bar, masthead, Hub opt-ins).
3. **`apps/studio`** — `AppStudio` in kol-shell: Home · Library · Create · Use · opt-in pages · Settings, mono (monitor.kolkrabbi.io is the reference).
4. **`apps/panels`** — parameter panels (categories, sub-categories, tabs, folds, labeled controls, modulation, phone form) on design-editor's own parameter data.
5. **Fixtures** — `apps/voyager-fixture` from `_tmp/kol-client` (VOYAGER: marks 7, stationery 7, deck 7, diagrams 10, graphics 41, `public/brand/voyager` 16, fonts Playfair + Right Grotesk; business data generated in the shape kol-system/kol-acyr-website use) · `apps/fixtures` — one page, dropdown between media · workshop · voyager.
6. **Brand** — `apps/brand` = the catalogue of brand building blocks (colour, ramps, swatches, type, clearspace, logo displays, business card, stationery, assets table, business-data table), shell + sidebar · `apps/brand-hub` = the client's home on VOYAGER, tools (notes · presentation · media) and apps (editor) as opt-ins.
Each phase: its docs + `/apps` home in the same pass; ends with gates + render + bumps/changelogs; no publish.

## Working memory not yet in AGENT-CONTEXT
- **How the user wants replies:** short, solution-first, no lists of things for him to comment on — he called the back-and-forth "a loop you created". Answer, propose ONE thing, stop. Memory `issues-come-with-the-solution` saved this session.
- Naming: `<tool>` alone · `<tool>-hub` = Shell + Hub + tool · `apps/shell` Shell alone · `apps/hub` Hub alone · `apps/catalog` · `apps/studio` (the fxr/mirror/monitor workstation) · fixtures named after what they fake (`voyager-fixture`).
- "Hub" = Home (the ContentFilters page) + Settings + S sheet + walkthrough — generic. "Studio" = the Hub + Library/Create/Use — the workstation shape.
- No consumer uses `AppHub` yet (MBP clones: fxr/mirror/monitor on kol-shell 0.40–0.56 via `AppShell`); a consumer scan belongs on the iMac.
- `validate:render` runs every app on ports 5290+ and kills them; probes live in `_tmp/probe/` (gitignored). Allowed exceptions print every run.
- acyr (local) is readable brand reference; hrafn-dop not needed.
- Live journal: `.kol/llm-context/playbook/2026-09-29-apps-review.md`. Goal file for this session is `status: done`.

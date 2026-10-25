# An app adoption playbook beside the site one

**Staged:** 2026-10-24 · from a dotfiles session
**Change:** one doc, `docs/operations/07-apps-tier/09-app-adoption.md`

---

## The problem, in one case
dotfiles now ships `/repo-layout`, which puts a consumer repo's hand-rolled layout on a shipped frame: `/repo-layout site` or `/repo-layout app`. The site side runs `08-site-adoption.md` step by step. The app side has no playbook to run. It has to piece AppShell adoption together from `04-compositions/11-shell-system.md`, `16-app-anatomy.md` and `02-shells.md`, which describe the frame but do not say how a repo takes it. So an app adoption gets improvised per repo, which is the drift the skill exists to stop.

The user's framing: a consumer never picks a rail, it picks a frame. Two layouts exist, SiteLayout (kol-framework) and AppShell (kol-shell). Hub and Studio are a layout plus a preset set and already have `06-studio-adoption.md`.

## The fix
Write `docs/operations/07-apps-tier/09-app-adoption.md` in the same playbook shape as `08-site-adoption.md`:
- **0. Prerequisites** — the kol-shell, kol-framework, kol-component and kol-theme versions that carry the frame.
- **1. Bump.**
- **2. The frame** — `AppShell` replaces the repo's local layout. Which props a plain app passes: `rail`, `touch`, `pageWash`, `masthead`, `navKeys`.
- **3. The rows** — the nav tree in AppShell's shape, sections that expand vs enter.
- **4. The pages** — what a page inside the shell opens with.
- **5. What leaves** — the local layout, the rail fork, their CSS.
- **6. Verification** — the walk at 1440 and 390, with `apps/shell` as the reference.

Add its row to `07-apps-tier/INDEX.md`, and cross-link it with `08-site-adoption.md` in both `related:` fields.

## Rejected alternative
The skill could carry the AppShell steps itself. Rejected because it copies DS law into dotfiles, where it drifts the next time kol-shell moves.

## Definition of done
- [ ] `09-app-adoption.md` exists in the playbook shape, numbered sections 0–6
- [ ] Listed in `07-apps-tier/INDEX.md`, cross-linked with `08-site-adoption.md`
- [ ] Receipt returned to dotfiles so `/repo-layout`'s `app` row can point at it

## 🟢 CLOSED — 2026-10-24 · `docs/operations/07-apps-tier/09-app-adoption.md`

Written in `08-site-adoption.md`'s shape, numbered 0–6: prerequisites (kol-shell ≥0.78.1 and the peers it declares), the bump, the frame (the `AppShell` props a plain app passes, as a table), the rows (items, the enter/expand rule, the foldernote, the foot), the pages (`PageShell`, `PageHeader`, `SettingsScaffold`), what leaves, the walk at 1440 and 390 beside `apps/shell`. Row in `07-apps-tier/INDEX.md`; `related:` cross-linked both ways with `08-site-adoption.md`. `pnpm validate:vault-links` green. Receipt returned to dotfiles — `/repo-layout`'s `app` row is the remainder there.

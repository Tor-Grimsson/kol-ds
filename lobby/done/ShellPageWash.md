# ShellPageWash — the page background steps up from a primary back, per app

**Staged:** 2026-08-27 · from **kol-monitor** (user ruling; the same mechanism is owed to kol-fxr and kol-mirror)
**Change:** kol-shell `AppShell` + `PageShell` — the back of the back is `surface-primary`; the page root paints a per-app TRANSPARENT wash over it

## The problem, in one case

Every kol-shell app paints its page root `bg-surface-primary` (`PageShell`) and
nothing behind it — `body` is unpainted. Monitor wants its main background a
step lighter, and the user's model is precise:

> "the back of the back should be primary — then you can just add transparent
> on top to step up the lightness"

Not a different opaque surface: `secondary` is the module faceplate (they
merged), and `oq-12` is the same pixel as fg-12-over-primary but hides the
structure. Monitor built it locally today: `RailFrame` became a real
`bg-surface-primary` block (the back), and an unlayered rule paints the page
root `background-color: var(--kol-fg-12)` (the wash). kol-fxr cannot copy that
— its `index.css` is imports-only by rule ("if something is missing, it goes in
the DS") — and kol-mirror's page roots are not on `PageShell` yet. Three apps,
one mechanism: it is the shell's.

## The fix

- `AppShell`: the rail-offset div (the one wrapping `children`) paints
  `bg-surface-primary` — the back of the back, always, in every app.
- `AppShell` prop **`pageWash`** — a CSS colour (`'var(--kol-fg-12)'`; default
  none) — set as `--kol-shell-page-wash` on that div.
- `PageShell`: `background: var(--kol-shell-page-wash, var(--kol-surface-primary))`
  in place of the `bg-surface-primary` class. Unset → primary, today's pixel;
  set → the wash over the back.
- A consumer root that is not `PageShell` (monitor's rack root) reads the same
  variable.
- Docs: `04-compositions/11-shell-system.md` — one paragraph: the back is
  primary, the wash is the app's, and why it is not a surface swap.

## Rejected alternative

A token each app binds in its overrides (`:root { --kol-shell-page-wash: … }`)
— fine for monitor and mirror, impossible for fxr, which has no local
stylesheet by policy. The prop covers all three; the variable is still there
for CSS-side readers.

## Definition of done

- kol-shell published; `pageWash` unset renders exactly as today in fxr,
  mirror and monitor.
- Remainders — **kol-monitor**: bump, `<AppShell pageWash="var(--kol-fg-12)">`,
  `RailFrame` back to `contents`, delete the MAIN BACKGROUND rule in
  `monitor-overrides.css`, rack root reads `--kol-shell-page-wash`.
  **kol-fxr**: bump, one prop, at whatever rung it wants. **kol-mirror**: on its
  ShellHomeSystem adoption, one prop.

## ✅ RESOLUTION — 2026-08-27 · kol-shell 0.11.0

`AppShell`'s content wrapper paints `bg-surface-primary` always (the back of the back) and takes `pageWash` → `--kol-shell-page-wash` on that wrapper (the bare touch wrapper carries the variable too — nothing to paint there); `PageShell` paints `background: var(--kol-shell-page-wash, var(--kol-surface-primary))` in place of its `bg-surface-primary` class, ink kept on `text-auto`. Unset = today's pixel. One paragraph in `11-shell-system.md § Contracts`. 21 gates clean; verified in source only (no server run, by your rule).

**Remainder here:** none — kol-monitor: bump kol-shell 0.11.0, `<AppShell pageWash="var(--kol-fg-12)">`, `RailFrame` back to `contents`, delete the MAIN BACKGROUND rule in `monitor-overrides.css`, rack root reads `--kol-shell-page-wash`. kol-fxr / kol-mirror: bump, one prop.

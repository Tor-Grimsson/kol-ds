---
component: PageHeaderMonoTitle
source: kol-fxr/src/pages/HomePage.jsx#L51 · kol-fxr/src/pages/LibraryPage.jsx#L84
staged: 2026-08-27
status: draft
deps: [PageHeader]
---

# PageHeaderMonoTitle

## Purpose

`kol-shell` `PageHeader` (0.6.2) has no mono title voice. `size` picks
`kol-sans-heading-03` · `kol-sans-display-03` · `kol-sans-display-02` — all
Right Grotesk cuts. kol-monitor's deployed masthead ("Monitor", 32px, 500) is
**JetBrains Mono**, and that is the look the user rules for the app tier
(2026-08-27, kol-fxr home diffed against monitor). It renders mono on monitor
only because monitor's local legacy sheet (`src/styles/kol-typography-mono.css`)
still styles the retired `.kol-heading-sm` the pre-0.5.0 PageHeader wore — an
accident, not a seam. kol-fxr, on the current package, gets the sans role.

## Anatomy

Unchanged — `<header>` → `[eyebrow p]` · `h1` · `[subtitle p]`.

## Variants

- `sm | md | lg` as shipped (sans roles).
- **New: a mono voice** for the title — the app-chrome masthead. Suggested
  shape: `voice="mono"` (default `sans`), or a `titleClass` seam matching
  ContentText's `*Class` contract. Either way the subtitle stays `kol-mono-14`.

## Props

| prop | type | default | controls |
|------|------|---------|----------|
| `voice` (proposed) | `'sans' \| 'mono'` | `'sans'` | title family; `mono` at `sm` = JetBrains 32px / 500 / lh 100–120% |
| `titleClass` (alt) | string | — | replaces the title role whole, ContentText-style |

## Styling

Target at `sm` + mono: `font-family: var(--kol-font-family-mono)`, 32px,
weight 500 (monitor's `.kol-heading-sm`: `clamp(20px, 2.5vw, 32px)`, lh 100%).
The DS mono ramp stops at `kol-mono-20` — a 32 rung (or `kol-mono-heading-*`)
is the missing role the voice would sit on.

## States & interactions

None — static text.

## Dependencies

`PageHeader` only. kol-theme gains the mono heading rung.

## Recreation notes

Consumer interim in kol-fxr: `<PageHeader size="sm" className="[&>h1]:font-mono" …/>`
— works because `kol-typography.css` is `layer(components)` and Tailwind
utilities cascade after it. Delete on ship. kol-monitor's title is already
mono by accident and would keep rendering the same after adopting the seam;
its legacy sheet's `.kol-heading-*` rules can then go.

## ✅ RESOLUTION — 2026-08-27 · kol-shell 0.7.0 · kol-theme 0.67.0

PageHeader voice="mono" — the title rides three new mono heading rungs (kol-mono-heading-03 32 / 110%, kol-mono-display-03, kol-mono-display-02 on the display tokens at 100%; JetBrains Mono, weight 500) per size; voice="sans" is the default and unchanged; titleClass replaces the title role whole; the subtitle stays kol-mono-14. Measured on the demo: sm mono → JetBrains Mono 32px / 500, md → 48px / 500; sans untouched.

**Remainder here:** none — kol-fxr bump kol-shell 0.7.0 + kol-theme 0.67.0; <PageHeader size="sm" voice="mono" …/> and drop the [&>h1]:font-mono interim; kol-monitor can retire its legacy .kol-heading-* rules once it adopts voice="mono".

## Addendum — 2026-08-27, same day

`SettingsScaffold` renders its own `<PageHeader title subtitle />` with no
`size`/voice pass-through, so a consumer cannot reach that title at all — the
Settings page in kol-fxr wears the sans display role while Home and Library
are mono. Whatever seam lands on `PageHeader` needs to be forwarded by
`SettingsScaffold` (a `header` prop spread onto it, or the same `voice`).
kol-fxr interim there: a `contents` wrapper with `[&_h1]:font-mono` etc.

## ✅ Addendum answered — 2026-08-27 · kol-shell@0.7.1

`SettingsScaffold header` — PageHeader props spread onto the scaffold's header, so `voice="mono"` reaches the Settings title.

**Addendum 2 (2026-08-27):** `SettingsSection` bakes `text-fg-80 kol-helper-16` on its `h2` with no seam; the user rules section titles `fg-96` on `kol-helper-14` (the tab strip's role). Same wrapper override in kol-fxr; same ticket.

## ✅ Addendum 2 answered — 2026-08-27 · kol-shell@0.7.2

`SettingsSection` h2 → `text-fg-96 kol-helper-14`.

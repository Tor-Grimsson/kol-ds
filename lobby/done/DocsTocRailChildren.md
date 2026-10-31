---
component: DocsTocRailChildren
source: kol-atlas/apps/lab/src/pages/t1-type.jsx (TypeScale, SCALE_TOC) · /lab/t1/type-scale
staged: 2026-10-30
status: draft
deps: [DocsToc, useScrollSpy]
---

# DocsTocRailChildren

## Purpose
`DocsToc variant="rail"` takes one flat list of headings; the graduations between them are inert (`minors`, the same count for every gap). On a long specimen page the user wants the ticks under each section to BE that section's entries: kol-atlas `/lab/t1/type-scale` has sections Display · Headings · Paragraph · Sizes · Inline · Utility, and each holds styles (display-1, display-2; h1–h6, eyebrow, label; …). The user: *"why arent each entry sectioned? like there are tickes under each section, primed to list each style f.e. on hover?"*

## Anatomy
```
nav.kol-toc (rail, pinned to an edge)
├─ row: section label ── major rule        ← toc[i] (link, today's row)
│   ├─ child tick                           ← toc[i].children[j] (link, label hidden at rest)
│   ├─ child tick
│   └─ …
├─ row: next section ── major rule
└─ …
```

## Variants
- `toc` entry without `children` — exactly today: the `minors` graduations fill the gap.
- `toc` entry with `children` — the gap under it is one tick per child, not `minors` inert ticks.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| `toc[].children` | `Array<{ id, label }>` | — | the section's entries; each is a tick that links to `#id` and is observed by the spy |
| `minors` | number | 10 | unchanged; still fills gaps under entries without `children` |

## Styling
- Child ticks read as today's graduations at rest (`.kol-toc-tick`, 3px pitch), so a rail with children looks like the current rail until hovered.
- Under the lens (the existing gaussian `--m`), a child's label appears beside its tick in the minor type, smaller than the section label.
- The active child (spy) gets the active ink, and its section label stays lit as the parent.
- Height: one tick per child plus the section rows — it follows the content instead of `minors`. kol-atlas currently passes `minors={32}` only to make the rail taller; drop that once children exist.

## States & interactions
- Rest: section labels visible, child labels hidden, ticks as graduations.
- Hover / lens: child labels fade in under the lens on the same curve as today's magnification.
- Click a child tick: scrolls to that entry (same `onNavigate` contract as the section links).
- Active: the spy tracks children too; the current child tick and its section are both marked.
- Keyboard: children are links in the tab order (today's graduations are `aria-hidden`; children are not).

## Dependencies
`DocsToc` (molecule) and `useScrollSpy` — the spy needs to observe child ids as well as section ids.

## Recreation notes
- Extend `DocsToc`; no new component. Backwards compatible: no `children`, no change.
- The snap / lens logic already measures every row centre; child ticks become measured rows with their own labels.
- Casing stays at the call site (labels verbatim).
- Consumer to pick it up: kol-atlas `apps/lab` (type-scale first, then the verbal views, whose `##` sections have `###` children).

## Resolution — 2026-10-30

🟢 `closed` — shipped in `@kolkrabbi/kol-component` **0.317.7** with `@kolkrabbi/kol-theme` **0.200.6**. Built as below.

## Built — 2026-10-30

- `packages/component/src/molecules/DocsToc.jsx`
  - L61–70 — header note: the sectioned rail.
  - L108–112 — the spy observes section and child ids in document order; `activeSection` is the active id or the entry that owns it (the list marks it too).
  - L210 — `snap="label"` locks to every labelled link, read off the DOM, instead of every (minors + 1)th row.
  - L297–316 — an entry with `children` renders one `<a class="kol-toc-row kol-toc-tick kol-toc-child">` per child in place of `minors` (also under the last entry): `href="#id"`, `onNavigate`, `aria-current`/`data-active`, a `kol-helper-10` label. No `children`, the same tree as 0.317.6.
- `packages/component/src/hooks/useScrollSpy.js` L49–66 — nested ids: the innermost visible element wins; when an entry leaves while its section is still in the band, the section takes the mark back. Inert for flat ids.
- `packages/theme/kol-components-molecules.css` L2470–2492 — `.kol-toc-child`: stretched across the rail as the hit area; the label overflows the 3px row without growing it, `pointer-events: none`, shown only near the lens's peak (`clamp(0, (--m − 0.96) × 25, 1)`); the active child's stroke at fg-64, graduation length; focus-visible shows the label; reduced motion keeps child labels hidden.
- `showcase/src/previews/DocsToc.jsx` — Props carries four children (toc · variant · onNavigate · rootMargin) with their own headings.
- `showcase/src/docs/components/DocsToc.mdx` — Behavior paragraph and the `toc` row.

Verified in the showcase preview (`/components/preview/DocsToc?variant=rail`, Playwright 1400×900): the row order is heading · 10 ticks · heading · 10 ticks · Props · 4 child links · Theming; lens on the second child shows only its label (opacities 0 · 1 · 0 · 0); click set `#toc-preview-props-variant`; scrolled to `toc`, the active marks are `#toc-preview-props` and `#toc-preview-props-toc`; child links tabbable; no page errors. Gates: `validate:syntax` clean, `validate:rails` clean.

**Visual call, for review:** a child's label shows only at the lens's peak, not on the section labels' curve — at a 3px pitch that curve would print four or five child labels over one another.

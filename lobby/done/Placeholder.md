---
component: Placeholder
source: kol-monorepo/apps/brand/src/editor/compose/inspectors/Placeholder.jsx#L1-L18
date: 2026-07-03
status: draft
deps: []
---

# Placeholder

## Purpose
A generic inspector empty-state: a small stacked block of stage kicker → title → optional hint → optional footer note, used where a real inspector hasn't shipped yet. Trivial but reused; a reusable "this panel is coming / nothing selected" stub for any inspector or empty rail.

## Anatomy
```
div.kol-compose-placeholder
├─ p  stage   (kol-helper-10 uppercase text-meta mb-1)     ← eyebrow / phase kicker
├─ p  title   (kol-helper-16 text-emphasis mb-3)           ← headline
├─ [p hint]   (kol-sans-body-03 text-body mb-4)            ← optional supporting line
└─ [p next]   (kol-helper-12 text-meta pt-3 border-t border-fg-08)  ← optional footer note above a hairline
```

## Variants
- **Minimal** — `stage` + `title` only.
- **+ hint** — adds the supporting body line (`hint`).
- **+ next** — adds the top-bordered footer note (`next`), a "what's coming next" line.
- Both `hint` and `next` are independently conditional.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| stage | string | — | eyebrow / kicker line (rendered as-authored) |
| title | string | — | headline line |
| hint | string | — | optional body line; omitted when falsy |
| next | string | — | optional footer note above a hairline; omitted when falsy |

## States & interactions
- Static, presentational — no state, no handlers.
- `hint` and `next` are conditionally rendered (`hint && ...`, `next && ...`).

## Styling
- **Type classes**: `kol-helper-10` (stage), `kol-helper-16` (title), `kol-sans-body-03` (hint), `kol-helper-12` (next) — KOL type scale.
- **Color classes**: `text-meta` (stage/next), `text-emphasis` (title), `text-body` (hint) — KOL semantic text colors.
- **Spacing**: `mb-1 / mb-3 / mb-4` between blocks; `next` gets `pt-3 border-t border-fg-08` for the hairline-separated footer.
- **Wrapper**: `.kol-compose-placeholder { padding: 0 }` (the app zeroes the inspector body's default padding for this stub) — trivial; fold into the DS component or drop.
- **App-specific bits to DROP:**
  - **`uppercase`** on the stage line — a `text-transform` in the component. Per KOL casing rules the DS component must not force case; author `stage` in the intended case at the call site and remove the `uppercase` utility.
  - **`.kol-compose-placeholder`** app class — only sets `padding:0`; inline it or drop it in the DS.

## Dependencies
- None. Plain `<p>` elements with KOL type/color classes.

## Recreation notes
- Tier: **atom** — a labeled empty-state text block.
- The **prop/slot seam replacing editor state**: none needed — already pure props (`{ title, stage, next, hint }`), no store. Consider renaming toward generic empty-state semantics (`eyebrow`/`title`/`body`/`footer`) if it graduates beyond "inspector placeholder," but the current names are fine.
- Text casing: **drop the `uppercase` utility** — the kicker should be authored in its final case at the call site, not force-cased by the component (matches the KOL no-auto-text-transform rule). This is the one real change on an otherwise verbatim port.

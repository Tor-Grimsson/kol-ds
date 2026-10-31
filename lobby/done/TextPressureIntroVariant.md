---
component: TextPressure
source: kol-website/_tmp/2026-10-28-web-frame/TextPressure.jsx#L1-L224
staged: 2026-10-30
status: draft
deps: [TextPressure, WebsiteIntroLoader, usePrefersReducedMotion]
---

# TextPressure — `variant="intro"`

## Purpose
kolkrabbi.io's intro wordmark lost its behaviour when it moved onto kol-foundry 0.14.0. Before, it bent the KOLKRABBI glyphs from the moment it appeared and followed the pointer anywhere in the window. Now every glyph sits flat (wght 400 / wdth 100) until the pointer is over the word itself, and the intro looks dead (screenshot: the word evenly set, the cursor ring below it). Asked: a `variant` on TextPressure that is the old behaviour, with `WebsiteIntroLoader` setting it. Today's behaviour stays the default for every other consumer.

## Anatomy
Unchanged: container → `<h1>` → one `<span>` per character.

## Variants
| variant | pointer tracking | at rest / on mount | wdth range | falloff (`maxDist`) | leave |
|---|---|---|---|---|---|
| `default` (today, unchanged) | container `mousemove` / `touchmove`, gated on `mouseenter` (`isHovering`) | static at `wght 400, wdth 100, ital 0` | 5–150 | container width / 2 | coasts back (`returnToDefault`) or freezes |
| `intro` (new — the retired site copy) | **`window`** `mousemove` + `touchmove` (`passive: false`), no hover gate | follower starts at the container's centre, so the loop deforms the glyphs on the first frame — the middle letters wide and heavy | **5–200** | **title (`<h1>`) width / 2** | n/a — the loop runs while mounted |

Reduced motion: both variants render static at the rest axis values — keep that.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| `variant` | `'default' \| 'intro'` | `'default'` | the row above; every other prop unchanged |

## Styling
No change. The old copy's `textTransform: 'uppercase'` is not wanted back; the caller passes `text="KOLKRABBI"` in caps.

## States & interactions
`intro`: the rAF loop runs from mount to unmount, with the follower lerping toward the last window pointer position (`/ 15`, as today).

## Dependencies
`WebsiteIntroLoader` (kol-foundry) passes `variant="intro"` to its `TextPressure`. Nothing else changes in it: the shell, timers, gesture engine and `CursorTrail` were diffed against the retired site copy and match line for line.

## Recreation notes
Evidence: diff `kol-website/_tmp/2026-10-28-web-frame/TextPressure.jsx` (the retired site copy, the reference for `intro`) against `kol-foundry/src/TextPressure.jsx` @0.14.0. The deltas that matter are window vs container listeners, the `isHovering` gate, `wdth` 200 vs 150, and title vs container width for `maxDist`. Consumer side after the release: bump kol-foundry, and the intro on `/` bends from first paint again.

## Resolution — 2026-10-30

🟢 `closed` — shipped in `@kolkrabbi/kol-foundry` **0.15.0** (registry live 2026-10-30). Built as below.

## Built — 2026-10-30

- `packages/foundry/src/TextPressure.jsx`
  - L77–79 — `variant = 'default'`; `intro` (JSDoc L29–33, L54).
  - L103–141 — `intro` listens for `mousemove` · `touchmove` (`passive: false`) on `window`, no `mouseenter`/`mouseleave` gate; the follower still starts at the container centre.
  - L180 — `intro || isHovering`: the loop never takes the coast-back branch, so it runs mount → unmount (lerp `/ 15`).
  - L185 — `maxDist` is the `<h1>` width / 2 for `intro`, the container's for `default`; L198 — `wdth` 5–200 for `intro`, 5–150 for `default`.
  - No `textTransform`; reduced motion returns before listeners and rAF in both.
- `packages/foundry/src/WebsiteIntroLoader.jsx` — `variant="intro"` on its `TextPressure`; nothing else.
- `showcase/src/previews/TextPressure.jsx` — a Default · Intro picker (`variants`).
- `packages/foundry/COMPONENTS.md`, `docs/documentation/04-compositions/05-foundry-system.md` — the TextPressure row names the variant.

Verified in the showcase (`/components/preview/TextPressure?variant=intro`, Playwright): with no pointer the glyphs read `wdth` 17 · 61 · 103 · 152 · 197 · 138 · 89 · 47 · 10 (centre widest); a `window` `mousemove` at (5, 5), outside the word, moved the peak to the first glyph (179 · 124 · 77 · 31 · 5…). Default with the same window event: every glyph `wght 400, wdth 100, ital 0`.

Gates: `validate:syntax` clean, `validate:preview-files` clean, `validate:props` no TextPressure finding.

---
component: TransportIcons (kol-icons set additions)
source: kol-ds-fxr/src/editor/params/TransportBar.jsx#L75-L76
staged: 2026-08-09
status: draft
deps: [Icon]
---

# TransportIcons

## Purpose
Two transport glyphs the curated kol-icon-set-v1 does not ship: `stop` and `rewind`. The design editor's TransportBar (editor + labs chrome, desktop + mobile sizes) requests both by name; every mount logs `Icon "stop" not found in icon set` / `Icon "rewind" not found in icon set` and renders an empty cell. Present since kol-icons 0.10.0; verified against the installed set (165 names) 2026-08-09.

## Missing list
| name | requested at | glyph |
|---|---|---|
| `stop` | `TransportBar.jsx:75` | media-stop square |
| `rewind` | `TransportBar.jsx:76` | rewind-to-start — vertical bar + left-pointing triangle |

## Anatomy
Single-glyph SVGs for the shared `<Icon/>` registry — same viewBox and stroke conventions as the shipped transport family (`play`, `pause`, `skip-back`, `skip-start`, `skip-forward`, `skip-end`).

## Variants
None (single form each).

## Props
None — set additions; the Icon atom's own API applies.

## Styling
- `currentColor`, keyline/stroke weight matched to `play`/`pause` in the curated set.
- Rendered at 12–16px in TransportBar cells — must stay legible at 12.

## States & interactions
None beyond Icon's own.

## Dependencies
None new.

## Recreation notes
The set already carries `skip-start`/`skip-back`; if a new drawing would be redundant, shipping `stop`/`rewind` as aliases of existing drawings is acceptable — the contract is that the **names resolve**. The names are what TransportBar (and any future transport consumer) requests literally.

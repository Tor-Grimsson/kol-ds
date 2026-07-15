# Parked: the full casing-law arc + v1 icon-set gaps

Surfaced 2026-07-15 (evening) during the preview-truth audit. The approved pass fixed the
9 sweep-flagged component-side casing sites + icon remaps with clear v1 equivalents
(component 0.10.1 · chess 0.2.1 · framework 0.4.2 · content 0.3.1 · foundry 0.4.2).
Everything below is the SAME violation classes, deliberately NOT touched — repo-wide
enforcement changes rendered casing in every consumer and needs the user's go.

## Casing-law remainder (text-transform still live)

**Theme CSS (~40 rules)** — the big one; each strip changes consumer visuals until
call-site strings are re-authored:
- `theme/kol-components-chess.css` — ~20 rules (113, 129, 170, 212, 285, 299, 313, 331,
  351, 368, 411, 435, 446, 527, 593, 747, 835, 1167) + one `capitalize` (1041)
- `theme/kol-components-atoms.css` — 9 rules (643, 718–778 block, 841)
- `theme/kol-components-styleguide.css` — 3 rules (78, 201, 366)
- `theme/kol-typography.css` — 3 rules (916, 972, 998 `.kol-prose h6`)

**Package JSX (unflagged in the approved sweep, same class):**
- `component/src/atoms/EmptyState.jsx` — uppercase class
- `component/src/organisms/FeatureSplit.jsx` — uppercase class
- `foundry/src/TypefaceVariablePreview.jsx:96`, `foundry/src/TypefaceLibraryItem.jsx:149`

**Showcase app chrome (not a package):**
- `showcase/src/lib/SidebarNav.jsx` — group headers + "Group by" label use `uppercase`

## v1 icon-set gaps (legacy names left in place — need designed v1 icons, not remaps)

| Legacy name | Lives in | Note |
|---|---|---|
| `dock-right` | framework/ShellHeader.jsx:136 | dock-left→panel-left shipped; no mirrored icon in v1 |
| `arrow-downright` | component/SectionLabel.jsx:45,51 | no diagonal arrows in v1 |
| `cut` | (demo now uses `x`) | scissors glyph missing |
| `library` | (remapped to book-open where hit) | dedicated library glyph? |
| `pointer`, `type` | (demos remapped to target/edit) | editor-tool glyphs missing |
| `foundation` | (remapped to book-open ×4 in foundry) | dedicated foundry glyph? |

## Legacy icons still firing live (observed in console during the demo sweep)

- `dashboard-book-open` / `dashboard-bookmark` / `dashboard-roadmap` / `trending` — kol-dashboards internals
- `menu` / `social-github` — showcase's own chrome (TopBar/footer), not a package

## Also parked
- Badge demo never shows the `info` variant (agent verdicted MATCHES; borderline)
- `Graphic.jsx` own JSDoc example names nonexistent `pattern-05` (files are `patt-*`)
- `showcase/src/demos/MenuPopover.jsx` — unreachable (DEPRECATED-filtered), deletion
  was permission-blocked: `rm showcase/src/demos/MenuPopover.jsx`

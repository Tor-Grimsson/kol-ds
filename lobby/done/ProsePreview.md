---
component: ProsePreview
source: kol-monorepo/apps/brand/src/components/styleguide/ProsePreview.jsx#L1-L40
date: 2026-07-03
status: draft
deps: []
---

# ProsePreview

## Purpose
A full rich-text specimen: one `.kol-prose` block exercising every long-form element — H1–H4, section lede, body paragraph, blockquote, indented passage, code block, pullout, and unordered/ordered lists — so the KOL prose stylesheet can be reviewed end-to-end in one view. The "long-form" member of the type-specimen kit. Fixed structure; only a few text slots vary per brand.

## Anatomy
- `.kol-prose` root (styles all descendants via the prose stylesheet)
  - `h1`–`h4` — heading ladder (bare tags, styled by `.kol-prose` descendant CSS)
  - lede `<p>` — larger intro paragraph (`kol-sans-body-01`)
  - body `<p>` (`paragraph` slot)
  - `blockquote > p` (`quote` slot)
  - `.kol-prose-indented > p` — bordered/indented tangential passage
  - `pre > code` — code block (`code` slot)
  - `.kol-prose-pullout` `<p>` — bordered pullout callout (`pullout` slot)
  - `ul` / `ol` — unordered + ordered list samples

## Variants
No structural variants — one fixed specimen layout. Only content slots (`h1`, `paragraph`, `code`, `pullout`, `quote`) change what text appears.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| h1 | string | — | trailing text of the H1 (rendered as `H1 — {h1}`) |
| paragraph | string | — | body paragraph text |
| code | string | — | contents of the `<pre><code>` block |
| pullout | string | — | trailing text of the pullout (rendered as `Pullout — {pullout}`) |
| quote | string | `'Above as below — justice is a starfield.'` | blockquote text |

## Styling
- Root: **`kol-prose`** — the base prose contract. Heading/paragraph/list/blockquote styles come from the prose stylesheet (`packages/ui/css/prose.css` + `packages/theme/kol-typography.css`), NOT from this component.
- Lede paragraph: **`kol-sans-body-01`** + `text-strong mb-6`.
- Indented passage wrapper: **`kol-prose-indented`** — CSS `padding-left: 32px; border-left: 1px solid var(--kol-fg-16)` (in `kol-framework.css`).
- Code block: `pre` gets `bg-fg-04 border border-fg-08`; `.kol-prose pre` / `.kol-prose code` / `.kol-prose pre code` rules (margin, padding, radius, mono font, overflow) live in `kol-framework.css`.
- Pullout: **`kol-prose-pullout`** + **`kol-helper-12`** + `uppercase tracking-widest text-body`; CSS `.kol-prose-pullout` (top+bottom hairline, vertical padding/margin) in `kol-framework.css`.
- Tokens: `bg-fg-04`, `border-fg-08`, `--kol-fg-16`, `text-strong`, `text-body`.
- **App-specific bits to DROP:** the default `quote` string (`'Above as below — justice is a starfield.'`) is brand copy — replace with neutral placeholder or make it required. The `.kol-prose-indented` / `.kol-prose-pullout` / `.kol-prose pre|code` rules currently sit in the **app** framework sheet; the DS should own these under the canonical prose stylesheet (`packages/ui/css/prose.css`) alongside the base `.kol-prose` styles rather than in an app file.

## States & interactions
Static, presentational. No interaction, no state; the code block scrolls horizontally on overflow (`overflow-x: auto` from `.kol-prose pre`).

## Dependencies
None imported. Depends entirely on the `.kol-prose` stylesheet being present.

## Recreation notes
- Tier: **molecule** (fixed markup specimen; a handful of text slots).
- **Overlap flag:** the DS already ships **`ProseStylesViewer`** (`packages/ui/src/molecules/ProseStylesViewer.jsx`) — a prose showcase with variant-switching `Tag`s and a baseline-grid toggle. ProsePreview is the plain, always-on specimen body; `ProseStylesViewer` is the interactive chrome around such a body. Recreate ProsePreview as the **content block** that gets passed as `children` into `ProseStylesViewer`, rather than duplicating its own viewer. Do not build a second prose showcase.
- Slots stay props: `h1`, `paragraph`, `code`, `pullout`, `quote`. The `H1 — ` / `Pullout — ` prefixes are hard-coded labels in the source; treat them as specimen-scaffolding text (keep or drop per DS taste), but author the slot values verbatim.
- Part of the **type-specimen kit** — keep the `kol-helper-12 uppercase` pullout idiom consistent with TypeSample/TypeSpecCard captions.
- Text casing at call site: `uppercase` on the pullout is presentational; keep in CSS, do not uppercase content. All slot strings render as authored.

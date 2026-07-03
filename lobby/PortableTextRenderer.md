---
component: PortableTextRenderer
source: kol-monorepo/apps/web/src/components/prose/core/PortableTextBlog.jsx#L1-L101
date: 2026-07-03
status: draft
deps: [CodeBlock, Table, Divider, Image, ProseStylesViewer]
---

# PortableTextRenderer

## Purpose
The Sanity **Portable Text → React component map** (`portableTextBlogComponents`) that `@portabletext/react`'s `<PortableText components={…}>` consumes to render CMS long-form into `.kol-prose`-styled markup. This is the design system's **missing CMS renderer** — the counterpart to `ProseStylesViewer`, which only *showcases* the prose styles. Both plug into the same `.kol-prose` stylesheet; this one turns a Portable Text document into that markup. It is not a single component but a **config object + block-type registry** — spec it (and recreate it) as a SET: one renderer map wired to a handful of block components.

## Anatomy
The export is a components map with five sections plus one helper:
- **`types`** (custom block types): `code` → `CodeBlock` (DS), `image` → `ImageBlock`, `dividerBlock` → `<hr />`, `tableBlock` → `TableBlock`, `videoBlock` → `VideoBlock`.
- **`marks`** (inline): `link` → `<a>` with `target="_blank"` + `rel="noopener noreferrer"` for `http…` hrefs (else same-tab); `segmentTitle` → `<span className="kol-segment-title">`.
- **`block`** (text blocks): `normal` → `<p>`; `h2`/`h3` → heading **with a slug `id`** derived from the block text (anchor targets); `h4` → `<h4>` (no id); `blockquote` → `QuoteBlock`; `caption` → `<p className="caption">`.
- **`list`**: `bullet` → `<ul>`, `number` → `<ol>`.
- **`listItem`**: both → `<li><span>{children}</span></li>` — the `<span>` wrapper is required by the flex list layout in `prose.css`.
- **Helper `slugify(text)`**: lowercase → strip non-word chars → spaces to `-` → collapse repeats → trim. Feeds the h2/h3 ids.

## Variants
There is a **near-duplicate older map** at `apps/web/src/components/portable-text/components.jsx` (`portableTextComponents`) to **reconcile into one canonical map**. Differences: it has fewer `types` (no `dividerBlock`; `image` is an inline `<img src={asset.url}>` with no aspect box, not `ImageBlock`); no `segmentTitle` mark; headings have **no** slug ids; list items are bare `<li>` (no `<span>`). Keep the newer PortableTextBlog map as the source of truth and delete the old one.

## Props
Not a props-taking component — it's the `components` config passed to `<PortableText>`. The "registry" is the contract:

| registry key | section | renders | notes |
|------|------|---------|----------|
| code | types | `CodeBlock` (DS) | `@sanity/code-input` shape |
| image | types | `ImageBlock` → Figure | de-Sanitize leaf (see ImageBlock.md) |
| dividerBlock | types | `<hr>` | → DS `Divider` |
| tableBlock | types | `TableBlock` → `Table` | de-Sanitize leaf |
| videoBlock | types | `VideoBlock` → VideoFigure | de-Sanitize leaf |
| link | marks | `<a target rel>` | `_blank`+noopener for `http…` |
| segmentTitle | marks | `<span className="kol-segment-title">` | inline emphasis |
| normal / h2 / h3 / h4 | block | `<p>` / `<h2 id>` / `<h3 id>` / `<h4>` | h2/h3 get `slugify` anchors |
| blockquote | block | `QuoteBlock` (`<blockquote>`) | prose-styled |
| caption | block | `<p className="caption">` | |
| bullet / number | list, listItem | `<ul>`/`<ol>`, `<li><span>` | span wrapper = prose.css flex req |

## Styling
Everything renders **bare tags styled by `.kol-prose` descendant CSS** — the map itself carries almost no classes. The exceptions are named hooks the prose sheet targets: `kol-segment-title`, `caption`, and (via the leaf blocks) `kol-prose-figure` / `kol-caption-label` / `kol-caption-text`. No inline tokens here; the styling contract is "render inside a `.kol-prose` container."
- **App-specific bits to DROP / convert:** the `types` keys (`dividerBlock`, `tableBlock`, `videoBlock`, `code` via `@sanity/code-input`) are **Sanity schema names** — CMS-coupled. Keep them as the registry keys only if the DS renderer explicitly targets Sanity documents; a generic renderer should alias them (e.g. `divider`, `table`, `video`). The leaf components (`ImageBlock`, `VideoBlock`, `TableBlock`) are themselves Sanity-`value`-shaped and must be de-Sanitized first (see their specs).

## States & interactions
Pure render configuration — no state. The one interactive affordance is the **heading slug ids** (h2/h3), which enable in-page anchor links / a table-of-contents.

## Dependencies
- Host: `@portabletext/react` `<PortableText>` (the map is inert without it).
- DS: `CodeBlock`, `Table` (via `TableBlock`), `Divider` (for `hr`), `Image` (via the Figure the `image` type resolves to).
- Staged-separately leaves: `ImageBlock` (→ Figure), `VideoBlock` (→ VideoFigure), `QuoteBlock` (thin `<blockquote>`), `TableBlock`. This map wires them together.

## Recreation notes
- Tier: a **renderer + block-type registry SET**, not one component. Ship **one** canonical map (reconcile the two source maps; delete `portable-text/components.jsx`).
- The child block components are staged as their own briefs — de-Sanitize each (drop the `value` shape → flat props), then this map just references them. Keep `slugify` + the h2/h3 `id` behavior; it's the anchor/TOC mechanic. Keep the `<li><span>` wrapper — it's load-bearing for `prose.css` flex lists.
- Complements **`ProseStylesViewer`** (a style *showcase*): this is the *renderer*. They share the `.kol-prose` CSS contract — do not fold one into the other; the viewer displays styles, this converts documents.
- Text casing at call site: `segmentTitle` / `caption` / headings are content — render as authored, no `text-transform` in the map.

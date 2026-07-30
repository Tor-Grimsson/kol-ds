# Handoff — 2026-07-30 09:15 GMT · the showcase review marathon → wave 4

**Arc:** the 2026-07-30 all-nighter — MDX migration → lobby queue → three user review waves. Everything shipped is logged in `playbook/2026-07-30-mdx-content-migration.md` (read it; it carries every ruling). This bridge carries ONLY what's open.

## State (all live on npm, repo ahead of npm on ONE file)

theme **0.13.2** · component **0.14.1** · framework **0.7.0** · workshop **0.3.3** · icons 0.8.10. Build green, gates 5/5, 194 routes clean. **framework's `ThemeToggle.jsx` carries the UNPUBLISHED roll-motion rework** (approval-gated → 0.7.1 on user's yes) — do not publish framework without knowing that ships too.

## Waiting on the USER (surface these at session start)

1. **Proposal review:** `open _tmp/toggle-library-proposals/preview.html` — roll motion (clickable) + library glyph. Approve → land glyph in icons (→0.8.11) + publish framework 0.7.1; reject → revert ThemeToggle.jsx (one file) / redo glyph.
2. His dev rig: two stale vite instances on 5173/5174 break HMR (kill + hard-reload 5175); theme cutover v3 clears the stale dark stamp on reload.

## Wave 4 queue (user-ruled, in order)

1. **Vault-reader retype** — Documentation pages render through the workshop reader wearing `kol-prose`/`docs-article` while every other page speaks `kol-doc-*`. User: one layout = one style system. Retype `DocsArticle`/render-tokens/DocsHeader to the doc roles (workshop package, big — this is the wave's spine).
2. **Vault parity:** tag colors dead · docs search not working · no cross-references in the right rail · "View components" goes to /components generally · **no node-graph view** (TagGraph exists in the package, unrouted). Reference: kolkrabbi.io/workshop.
3. **Imported-from history** — user wants per-component origin-repo provenance ("imported when, from where, by who"). The Source-path row shipped (component-sources.json); the REPO-of-origin layer needs research (lobby done/ specs + package headers carry most of it). Consider extending component-sources.json with an `origin` field mined from lobby specs.
4. **MDX prose authoring** — the 66 mechanical .mdx docs await real per-component prose (backlog/2026-07-30-mdx-content-migration.md, superseded status: mechanism DONE, content OPEN).
5. Small: `documentation(1)`/near-empty vault pages (root INDEXes render thin — check content vs bug) · `.kol-feature-split-pull em` italic is an elder deliberate accent, left alone — flag to user if italic purge should extend to it.

## Standing laws minted tonight (obey; all in the registry doc + 02-shells)

- Width: shell 1800 · **panel 960** (ALL doc furniture incl. preview figure) · column 768 · measure 65ch; `--kol-container-max` = the shell's ladder; `.kol-full-bleed` is THE full-bleed.
- ONE code idiom: every code surface = kol-component `CodeBlock` (bare variant for framed hosts).
- Seam law: chrome borders opaque `--kol-oq-08`, never `fg-*` alpha.
- Rails: right = left idiom (`shell-nav-item kol-mono-14`); ALL rail labels = `kol-doc-eyebrow`.
- Taxonomy: atomic tiers = kol-component only; flat packages classify by package; hooks are not components.
- Prose vs docs: `.kol-prose` = blog/CMS only, never docs surfaces.
- Provenance: no component without a printed Source; metadata (frontmatter) is content, never hidden.
- Report shape (meta): done work = one checkbox line + emoji; proposals must be WIRED TO VIEW.

## Key files for wave 4

`packages/workshop/src/docs/{DocsArticle,DocumentationReader,render-tokens,DocsHeader}.jsx` [5/5] · `showcase/src/lib/vault.js` · `packages/workshop/src/tags/` (TagGraph/TagMode) · `showcase/src/lib/shell-nav.js` · playbook [5/5].

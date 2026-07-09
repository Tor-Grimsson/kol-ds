# @kolkrabbi/kol-workshop

The KOL **workshop / docs system**, lifted from the monorepo `apps/web` into the design system.

A handrolled documentation engine — no `remark`, no `gray-matter`, no `fuse.js` — plus (in later phases) the docs shell, search, and a tag system including a d3 tag graph. Sits above the other four UI packages and consumes them.

## Status

**Phase 1 — the pure engine (this release).** React-free, zero-dependency:

| Import | What |
| --- | --- |
| `parseDocsMarkdown(md)` | block + inline markdown → `{ sections, toc, introBlocks, inlineTags }` |
| `parseFrontmatter(raw)` | YAML-subset frontmatter → object (inline arrays + block lists) |
| `buildInventory(modules)` | a raw-markdown module map → a doc inventory (see the seam below) |
| `buildInventoryCounts(inv)` | status / category / content-type tallies |
| `getTagColor`, `extractDocNumber`, `cleanTitle`, `groupDocsByMajor`, … | doc/tag helpers |

```js
import { parseDocsMarkdown, buildInventory } from '@kolkrabbi/kol-workshop/engine'
```

### Content-injection seam

The package is **Vite-agnostic** — it never globs your docs. The consumer supplies the raw-markdown module map:

```js
const modules = import.meta.glob('/docs/**/*.md', { eager: true, query: '?raw', import: 'default' })
const inventory = buildInventory(modules)
```

## Roadmap

- **Phase 2** — the shell + docs viewer + tag-mode components, KOL-conformed (Button / Icon-v1 / no text-transform), chrome CSS moved into `@kolkrabbi/kol-theme`.
- **Phase 3** — content-injection seam extended to route + search config.
- **Phase 4** — flip `private` off, publish, repoint the monorepo `apps/web` onto it, delete the local copies.

Self-check: `node src/engine/__check.mjs`.

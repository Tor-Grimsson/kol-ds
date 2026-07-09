# @kolkrabbi/kol-workshop

The KOL **workshop / docs system**, lifted from the monorepo `apps/web` into the design system.

A handrolled documentation engine — no `remark`, no `gray-matter`, no `fuse.js` — plus (in later phases) the docs shell, search, and a tag system including a d3 tag graph. Sits above the other four UI packages and consumes them.

## What's in the box

Two entry points:

- **`@kolkrabbi/kol-workshop/engine`** — the pure, React-free, zero-dependency core.
- **`@kolkrabbi/kol-workshop`** — the React layer (docs viewer, shell, tag system) built on the engine.

### Engine (`/engine`)

| Import | What |
| --- | --- |
| `parseDocsMarkdown(md)` | block + inline markdown → `{ sections, toc, introBlocks, inlineTags }` |
| `parseFrontmatter(raw)` | YAML-subset frontmatter → object (inline arrays + block lists) |
| `buildInventory(modules)` | a raw-markdown module map → a doc inventory (see the seam below) |
| `buildInventoryCounts(inv)` | status / category / content-type tallies |
| `getTagColor`, `extractDocNumber`, `cleanTitle`, `groupDocsByMajor`, … | doc/tag helpers |

### React layer (`.`)

| Import | What |
| --- | --- |
| `DocumentationReader` | the docs viewer — renders one doc from the inventory (article + header + frontmatter + token render) |
| `ShellLayout`, `ShellSidebar` | the docs shell composition (adapts the DS `ShellHeader`/`ShellDrawer`/`ShellSearchOverlay`) |
| `TagModeProvider`, `TagModeGate`, `TagModeOverlay`, `TagGraph` | the tag system, incl. the d3 tag graph |
| `WorkshopSidebar`, `WorkshopDefaultSidebar` | example sidebar compositions to copy |

The React layer imports its chrome (`Icon`/`Tag`/`CodeBlock`/`Divider`/`DocsToc` from `kol-component`, `ShellHeader` from `kol-framework`) from the DS packages — it keeps **no** local copies. Chrome CSS ships in `@kolkrabbi/kol-theme` (`kol-components-workshop.css`, already in the theme aggregate).

## The content-injection seam

The package is **Vite-agnostic — it never globs your docs.** The consumer owns the `import.meta.glob` and injects the result as props:

```js
import { buildInventory } from '@kolkrabbi/kol-workshop/engine'
import { DocumentationReader, TagModeProvider } from '@kolkrabbi/kol-workshop'

const modules   = import.meta.glob('/docs/**/*.md', { eager: true, query: '?raw', import: 'default' })
const inventory = buildInventory(modules)
// pass inventory + routes/basePath + docHref(id) + tagHref(tag) into the components
```

So the package ships the **engine + chrome**, never the content — bring your own docs.

## Tailwind v4 consumers

Tailwind skips `node_modules` when scanning, so point it at this package's source — otherwise the shell's grid/sidebar/toc layout utilities never generate and the docs shell collapses to a single column:

```css
@source "../node_modules/@kolkrabbi/kol-workshop/src";
```

Self-check: `node src/engine/__check.mjs`.

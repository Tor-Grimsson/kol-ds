# @kolkrabbi/kol-content

The KOL **content / CMS system** — the two Sanity-driven streams of kolkrabbi.io, `/stack` (blog editorial) and `/work` (portfolio), lifted into one package because they share a content model and version on their own cadence.

Data is **consumer-injected** (portable text / project docs). The shared primitives — `ContentFilters`, `DropdownTagFilter`, `ShellSearchOverlay`, `GalleryCarousel`, `Avatar`, `Tag` — stay in `@kolkrabbi/kol-component` (core, used by 7–10 consumers); this package depends on them.

## What's in the box

### Stack (blog / editorial)

| Export | What |
| --- | --- |
| `StackHero` | full-bleed article hero (`variant` `default` / `tall`) |
| `ArticleHeader` | article masthead — tags, title, `AuthorLine`, meta, excerpt, hero image |
| `AuthorLine` | the author cluster (Avatar + name + role), standalone |
| `ArticleCard` | blog card family — `size` `hero` / `default` / `mini` |
| `PortableTextRenderer`, `slugify` | portable-text body → 10 block types (heading, paragraph, list, quote, code, table, image, video, divider, caption) + inline `link` / `segmentTitle` marks |
| `ShareButtons` | share bar — copy-link + X / LinkedIn / email intents |
| `SourcesReferences` | end-of-article sources / references block |

### Work (portfolio / project)

| Export | What |
| --- | --- |
| `WorkViewToggle` | Shelf ⇄ List view switch |
| `WorkCard` | project card (3D-tilt hover), 3 sizes |
| `WorkListItem` | conservative list row |
| `ParallaxShelf` | embla-driven horizontal shelf |
| `ScrollDriftGallery` | gsap scroll-triggered outside-in drift gallery |

## Injection + requirements

Components take flat prop bags / adapters — they never fetch. Portable-text bodies are passed as `blocks`; work items as arrays.

- **CSS** ships in `@kolkrabbi/kol-theme` (`.kol-prose` in `kol-typography.css` + the component sheets, all in the theme aggregate) — this package ships JS only.
- **Vite** consumer; **Tailwind v4** `@source "…/node_modules/@kolkrabbi/kol-content/src"`.
- Peer: `gsap` (ScrollDriftGallery); dep: `embla-carousel-react` (ParallaxShelf).
- No auto text-transform — every string renders in its authored case (KOL rule).

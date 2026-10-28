# LayoutsAndWebsiteLayout — a Layouts app (four frames, every page that fits) and the website's frame into the DS

**Staged:** 2026-10-28 · from kol-website (user)
**Files:** `lobby/_assets/LayoutsAndWebsiteLayout/website-layout/` — kolkrabbi.io's frame as it runs today

---

## The problem
1. **No one can see what fits where.** The system has frames and page types, but nothing shows them together. The only list is the parts table in `docs/documentation/04-compositions/18-site-frame.md`, and it is incomplete. It has `SiteHero`, the document page, `BrandBook`/`BrandAssets`, `CategoryPage` and `PageHero`, but not `BrandGuide`, `A4Pages`, `PrintStudio`, the resume kit, or the decks, notes and media pages that brand and record run inside `SiteLayout` today. site-hub, brand-hub and studio-hub each show one example, never the whole set for a frame.
2. **One of the four frames is not in the DS.** kolkrabbi.io runs its own frame: `WebsiteLayout` (renamed today from a local `SiteLayout`, which shadowed kol-framework's), with `Navbar`, `TakeoverMenu`, `Footer`, `IntroLoader` and `RouteLoader`, the cursor layer and the work-view context.

## The four frames
| Frame | Package | Shape | Runs today in |
|---|---|---|---|
| `SiteLayout` | kol-framework | the site rail (categories, foldernotes, groups), the plane with `pageWash`, the TOC rail | brand, record, site-hub, brand-hub |
| `AppShell` (+ `AppHub` · `AppStudio` presets) | kol-shell | the app rail, the tool frame, the hub and studio page sets | media, metric, studio-hub, resume, the `*-hub` apps |
| `ShellLayout` | kol-workshop | two rails (sidebar + `RightRail`) around the markdown reader | ui.kolkrabbi.io (the showcase), the workshop |
| `WebsiteLayout` | **local** — kol-website `apps/web` | top bar + takeover menu, full-bleed pages, footer, intro and route loaders, the cursor layer | kolkrabbi.io |

## Ask 1 — the website's frame, copied
Carry `website-layout/` into the DS as `WebsiteLayout`, **verbatim**. This is the same rule as the article renderer: copy it, don't redesign it.
- `layout/` — `WebsiteLayout` · `Navbar` · `TakeoverMenu` · `Footer` · `IntroLoader` · `RouteLoader`
- `cursor/` — `CursorContext` · `CursorOverlay` · `CursorTrail`; `ui/` — `AsciiCursor` · `TextPressure`; `context/` — `WorkViewContext`
- `tokens-excerpt.css` — `--kol-nav-h: 68px` (the bar's height, which no published token carries) and the other web-owned tokens, for reference
- `App-routes-excerpt.jsx` — how the site mounts it: `IntroLoader` on `/` only, `RouteLoader` always, `/workshop` and `/docs` hide the chrome

**The seams, the only changes allowed:**
- the nav items, the takeover's links and the footer's line come in as props (today they are written in `Navbar` and `TakeoverMenu`)
- the mark and the wordmark come in as props (today kol-icons' kolkrabbi files)
- which routes hide the chrome (`hideChrome`) is a prop
- the cursor layer and the intro are opt-in

## Ask 2 — the Layouts app
A new app on ui.kolkrabbi.io (`apps/layouts`, name yours):
- **Pick a frame** — the four above.
- **Its rail lists every page type that fits that frame**, each one the real package component on VOYAGER's fixture. Nothing is mocked or redrawn.
- **The known placements, as evidence** (a page may fit more than one frame; list it under each):
  - `SiteLayout`: `SiteHero` · `CategoryPage` · `PageHero`/`PageHeader` · `Brand` (book ⇄ assets) · `BrandGuide` · `MarkdownPage` + `DocumentIndex` · `A4Pages` · `PrintStudio` · the resume kit (`ResumeLibrary` · `ResumeSource` · `ResumeTreatment`) · `Decks` · `Notes` · `MediaLibrary`
  - `AppShell`: `HubHome` · `HubSettings` · `HubDev` · `StudioCreate` · `StudioDetail` · `PageShell` pages · `EditorShell` · `MediaLibrary` (explorer) · `Decks` · `Notes` · the resume kit (apps/resume)
  - `ShellLayout`: `DocumentationReader` · component, block and set pages · foundations pages
  - `WebsiteLayout`: `SiteHero`-style home sections · the article page (kol-content's Portable Text map + `StickyNavCard`) · `ListingCard` listings · `FeaturedCarousel` · `FeatureSplit` · `NewsletterBand` · `CtaGlobal`
- **The docs follow.** The `18-site-frame.md` table, its `16-app-anatomy.md` counterpart, and a new `WebsiteLayout` doc list the same pages per frame. A validation script fails the build when a page component ships without being placed under at least one frame.

## Definition of done
- [ ] `WebsiteLayout` in a DS package, verbatim apart from the seams, with kolkrabbi.io's content passed in
- [ ] the Layouts app: four frames, every page type that fits under each, live on fixtures
- [ ] the frame docs list the same pages; the validation script guards it
- [ ] published

**Remainder at kol-website once it ships:** web on the package's `WebsiteLayout` (its nav, links, footer line and mark as props); `components/layout/`, `cursor/`, `AsciiCursor`, `TextPressure` and `WorkViewContext` to `_tmp/` where nothing else uses them; bump.

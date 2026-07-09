# kol-design-system — Architecture

Load-bearing decisions and constraints. "We chose this deliberately and it has downstream consequences." Do not revisit without explicit reason.

---

## §1 — One repo, three hats; internal-vs-external is the seam

This repo **maintains**, **hosts**, and **showcases** the KOL design system. The trick that keeps the hats from fighting is the internal/external seam:

- **Internal (maintenance + showcase):** a pnpm workspace. Packages depend on each other via `workspace:*`; the showcase consumes them via `workspace:*`. Linking here is correct and fast.
- **External (consumers):** packages are **published + versioned** to npm. Consumers `npm install @kolkrabbi/kol-*`. **No linking, no symlinks, no `workspace:*` ever reaches a consumer.**

"No linking for fresh installs" and "workspace internally" are not in conflict — they are external vs internal.

**Do not** introduce a path/symlink shortcut that lets a consumer bypass the published version.

## §2 — This repo is the source of truth

The `@kolkrabbi/kol-*` packages here are canonical. The older copies in `kol-monorepo` are downstream and migrate onto the published versions. When package code changes, it changes **here** first.

## §3 — Ten UI packages + a clients tier

`theme` (CSS only) ← `loader` (Icon) ← `component` (atoms→organisms) ← `framework` (app shell). Cross-package imports use the `@kolkrabbi/*` specifier; **within** a package, imports stay relative file-to-file. The split was derived from the recent single-app source (`_kol-labs-single-init-state`), re-packaged into the monorepo's published topology.

**Fifth UI package — `kol-workshop` (added 2026-07-09):** the docs/workshop *system* lifted from the monorepo `apps/web` — a handrolled markdown engine (no remark/gray-matter/fuse.js), search, a tag system (incl. a d3 tag graph), and the docs shell. It sits **above** the other four (consumes `theme` + `icons` + `component` + `framework`); its **pure engine is React-free** and **content is injected by the consumer** (the package never globs docs itself — no baked-in Vite `import.meta.glob`). This **supersedes the earlier "four packages (fixed)" constraint** — deliberately, to avoid bloating `framework` with a markdown parser + d3. Lifted in phases; ships once the KOL-conformance sweep (Button / Icon-v1 / no text-transform / chrome CSS → theme) is complete.

**Sixth UI package — `kol-dashboards` (added 2026-07-09):** the dashboards/analytics system — hand-rolled SVG charts (**no d3**), the card family, a responsive dashboard grid, and the `MetricsDashboard` apparatus — **lifted out of `component`** into its own package. Trigger was **not** dep weight (it carries none): it's a shared capability with **multiple consumers** (every repo with a metrics/analytics view) that must **version on its own cadence**, independent of the core UI atoms. Sits above `theme`/`icons`/`component`; data is **consumer-injected** (never fetches). CSS stays in `kol-theme` (`kol-components-dashboards.css`). This **supersedes the earlier five-package count.** **Do not** fold dashboards back into `component`.

**Seventh UI package — `kol-chess` (added 2026-07-09):** the chess system — board + variants, pieces (3 SVG sets), the play/analysis apparatus (notation, playback, variation tree, game-archive table), a PGN engine, and a **bundled game-data adapter** (`./data` subpath: demo set + Backblaze-B2 CDN fetch for the full 27k-game archive) — **lifted out of `component`** into its own package. Same trigger as dashboards: **multiple consumers** + independent versioning. Deps: `chess.js` + `kol-{component,icons,theme}`. Data is adapter-injected via a `chessData` prop; CSS stays in `kol-theme`. **Do not** fold chess back into `component`.

**Eighth UI package — `kol-content` (added 2026-07-09):** the CMS/content system — the two Sanity streams `/stack` (blog editorial) + `/work` (portfolio) — lifted out of `component` into one package. Trigger: **multiple consumers** + a shared content model versioning on its own cadence. Owns the article masthead/cards/portable-text renderer + author/share/sources pieces and the work shelf/list apparatus (embla `ParallaxShelf`, gsap `ScrollDriftGallery`, `WorkViewToggle`). **Shared primitives stay in `component`** — `ContentFilters`/`DropdownTagFilter` (filtering is core, 7–10 consumers), `ShellSearchOverlay`, `GalleryCarousel` (embla wrapper), `Avatar`/`Tag`; kol-content depends on them. Data is consumer-injected; CSS (`.kol-prose`) stays in `kol-theme`. **Not CMS** — `prints` and `specimen` (type) are separate domains, now their own packages (below). Supersedes the seven-package count.

**Ninth UI package — `kol-specimen` (added 2026-07-09; renamed from `kol-foundry` the same day, pre-publish):** the type-**specimen** apparatus — typeface hero, variable-font axis playground, parsed-metric glyph inspector via optional `opentype.js`, character-set browser, font preview, and the typeface-catalog grid. **Membership test: a component must render, inspect, or manipulate a live font** — the commercial *foundry* chrome (pairings, licensing, CTA/promo cards, OpenType descriptor cards) was **excluded**, which is why the package is `specimen`, not `foundry`. Graduated from the `component/foundry` subpath. A distinct content domain (typefaces / glyph metrics, not Sanity CMS) with its own consumer + cadence. Shared primitives (`Tag`/`Pill`/`Slider`/`Button`/`Divider`/`Dropdown`/`ContentFilters`/`useAxisAnimation`) stay in `component`; `opentype.js` is an **optional** peer. **Deferred:** the `@kol/fontviewer` variable-font engine + the site loader/`FontPreviewCard` are specimen-bound, not yet extracted.

**Tenth UI package — `kol-store` (added 2026-07-09):** the commerce / storefront system — `ProductDetailLayout`, `PriceDisplay`, and the gsap `DiagonalMarqueeRiver` — lifted out of `component`; the prints store is its consumer. Form primitives (`QuantityInput`/`SpecList`/`TabsRow`/`Pill`/`Divider`/`Dropdown`) stay in `component`; `gsap` is a peer. **Do not** fold either back into `component`.

**Clients tier** (added 2026-07-03): headless service SDKs — **one package per service contract** (`@kolkrabbi/kol-*-client`), plain ESM, no React, no deps on or from the UI packages; the package version tracks its API contract. First: `kol-media-client`. **Do not** merge clients into a grab-bag package — unrelated contracts must not version in lock-step.

**Do not** collapse packages back into one app, and do not add reverse dependencies (e.g. component importing framework).

## §4 — Packages ship raw source; consumers must be Vite + Tailwind v4

No build step. Packages publish raw `.jsx` / `.css`. The loader uses `import.meta.glob` (Vite-only). Theme is Tailwind-v4-oriented CSS. This is deliberate (source-available, zero build infra) and constrains the consumer toolchain — documented in every package README.

**Do not** add a dist/transpile step without a reason that outweighs losing source-availability and simplicity.

## §5 — CSS cascade order is load-bearing

`tailwindcss` → `@kolkrabbi/kol-theme` → `kol-brand-color.css` → `kol-framework.css`. Framework chrome reads `--brand-*` / `--kol-*` custom properties defined upstream of it; reordering breaks theming. Documented in the root README and every consumer.

## §6 — The showcase is presentation + mined reference

`showcase/` is a Vite app that consumes the packages like any consumer. Its Components gallery renders live demos (safe atoms, error-boundaried) **and** a usage reference mined verbatim from ~25 real KOL apps via `scripts/extract-usage.mjs` → `docs/usage/*.md` + `showcase/src/usage/usage-index.json`. The reference is for both humans and LLMs.

## §N — Non-goals (do not reopen without an explicit ask)

- No build/transpile pipeline for packages (§4).
- No collapsing the five packages, no reverse deps (§3).
- No consumer-facing linking/symlinks (§1).
- No second maintenance home — changes land here, not in kol-monorepo (§2).

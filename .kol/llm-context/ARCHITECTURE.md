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

## §3 — Twelve UI packages + an app tier + a clients tier

`theme` (CSS only) ← `loader` (Icon) ← `component` (atoms→organisms) ← `framework` (app shell). Cross-package imports use the `@kolkrabbi/*` specifier; **within** a package, imports stay relative file-to-file. The split was derived from the recent single-app source (`_kol-labs-single-init-state`), re-packaged into the monorepo's published topology.

**Fifth UI package — `kol-workshop` (added 2026-07-09):** the docs/workshop *system* lifted from the monorepo `apps/web` — a handrolled markdown engine (no remark/gray-matter/fuse.js), search, a tag system (incl. a d3 tag graph), and the docs shell. It sits **above** the other four (consumes `theme` + `icons` + `component` + `framework`); its **pure engine is React-free** and **content is injected by the consumer** (the package never globs docs itself — no baked-in Vite `import.meta.glob`). This **supersedes the earlier "four packages (fixed)" constraint** — deliberately, to avoid bloating `framework` with a markdown parser + d3. Lifted in phases; ships once the KOL-conformance sweep (Button / Icon-v1 / no text-transform / chrome CSS → theme) is complete.

**Sixth UI package — `kol-dashboards` (added 2026-07-09):** the dashboards/analytics system — hand-rolled SVG charts (**no d3**), the card family, a responsive dashboard grid, and the `MetricsDashboard` apparatus — **lifted out of `component`** into its own package. Trigger was **not** dep weight (it carries none): it's a shared capability with **multiple consumers** (every repo with a metrics/analytics view) that must **version on its own cadence**, independent of the core UI atoms. Sits above `theme`/`icons`/`component`; data is **consumer-injected** (never fetches). CSS stays in `kol-theme` (`kol-components-dashboards.css`). This **supersedes the earlier five-package count.** **Do not** fold dashboards back into `component`.

**Seventh UI package — `kol-chess` (added 2026-07-09):** the chess system — board + variants, pieces (3 SVG sets), the play/analysis apparatus (notation, playback, variation tree, game-archive table), a PGN engine, and a **bundled game-data adapter** (`./data` subpath: demo set + Backblaze-B2 CDN fetch for the full 27k-game archive) — **lifted out of `component`** into its own package. Same trigger as dashboards: **multiple consumers** + independent versioning. Deps: `chess.js` + `kol-{component,icons,theme}`. Data is adapter-injected via a `chessData` prop; CSS stays in `kol-theme`. **Do not** fold chess back into `component`.

**Eighth UI package — `kol-content` (added 2026-07-09):** the CMS/content system — the two Sanity streams `/stack` (blog editorial) + `/work` (portfolio) — lifted out of `component` into one package. Trigger: **multiple consumers** + a shared content model versioning on its own cadence. Owns the article masthead/cards/portable-text renderer + author/share/sources pieces and the work shelf/list apparatus (embla `ParallaxShelf`, gsap `ScrollDriftGallery`, `WorkViewToggle`). **Shared primitives stay in `component`** — `ContentFilters`/`DropdownTagFilter` (filtering is core, 7–10 consumers), `ShellSearchOverlay`, `GalleryCarousel` (embla wrapper), `Avatar`/`Tag`; kol-content depends on them. Data is consumer-injected; CSS (`.kol-prose`) stays in `kol-theme`. **Not CMS** — `prints` and `foundry` (type) are separate domains, now their own packages (below). Supersedes the seven-package count.

**Ninth UI package — `kol-foundry` (added 2026-07-09):** the type-specimen apparatus — typeface hero, variable-font axis playground, parsed-metric glyph inspector via optional `opentype.js`, character-set browser, font preview, and the typeface-catalog grid: the component set a type foundry's site is built from. **Membership test: a component must render, inspect, or manipulate a live font** — the commercial chrome (pairings, licensing, CTA/promo cards, OpenType descriptor cards) was **cut** (13 components removed 2026-07-09; the live `kol-foundry@0.1.0` name is reused → republished **0.2.0**). Graduated from the `component/foundry` subpath. A distinct content domain (typefaces / glyph metrics, not Sanity CMS) with its own consumer + cadence. Shared primitives (`Tag`/`Pill`/`Slider`/`Button`/`Divider`/`Dropdown`/`ContentFilters`/`useAxisAnimation`) stay in `component`; `opentype.js` is an **optional** peer. **Deferred:** the `@kol/fontviewer` variable-font engine + the site loader/`FontPreviewCard`, not yet extracted. **Note:** "specimen" is reserved for a future paragraph/layout tester — not this component set.

**Tenth UI package — `kol-store` (added 2026-07-09):** the commerce / storefront system — `ProductDetailLayout`, `PriceDisplay`, and the gsap `DiagonalMarqueeRiver` — lifted out of `component`; the prints store is its consumer. Form primitives (`QuantityInput`/`SpecList`/`TabsRow`/`Pill`/`Divider`/`Dropdown`) stay in `component`; `gsap` is a peer. **Do not** fold either back into `component`.

**Eleventh UI package — `kol-shell` (added 2026-08-14):** the **application** shell — fixed 48px NavRail + AppShell layout root, PageShell scaffolds, GridCard, SettingsScaffold, WalkthroughPanel, ShortcutsOverlay — lifted from the hand-copied twins in kol-monitor and kol-mirror (AppShellSet lobby brief; the copies had already drifted: shared dead import, shared light-theme bug, two implementations of the same active-state ruling). **Sibling of kol-framework, NOT a variant of it** — framework's SideNav/footer/heroes are *site* chrome with a two-level navTree; this rail is deliberately flat `{icon,path,label}` app chrome. Router-agnostic (`currentPath` + `onNavigate`, children for the outlet); icons via Button's `iconComponent` seam; nav/content/shortcuts consumer-injected. CSS stays in `kol-theme` (`kol-components-shell.css` — rail tokens + the rail-scoped 2026-08-12 active-wash ruling). Consumes `component` + `framework` (ThemeToggle). **Do not** fold shell into framework or component.

**Two names left this list 2026-09-03** (page-header-one-masthead, kol-client-olina).
`ContentFilters` was never in kol-shell — it has always shipped from `kol-component`, and
this sentence was wrong from the day it was written. `PageHeader` WAS shell's and moved to
`kol-component`, deliberately and against this section, on the user's ruling: the app-shell
tier is rails, drawers and the portal frame, and a SITE with no shell could not take the
masthead without installing the whole package for one header — so kolkrabbi.io hand-built it
from `SectionText` on two pages. The rest of that page's stack (`ContentFilters`,
`ContentCollection`, `ContentCard`, `SectionText`) was already in `kol-component`, so the move
reunites one page's components in one package. Nothing circular: shell peers on component.
`kol-shell` does not re-export it — the import path changes, which is the whole migration.

**Twelfth UI package — `kol-controls` (added 2026-09-01):** hardware panel controls for instruments — knob, fader, LED, toggles, rocker, jack socket, panel selector/dropdown/input, module header, the touch `ParamSheet` — lifted from kol-monitor's rack (`KolControlsPackage`; user: *"make a controls package in the ds … it's mainly about mixer strips, knobs and stuff specific to modules, mixers and synth hardware"*). A different TIER from `component`'s app atoms — a rack fader is a 2px track on a 24px panel, not app chrome — so `Fader`/`PanelDropdown`/`PanelLabel` coexist with `Slider`/`Dropdown`/`LabeledControl` by design. Consumers: kol-monitor (rack), kol-mirror (CRT bezel, transport deck), kol-fxr (editor controls). **Modules, rack composition, routing and render loops stay in the consumers**; the package is presentational with seams (`ModuleHeader powered`, `JackSocket`'s routing props, `iconComponent`). Tokens in `kol-theme` (`kol-components-controls.css`, `--kol-ctl-*` — theme-invariant hardware caps, the set's own LED emitters, hex jack roles). **Do not** fold controls into `component`, and do not swap a consumer's rack controls for app atoms.

**Clients tier** (added 2026-07-03): headless service SDKs — **one package per service contract** (`@kolkrabbi/kol-*-client`), plain ESM, no React, no deps on or from the UI packages; the package version tracks its API contract. First: `kol-media-client`. **Do not** merge clients into a grab-bag package — unrelated contracts must not version in lock-step.

**APP TIER — `@kolkrabbi/design-editor` (added 2026-09-03, user ruling).** The
editor as one embeddable `<DesignEditor />`, moved in from kol-fxr — which had
been publishing it from its own `package.json`, so no gate, roster or taxonomy
check ever touched it. NOT a UI package and not counted as one: it is an
application that CONSUMES the UI packages as peers, it is the one package here
that ships a build (§4's exception), and it carries pixi / three / d3 which no
`kol-*` package takes. The component-tier parts of that editor still belong in
`kol-component` — the parts in `component`, the assembled app in
`design-editor`. kol-fxr is now its first consumer, and the repo that demos and
drives it.

**Do not** collapse packages back into one app, and do not add reverse dependencies (e.g. component importing framework).

## §4 — Packages ship raw source; consumers must be Vite + Tailwind v4

No build step. Packages publish raw `.jsx` / `.css`. The loader uses `import.meta.glob` (Vite-only). Theme is Tailwind-v4-oriented CSS. This is deliberate (source-available, zero build infra) and constrains the consumer toolchain — documented in every package README.

**Do not** add a dist/transpile step without a reason that outweighs losing source-availability and simplicity.

**ONE EXCEPTION — `@kolkrabbi/design-editor` (user ruling 2026-09-03).** It ships
a BUILT bundle (`dist/`, rolldown) and is the only package here that does. The
reason that outweighs the rule is that it is not a component set: it is an
embeddable APPLICATION, one export (`<DesignEditor />`) that owns its own
router and state, and it carries pixi / three / d3 — renderers no `kol-*`
package takes, and which every consumer of a Button would otherwise pay for.
Raw-source publishing exists so a consumer can read and patch a component; that
argument does not reach a 4.4MB compositor.

It arrived here by ruling, not by design: it was published from
`kol-fxr/package.json` — the app publishing itself under the `@kolkrabbi` scope
— so no gate, roster or taxonomy check ever touched it, and it sat at 0.1.0 for
two months pinning `^0.1.1` peers and `@kolkrabbi/kol-loader`, a package that no
longer exists. The lesson is the boundary, not the build: **a package in this
scope is versioned HERE or it is not versioned at all.**

The exception is the build step and nothing else. It takes the DS as peers like
any consumer, it publishes from `packages/` under the same gates, and the
component-tier parts of that editor still belong in `kol-component` — the parts
in `component`, the assembled app in `design-editor`.

## §5 — CSS cascade order is load-bearing

`tailwindcss` → `@kolkrabbi/kol-theme` → `kol-brand-color.css` → `kol-framework.css`. Framework chrome reads `--brand-*` / `--kol-*` custom properties defined upstream of it; reordering breaks theming. Documented in the root README and every consumer.

**Order is not enough — the LAYER is part of the contract (added 2026-07-30).** Framework chrome must be imported **into the components layer**:

```css
@import "@kolkrabbi/kol-framework/kol-framework.css" layer(components);
```

Unlayered rules outrank every layered rule regardless of specificity or source order, so a bare import silently promotes all framework chrome above the theme's type/utility layer. Two consumers then render the same package differently with no version difference — exactly what happened: kol-website layered it, the showcase didn't, and shell header tabs rendered 16px here and 14px there. **A component's type belongs in its own rule, never as a `kol-mono-*`/`kol-helper-*` utility class on the element** — equal specificity means the winner is decided by whichever sheet happens to load last.

## §6 — The showcase is presentation + mined reference

`showcase/` is a Vite app that consumes the packages like any consumer. Its Components gallery renders live demos (safe atoms, error-boundaried) **and** a usage reference mined verbatim from ~25 real KOL apps via `scripts/extract-usage.mjs` → `docs/usage/*.md` + `showcase/src/usage/usage-index.json`. The reference is for both humans and LLMs.

## §7 — ONE `public/`, at repo root (2026-07-15 user ruling)

Static assets (fonts, images, favicons) live in **one** `public/` at the repo root — never per-app copies. Every Vite app points at it via `publicDir: '../public'` in its config (native mechanism, preferred); a **symlink** is the fallback only for tools that can't be configured. Rationale: multiple `public/` dirs per repo made assets untrackable. **Do not** create a second `public/` — point or link to the root one.

## §N — Non-goals (do not reopen without an explicit ask)

- No build/transpile pipeline for packages (§4) — one ruled exception, `design-editor`, an embeddable app rather than a component set; the exception is the build step and nothing else.
- No collapsing the five packages, no reverse deps (§3).
- No consumer-facing linking/symlinks (§1).
- No second maintenance home — changes land here, not in kol-monorepo (§2).

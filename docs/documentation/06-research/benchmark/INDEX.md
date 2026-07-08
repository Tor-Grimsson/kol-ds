---
title: shadcn ⇄ KOL — system comparison & gap analysis
type: audit
status: active
updated: 2026-06-15
verified: 2026-06-15
description: Side-by-side of shadcn/ui and KOL across catalog, distribution, variants, theming, behavior/a11y, and docs — with prioritized gaps and opportunities.
tags:
  - domain/design-system
  - domain/components
aliases:
  - shadcn-comparison
  - benchmark
sources:
  - packages/component/src
  - packages/theme
  - packages/framework/src
  - packages/icons/src
  - showcase/src/usage/usage-index.json
---

# shadcn ⇄ KOL — system comparison & gap analysis

A point-by-point read of **shadcn/ui** (verified against `ui.shadcn.com`, June 2026) against **KOL** (this repo). The aim is not "catch up to shadcn" — the two systems aim at different surfaces. The aim is to see clearly where KOL is ahead, where it is behind, and which gaps are worth closing.

## Scope

- **shadcn/ui** — ~59 components, copy-paste-source distribution, Radix/Base UI behavior layer, CVA variants, OKLCH CSS-variable theming, a CLI + open registry + MCP server, plus Blocks/Charts/Forms.
- **KOL** — 55 mined exports across `@kolkrabbi/kol-{component,theme,framework,loader}`, published as versioned raw-source npm packages, hand-rolled behavior, CSS control-shell variants, a `--kol-*` token system with a 14-stop opacity scale, and a showcase that mines real usage from ~25 consumer apps.

**The one-line thesis:** KOL is a *design-tool / editor* system (inspectors, numeric controls, color + transparency tooling, an icon/graphic loader, an opacity token scale). shadcn is a *general web-app* system (forms, overlays, navigation, data display). Each is strong exactly where the other is thin.

---

## Finding 1 — Distribution model

| | shadcn/ui | KOL |
|---|---|---|
| Unit | Source files copied into your repo (`@/components/ui`) | Versioned npm packages (`@kolkrabbi/kol-*`) |
| Runtime dep | None for components; Radix/Base UI + CVA + tailwind-merge | The KOL packages themselves (`workspace:*` internal, published external) |
| Build step | None (you own source) | None — packages ship raw `.jsx`/`.css` (ARCHITECTURE §4) |
| Update path | Re-pull via CLI (`--overwrite`/`--diff`); no auto-update | `npm update` — standard semver |
| Install | `npx shadcn add <name>` | `npm install @kolkrabbi/kol-component` |

**Read:** Both reject the opaque-bundle model and ship readable source — same "open code" instinct. They differ on ownership: shadcn hands you the source to fork; KOL keeps a canonical home (ARCHITECTURE §2) and versions it. KOL's model is better for a *single owner across many apps* (one fix propagates by version bump); shadcn's is better for *per-project divergence*. KOL's choice is correct for its situation — **no change recommended**, but see Finding 6 for borrowing shadcn's CLI/registry without giving up versioning.

## Finding 2 — Component catalog coverage

Mapping shadcn's catalog onto KOL. ✓ = real equivalent · ~ = partial/compose · ✗ = gap.

### Where KOL has an answer
| shadcn | KOL | Note |
|---|---|---|
| Button | Button ✓ | KOL adds `iconOnly`, `quiet`, `animateIcon` |
| Input / Native Select | Input ✓ / Dropdown ✓ | |
| Textarea, Label, Slider, Switch, Checkbox | Textarea ✓, Label ✓, Slider ✓, ToggleSwitch ✓, ToggleCheckbox ✓ | naming differs (Switch→ToggleSwitch) |
| Toggle / Toggle Group | ToggleBracket ~ / SegmentedToggle ~ | KOL's are text/segmented, not icon toggles |
| Select | Dropdown ✓ | single-select only |
| Popover, Tooltip | Popover ✓, Tooltip ✓ | both on Floating UI |
| Dropdown Menu | MenuItem + MenuDropdown* ✓ | composition-based |
| Table / Data Table | Table ✓ / ✗ | no TanStack-style Data Table recipe |
| Avatar, Badge, Accordion, Collapsible, Carousel | Avatar ✓, Badge ✓, Accordion ✓, AccordionPanel ~, Carousel ✓ | |
| Separator | Divider ✓ | |
| Dialog / Alert Dialog | Modal ~ | KOL's Modal is a promise-based `prompt()`/`confirm()` only — no generic content dialog |
| Empty | AssetPlaceholder ~ | asset-specific |
| Aspect Ratio | `aspectRatio` prop on Image/Graphic ~ | not a standalone primitive |
| Sidebar | SideNav ✓ (framework) | |
| Typography | type-scale classes ✓ | class-based, not a component |

### Gaps — shadcn ships, KOL doesn't
**High-recurrence web-app staples:** `Tabs` ✗, `Card` ✗, `Alert` ✗, `Toast`/`Sonner` ✗, `Skeleton` ✗, `Progress` ✗, `Spinner` ✗ (only a `loader` icon), `Breadcrumb` ✗ (now built into the showcase by hand), `Pagination` ✗, `Radio Group` ✗, `Sheet`/`Drawer` ✗, `Command` ✗, `Context Menu` ✗, `Menubar` ✗, `Navigation Menu` ✗, `Hover Card` ~, `Scroll Area` ✗, `Resizable` ✗, `Kbd` ✗ (only a `shortcut` prop on menu items).

**Whole capabilities:** `Form` (RHF+Zod integration) ✗, `Calendar`/`Date Picker` ✗, `Chart` (Recharts) ✗, `Combobox` ✗, `Input OTP` ✗.

### KOL-only — no shadcn equivalent
This is KOL's moat, and it's substantial: **ColorSwatch, TransparentX** (color/transparency tooling), **PropertyInput, QuantityInput, QuantityStepper, Stepper** (numeric inspector controls), **ViewToggle, SegmentedToggle, ToggleBracket** (view controls), **DropdownTagFilter, ContentFilters** (content filtering), **Graphic + GRAPHICS + GRAPHIC_RAW** (SVG illustration system), **Icon** (341-icon glob-loaded set across 14 categories), **Section, SectionLabel, FullscreenOverlay, ExitPreview, AssetPlaceholder, Image**.

**Read:** The gaps cluster in *general web-app UI*; the surplus clusters in *design-tool UI*. That's coherent and intentional — KOL grew out of editors (kol-editor, kol-draw-3d, kol-radar). The question for each gap below is demand, not prestige.

## Finding 3 — Variant & styling architecture

| | shadcn/ui | KOL |
|---|---|---|
| Variant source | `cva()` config per component (`buttonVariants`), `VariantProps` types | `variant`/`size` props mapped to CSS control-shell classes (`kol-control--filled`, `kol-control-sm`) in JSX |
| Override merge | `cn()` = `twMerge(clsx())` resolves Tailwind conflicts | `className` passthrough; no conflict resolution layer |
| Composition | `asChild` via Slot — render as any child element | none — components own their root element |

**Read:** shadcn's `cva` + `cn()` gives one declarative place for variant→class mapping and clean call-site overrides; KOL's variant logic is split between JSX branching and hand-authored CSS, which is harder to audit and prone to drift (the global rule against "two ways to express the same concept" is exactly this risk). Two of KOL's missing pieces are real ergonomics gaps: **no `cn()`/tailwind-merge** (so a consumer's `className` can silently lose to a component's own class) and **no `asChild`** (so `<Button>` can't wrap a router `<Link>` — the brand app works around this with a `href` prop).

## Finding 4 — Theming

| | shadcn/ui | KOL |
|---|---|---|
| Mechanism | CSS vars, `:root` / `.dark`, `@theme inline` (Tailwind v4 CSS-first) | CSS vars `--kol-*`, `:root` / `[data-theme="dark"]`, Tailwind v4 |
| Color space | **OKLCH** (perceptually uniform) | sRGB hex + `color-mix()` |
| Token shape | flat semantic pairs (`background`/`foreground`, `primary`/`primary-foreground`) | surface tiers (`primary`/`secondary`/`tertiary`/`inverse`) **+ a 14-stop opacity scale** (`fg-01`…`fg-96`, with standard/absolute/inverse tiers) |
| Chart tokens | `chart-1..5` | none |
| Presets / generator | base-color presets + `shadcn/create` visual builder | brand-color layer (`kol-brand-color.css`), hand-authored |

**Read:** KOL's opacity scale + surface tiers is *more* expressive than shadcn's flat pairs for layered, translucent UI (exactly what editors need) — this is a genuine KOL advantage. KOL is behind on two counts: **sRGB instead of OKLCH** (KOL won't get shadcn's perceptual-uniform light/dark parity for free), and **no theme generator** (brand themes are hand-cut). Adopting OKLCH for the base tokens is a low-risk, high-quality win.

## Finding 5 — Behavior & accessibility

| | shadcn/ui | KOL |
|---|---|---|
| Behavior layer | Radix UI **or** Base UI primitives (chosen at init) | hand-rolled per component; Floating UI under Popover/Tooltip only |
| Free a11y | focus trap, ARIA roles/states, full keyboard nav, dismissal/layering, RTL | only what each component author implemented |
| RTL | `Direction` provider + `migrate rtl` codemod | none |

**Read:** **This is KOL's biggest structural risk.** shadcn inherits focus management, ARIA wiring, keyboard nav, and roving tabindex from a battle-tested primitive layer across its entire overlay/menu/form surface. KOL re-implements this per component, which means a11y quality is uneven and unverified — and the gap widens with every overlay/menu component added (Finding 2). KOL already depends on Floating UI; the realistic move is not "adopt Radix" (it would fight the raw-source, zero-build constraint) but **establish a documented a11y baseline** and a shared set of headless behavior hooks (focus-trap, roving-tabindex, dismiss) so new components inherit it instead of re-deriving it.

## Finding 6 — Docs & presentation

| | shadcn/ui | KOL showcase (now) |
|---|---|---|
| Per-component page | ✓ Preview/Code tabs, install, usage, examples, API table | ✓ Preview/Code tabs, install + import, **mined real-world usage**, prev/next — *built this session* |
| Sidebar | ✓ grouped by category | ✓ grouped by category, registry-driven — *built this session* |
| Props/API table | ✓ per prop | ✗ — `docs/usage/*.md` exist but aren't structured prop tables |
| Multiple labeled examples | ✓ (Button: 13 variants) | ~ one canonical demo per component |
| Installation CLI tab | ✓ | ✗ npm-install only (no CLI) |
| a11y notes per component | ✓ (links to primitive API) | ✗ |
| Mined real consumer usage | ✗ | ✓ **KOL-only** — verbatim examples from ~25 apps |
| LLM/AI access | MCP server | the mined `usage-index.json` + `docs/usage/*.md` are LLM-readable, but not served over MCP |

**Read:** After this session the showcase matches shadcn's core presentation pattern, and KOL has one thing shadcn doesn't — **mined real-world usage** as a first-class reference. Remaining presentation gaps: structured **props/API tables** (the package source already carries the data — see the inventory; this can be generated), **multiple labeled examples** per component, and **per-component a11y notes** (blocked on Finding 5).

---

## Recommendations — prioritized

1. **Establish an a11y baseline + shared behavior hooks** (Finding 5). Highest structural value. Document the keyboard/ARIA contract every overlay/menu/form component must meet; extract focus-trap / roving-tabindex / dismiss into shared hooks so new components inherit it. Do this *before* filling overlay gaps in Finding 2, or the gaps inherit the same unevenness.
2. **Add `cn()` (clsx + tailwind-merge) and an `asChild` pattern** (Finding 3). Small, mechanical, immediately removes the silent-className-loss footgun and the `<Button href>` workaround. Lowest effort-to-value ratio on the list.
3. **Close the high-recurrence component gaps, demand-ranked** (Finding 2): `Tabs`, `Card`, `Alert`, `Toast`/`Sonner`, `Skeleton`, `Progress`, then generalize `Modal` into a proper `Dialog`. Skip the design-tool-irrelevant ones (`Calendar`, `Chart`, `Input OTP`) until a consumer needs them.
4. **Generate per-component props/API tables** for the showcase (Finding 6). The data already lives in the package source; the inventory pass proves it's extractable. Adds the one piece of shadcn's doc page KOL still lacks.
5. **Move base tokens to OKLCH** (Finding 4). Low-risk quality win for light/dark parity; keep the opacity-scale system (it's an advantage).
6. **Publish a shadcn-compatible registry + (optional) MCP** (Findings 1, 6). shadcn's CLI consumes third-party registries; a `registry.json` for KOL would let any shadcn user `npx shadcn add @kol/<name>` *without* KOL abandoning versioned packages. Pairs naturally with serving the existing mined usage over MCP. Highest-ceiling, lowest-urgency — do it once the catalog and a11y are solid.

## What KOL should NOT copy

- **Per-project source ownership** — KOL's canonical-home + versioning model (ARCHITECTURE §2) is the right call for one owner across many apps. Keep it.
- **Radix/Base UI as a hard dependency** — fights the raw-source / zero-build constraint (ARCHITECTURE §4). Borrow the *a11y contract*, not the dependency.
- **Flattening the token system** to shadcn's simple pairs — KOL's opacity scale + surface tiers is more capable for layered editor UI. Keep it; just move it to OKLCH.

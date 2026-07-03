---
component: ShellHeader
source: kol-monorepo/apps/web/src/components/shell/ShellHeader.jsx#L1-L153
date: 2026-07-03
status: draft
deps: [Icon, SearchInput, ThemeToggleButton, KolWordmark, KolLogomark]
---

# ShellHeader

## Purpose
The shell's sticky top chrome: a two-row bar. Row 1 is the brand block (KOL logomark/wordmark + an optional consumer brand-logo) plus the right-side controls (search trigger, theme toggle, hamburger). Row 2 is a horizontal tab strip of top-level sections derived from `routes`, plus optional dock-left / dock-right rail toggles. All actions are delegated up via callbacks — the header holds no shell state except reading the theme.

## Anatomy
```
<div class="sticky top-0 z-50 shrink-0 bg-surface-primary">
  <div class="border-b border-fg-08">                          ← Row 1
    <div class="mx-auto max-w-[1800px] px-4 py-4 md:px-6 lg:px-8">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-8">                   ← brand block
          <Link to="/" class="shell-header-logo … w-auto lg:w-[256px]">
            <KolLogomark class="h-6 w-6 md:hidden"/>
            <KolWordmark class="h-6 w-auto hidden md:block"/>
          <Link to={basePath}>?                                 ← brandLogoSrc <img class="wordmarkBrand h-6 w-auto">
        <div class="flex items-center gap-1">                   ← controls
          <SearchInput iconOnly onClick={onSearchOpen}/>?
          <button onClick={toggleTheme}><Icon name="theme-toggle" size=18/></button>   ← inline theme toggle
          <button onClick={onMenuOpen}>{hamburgerSvg}</button>? ← 3-bar inline SVG
  <div class="border-b border-fg-08">                          ← Row 2
    <div class="mx-auto max-w-[1800px] px-4 md:px-5 lg:px-6">
      <div class="shell-tabrow-items">
        <div flex gap:24 flex:1>{routes.map → <NavLink class="shell-tab">[Icon]{label}</NavLink>}</div>
        <SearchInput value/onChange/>?                           ← inline row search (onSearch)
        <div class="hidden lg:flex … pb-2">
          <button onClick={onNavToggle}><Icon name="dock-left"/></button>?
          <button onClick={onTocToggle}><Icon name="dock-right"/></button>?
```
`getSectionRootPath(route, basePath)` (L4-L16) resolves each tab's target: `route.path` (absolute or `basePath`-joined) else first child's path else `basePath`. `isRoot` tabs get NavLink `end`.

## Variants
- **Row-2 controls** are all conditional: tabs always render from `routes`; the inline search only if `onSearch` given; each dock toggle only if its callback given (and only `lg:flex`).
- **Brand-logo present / absent** — the consumer `<img>` renders only when `brandLogoSrc` is set.
- **Toggle button tint** reflects state: `navCollapsed`/`tocCollapsed` → `text-fg-32`, else `text-fg-64`.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| brandLogoSrc | string | — | optional consumer logo shown beside the KOL wordmark |
| brandLogoAlt | string | `''` | alt text for that logo |
| routes | array | `[]` | source of the Row-2 section tabs |
| basePath | string | `'/'` | base for tab path resolution |
| onMenuOpen | fn | — | hamburger click (renders button only if set) |
| onNavToggle | fn | — | dock-left button → toggle left nav |
| onTocToggle | fn | — | dock-right button → toggle TOC |
| navCollapsed | bool | — | tints the dock-left button |
| tocCollapsed | bool | — | tints the dock-right button |
| onSearchOpen | fn | — | search-icon click (renders `SearchInput iconOnly` only if set) |
| onSearch | fn | — | inline Row-2 search onChange (renders that input only if set) |
| searchQuery | string | — | controlled value for the inline search |

## States & interactions
- **Theme toggle:** reads `useTheme()` from `@kol/ui`, calls `toggleTheme` on click. The button markup is hand-rolled (`h-9 w-9 rounded-md text-fg-64 hover:bg-fg-08 hover:text-fg` + `Icon name="theme-toggle"`) — see DROP.
- **Active-route:** Row-2 tabs are `NavLink`s (`shell-tab`), auto-highlighting; root tab uses `end`.
- **Search:** icon trigger (Row 1) calls `onSearchOpen`; optional live field (Row 2) is a controlled `SearchInput`.
- **Hamburger / rail toggles:** pure callbacks up to `ShellLayout`.
- No open/close, scroll-hide, or focus-trap of its own — it is a stateless bar (sticky, `z-50`).

## Styling
- Tailwind utilities; KOL tokens `bg-surface-primary`, `border-fg-08`, `text-fg`, `text-fg-64`, `text-fg-32`. Icon buttons share the `h-9 w-9 items-center justify-center rounded-md … hover:bg-fg-08 hover:text-fg` recipe. Container `mx-auto max-w-[1800px]` with per-row padding.
- The `lg:w-[256px]` on the logo link deliberately reserves the nav-column width so tabs align to the grid.
- Transitions: `transition-opacity` on brand links, `transition-colors` on buttons.
- **App-specific bits to DROP / convert:**
  - **Inline theme toggle → compose DS `ThemeToggleButton` + `useTheme`.** The hand-rolled `<button>`+`Icon name="theme-toggle"` duplicates the atom; the standalone `ThemeToggle` atom is deprecated in favor of `ThemeToggleButton` (controlled) + the `useTheme` hook. Recreate with that pair.
  - **`Link to="/"` and `Link to={basePath}` are react-router** + a hardcoded KOL home target. Make the whole brand block a **`brand` slot** (render-prop or node) so the consumer supplies its own logo + link element; keep `KolLogomark`/`KolWordmark` only as the default slot content.
  - **`NavLink` tabs are react-router** — accept a `linkComponent`/`renderTab` seam, or take resolved `{ href, active }` so the DS tab strip is router-agnostic.
  - `hamburgerSvg` (inline 3-bar SVG) — replace with `Icon name="menu"`/equivalent from the DS icon set.
  - CSS hooks `shell-header-logo`, `shell-tabrow-items`, `shell-tab`, `wordmarkBrand` live in app CSS — re-tier into DS or express inline.

## Dependencies
- **@kol/ui:** `Icon`, `SearchInput`, `useTheme`, `KolWordmark`, `KolLogomark` (already DS atoms).
- **react-router-dom:** `Link`, `NavLink` — to be abstracted behind a link/brand seam.
- Target composition: **ThemeToggleButton** (DS) instead of the inline toggle.

## Recreation notes
- Tier: **organism** (composite top nav; part of the shell system).
- Prop seams to keep: `routes`, `basePath`, `onSearchOpen`, `onSearch`/`searchQuery`, `onMenuOpen`, `onNavToggle`/`onTocToggle`, `navCollapsed`/`tocCollapsed`, `brandLogoSrc`/`brandLogoAlt`.
- New seam to add: **`brand`** slot (default = `KolLogomark`+`KolWordmark`) and a `linkComponent`/`renderTab` for routing — this is the "light extraction" the brief calls for.
- Compose, don't re-roll: **ThemeToggleButton + useTheme** for the toggle, **SearchInput** (already used) for both search affordances, **Icon** for dock/menu glyphs.
- Keep `getSectionRootPath` as the tab-target resolver, but it should accept already-resolved routes if the DS standardizes a route shape.

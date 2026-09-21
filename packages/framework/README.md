# @kolkrabbi/kol-framework

The KOL app shell — sidenav, layout, theme toggle, footer, and heroes, plus the brand color layer. Site chrome shared across KOL apps.

`SideNav` takes its nav data as props (`navTree` + `getActivePage`) so the navigation tree stays app-local.

## Install

```sh
npm i @kolkrabbi/kol-framework @kolkrabbi/kol-component @kolkrabbi/kol-theme
# react, react-dom, react-router-dom are peers
```

## Use

```css
@import "tailwindcss";
@import "@kolkrabbi/kol-theme";
@import "@kolkrabbi/kol-framework/kol-brand-color.css";
@import "@kolkrabbi/kol-framework/kol-framework.css" layer(components);
```

`layer(components)` is **required**, not optional. Unlayered rules outrank every
layered rule regardless of specificity, so a bare import promotes framework
chrome above the theme's type layer and the same package renders differently
per consumer.

```jsx
import { PageLayout } from '@kolkrabbi/kol-framework'
import { NAV_TREE } from './sidebars.config'

<PageLayout navTree={NAV_TREE} pageWash="var(--kol-fg-02)" />
```

Exports: `PageLayout` (alias `AppShell`), `SideNav`, `ThemeToggle`, `Layout`, `PageHero` (aliases `BrandHero`, `SubPageHero`), `PageSection`, `PortalFooter`, `ScrollToTop`.

## Tailwind v4 consumers

Tailwind skips `node_modules` when scanning, so add this next to the imports above — otherwise the shell's layout utilities never generate and the PageLayout grid collapses:

```css
@source "../node_modules/@kolkrabbi/kol-framework/src";
```

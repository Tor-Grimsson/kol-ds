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
@import "@kolkrabbi/kol-framework/kol-framework.css";
```

```jsx
import { AppShell } from '@kolkrabbi/kol-framework'
import { NAV_TREE, getActivePage } from './sidebars.config'

<AppShell navTree={NAV_TREE} getActivePage={getActivePage} />
```

Exports: `AppShell`, `SideNav`, `ThemeToggle`, `Layout`, `PageSection`, `PortalFooter`, `ScrollToTop`, `BrandHero`, `SubPageHero`.

## Tailwind v4 consumers

Tailwind skips `node_modules` when scanning, so add this next to the imports above — otherwise the shell's layout utilities never generate and the AppShell grid collapses:

```css
@source "../node_modules/@kolkrabbi/kol-framework/src";
```

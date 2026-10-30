---
title: Website frame
type: reference
status: active
created: 2026-10-28
updated: 2026-10-28
description: The frame a website stands in
aliases:
  - website frame
  - WebsiteLayout
  - takeover menu
sources:
  - packages/framework/src/website/WebsiteLayout.jsx
  - packages/framework/src/website/Navbar.jsx
  - packages/framework/src/website/TakeoverMenu.jsx
  - packages/framework/src/website/Footer.jsx
  - packages/foundry/src/WebsiteIntroLoader.jsx
  - showcase/src/nav/placements.js
  - apps/layouts/src/App.jsx
tags:
  - domain/compositions
  - audience/agency-internal
related:
  - "[[INDEX|Compositions]]"
  - "[[18-site-frame|Site frame]]"
  - "[[16-app-anatomy|App anatomy]]"
  - "[[04-workshop-system|Workshop system]]"
---

# Website frame

kolkrabbi.io's frame, carried verbatim into the design system (LayoutsAndWebsiteLayout, 2026-10-28). One top bar, everything else behind its menu button, full-bleed pages, a footer. What the site says comes in as props.

## The parts

| Part | Package | What it is |
|---|---|---|
| `WebsiteLayout` | kol-framework | the frame: skip link, the bar, the page (`children`, or the router's `<Outlet />`), the footer, the cursor layer when `cursor` is on |
| `WebsiteNavbar` | kol-framework | the one top bar: wordmark, the tools slot on its routes, the menu button; hides on scroll down, returns on scroll up |
| `TakeoverMenu` | kol-framework | the full-bleed menu: the big mark, the studio lines and blurb, the social link, the theme toggle, the links bottom-right |
| `WebsiteFooter` | kol-framework | `© <year> <owner>` and back to top |
| `WebsiteIntroLoader` | kol-foundry | the intro curtain: the word in a variable font (TextPressure), the arrow, scroll, swipe or a key slides it away |
| `RouteLoader` | kol-framework | a no-op, kept so the site's mount needs no diff |
| `CursorProvider` · `useCursor` · `CursorOverlay` · `CursorTrail` | kol-framework | the cursor layer: the pointer's position, the ring a page lights, the intro's spring trail |
| `AsciiCursor` | kol-component | the ASCII cursor the frame mounts with `cursor` (the evolved twin of the site's copy) |
| `WorkViewProvider` · `useWorkView` | kol-framework | the work page's view and search, shared by the bar's tools slot and the page |
| `--kol-nav-h` | kol-framework.css | the bar's height, 68px; a full-bleed hero reserves it |

## The props

| Prop | What it carries | kolkrabbi.io passes |
|---|---|---|
| `wordmark` · `logomark` | raw SVG strings, inked with `currentColor` | kol-icons' `kolkrabbi-wordmark` and `kolkrabbi-logomark` |
| `name` | the marks' labels | `Kolkrabbi` |
| `navItems` | `[{ to, label }]`, the takeover's links | Studio · Work · Foundry · Stack · Prints · Workshop |
| `takeover` | `{ lines, blurb, social: { href, label, icon } }` | the studio block and the Instagram link |
| `owner` | the footer's line | `Kolkrabbi` |
| `hideChrome` | path prefixes or `(pathname) => bool` | `['/workshop', '/docs']` |
| `tools` | `{ routes, node }` for the bar's tools slot | `{ routes: ['/work'], node: <WorkViewToggle /> }` |
| `cursor` | `true` mounts the ring and the ASCII cursor | `true` |

## Pages

<!-- placements: website -->
Every page that fits WebsiteLayout, from `showcase/src/nav/placements.js` (the list apps/layouts and `validate-placements` read).

| Page | Placement |
|---|---|
| `SiteHero` | fits, placed for review |
| `FeaturedCarousel` | fits, placed for review |
| `FeatureSplit` | fits, placed for review |
| `NewsletterBand` | fits, placed for review |
| `CtaGlobal` | fits, placed for review |
| `StackHero` | runs here today |
| `ArticleHeader` | runs here today |
| `StickyNavCard` | runs here today |
| `ContentCollection` | runs here today |
| `SectionText` | runs here today |
| `PageSection` | runs here today |
| `ProductDetailLayout` | fits, placed for review |
| `PrintsGrid` | fits, placed for review |
| `TypefaceSpecimenPage` | fits, placed for review |
| `FontViewerSection` | fits, placed for review |
| `FoundryOpentypeFeatures` | runs here today |
| `FoundryTypefaceDetails` | fits, placed for review |
| `FoundryTypefacePairing` | runs here today |
<!-- /placements: website -->

## Mounting it

1. Mount `WebsiteIntroLoader` on `/` only, outside the frame, with the site's word and font.
2. Make the frame a layout route: `<Route element={<WebsiteLayout … />}>` around the pages.
3. A full-bleed hero starts under the bar; give it `var(--kol-nav-h)` of top room.
4. Open apps/layouts (5212, `pnpm layouts`) and pick WebsiteLayout in the switcher pinned at the foot. Every page above is shown inside it, the way the apps use it.

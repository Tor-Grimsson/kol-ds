---
title: Save to home screen
type: playbook
status: active
created: 2026-10-26
updated: 2026-10-26
audience: internal
description: Making a KOL app open from the iPhone home screen
tags:
  - domain/workflow
  - audience/agency-internal
  - pattern/workflow
aliases:
  - home screen
  - add to home screen
  - standalone
related:
  - "[[INDEX|Apps tier]]"
  - "[[../../documentation/02-icons/05-app-icons|App icons]]"
---

# Save to home screen

How a KOL app opens from the iPhone home screen like an app: no Safari chrome, its own icon, its title clear of the status bar, and the dark ground right to the bottom of the screen. Mirror's shape (`kol-mirror/index.html`), which is fxr's.

| Layer | Who ships it | What it is |
|---|---|---|
| Head tags | the app, `index.html` | manifest link, Apple meta, `viewport-fit=cover`, `theme-color` |
| Manifest | the app, `public/manifest.webmanifest` | `display: standalone`, name, colours, icons |
| Icons | the app, `public/touch-icons/` | see [[../../documentation/02-icons/05-app-icons\|App icons]] and `/app-icon` |
| Ground and top inset | **kol-theme ≥ 0.191.0**, `kol-base-tokens.css` | `html` on `--kol-surface-primary`; standalone `body` padded by the top inset |

## 0. Prerequisites

- `@kolkrabbi/kol-theme` 0.191.0 or later, through `core` or the umbrella. Older themes leave `html` unpainted and the top unpadded (see 4).
- The app's icon, made with `/app-icon`.

## 1. Head tags

```html
<link rel="apple-touch-icon" href="/touch-icons/apple-touch-icon-dark.png" />
<link rel="manifest" href="/manifest.webmanifest" />
<meta name="mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-title" content="Mirror" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<meta name="theme-color" content="#121215" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
```

`black-translucent` puts the page under the status bar; `viewport-fit=cover` is what lets it reach there. The two go together, and together they make the top inset the page's to pad (step 3).

## 2. Manifest

```json
{
  "name": "Mirror",
  "short_name": "Mirror",
  "id": "/",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "background_color": "#121215",
  "theme_color": "#121215",
  "icons": [
    { "src": "/touch-icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
    { "src": "/touch-icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" },
    { "src": "/touch-icons/icon-512-maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" },
    { "src": "/touch-icons/apple-touch-icon-dark.png", "sizes": "180x180", "type": "image/png", "purpose": "any" }
  ]
}
```

The in-repo tool apps carry theirs at `public/apps/<name>.webmanifest`.

## 3. What the theme does

Nothing for the app to write. kol-theme 0.191.0 ships two rules every app loads:

```css
html { background: var(--kol-surface-primary); }
@media (display-mode: standalone) {
  body { padding-top: env(safe-area-inset-top, 0px); }
}
```

- **The padding** moves the title below the status bar. A browser tab reports no inset and is unchanged.
- **The ground.** Standalone, the viewport is shorter than the screen by the top inset. The padding pushes the content one inset past it, so the overflow covers the bottom; `html` keeps whatever shows behind the status bar and below the shell dark. Without it the bare canvas shows white there, in dark mode too: tokens paint nothing.

An app that padded the top itself (Mirror's `index.css`, fxr's `kol-editor.css`) drops its copy on the bump. The values are the same, so the two don't stack.

## 4. Before 0.191.0

kol-framework painted `html`, so a site on it got the ground; Mirror and Monitor don't import kol-framework and showed a ~62pt white strip at the bottom. fxr looked right only because its editor stylesheet loads on every route. On an older theme, bump it. Don't hand-copy the rules.

## 5. Verification

On the iOS simulator (or a phone), open the app in Safari, Share → Add to Home Screen, open it from the home screen:

- [ ] the title clears the status bar
- [ ] no white band at the top or the bottom, in both themes
- [ ] the icon is the app's dark tile, not a screenshot

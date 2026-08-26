# @kolkrabbi/kol-shell

The KOL **application shell** — the fixed 48px NavRail, the AppShell layout
root, and the page scaffolds an app is built from. Lifted 2026-08-14 from the
hand-copied twins in kol-monitor ("Monitor") and kol-mirror ("Hall of
Mirrors").

**App chrome, not site chrome.** kol-framework owns the site register (SideNav
with a two-level navTree, footer, heroes); this rail is deliberately flat
`{ icon, path, label }`. They are different components, not variants.

## Requirements

Same consumer contract as every KOL package — raw `.jsx` source, so:

- **Vite + Tailwind v4** consumer
- `@source "../node_modules/@kolkrabbi/kol-shell/src"` in your CSS (Tailwind
  skips `node_modules`; see the kol-theme README for the full `@source` contract)
- CSS cascade: `tailwindcss` → `@kolkrabbi/kol-theme` → brand color → framework
  CSS `layer(components)` — the shell's chrome (`kol-components-shell.css`)
  ships inside kol-theme ≥0.41.0
- Peers: `@kolkrabbi/kol-{theme,component,framework,icons}` + React

## Pieces

| Piece | What it is |
|---|---|
| `AppShell` | Layout root — rail + content offset by `--kol-shell-rail-width`. Router-agnostic: children + `currentPath`/`onNavigate` |
| `NavRail` / `useNavHidden` | The fixed rail — logomark top, items, spacer, ThemeToggle, bottom items. Full-bleed routes flip `useNavHidden` |
| `PageShell` / `PageBleed` | Page scaffold — `mode="scroll"` or `"fixed"`; gutter `--kol-shell-page-pad`, `PageBleed` breaks it |
| `PageHeader` | Title + mono subtitle as values (kills the tab-driven inline fork) |
| `ContentFilters` | The catalog organism — chips, expanding pill search, view/layout strips, render-prop |
| `TabStrip` | The flat text-tab idiom (view modes, settings tabs) |
| `GridCard` | A4 card + `list` row + monitor's `expanded` 2×2; preview fits via `.kol-shell-card-preview--*` |
| `SettingsScaffold` / `SettingsSection` / `LabelRow` | The settings idiom — tabs feed the header; 160px label rows |
| `WalkthroughPanel` | Centred stepped intro card; steps/illustrations/actions are content |
| `ShortcutsOverlay` | Blurred scrim + flat 2-col shortcut sheet at `--kol-z-modal` |
| `Logomark` | Fetch-and-inline SVG mark (currentColor-safe in dark mode) |

## Wiring (react-router example)

```jsx
import { AppShell } from '@kolkrabbi/kol-shell'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Icon from './icons/Icon'   // your registry, via the iconComponent seam

const NAV = [
  { icon: 'nav-library', path: '/library', label: 'Library' },
]
const BOTTOM = [{ icon: 'nav-settings', path: '/settings', label: 'Settings' }]

export default function Layout() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  return (
    <AppShell
      items={NAV} bottomItems={BOTTOM}
      logomark={{ svgUrl: '/svg/favicon-01.svg', title: 'Monitor' }}
      currentPath={pathname} onNavigate={navigate}
      iconComponent={Icon}
    >
      <Outlet />
    </AppShell>
  )
}
```

## Laws carried natively

- **Rail active state (user ruling 2026-08-12):** ink `--kol-oq-96` in every
  state; hover = the `--kol-oq-04` wash; active route = that wash **held on**,
  keyed off `aria-current="page"`. Never `selected`/`pressed`. Both source
  repos' overrides die on adoption.
- **Rail stacking:** `--kol-z-sticky` — above content, below overlay/modal
  (monitor's raw `z-70` rail sat above its own `z-50` overlays).
- **No auto-casing:** the source repos' `text-transform: uppercase` strips are
  dropped — author labels in the case they should render.
- **Grid geometry (documented default):** catalog grid = `repeat(6, 1fr)`
  gap 24 · list = `repeat(4, 1fr)` gap 8.
- **Shortcuts single-source:** feed ONE array to both `ShortcutsOverlay` and
  the settings page's `LabelRow` map — the twice-maintained lists drifted in
  both source repos.

## Theme boot

Re-stamp the theme before first paint (both repos' `main.jsx`, the canonical
snippet — a helper would be four lines of ceremony):

```js
import { applyTheme, getInitialTheme } from '@kolkrabbi/kol-framework'
applyTheme(getInitialTheme())
```

## Stays per-app

Domain surfaces (rack, studio, detail pages), accent bindings, product names,
logomark files, nav arrays, walkthrough/shortcut/settings **content**,
touch-device gates.

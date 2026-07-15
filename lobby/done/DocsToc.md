---
component: DocsToc
source: kol-monorepo/apps/web/src/components/workshop/docs/DocsToc.jsx#L1-L63
date: 2026-07-03
status: draft
deps: [useScrollSpy]
---

# DocsToc

## Purpose
A table-of-contents nav for long docs pages. Renders a flat list of in-page anchor links and highlights the heading currently in view (IntersectionObserver-driven scroll spy). Used in the workshop docs shell sidebar.

## Anatomy
```
nav
└── ul  space-y-0
    └── li (per toc entry, key=item.id)
        └── a  href="#{item.id}"   [active class when activeId === item.id]
              {item.label}
```
`toc` is an array of `{ id, label }`. Anchors link to `#id`; a matching in-page element with that `id` must exist for the spy to observe it.

## Variants
None (single form). The only per-item variance is the **active** state toggled by scroll position.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| toc | `{ id, label }[]` | — | the list of headings to render + observe |
| onNavigate | function | — | optional click handler, called with the click event on any link |

## Styling
- `nav` → `ul.space-y-0` → `li` → `a`.
- Link class in source: **`shell-sidebar-link block`** plus `active` when current.
- **`shell-sidebar-link` is an app-only CSS class** (defined in `packages/ui/css/components.css`, NOT a DS token/utility). Its rule is:
  - `font-family: var(--kol-font-family-mono)`, `font-size: 13px`, `padding: 4px 0`, `border-radius: 4px`, `display: block`, `transition: all 0.15s ease`
  - base color `color-mix(in srgb, var(--kol-surface-on-primary) 64%, transparent)` (i.e. **`text-fg-64`** equivalent)
  - `:hover` and `.active` → `color-mix(... 100% ...)` (i.e. **`text-fg-96/100`** / full-emphasis foreground)
- **App-specific bits to DROP on recreation:** the `shell-sidebar-link` class entirely. Rebuild its look with DS tokens/utilities: mono type, `13px`, `py-1`, `rounded`, `block`, `transition-colors`, `text-fg-64` default, `hover:text-fg-96` and active `text-fg-96` (or the DS's full-emphasis foreground token). Do not depend on the consumer stylesheet.

## States & interactions
- **active** (current heading): full-emphasis foreground; toggled purely by scroll position via IntersectionObserver.
- **hover**: link goes to full-emphasis foreground.
- **click**: sets the browser hash (native anchor), and calls `onNavigate(event)` if provided (consumer can e.g. prevent default / smooth-scroll / close a mobile drawer).
- No disabled/focus styling in source — add focus-visible on recreation.
- Scroll-spy mechanics in source: `IntersectionObserver` over `document.getElementById(id)` for each toc id, `rootMargin: '-80px 0px -80% 0px'`, `threshold: 0`; picks the topmost intersecting entry as active; re-subscribes when `toc` changes; unobserves on cleanup.

## Dependencies
- **RECONCILE onto DS `useScrollSpy`** (`packages/component/src/hooks/useScrollSpy.js`). The source hand-rolls its own IntersectionObserver; the DS already ships an equivalent. Replace the inline effect + local `activeId` state with:
  `const activeId = useScrollSpy(toc.map(t => t.id))`.
  - Note the behavioral deltas to reconcile: DS hook defaults `rootMargin: '-30% 0px -60% 0px'` and adds edge-locking (top → `activeId=null`, bottom → last id) plus a scroll listener; source uses `rootMargin: '-80px 0px -80% 0px'` and no edge lock. Pass a matching `rootMargin` option if the tighter top offset matters, otherwise adopt the DS defaults.
- No DS visual components composed — it is a nav + anchors.

## Recreation notes
- Tier: **molecule** (a small nav that composes the `useScrollSpy` hook).
- Props stay `toc` (`{id,label}[]`) and `onNavigate`. Consider a `getHref` or `activeClassName` override only if a second consumer needs it — otherwise keep minimal.
- **Drop the `shell-sidebar-link` class** and restyle with DS tokens/utilities (mono 13px, `py-1`, `rounded`, `block`, `transition-colors`, `text-fg-64` → `text-fg-96` on hover/active). This is the key coupling to sever.
- Swap the inline IntersectionObserver for **`useScrollSpy`**; delete the local `useState`/`useEffect` observer block.
- Add focus-visible styling (absent in source).
- Text casing: `item.label` is authored by the caller and rendered verbatim — no auto text-transform.

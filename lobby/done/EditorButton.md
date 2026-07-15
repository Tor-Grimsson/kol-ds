---
component: EditorButton
source: kol-monorepo/apps/brand/src/editor/components/EditorButton.jsx#L1-L100
date: 2026-07-03
status: draft
deps: [Button, Icon]
---

# EditorButton

## Purpose
A near-verbatim fork of the DS `Button` that exists for ONE reason: it resolves icon names against the editor's own icon registry (`EditorIcon`, backed by `src/editor/icons/svg/`) instead of the DS `Icon`. Every visual is identical — same `kol-btn-*` classes, same variant/size/hover-swap logic, same icon-only handling. It is not a new atom; it is evidence of a missing injection seam on `Button`. The recreation target is a `Button` enhancement, not a component (see Recreation notes).

## Anatomy
```
<button type onClick disabled class="kol-btn {variant} {size} [animate] [quiet] [className]" style={mergedStyle} aria-label?>
  {content}
</button>
```
Where `content` is:
- icon-only → `renderIcon(iconOnly, iconOnlyHover)`
- icon(s)+text → `<span class="flex items-center gap-2">[leftIcon] {children} [rightIcon]</span>`
- text-only → `children`

`renderIcon` uses `EditorIcon` (not DS `Icon`); hover-swap wraps two absolutely-positioned `EditorIcon`s in `<span class="kol-icon-swap-container">`. Skips the `href`/`<a>` branch entirely — editor buttons are never links.

## Variants
- **variant**: `primary` → `kol-btn-primary`, `accent` → `kol-btn-accent`, `outline` → `kol-btn-outline`, `ghost` → `kol-btn-ghost`, else → `kol-btn-secondary`. (Note: no `control` alias branch — the DS `Button` has one, this fork doesn't.)
- **size**: `sm` → `kol-btn-sm kol-mono-12`, `lg` → `kol-btn-lg kol-mono-16`, else `kol-btn-md kol-mono-14`.
- **quiet** → `kol-btn-quiet`; **animateIcon** → `kol-btn-animate`.
- **iconOnly** — square icon-only button with `aria-label` fallback `'Button'`.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| children | node | — | button label |
| variant | primary\|secondary\|accent\|outline\|ghost | `primary` | `kol-btn-{variant}` |
| size | sm\|md\|lg | `md` | `kol-btn-{size}` + mono type class |
| iconLeft / iconRight | string | — | icon name (left/right), resolved via EditorIcon |
| iconLeftHover / iconRightHover | string | — | hover-swap icon name |
| iconOnly / iconOnlyHover | string | — | icon-only name + hover-swap |
| animateIcon | bool | `false` | `kol-btn-animate` |
| quiet | bool | `false` | `kol-btn-quiet` |
| iconSize | number | `16` | EditorIcon px size |
| onClick | function | — | click handler |
| disabled | bool | `false` | disabled attr |
| type | string | `'button'` | button type attr |
| className | string | `''` | extra classes |
| style | object | `{}` | inline style (merged with icon-only flex style) |
| ...props | — | — | spread last (aria/data attrs) |

## Styling
- KOL button atom classes (DS-tier): `kol-btn`, `kol-btn-{primary,secondary,accent,outline,ghost}`, `kol-btn-{sm,md,lg}`, `kol-mono-{12,14,16}`, `kol-btn-animate`, `kol-btn-quiet`, `kol-icon-swap-container`, `kol-icon-default`, `kol-icon-hover` — all from `packages/theme/kol-components-atoms.css`, identical to DS `Button`. Nothing app-specific in the CSS.
- Tailwind utilities (inline): `flex items-center gap-2` on the icon+text wrapper.
- Inline styles: hover-swap container `{ position:'relative', display:'inline-flex', width/height:iconSize, overflow:'hidden' }`; swap icons `{ position:'absolute' }`; icon-only merged style `{ lineHeight:0, display:'inline-flex', alignItems:'center', justifyContent:'center' }`.
- **App-specific bits to DROP:** the ONLY divergence from DS `Button` is `import EditorIcon from '../icons/EditorIcon'` and every `<EditorIcon>` call. That editor icon registry is app/editor state — it must NOT enter the DS. There is also a small drift to reconcile: this fork lacks the `control` variant alias, the `iconGap` prop, the `selected`/`aria-pressed` state, the `href`/`<a>` link branch, and the `-2px` icon margin nudges that DS `Button` has — do not port the fork's reduced surface; keep DS `Button`'s fuller API.

## States & interactions
- **hover** — icon hover-swap via `kol-icon-default`/`kol-icon-hover` (CSS-driven crossfade); `kol-btn-animate` disables default button hover to feature icon animation.
- **disabled** — native `disabled`, dims via `kol-btn` CSS.
- **quiet** — dimmed at rest, brightens on hover.
- No `selected`/toggle state (unlike DS `Button`). No focus/active handling beyond the atom CSS.

## Dependencies
- **Button** (DS) — the thing this should collapse into; the fork mirrors its API 1:1.
- **Icon** (DS) — the default icon component the injection seam falls back to; the fork swaps it for `EditorIcon`.
- `EditorIcon` (app/editor, `src/editor/icons/EditorIcon`) — the app-only dependency that motivated the fork; stays in the app.

## Recreation notes
- Tier: **NOT a new atom — this is a `Button` enhancement.** Do not recreate `EditorButton` in the DS. Kill the fork.
- **The real ask:** add an icon-component injection seam to DS `Button` so consumers can resolve icons against their own registry. Recommended shape: an `iconComponent` prop (defaulting to the DS `Icon`) — e.g. `iconComponent = Icon`, then `renderIcon` uses `const IconCmp = iconComponent; <IconCmp name=... size=... />`. A render-prop (`renderIcon={(name,size)=>...}`) is an acceptable alternative if a component prop is too rigid. Either way, `Button`'s default behavior is unchanged (falls back to DS `Icon`).
- Once `Button` accepts `iconComponent`, the editor passes `iconComponent={EditorIcon}` and `EditorButton.jsx` is deleted; the editor keeps its own icon registry, the DS keeps ownership of the button.
- No new tokens — all `kol-btn-*` / `kol-icon-*` classes already live in the DS theme.
- While adding the seam, keep DS `Button`'s full API (`control` alias, `iconGap`, `selected`/`aria-pressed`, `href` link branch, icon margin nudges). Do not regress to the fork's smaller surface.
- Text casing: button labels come from `children` authored at the call site — no auto text-transform in the component. Keep it that way.

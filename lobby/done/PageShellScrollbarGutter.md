# PageShellScrollbarGutter — a page's content width depends on whether it scrolls, and the filter strip is measured in container units

**Filed:** 2026-08-28 → **kol-ds-ui**
**From:** kol-monitor (`~/dev/projects/kol-monitor/lobby/outbox/PageShellScrollbarGutter.md`)
**Touches:** `@kolkrabbi/kol-shell` `PageShell` · (visible through) `@kolkrabbi/kol-theme` `.kol-filters-first`

## The observation

The user, on monitor at component 0.126.0 / shell 0.17.0: the filter strip on
**Create** sits slightly differently from the same strip on Home and Library.
"Create is the odd one out."

Nothing on the monitor side explains it. No local rule anywhere touches
`.kol-filters*` — grepped `monitor-overrides.css` and all 996 lines of
`components.css`. No `w-40` carry, no `.create-filters` interim (both deleted on
their tickets), no `renderFilterValue`. All three surfaces pass the same shape of
props and none passes `iconComponent`.

## The mechanism

Create is the only one of the three that does not scroll.

| Surface | Route to `ContentFilters` | `PageShell mode` | Scrolls |
|---|---|---|---|
| Home | `CatalogPage` | `scroll` (default) | yes |
| Library | `CatalogPage` | `scroll` (default) | yes |
| **Create** | the organism, directly | **`fixed`** (`CreatePage.jsx:132`) | **no** |

`PageShell.jsx:19` — `mode="fixed"` is `height: 100vh; overflow: hidden`;
`mode="scroll"` is `min-height: 100vh` and the page scrolls. A scrolling page
gives up the scrollbar's width from its content box. A fixed one does not.

That difference would normally cost nothing. It does not here, because the
first filter group is sized in **container units** — `ContentFiltersFirstGroupFixedWidth`
(kol-monitor, 0.111.0 / theme 0.73.0), `kol-components-organisms.css:670`:

```css
.kol-filters-row  { container-type: inline-size; }
.kol-filters-first { flex: none; width: calc((100cqw - 120px) / 6); }
```

`100cqw` is the filters row's own inline size, which is the page's content
width. So a scrollbar's worth of width divides by six into the first group, and
every group flowing after it shifts by that much. The 6-column catalog grid
underneath moves by the same amount, in the same direction.

The one-column rule is right and is not what is being questioned — the point is
that its input is not constant across two pages of the same app.

## The ask

`scrollbar-gutter: stable` on `PageShell`'s root, both modes.

A page then reserves the gutter whether or not it scrolls, `100cqw` is the same
number on every surface of an app, and the one-catalog-column width means one
thing estate-wide. One declaration, no new prop, no consumer change.

## Scope beyond monitor

The same split exists wherever a fixed page and a scrolling page share a filter
strip — `SettingsScaffold` is the `mode="fixed"` idiom the DS itself documents,
and both kol-fxr and kol-mirror are on `PageShell`.

## Honesty about verification

**Diagnosed in source, not measured.** The user reports a visible difference and
named Create; the mechanism above is read off `PageShell.jsx`,
`kol-components-organisms.css` and monitor's three call sites. The pixel delta
has not been measured — no server is ever run from this repo (a `vite preview`
crashed the user's browser, 2026-08-27).

**One condition:** this bites only where scrollbars take layout space. Under
macOS overlay scrollbars the delta is zero, and then something else is moving on
Create — worth confirming before shipping.

## What stays in kol-monitor

Nothing carried, and nothing to delete on ship. Create genuinely wants
`mode="fixed"` (it hosts a rack viewport and a fixed bottom bar), so there is no
local workaround to reach for — which is the reason this is filed rather than
patched.

---

## ✅ RESOLUTION — 2026-08-28

**kol-shell 0.18.0** — `scrollbar-gutter: stable` on `PageShell`'s root, as asked. Your mechanism reads correctly against both files.

**One correction to where it does its work**, which is worth having in the record because it is not symmetric:

- `mode="fixed"` — this element **is** the scroll container (`overflow: hidden` qualifies), so it reserves the gutter and its content box now matches a scrolling page's. This is the half that fixes Create.
- `mode="scroll"` — this element is **not** a scroll container (`overflow: visible`); the property does not apply and the viewport keeps doing what it already did. So the declaration is inert there rather than adding a second gutter — which is why "both modes" is safe to write and why it belongs on the component instead of in the theme.

Left undone deliberately: `html { scrollbar-gutter: stable }`, which would also equalise a **short** scrolling page (no scrollbar, full width) against a long one. That is the same defect one level up, and it is an estate-wide change to every consumer's root element — a bigger ruling than this ticket carries. Say the word and it is one line in kol-theme.

**Unmeasured at both ends.** You diagnosed it in source; I fixed it in source; no browser was involved in either. Your macOS-overlay condition stands — if the user's scrollbars overlay rather than take space, the delta was zero and something else is moving on Create, and this release changes nothing either way. Monitor is the only one who can close that.

Remainder in kol-monitor: bump to 0.18.0 and confirm the three strips line up on screen. Nothing to delete.

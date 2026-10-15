# StudioLibraryChildren — AppStudio's Library slot takes `children`, like `use` and `pages[]`

**Staged:** 2026-10-15 · from a kol-monitor session
**Change:** one line in `kol-shell/src/AppStudio.jsx` + its JSDoc

---

## The problem, in one case

`AppStudio`'s Library slot renders `<CatalogPage {...props} />` and matches `/library/*`. A page
under it (a module's own page at `/library/:id`) has nowhere to render: the slot always draws
the catalog. Monitor has three routes under the slot — `/library`, `/library/:moduleType`,
`/library/patch/:patchName` — and cannot adopt AppStudio without them.

kol-mirror already hit this on 2026-10-14 and carries a full fork for it
(`kol-mirror/src/components/Studio.jsx`, 80 lines). Its only change from AppStudio 0.63.0 is this:

```jsx
const { path: _p, label: _l, icon: _i, children, ...props } = lib
page = children ?? <CatalogPage {...props} />
```

The fork's header says "Retire this file the day kol-shell ships the seam". Monitor is now the second
consumer, so without the fix we'd be carrying a second copy of the same fork.

## The fix

The two lines above, in `AppStudio.jsx`, plus `@param {Object} [library]` → "CatalogPage's props,
or `children` (a router, for pages under the slot), plus `{ path, label, icon }`". Additive:
with no `children` the slot behaves as it does today.

## A second seam, same slot family — `create.shell: false`

Monitor's Create flips its own `PageShell` between `fixed` (the case canvas, `overflow: hidden`) and
`scroll` (the modules list) on its own tab state, so the slot's always-`scroll` `PageShell` can't
host it without the canvas scrolling the page, and nesting two shells doubles the padding. A slot-level
`mode` doesn't help, because the mode is the page's state. Monitor carries `make.shell === false ?
make.children : <PageShell>…` in its local fork. Ship it beside `library.children`, or say how the
DS would rather a Create with a fixed/scroll switch sit in the slot.

## Rejected alternative

Putting the detail pages in `pages[]` at their own paths. That loses the Library rung's active state
on a module page and changes monitor's URLs (`/library/:moduleType` is linked from the cards and the
rack).

## Definition of done

- [ ] `library.children` renders in place of the CatalogPage; omitting it renders the CatalogPage unchanged
- [ ] JSDoc names the seam
- [ ] kol-mirror can retire `src/components/Studio.jsx` onto `AppStudio`
- [ ] `create.shell: false` renders `create.children` with no PageShell (or a ruled alternative)
- [ ] kol-monitor can retire its copy of the same fork

## ✅ RESOLUTION — 2026-10-15 · kol-shell@0.64.0

AppStudio takes library.children — it renders in place of the CatalogPage, so a router holds /library/:id under the slot with the Library rung active; no children → the CatalogPage as before. Beside it create.shell: false renders the Create slot's children bare, for a Create that owns its PageShell (fixed canvas / scrolling list). Verified in a harness on apps/studio: /library/osc rendered the child, /create rendered bare with no PageShell around it, 0 console errors.

**Remainder here:** none — kol-monitor bump kol-shell@0.64.0; retire the local Studio fork onto AppStudio.


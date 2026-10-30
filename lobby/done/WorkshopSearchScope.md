# WorkshopSearchScope — Settings › Search picks which spaces are in view; search and the tab bar follow it

**Staged:** 2026-10-29 · from kol-hq (`site/`, the estate docs app on kol-workshop). User: let the user choose which repos' docs are in view, so search and the tab bar cover that scope · one "Scope" row in the existing Settings tab, Search section, replacing "This space only" · All repos · This repo · Pick repos (a ticked list) · not a new tab · *"I dont want any reinventions"*.

## The problem
`ShellLayout`'s Settings › Search has one switch, **This space only** (`prefs.limitToSpace`, `ShellLayout.jsx` settingsSections). It can only say "this space" or "all". A workshop with several spaces (kol-hq's site: kol-hq, dotfiles, more to come) can't narrow to a chosen set, and the tab bar always shows every space.

## The fix
- Replace the switch with a **Scope** row of the rail's existing `type: 'choice'`: **All · This · Pick**.
- **Pick** shows one `type: 'switch'` row per space under it (the space label), ticked = in scope. No new row type, no new control.
- One pref replaces `limitToSpace`: `scope: 'all' | 'this' | string[]`. Read an old `limitToSpace: true` as `'this'`.
- **Search** (quick search and `SearchPage`) covers only the scoped spaces.
- **The tab bar** shows only the scoped spaces. `This` keeps the current space's tab. The active space always stays visible, so the user can't hide the page they are on.

## Definition of done
- [ ] Scope row (All · This · Pick) in Settings › Search in place of This space only, per-space switches under Pick
- [ ] search and the tab bar follow the scope; the active space never disappears
- [ ] old `limitToSpace` read as `This`
- [ ] published


---

## ✅ RESOLVED — 2026-10-29

Shipped **kol-workshop 0.44.0**.

- Settings › Search: **Scope** replaces This space only. It is the rail's existing `type: 'choice'` row, **All · This · Pick**. Pick adds one `type: 'switch'` row per space (the route's label). No new row type or control.
- One pref, `scope: 'all' | 'this' | string[]`. An old `limitToSpace: true` reads as This. Choosing Pick starts from what was in view, and a Pick with nothing ticked reads as This, so the tab bar and search never disagree.
- Quick search passes the scoped ids to kol-search, which already takes a list. The engine is unchanged.
- `SearchPage` reads the new `ShellSearchScopeContext` and scopes its results and its own scope row. Outside a shell nothing changes.
- The tab bar shows only the scoped spaces, and the active one always stays.
- Walked in apps/workshop:
  - an old `limitToSpace` read as This, with 1 of 6 tabs;
  - Pick listed six switches, and ticking Components gave 2 tabs;
  - unticking Docs while on /docs kept its tab;
  - SearchPage "icon" gave 2 results in scope `components` against 4 in All;
  - quick search in scope `docs` returned only docs.

  Screenshots are in `_tmp/2026-10-29-search-scope/`.

**Remainder at kol-hq:** bump `site/`.

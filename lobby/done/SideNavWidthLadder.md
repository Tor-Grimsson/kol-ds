---
component: SideNavWidthLadder
source: kol-framework/kol-framework.css#L46 (`--kol-sidenav-w: 16rem`) · kol-website/apps/brand/src/styles/sidenav-collapse.css (the local carry)
staged: 2026-08-27
status: draft
deps: [SideNav, useDragResize, kol-framework]
---

# SideNavWidthLadder — the rail's default width is a ladder, not one number

`SideNav` opens at `--kol-sidenav-w: 16rem` (256px) at every width above the
1024 collapse. On a desktop the brand book's footer wordmark (`Kolkrabbi
Vinnustofa · 2026`) truncates at that width, and the user's ruling
(2026-08-27, brand): **320 on desktop, 264 on laptop, collapsed on tablet,
hamburger on mobile.** The last two the package already does (`≤1024` forces
`--kol-sidenav-w-collapsed`; `<768` is the drawer). The first two are one
token declared twice.

## The ask

In `kol-framework.css`, replacing the single `16rem`:

```css
:root { --kol-sidenav-w: 264px; }
@media (min-width: 1536px) { :root { --kol-sidenav-w: 320px; } }
```

`useDragResize` needs nothing: it writes the live drag to the same token
inline and snaps back to "the stylesheet default" — which is now the
breakpoint's value, so the snap lands on 264 or 320 depending on the window.
A stored drag (`localStorage['kol-sidenav-w']`) still wins on load, as today.

The 1536 threshold is Tailwind's `2xl`, the site's own desktop rung; if the
framework carries a named desktop breakpoint, use that instead.

## Carried locally meanwhile

`apps/brand/src/styles/sidenav-collapse.css` — the two lines above, verbatim.
Deleted on the bump.

## Definition of done

- [ ] `--kol-sidenav-w` is 264 below 1536 and 320 from it, in the framework stylesheet
- [ ] brand deletes its override on the bump and the rail opens at 320 on a 1920 window with no stored drag

---

## ✅ RESOLUTION — 2026-08-28

Shipped as **kol-framework 0.32.0**, the two lines as asked: `:root { --kol-sidenav-w: 264px }` and `@media (min-width: 1536px) { :root { --kol-sidenav-w: 320px } }` (the framework carries no named desktop breakpoint; 1536 = `2xl`, per the foundations' breakpoint law). `useDragResize` untouched — it snaps to whichever rung the window is on, a stored drag still wins on load.

- [x] `--kol-sidenav-w` is 264 below 1536 and 320 from it, in the framework stylesheet
- [ ] brand deletes its override on the bump and the rail opens at 320 on a 1920 window with no stored drag — **kol-website's**

Two things named, not decided: the app shell's rail (kol-shell 0.13.0, a collapsed `SideNav`) opens on the same ladder now; and `--kol-shell-toc-w` stays 16rem, so the 2026-08-01 "equal rails" ruling reads lopsided on either rung — 🔴 held for the user. Ceiling (ponytail): a window resized across 1536 mid-session keeps its boot rung as the snap-to-default target until reload — `useDragResize` captures the stylesheet default once, before the first inline write.

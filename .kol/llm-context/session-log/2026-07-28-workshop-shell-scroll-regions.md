# Workshop shell — three independent scroll regions

**Date:** 2026-07-28
**Agent:** Grim (Fable 5)

Consumer-reported (kol-website workshop): the shell had ONE scroll container wrapping the whole grid — sidebars rode along on a `sticky + max-h` hack, so rails co-scrolled with main, got cut at the bottom, and edge-bounce chained everywhere. Rebuilt `ShellLayout` as three independent scroll regions and published **kol-workshop 0.1.7**.

- `ShellLayout.jsx`: Nav/Toc rails = own `overflow-y-auto` regions (`h-full min-h-0`, scrollbar hidden via existing `.shell-sidebar-sticky`); Main = own scroller, locked to `overflow-hidden` in full-height mode (`ShellFullHeightContext` — iframe embeds); `overscroll-none` on all three kills chaining + rubber-band bounce; one wrapper level dropped; `scrollbarGutter: stable` moved to main
- No API change — contexts and props untouched; theme CSS untouched
- `package.json` 0.1.6 → 0.1.7 · `docs/operations/SHIPPED-PACKAGES.md` row bumped
- Verify: repo build ✓ · published `+ @kolkrabbi/kol-workshop@0.1.7` · **git push = user's** (pinged)
- NB: two-repo mandate honored — change landed here directly, no `_tmp` ledger; consumer bump (kol-website 0.1.6→0.1.7 + app-side `html` overscroll rule) happens website-side same session

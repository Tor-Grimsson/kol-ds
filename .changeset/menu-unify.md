---
"@kolkrabbi/kol-component": minor
---

Menu-family unification, step 1: `MenuPopover` is now a deprecated alias of `MenuItem` — the two triggers had identical APIs and duplicate implementations (hand-rolled fixed positioning vs floating-ui). One implementation remains (floating-ui: portal, auto-flip, scroll-tracking, focus management). Existing `MenuPopover` call-sites keep working; note the trigger now renders MenuItem's chrome (chevron) and the panel is portal-rendered. Migrate imports to `MenuItem`; the alias goes away in the next major.

---
component: PublicSansByLink
source: kol-fxr plan 44 (`~/dev/projects/kol-fxr/.kol/llm-plan/44-logged-out-home-and-the-fonts.md`)
staged: 2026-10-28
status: draft
---

# PublicSansByLink

**Raised:** user, 2026-10-28: *"its only used in apps/document … we should just import it via link, not via. actual fonts"* → *"I think Public should just use link. ticket that to DS"*

## The problem
`kol-typography.css` (pulled in by `@kolkrabbi/kol-theme/core`) declares four Public Sans `@font-face` rules at `/fonts/public-sans/…` (lines ~1117–1130 in 0.194.0). Every consumer of `core` carries them; the README tells apps to serve the files from `public/fonts/`. fxr has no `public-sans` folder and never sets Public Sans, so nothing loads, but the declaration and the README rule say otherwise. Only apps/document uses the family.

## The ask
- Drop the Public Sans `@font-face` rules from `kol-typography.css`.
- Where Public Sans is used (apps/document, or whatever stylesheet its type classes live in), load it with a Google Fonts `css2` link, variable weight, italic included.
- README: Public Sans is not a self-hosted file an app must serve.

## Done when
`kol-theme/core` declares no Public Sans `@font-face`; apps/document renders Public Sans from the link; the README's "serve from /fonts" line no longer names public-sans.


---

## ✅ RESOLVED — 2026-10-28

Shipped **kol-theme 0.195.0**. `kol-typography.css` declares no Public Sans `@font-face`; the sheet's `--body` still names it, and an app that renders a document sheet adds the Google Fonts css2 link (variable weight, italic) — apps/document and the showcase do. README: Public Sans is not a file an app serves. kol-ds-ui's `public/fonts/public-sans/` to `_tmp/`. Walked: apps/document `/project` renders `.kol-sheet` in Public Sans from the link, no `/fonts/public-sans` request.

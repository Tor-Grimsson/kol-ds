---
component: FontFolderNaming
source: kol-website — public/fonts restructure 2026-08-14
staged: 2026-08-14
status: draft
deps: [kol-theme]
---

# FontFolderNaming — lowercase-kebab the theme's font URL paths, drop the dead Text reservation

## The ask (user ruling 2026-08-14, kol-website session)

1. **Rename the statics folder kol-theme's @font-face URLs point at:
   `/fonts/Right-Grotesk/` → `/fonts/right-grotesk/`.** The consumer cleaned its
   `public/fonts/` to one convention (lowercase kebab: `jetbrains-mono/`,
   `tg-foundry/`, `tg-typefaces/`) and the one folder it cannot rename is this
   one — kol-theme owns the URLs (98 static-cut woff2 srcs in
   `kol-typography.css`). Coordinated wave: theme ships the new paths, consumers
   rename the folder on the same bump.

2. **Drop the `"Right Grotesk Text"` @font-face pair**
   (`kol-typography.css:727-740`). Verified consumer-side: no token exists (the
   theme's own port note says only sans/narrow/compact are tokenized), no CSS
   rule and no app code ever sets the family, so browsers never download the
   files. kol-website has already retired its two `Right-Grotesk-Text/` woff2
   from `public/fonts/` — the declaration now points at files consumers are not
   expected to serve. If the "optical-grade body (reserved)" idea is still live,
   re-add it the day something renders with it.

## Why it's the DS's call

The URLs live in kol-theme; a consumer renaming the folder alone 404s every
static cut. Conversely the theme renaming alone breaks every consumer that
hasn't moved the folder — hence one coordinated wave, called out in whatever
changelog line the wave ships with (see `PublishWaveChangelog`).

## What stays with kol-website

On ship: rename `public/fonts/Right-Grotesk/` → `right-grotesk/` and bump.
Nothing else — the folder contents are already exactly the 98 files the theme
declares.

## Resolution — 🟢 closed 2026-08-14

Shipped **theme 0.41.0** (registry-verified), flagged **BREAKING** in the
changelog per the new wave discipline:

- All 98 static srcs in `kol-typography.css` → `/fonts/right-grotesk/`; header
  comment synced; every declared file verified present on disk post-rename.
- The `"Right Grotesk Text"` pair (727–740) deleted; the header's stale
  "Loaded cuts" list (which still named Text/Text Compact/Text Spatial/Text
  Wide — never declared) corrected to the 7 real families.
- This repo's own consumer half done in the same pass: `public/fonts/`
  renamed (`right-grotesk/`, plus `right-grotesk-ttf/` — same convention,
  referenced by showcase/foundry), showcase demo URLs + theme README synced,
  foundry doc-comment synced (**foundry 0.5.5**). `Right-Grotesk-Text/`
  statics quarantined to `_tmp/2026-08-14-right-grotesk-text-statics/`.
- Left as found: `public/fonts/Right-Grotesk-Mono/` — zero references
  anywhere (JetBrains is the mono); not this ticket's call.

📌 Remainder is kol-website's: rename `public/fonts/Right-Grotesk/` →
`right-grotesk/` on the theme ≥0.41.0 bump.

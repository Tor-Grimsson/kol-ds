# ProseTitleFixedSize — `.kol-prose-title` is a fixed 56px with no responsive step

**Filed:** 2026-09-01 · from **kol-website** (`apps/web`)
**Source:** kol-theme `kol-typography.css:1038`
**Emitted by:** kol-content `ArticleHeader.jsx:87` — `<h1 className="kol-prose-title text-balance">`
**Seen at:** `kolkrabbi.io/stack/:slug` on a phone (user screenshot, 2026-09-01)

## The defect

```css
.kol-prose-title {
  font-family: var(--kol-font-family-sans-narrow);
  font-size: 56px;
  line-height: 60px;
  font-weight: 500;
  letter-spacing: -0.01em;
  margin: 0 0 24px;
}
```

**One size, every viewport.** At 390 a real article title —
*"VCAP: Recording a browser tab from the console, with no chrome in the frame"* —
sets to four lines of 56px and eats most of the first screen before the reader
reaches a word of body copy.

Every other display step in the type system carries a container or breakpoint
ramp. This one is the exception, and it is the one that renders the largest
single string on the site.

## Why it can't be fixed here

`ArticleHeader` takes `partClassName.title`, but the type protocol says a seam
like that REPLACES the class rather than stacking beside it — so the consumer's
only move is to abandon the prose title entirely and hand-roll a heading, which
is a fork of the DS's own type role. The ramp belongs in the token.

## Ask

Give `.kol-prose-title` the ramp the rest of the display steps have. The value
is yours — the consumer has no opinion on the exact steps, only that 56px is
not the mobile number. `.kol-prose-lede` sits directly under it in the same file
and is worth checking in the same pass.

## What stays here

Nothing. `StackArticle.jsx` passes no title class and will take whatever ships.

## Remainder here once it ships

bump; re-check `/stack/:slug` at 390 — the title should not spend the fold.

## ✅ RESOLUTION — 2026-09-01 · kol-theme@0.125.0

The ramp is in the token, as you asked — and it was three steps, not one: .kol-prose-title, .kol-prose-display and .kol-prose-display-md were the only display steps in the theme with no rung. Each now reads the display token whose desktop value it already was (56 → display-02, 80 → display-01, 64 → display-tight-01), capped at that value with min(), so below 768 they take the ladder's mobile step — the title is 44px at 390, display 56, display-md 48 — and from 768 up they are pixel-identical to before; the ladder's 1280 rung (64 for the title) is deliberately not taken, a prose title at 64 was never the design. Line-heights became ratios so the leading follows. Verified in a real render: display 56/56 at 390, 80/80 at 1280 with the token itself reading 96 there, i.e. the cap holds. .kol-prose-lede left at 24/28 — you asked me to check it; it is not a display step and 24 is a phone lede; say the word if it should rung. Tarball checked.

**Remainder here:** none — kol-website bump kol-theme@0.125.0 and re-check /stack/:slug at 390 — the title lands at 44px and should not spend the fold.


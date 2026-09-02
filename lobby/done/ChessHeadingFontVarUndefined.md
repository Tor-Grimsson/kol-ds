# The chess pack asks for `--kol-font-family-heading` and nobody defines it

**Filed:** 2026-09-01 · from **kol-chess** · kol-theme 0.115.0

## The finding

`kol-components-chess.css` sets `font-family: var(--kol-font-family-heading)`
in **10 rules**, and no file in the theme defines that token — grep across every
shipped `.css` in 0.115.0 finds only the 10 usages:

```
.board-playback__title        .chess-hero__title
.board-playback__value        .chess-hero__value
.board-playback__avatar-name  .chess-hero__side-value
.analysis-table__result       .chess-hero-metric__value
.chess-donut-chart__title     .chess-stacked-bar-chart__title
```

`var()` with no fallback is invalid-at-computed-value, so the property falls to
the **inherited body font** — under a consumer's Tailwind preflight that is
`ui-sans-serif`. Every hero metric, board-playback title/name, analysis result
and chart title renders system sans while the rest of the page wears Right
Grotesk.

Found on the kol-chess mobile field review (01/09, live site): the visible
symptom was the stat values on `/` in the wrong face, which took a while to
separate from the (unrelated) font-folder deploy bug found the same evening —
this one reproduces locally too, and outlives that fix.

## The ask

Bind the token or retire it, your pick:

- **Bind:** `--kol-font-family-heading: var(--kol-font-family-sans-compact)`
  (or plain sans) in base tokens — one line, the 10 rules start resolving.
- **Retire:** swap the 10 rules to the family vars the rest of the theme
  already speaks (`--kol-font-family-sans-compact` is what the heading ramp
  uses).

Either way the chess pack stops being the only pack that references a token
the theme never shipped.

## ✅ RESOLUTION — 2026-09-01 · kol-theme@0.119.0

Retired, not bound: the 10 chess rules speak --kol-font-family-sans-narrow by name. The token WAS defined — but in kol-framework's kol-brand-color.css, a site-tier sheet an app-shell consumer never imports, which is why it resolved for the website and to nothing for you. sans-narrow is the face that seam bound it to, so nothing moves where it already worked. The framework seam stays for site consumers.

**Remainder here:** none — kol-chess bump kol-theme@0.119.0 (remember node_modules/.vite); re-check the / hero metrics and chart titles render Right Grotesk Narrow.


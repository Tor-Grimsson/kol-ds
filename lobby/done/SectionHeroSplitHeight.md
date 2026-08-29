---
component: SectionHeroSplitHeight
source: kol-website/apps/web/src/routes/Studio.jsx#L31-L60
staged: 2026-08-26
status: draft
deps: [SectionHero]
---

# SectionHeroSplitHeight — the split variant's height class is built at runtime, so Tailwind never emits it

## Purpose

Studio hero on `variant="split" height="80"` renders ~175px tall — the text
column's own height — instead of 80vh.

`SectionHero.jsx:154` (0.80.0):

```js
${(HEIGHTS[height === 'lg' ? 'full' : height] || height).replace(/\bh-/g, 'min-h-')}
```

The media presets are literal strings (`h-[70svh] md:h-[80vh]`) and Tailwind
sees them in the package source. The split variant rewrites them to
`min-h-[70svh] md:min-h-[80vh]` **at runtime** — those tokens exist in no
source file, so the v4 scanner never generates them (checked: not in
kol-theme's CSS, not in kol-website's built CSS). The class lands on the
element with no rule behind it. Every split preset is dead; only a consumer
who passes a literal `min-h-…` string gets a height.

Compounding it: the media half in split gets the caller's node — a
`kol-full-bleed-hero-media` img is `position: absolute`, so the half
contributes no height either.

## Ask

A literal `SPLIT_HEIGHTS` map (`full: 'min-h-dvh'`, `80: 'min-h-[70svh]
md:min-h-[80vh]'`, `60: …`, aliases) beside `HEIGHTS` — strings the scanner
can read — and no runtime rewrite. The split's media half should size itself
(`h-full` / `min-h-0` on a relative half) so an absolute media node fills it.
Same rule as the tokens law: a class Tailwind cannot see is not a class.

## Consumer state

Studio hero stays on `variant="split" height="80"`; renders collapsed until
this ships.

## ✅ RESOLUTION — 2026-08-26 · kol-component@0.80.1

`SPLIT_HEIGHTS` is a literal map beside `HEIGHTS` — `full` / `screen` / `lg` = `min-h-dvh`, `80` = `min-h-[70svh] md:min-h-[80vh]`, `60` / `md` = `min-h-[50svh] md:min-h-[60vh]` — no runtime rewrite, so Tailwind emits every class; the media half is `h-full min-h-0` so an absolute media node fills it. Measured on the Section Set at 1000 tall: full → 1000 with the media half at 1000; the `80` classes → 800; `60` → 600.

**Remainder here:** none — kol-website bump kol-component 0.80.1; Studio hero renders at 80vh with nothing changed.


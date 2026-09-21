---
component: kol-theme
source: kol-client-hrafn/apps/web/src — 57 call sites, swept twice
staged: 2026-09-03
status: draft
deps: [kol-theme, kol-design-tokens.css]
---

# kol-theme — register the spacing scale in `@theme`

## Purpose

`--kol-spacing-*` is a real scale and Tailwind never sees it. `kol-design-tokens.css`
has an `@theme` block, but it registers **containers and z-index only**:

```css
@theme {
  --container-canvas:  var(--kol-content-canvas);
  …
  --z-index-nav:       var(--kol-z-nav);
}
```

So there is no `gap-kol-6`, no `p-kol-4`. A consumer wanting KOL spacing in JSX has
exactly two options, and both are bad:

1. `gap-[var(--kol-spacing-6)]` — 28 characters for what `gap-6` says in 5, and it
   is a `var(--kol-*)` read in JSX, which check 2 of the full-consumption contract
   flags.
2. `gap-6` — short and clean, but it is **Tailwind's** number, not KOL's. Identical
   today because both scales are index × 4; silently divergent the day KOL moves a
   step.

## The ask

Register the spacing scale in the theme's `@theme` block alongside the containers
and z-index already there, so `p-*` / `gap-*` / `m-*` generate from KOL tokens and
a consumer writes plain Tailwind that is KOL-backed.

The scale, from `kol-design-tokens.css`:

```
--kol-spacing-1  4     --kol-spacing-8   32     --kol-spacing-20  80
--kol-spacing-2  8     --kol-spacing-10  40     --kol-spacing-24  96
--kol-spacing-3  12    --kol-spacing-12  48
--kol-spacing-4  16    --kol-spacing-16  64
--kol-spacing-5  20
--kol-spacing-6  24
```

Plus the semantic aliases `--kol-spacing-gap-{sm,md,lg}` (8 / 16 / 24) and
`--kol-spacing-{section,container}` (80 / 40), which are the ones a page ramp
actually wants to name.

**Note the numbering already matches Tailwind's** — `--kol-spacing-4` and `p-4` are
both 16px — so registering the scale is a no-op visually for every consumer and a
real one semantically. The gaps in the ladder (no 7, 9, 11…) are the only
behavioural change: those steps would stop generating, which is the point.

## Recreation notes

Theme-level, `packages/theme/kol-design-tokens.css`, in the existing `@theme`
block. Tailwind v4 reads `--spacing-*` from `@theme`, so the mapping is
`--spacing-4: var(--kol-spacing-4)` and so on.

Worth deciding at the same time whether the semantic aliases get names
(`--spacing-gap-md`) or stay CSS-only.

## Why it is filed rather than worked around

kol-client-hrafn swept its 57 spacing call sites **twice** in one session — vw
literals → `var(--kol-spacing-N)` → back to Tailwind's `N` — because neither form
is right. It is now on Tailwind's numbers by the user's call, knowing they are
not KOL's, and will move to the registered classes with no edit if this ships,
since the indices are identical.

## Filed by

kol-client-hrafn, 2026-09-03. Not blocking.

## ✅ RESOLUTION — 2026-09-03 · @kolkrabbi/kol-theme@0.141.0

Registered. `--kol-spacing-*` is in the theme's @theme block beside the containers and z-index, so `p-4` / `gap-6` / `m-8` now resolve THROUGH the KOL token: a no-op visually, since the indices already agreed, and the real change semantically — a step that moves here moves everywhere, which is what your double sweep was about.

Registered: 1 2 3 4 5 6 8 10 12 16 20 24, plus the two semantic steps that read as utilities — `--spacing-section` and `--spacing-container`, so `py-section` and `px-container` work.

The three gap aliases stay CSS-only, deliberately: `gap-gap-md` stutters, and `gap-md` would have to burn `--spacing-md`, a name too generic to spend on three values that are already 2 / 4 / 6. Say so if you want them anyway and it is one line each.

THE ONE THING I DID NOT DO, and it is the half your ticket called "the point": the off-ladder steps still generate. Tailwind v4's `--spacing` multiplier produces any numeric step on demand, so killing 7 / 9 / 11 means `--spacing: initial`, and that is not scoped to the gaps in the ladder — it drops every fractional and unlisted step too. Measured before deciding, across this repo's own packages plus kol-website, the clients, fxr, monitor and mirror: 130+ off-ladder utilities live today. `gap-1.5` ×30, `py-1.5` ×24, `gap-0.5` ×18, `py-2.5` ×7, and a tail of p-7 / px-14 / pb-32 / pt-56. Every one of those would emit NOTHING — no error, no warning — which is the exact silent failure your ticket quotes the @theme block as having been written to end for `z-modal`. A month of a skip link with no fill, again, times 130.

So closing the ladder is a real ruling with a real sweep attached, and it should not ride in as a side effect of registering the scale. Filed here as the DS's own next question rather than done quietly. The registration is the part that unblocks you, and it lands with nothing to change on your side: your 57 call sites are already on Tailwind's numbers and those numbers are now KOL's.

Shipped in @kolkrabbi/kol-theme@0.141.0. Verified in the showcase's built CSS: `.p-4{padding:var(--spacing-4)}` and `.gap-6{gap:var(--spacing-6)}` resolve through the registered tokens. `py-section` / `px-container` are unexercised in this repo — same namespace mechanism as the containers already in that block, but nothing here uses them yet, so you would be the first.

**Remainder here:** none — kol-client-hrafn bump kol-theme to 0.141.0 — your 57 call sites need no edit, the numbers are now KOL's.


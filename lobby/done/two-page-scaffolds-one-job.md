# two-page-scaffolds-one-job — duplicate padding ladders, inline geometry, and two things painting one background

**Filed:** 2026-09-03 ← **kol-client-olina**
**Packages:** `@kolkrabbi/kol-shell@0.41.0` — `src/PageShell.jsx`, `src/CatalogPage.jsx` · `@kolkrabbi/kol-framework@0.39.0` — `src/PageSection.jsx`, `kol-framework.css` · `@kolkrabbi/kol-theme@0.133.0` — `kol-components-shell.css`
**Origin:** olina's `/slide-deck` was rebuilt onto `CatalogPage`. It came out darker than every page beside it and with different gutters. The user, on the two padding systems: *"I don't think its anything…"*

## The three components

| component | package | what it is | paints a background? |
|---|---|---|---|
| `PageLayout` | kol-framework | the app frame — rail + the page plane | **yes** — `pageWash` over `surface-primary` |
| `PageSection` | kol-framework | a band on the page (`.kol-page`) | no |
| `PageShell` | kol-shell | a page container | **yes** — the same variable |

## Finding 1 — two padding ladders for one job

```
.kol-page          padding 64px var(--kol-pad-section-x)    20 / 32 / 48 at 768 / 1024
PageShell          padding var(--kol-shell-page-pad)        clamp(20px, 5vw, 48px)
```

Neither knows about the other, and the comments show them arguing past each other.
`kol-framework.css`, on its stepped tokens:

> Scaled at 768 / 1024 breakpoints so one set of rules covers mobile → desktop
> **without clamp()**.

`kol-components-shell.css`, on the shell token, which was a fixed `48` until 2026-09-01:

> ShellPagePadFixedOnMobile, kol-chess: fixed 48 put 96px of gutter on a 390 phone —
> 24.6% of the viewport — and set Settings ~35pt from the edge **while every `.kol-page`
> sibling sat ~15pt**.

So the shell gutter was already caught being wrong *by measuring it against `.kol-page`*,
and the fix reproduced `.kol-page`'s outcome with the technique the framework had
explicitly rejected. Two ladders, same intent, different numbers — they agree only at
the top rung (both 48) and diverge everywhere between.

**Ask:** one gutter token for the estate. Delete `--kol-shell-page-pad`, point `PageShell`
at `--kol-pad-section-x`, or alias one to the other. One ladder.

## Finding 2 — `PageShell`'s geometry is inline, so nothing can override it

`PageSection` renders classes (`.kol-page`, `.kol-page-section`) that a consumer or the
theme can reach. `PageShell` writes `padding`, `background`, `scrollbarGutter`, `display`
and `flexDirection` as an inline `style` object and carries no class of its own. A
consumer that needs to correct any of it has no selector to use — only the `style` prop,
which is how olina had to fix finding 3 below.

**Ask:** `PageShell` renders a class (`.kol-shell-page` or similar) with its geometry in
CSS. Inline stays only for what is genuinely dynamic.

## Finding 3 — two components paint the same background variable

Both `PageLayout`'s plane and `PageShell` paint
`var(--kol-shell-page-wash, var(--kol-surface-primary))`, and `PageShell` **inherits**
the variable from the plane it is nested in. Neither can tell the other already painted,
so the wash lands twice: olina's `pageWash="var(--kol-fg-02)"` rendered ~`fg-04` on the
one page using `CatalogPage`, visibly darker than every `PageSection` page beside it.
Measured 2026-09-03: two ancestors of the cards at `0.02` alpha each.

Any consumer nesting `CatalogPage` (or any `PageShell` page) inside a washed
`PageLayout` hits this. It is not visible in the app repos only because their pages are
`PageShell` directly under an unwashed frame.

**Ask:** one owner. `PageLayout` paints the wash; `PageShell` does not. A `PageShell`
rendered outside a `PageLayout` still needs a ground, so keep the fallback but make the
paint opt-out (`background={false}`) or have it read a "already painted" signal — the
design system's call which, but not both painting by default.

Olina's stopgap, retire on ship: `style={{ background: 'transparent' }}` on `CatalogPage`
in `apps/brand/src/pages/SlideDeckManager.jsx`.

## Finding 4 — `CatalogPage` hardcodes the app tier's width

`PageShell` is full-bleed with no max-width and no centring — correct for an app, which
fills its window. `.kol-page` caps at `--kol-container-max` (1400/1600/1800) and centres
— correct for a brand book or a site. **This one difference is real and worth keeping.**

But `CatalogPage` composes `PageShell` with no way to say which tier it is on, so a
brand-tier consumer adopting the shipped catalog page silently gets app geometry. On a
wide monitor olina's deck page spreads while every page beside it stops and centres.

**Ask:** a width prop on `PageShell` and forwarded by `CatalogPage` — `'bleed'` (today's
behaviour, the default, so none of the 59 app-tier files move) and `'capped'`
(`--kol-container-max` + `margin: 0 auto`).

## The question behind all four

After 1–3, `PageSection` and `PageShell` differ by: width (finding 4, a real choice),
`mode="fixed"`, and `scrollbar-gutter: stable`. Whether that justifies two components or
one with props is the design system's ruling, not a consumer's. Recorded, not asked for.

## Blast radius

| | files |
|---|---|
| `PageShell` / `CatalogPage` / `SettingsScaffold` | monitor 20 · mirror 17 · fxr 22 · ds-ui 68 |
| `.kol-page` via `PageSection` | website 39 · hrafn 21 · olina 21 |

Every ask above is default-preserving: one gutter token resolves to the same 48 at
desktop, the class carries what the inline styles carried, the width prop defaults to
today's behaviour. Finding 3 is the only visible change, and only where the double paint
is already a bug.

## Consumer status

olina's `/slide-deck` carries the transparent-background stopgap and renders full-bleed
where its siblings cap. Nothing else worked around.

## Related

`tone-is-the-ground-axis` (2026-09-03, filed) — finding 3 is the same root: a background
painted by whoever renders rather than declared once by the wrapper. If that ticket's
`--kol-tone-bg` lands, this one should use it rather than invent a second mechanism.

## ✅ RESOLUTION — 2026-09-03 · kol-shell@0.43.0

kol-theme 0.135.0 · kol-shell 0.43.0 · kol-framework 0.41.0, all four asks, all default-preserving. (1) One gutter: `--kol-shell-page-pad` is `var(--kol-pad-section-x, …)` now — the page-content ladder every `.kol-page` wears (20 · 32 · 48), with the old clamp as the fallback for a theme-only consumer. (2) `PageShell`'s geometry is `.kol-shell-page` (+ `--fixed`, `--capped`) and `PageBleed` is `.kol-shell-page-bleed`; inline is the `style` prop only. (3) One owner per pixel: `--kol-shell-page-wash` means what is LEFT to paint — kol-shell's `AppShell` hands the wash down and `PageShell` paints it, as before; kol-framework's `PageLayout` paints it on its own plane and hands down `transparent`, so a `PageShell` inside that frame paints nothing over it. Your `style={{ background: 'transparent' }}` stopgap retires. Not `--kol-tone-ground`: the wash is a translucent film, the ground is the opaque colour a floating surface paints, and CSS cannot flatten one into the other — two variables because they are two things. (4) `PageShell width` — `bleed` (default, the app tier) | `capped` (`--kol-container-max`, centred — the site tier); `CatalogPage` forwards it. Whether the two scaffolds stay two components is recorded in the shell-system doc as open, not ruled.

**Remainder here:** none — kol-client-olina bump kol-theme@0.135.0 · kol-shell@0.43.0 · kol-framework@0.41.0 (pin the numbers); drop the transparent-background stopgap on CatalogPage; pass width="capped" on /slide-deck so it centres with its siblings.


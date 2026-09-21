---
component: SectionSplit
source: kol-client-hrafn/apps/web/src/pages/Options.jsx#L1-L30
staged: 2026-09-03
status: draft
deps: [SectionSplit, SectionText, AssetPlaceholder]
---

# SectionSplit — `align="top"` and `align="bottom"`

## Purpose

`SectionSplit` places media BESIDE text — `align="left"` or `align="right"` —
and `align="center"` for a single centred column. There is no vertical pair:
media ABOVE the text, or media BELOW it. A landing page needs all four
placements from one section, the way it needs both horizontal ones.

Found on kol-client-hrafn's Home: the closing CTA is a centred headline with a
portrait under it (text top, image bottom). Nothing in the section family does
that, so the site carries it as `SectionCta variant="centered"` with the image
pushed into `actions` — a slot meant for buttons. It renders right and it is a
workaround.

## The ask

Two more values on the existing `align` prop, no new component:

| `align` | layout |
|---|---|
| `left` | media left, text right *(exists)* |
| `right` | media right, text left *(exists)* |
| `center` | single centred column *(exists — see question below)* |
| **`top`** | media above, text below, both centred |
| **`bottom`** | text above, media below, both centred |

Everything else stays: `media`, `ratio`, `height`, `mediaHover`, `mediaClip`,
`headline`, `body`, `actions`, `textAlign`, `fullBleed`, `background`.

**Question for the DS:** what does `align="center"` render today when `media` is
passed — does it stack, and in which order? If it already stacks media-over-text,
then `top` is `center` and only `bottom` is missing; if it drops the media, both
are. Consumer could not tell from the source without running it.

## Composition

Same pieces the section already uses: `SectionText` for the text block, the
`media` node in the existing frame (`ratio` · `mediaClip` · `mediaHover`), and
the DS `AssetPlaceholder` when `media` is absent — `SectionSplit` currently
renders nothing in that case, which is worth fixing in the same pass so an
empty section still shows its shape.

## Reference

The look is live on kol-client-hrafn Home, bottom of the page:
`SectionCta variant="centered" height="60"` with the headline and the portrait
in `actions`. Headline face is the site's (`.hrafn-cta-headline`, Narrow 500 on
display-01); the image is `w-[15.556vw] min-w-30 aspect-[224/304] rounded-xl`.

## Recreation notes

Organism-level, `packages/component/src/organisms/SectionSplit.jsx`. `top` /
`bottom` are a `flex-col` with the media frame and the `SectionText` block in
the two orders, both centred; `textAlign` defaults to `center` for them as it
does for `center`. Width of the stacked media frame is the open call — the
horizontal forms give it a column; a vertical form needs a cap, probably the
same `ratio`-bounded frame at a `max-w` on the content ladder.

## Filed by

kol-client-hrafn, 2026-09-03. Not blocked — the workaround is live.

## ✅ RESOLUTION — 2026-09-03 · @kolkrabbi/kol-component@0.192.0

Both values shipped, and your question has a definite answer.

WHAT `center` RENDERS TODAY, since you could not tell from the source: it STACKS, and the order is text first, media below, capped at max-w 640. So `bottom` already existed under a name that did not say so, and `top` was the only one actually missing.

Shipped both anyway, and deliberately: `bottom` is now its own value rendering exactly what `center` does, because "centred" says where the column SITS and nothing about the order — a page asking for text-over-image should be able to name that. `center` is untouched, so nothing existing moves. `top` reverses it: media above, text below, both centred, on the same order utilities `left` already used for the two-column form.

Everything else carries: media, ratio, height, mediaHover, mediaClip, headline, body, actions, textAlign, fullBleed, background. textAlign still defaults to center for the single-column forms, and the stacked media keeps the 640 cap — that answers your open call on the width, and it is the cap the centred form has always used rather than a new number.

THE PLACEHOLDER IS OPT-IN, not automatic: `placeholder={true}` renders the DS AssetPlaceholder at the frame's ratio, or pass your own node. Not the default, and this is the one place I did not do what the ticket asked. A text-only SectionSplit is a real and common call across the estate — turning "no media" into a visible grey box everywhere would put a placeholder into live pages that are correct as they are. Opt in and you get the empty shape you want; leave it and nothing changes.

Your CTA can come off the workaround: `SectionSplit align="bottom"` with the portrait as `media` instead of SectionCta variant="centered" with an image in `actions`. The site face stays yours — headlineSize / your own class on the headline; the section does not own type.

@kolkrabbi/kol-component@0.192.0. 26 gates clean, showcase builds; the demo's variant strip now renders all six forms (right · left · center · top · bottom · fill) so the difference is visible rather than described.

**Remainder here:** none — kol-client-hrafn bump kol-component to 0.192.0 and move the Home CTA off the actions-slot workaround onto align="bottom".


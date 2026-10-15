---
title: Motion
type: plan
status: draft
created: 2026-10-14
updated: 2026-10-14
description: Clip candidates for the KOL post
aliases:
  - stack-motion
tags:
  - domain/stack
  - audience/public
related:
  - "[[04-graphics|graphics]]"
  - "[[03-mixed|mixed]]"
---

# Motion

Each candidate is a start frame from the live showcase, dark theme embedded, light twin beside
it. Nothing is recorded yet. A clip is made the same way the frame was: Playwright opens the
chromeless preview route, scripts the interaction, records a webm, and ffmpeg trims it to an
mp4 on a 16:9 plate for Stack's `VideoBlock` (1200 × 675).

## Constraints

- One interaction per clip, 4 to 8 seconds, no cursor chrome, no sound.
- The clip loops. First and last frame match, or the cut is at rest.
- 16:9, because `VideoBlock` enforces it.

## Candidates

**Theme flip over a dense page.** The rack set, or the editor, with the theme toggled once.
Every token flips at the same instant: surfaces, inks, keylines, LEDs. This is "brand as input"
in motion. 4 seconds.

![[_assets/motion/theme-flip-rack--dark.png]]

The light twin is the end frame:

![[_assets/motion/theme-flip-rack--light.png]]

**Search modal.** `⌘K`, a query typed, results filtering, Enter. The app-shell point. 6 seconds.

![[_assets/motion/search-modal-page--dark.png]]

**Knob drag.** A rotary dial turned through its range with the LED following. The hardware tier
doing its job. 4 seconds.

![[_assets/motion/knob--dark.png]]

**Tag graph settling.** The force simulation from scatter to rest. 6 seconds, then still.

![[_assets/motion/tag-graph-settle--dark.png]]

**Envelope generator.** The oscilloscope playing an expression at 60 BPM. 5 seconds.

![[_assets/motion/envelope-generator--dark.png]]

**Theme toggle alone.** The toggle's roll mechanics in isolation. 3 seconds. Small.

![[_assets/motion/theme-toggle--dark.png]]

**Tilt bento.** The pointer crossing a tilt grid. Pure decoration, handsome. 5 seconds.

![[_assets/motion/tilt-bento--dark.png]]

**Text pressure.** Variable-font weight following the pointer. Foundry's trick. 5 seconds.

![[_assets/motion/text-pressure--dark.png]]

**Intro loader.** The logomark loader. 3 seconds.

![[_assets/motion/intro-loader--dark.png]]

**Marquee river.** The store's diagonal marquee. Decorative. 5 seconds.

![[_assets/motion/diagonal-marquee-river--dark.png]]

**Selection overlay.** A box rotated with the size label staying upright, the fix that closed a
ticket on 2026-10-13. 4 seconds. Niche.

![[_assets/motion/selection-overlay--dark.png]]

**Chess playback.** Moves stepping through a game. 6 seconds.

![[_assets/motion/chess-board-with-controls--dark.png]]

**Content collection.** The grid-to-list switch with its stagger. 4 seconds.

![[_assets/motion/content-collection--dark.png]]

**Scroll drift gallery, parallax shelf, carousel, flip toggle, media library.** Captured for
completeness; none carries a point the post makes.

![[_assets/motion/parallax-shelf--dark.png]]

## Shortlist

Two clips.

| Slot | Clip | Why |
|---|---|---|
| Origin | Theme flip over the rack set | The brand-is-an-input claim, proved in one frame change |
| Function first | Knob drag with the LED | The hardware tier is a different kind of control, and you can see it move |

Alternates, in order: the search modal, the tag graph settling.

## Open calls

- **Which page for the flip.** The rack is densest; the editor set shows more surface tiers.
  Recommend the rack.
- **Speed.** Real speed, no slow motion. If the flip reads as a cut, hold 1.5 seconds each side.

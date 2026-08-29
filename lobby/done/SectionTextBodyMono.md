---
component: SectionTextBodyMono
source: kol-website/apps/web/src/components/sections/home/HomeSignup.jsx#L17-L30 + routes/Stack.jsx#L138-L150
staged: 2026-08-27
status: draft
deps: [SectionText, kol-theme]
---

# SectionTextBodyMono — the section family's body voice is mono, sans is opt-in

## Purpose

`SectionText`'s ruled body is `.kol-section-text-body` — sans 16
(kol-components-organisms.css:325). Every section that used to carry its own
mono lede lost it as the organism overrides were removed (the right move):
the newsletter went mono-14 → sans in 0.90.1, the Stack hero needed
`bodyClass="kol-mono-16"` by hand, the Studio process split and Home foundry
split render sans today. User, 2026-08-27: *"I don't want the sans anywhere,
I want the text on the cards to default mono, with props to change it if I
feel like it."*

## Ask

`.kol-section-text-body` becomes the mono voice — **`kol-mono-*`**, the
line-height-bearing paragraph mono, NEVER `kol-helper-*` (line-height 1,
weight 500, tracked: single-line chrome, wrong for a lede that wraps).
`kol-mono-14` / 16 — the DS picks the rung; 14 is what the newsletter and the article cards carried,
16 is what the Stack hero lede sits on). Sans stays reachable through the
existing `bodyClass` / `slotClass` seam. Headline and label unchanged. Every
section in the set (hero · split · cards header · faq · cta · newsletter)
follows, since they all render `SectionText` bare.

## Consumer state

`Stack.jsx` passes `bodyClass="kol-mono-16"` on its hero today only because
of this; drops it on return if the default lands on 16, keeps it if 14.

## ✅ RESOLUTION — 2026-08-27 · kol-theme 0.60.0

.kol-section-text-body is the mono-16 rung (JetBrains Mono 16 / 22, 72% ink unchanged) — the DS picked 16, the section scale where the Stack hero's lede already sat; sans is opt-in through bodyClass / slotClass. Every section rendering SectionText bare follows (hero, split, faq, cta, newsletter). Measured on the section set: split and newsletter bodies at JetBrains Mono 16px / 22px.

**Remainder here:** none — kol-website bump kol-theme 0.60.0; Stack.jsx drops bodyClass="kol-mono-16" on its hero (the default lands on 16).


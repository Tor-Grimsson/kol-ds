---
component: SectionTextLabelVoice
source: kol-website/apps/web/src/components/sections/studio/StudioProcessCard.jsx#L1-L34 + components/sections/home/HomeFoundry.jsx#L17-L36
staged: 2026-08-26
status: draft
deps: [SectionText, SectionSplit, SectionHero]
---

# SectionTextLabelVoice — the ruled eyebrow is the wrong voice; the hero's is right

## Purpose

User, 2026-08-26, on the Studio process split and the Home foundry split:
*"this card has the WRONG section eyebrow style. it should be closer to the
hero eyebrow."*

Two voices for one slot today:

| where | class | renders as |
|---|---|---|
| `SectionText` default (`SectionText.jsx:57`) → every `SectionSplit`, `SectionCards`, `SectionFaq` | `kol-section-text-label` | **PROCESS** / **TYPE FOUNDRY** — uppercase, heavy, wide-tracked |
| `SectionHero` override (`SectionHero.jsx:179, 240`) | `kol-helper-12 text-meta` | Services — small, quiet, as authored |

The user wants the hero's. Also: the authored strings are `Process` /
`Type Foundry`; rendering them uppercase is `.kol-section-text-eyebrow { text-transform: uppercase }` (kol-components-organisms.css:286-289) —
the KOL casing law says labels render as authored, case at the call site.

## Ask

`SectionText`'s ruled label voice becomes the hero's (`kol-helper-12
text-meta` or the equivalent theme rule under `.kol-section-text-label`), with
no case transform; `SectionHero` drops its `labelClass` override once the
default is the same thing. One eyebrow across the set.

## Consumer state

Nothing changed here — `SectionSplit` exposes no `labelClass` seam, so the
fix is the rule. Studio process card and Home foundry split show the defect.

## ✅ RESOLUTION — 2026-08-26 · kol-component@0.76.2 · kol-theme@0.57.1

One eyebrow voice across the set: `SectionText`'s label default is the hero's `kol-helper-12 text-meta` (12px, meta ink) instead of the split's mono-18 accent kicker; `SectionHero` drops its override; the theme's `.kol-section-text-label` is retired from the kicker rule (`.kol-feature-split-kicker` keeps painting for a consumer's own CSS until the next major). Measured on split, hero and FAQ: 12px / 500 / meta on all three. The ticket's "no case transform" line cites the retired law — the eyebrow is uppercase by ROLE (user ruling 2026-08-26, `.kol-section-text-eyebrow`, typography doc § Casing) and stays so; author the strings as you like, they render caps.

**Remainder here:** none — kol-website bump kol-component 0.76.2 + kol-theme 0.57.1; Studio process split and Home foundry split need nothing — the rule is the fix.


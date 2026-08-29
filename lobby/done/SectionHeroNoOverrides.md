---
component: SectionHeroNoOverrides
source: kol-website/apps/web/src/routes/Studio.jsx#L24-L52 + components/sections/studio/StudioProcessCard.jsx#L1-L36
staged: 2026-08-26
status: draft
deps: [SectionHero, SectionText, OverlayGlassPanel]
---

# SectionHeroNoOverrides — the hero forces its own voice on SectionText; the split doesn't

## Purpose

Studio page, hero glass panel beside the process split, same `headlineSize`
(`heading-02`): the hero's body is visibly smaller, its headline carries a caps
class, its rhythm is tighter. User: *"you think the purpose of unifying
components is to make OVERWRITES?"*

`SectionHero.jsx` (0.79.0) passes these into `SectionText` on both the media
route (172-186) and the text-only route (238-252):

| forced | value | the molecule's own default |
|---|---|---|
| `headlineClass` | `HEADLINE_ROLE[…] kol-section-text-caps` (and remaps `display-04` → `heading-02`) | `HEADLINE_ROLE[headlineSize]` |
| `bodyClass` | `kol-sans-body-02 text-body` | `kol-section-text-body` (16px sans) |
| `gap` | `gap-6` | `gap-4` |
| `actionsClass` | `flex flex-wrap gap-4 justify-center` | `flex flex-wrap gap-4` (+ `align` handles centring) |

Every one is the old glass-panel hero's pixel parity carried into the set —
the same thing the label override was (`SectionTextLabelVoice`, removed in
0.76.2). Parity with the retired hero is not the bar; one voice across the set
is.

## Ask

`SectionHero` renders `SectionText` **bare** — `label · headline ·
headlineSize · body · actions · align · slotClass · slotStyle` and nothing
else — exactly as `SectionSplit` does. The hero's only say is the
`OverlayGlassPanel` around it (`panelProps`). If the caps headline is a ruled
hero trait, it becomes a `SectionText` role (`headlineCase`), not a hero-side
class. Same for `gap`: if the panel wants `gap-6`, that's a `SectionText`
prop the consumer can pass, not a default the hero hides.

## Consumer state

Studio hero + Studio process split, side by side, are the reference. No
change here on return.

## ✅ RESOLUTION — 2026-08-26 · kol-component@0.80.0

`SectionHero` renders `SectionText` bare — label · headline · headlineSize · body · actions · align · slotClass · slotStyle, plus `gap` only when the consumer passes it. The forced `gap-6`, `kol-sans-body-02` body, caps headline class and actions row are gone; the `display-04 → heading-02` remap is gone. What survives: `headlineSize` defaults per variant (media `display-04`, split `heading-02`) and the split hero's caps headline as `SectionText headlineCase="upper"` — a role on the molecule the consumer can set too. Measured side by side: hero body and split body both `kol-section-text-body` 16px, both gap 16px; split hero headline uppercase through the role. Reference pages updated.

**Remainder here:** none — kol-website bump kol-component 0.80.0 — Studio hero and process split now match with nothing passed; pass `gap="gap-6"` on the hero only if you want the old rhythm back.


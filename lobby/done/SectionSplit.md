---
component: SectionSplit
source: kol-website — six hand-built heroes + five hand-built split-sections
staged: 2026-08-15
status: draft
deps: [kol-component]
---

# SectionSplit — THE page-section anatomy, solved once

## The ask (user ruling 2026-08-15, kol-website session)

Every marketing-page section in kol-website is the same anatomy rebuilt by hand:
a **media side** (image / video / interactive node) beside a **text side**
(kicker · heading · body · actions), sometimes flipped. Each rebirth re-decides
breakpoints, hover behavior, heading scale, and button variant — which is how
one hover animation broke silently and why a disliked Studio hero has sat
unfixed for months ("it's studio-specific, riding the coattail of huge lag").

Ship the anatomy once:

- **Media slot** — polymorphic: `<img>`, video, or an arbitrary interactive
  node (one reference case renders a live contact-toggle card in the media
  position).
- **Text contract** — `kicker` (mono label + optional arrow glyph), `heading`
  (DS heading scale by size prop), `body`, `actions` (Button row). How custom
  per-site type classes thread through this contract is the core design
  question — decide it here, once.
- **`flip`** — text/media order swaps.
- Breakpoints, gap rhythm, and media hover treatment owned by the component.

## Reference implementations (all in kol-website, copy freely)

- `components/sections/home/HomeFoundry.jsx` — image left / text right
  ("Type Foundry ↘ / Custom typefaces & specimens / body / Browse Typefaces").
  Its media hover animation is currently broken — the exact defect class this
  component exists to end.
- `components/sections/studio/StudioProcessCard.jsx` — text left / interactive
  right (ProfileCard with contact toggle in the media slot).
- `components/sections/home/HomeAbout.jsx` · `HomeSignup.jsx` — same anatomy.
- `components/sections/shared/CtaGlobal.jsx` — the /CONNECT band: the anatomy
  with no media (text-only degenerate case; support it).

## What stays with kol-website

On ship: the listed sections re-declare as content on SectionSplit; the Studio
hero is the first adopter. Heroes with genuinely bespoke behavior (HomeHero)
stay local.

---

## Resolution — 🟢 closed 2026-08-15

Shipped in **`@kolkrabbi/kol-component@0.42.0`** + **`@kolkrabbi/kol-theme@0.42.0`**
(both registry-verified).

**No `SectionSplit` was built, and that is the ruling.** The anatomy the brief
describes — media slot beside kicker / heading / body / actions, with a flip —
already ships here as **`FeatureSplit`** (`organisms/FeatureSplit.jsx`, chrome in
`kol-components-organisms.css`). A second component beside it would have been the
exact duplication this brief exists to end: eleven hand-built sections become
twelve implementations, not one. `FeatureSplit` grew the three things it
genuinely lacked instead.

| Brief asks | Status |
|---|---|
| Polymorphic media slot (img / video / interactive node) | **already had it** — `media` is a ReactNode slot |
| Text contract: kicker · heading · body · actions | **already had it** — `kicker` / `title` / `body` / `ctas` |
| Text-only degenerate case (the /CONNECT band) | **already worked** — `media` is optional, the column doesn't render |
| `flip` | **added** |
| Heading scale by size prop | **added** — `titleSize` |
| Breakpoints + gap rhythm owned by the component | **already had it** — one grid, one clamp |
| Media hover treatment owned by the component | **added** — `mediaHover` |

**`flip` uses `order`, not `flex-row-reverse`.** The grid collapses to ONE column
below 901px, where DOM order decides the stack — a row reversal flips the wide
layout and leaves the narrow one still text-first, which is the kind of
half-working flip a hand-built section produces.

**The named core design question — how per-site type classes thread through the
text contract — is answered: they do not thread.** A consumer picks a ROLE
(`titleSize`) and the component emits exactly one type class. Passing
`kol-sans-heading-01` in beside `.kol-feature-split-pull` would put two
equal-specificity rules on one element and let sheet load order decide the
winner — the failure ARCHITECTURE §5 records for cascade layers, and the
2026-07-30 law that a component's type lives in its own rule. The `*ClassName`
seams remain, for LAYOUT.

**The named defect is closed at its cause.** HomeFoundry's hover broke silently
because every section re-decided its own hover; `mediaHover` is now DS CSS with
the same 1.03 / 300ms / reduced-motion numbers as CardFeatureItem's zoom
(CardFeatureHoverZoom, 2026-08-12) — one motion vocabulary, not a per-section
re-invention.

19 gates clean.

**Remainder here:** none.

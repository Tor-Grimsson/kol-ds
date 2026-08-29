---
component: SectionHeroRound2
source: kol-website/apps/web/src/components/sections/stack/StackHero.jsx#L1-L60 + routes/foundry/FoundryTypefaces.jsx#L203-L217 + routes/foundry/FoundryLicensing.jsx#L48-L66
staged: 2026-08-26
status: draft
deps: [SectionHero, SectionText, FeaturedCarousel, FoundryCTA, SectionFaq]
---

# SectionHeroRound2 — one hero for every page: vh presets, bottom-pinned content, overlap slot, carousel media

## Purpose

`SectionSet` shipped (0.71.0). Adopting it across kol-website found what
`SectionHero` still cannot do that the site's remaining heroes do. The user's
rule: **maintain ONE hero component.** This closes the gap.

## Asks

### 1. Height presets in viewport units, each with a phone/desktop pair

User's ruling 2026-08-26: three tiers —

| preset | desktop | notes |
|---|---|---|
| `full` | `100vh` | sits UNDER the fixed navbar (the bar floats over the media); consumers drop their `pt-14 md:pt-16` wrapper |
| `80` | `80vh` | |
| `60` | `60vh` | |

Each preset may carry its own phone value (class strings already — e.g.
`h-[60vh] md:h-[80vh]`); the DS picks the ramps. Today's `lg` (440/640px) and
`md` (320/440px) become aliases or retire. `svh`/`dvh` is the DS's call.

Consumer state right now (class strings, to be replaced by the presets):
Studio `screen` (100vh, wrapper padding removed) · typeface pages `h-[60vh]`
(was `h-[560px] md:h-[768px]`) · foundry index carousel `h-[80vh]`.

### 2. `justify: 'center' | 'end'` — content pinned to the bottom

`StackHero` (`items-end`, `pb-32 sm:pb-40 lg:pb-48 xl:pb-56`) puts the title
and lede at the foot of the frame. SectionHero only centres vertically.

### 3. Gradient veil

`StackHero`'s `.stack-hero-overlay` is a gradient (bottom-heavy) — SectionHero
has only the flat `overlayOpacity` scrim. Same device as `SectionSplit`'s
caption veil.

### 4. Overlap slot

Stack's "Featured" card straddles the hero's bottom edge (the card starts
~250px above the frame's end). A `foot` / `overlap` slot renders a node across
the fold with the negative margin owned by the organism.

### 5. `media` as an array → carousel mode

`FeaturedCarousel` is a hero with rotating media (foundry index: three
typefaces, autoplay, one glass panel per slide). Same anatomy —
`SectionHero media={[…]}` (+ `autoPlay`, `autoPlayInterval`, nav position)
absorbs it; `FeaturedCarousel` becomes an alias.

### 6. Text-only hero

`FoundryLicensing` hero: Pill · display headline · hairline · lede, no media.
SectionHero with `media` omitted renders the composed `SectionText` on the
surface (no glass panel) — or the DS rules `SectionText align="center"` in a
section is the answer and says so.

### 7. Fold `FoundryCTA` into the set

The "Licence" block on every typeface page (heading · sentence · button,
centred) is `FoundryCTA` — a second way to render `SectionText`. Alias it to
the set (`SectionText align="center"` in a section, or a `SectionCta` variant).

## Reveal stagger

Not asked. Stack's `.reveal` entrance stays consumer-side via className.

## Adopters on return (kol-website)

Stack (`StackHero` retires) · foundry index (`FeaturedCarousel` → `SectionHero
media=[…]`) · typeface pages (`height="60"`) · licensing (hero → text-only
SectionHero, FAQ → `SectionFaq`) · Studio (`height="full"`). `FoundryCTA`
call sites move with the alias.

## ✅ RESOLUTION — 2026-08-26 · kol-component@0.76.0 · kol-theme@0.57.0

One hero, seven asks, all in `SectionHero` (component 0.76.0 · theme 0.57.0). (1) `height` presets in viewport units: `full` = 100dvh (dvh, not vh — a phone's URL bar would push the foot off screen; sits under a fixed navbar, drop the pt-14 wrapper) · `80` = 70svh / 80vh · `60` = 50svh / 60vh; `lg` / `md` / `screen` stay as aliases. (2) `justify="end"` — items-end + StackHero's pb-32 → xl:pb-56 ramp. (3) `veil` — `.kol-section-hero-veil`, the bottom-heavy gradient, same device as the split's caption veil. (4) `foot` + `overlap` (default 250px) — the node renders across the fold, the hero owns the negative margin. (5) `media` as an ARRAY is the carousel: FeaturedCarousel is the engine (fullWidth, no header, one glass panel per slide; `autoPlay`, `autoPlayInterval`, `navPosition`), deprecated as a consumer import. (6) No media = the text-only hero: the composed SectionText on the surface, no glass panel. (7) `FoundryCTA` = `SectionCta variant="centered"` (rule · heading · mono line · Buttons), deprecated alias, same render. The split variant takes the same presets (`full` default). Measured headless: text-only 600px at 60 with no glass and no media; end at 80 → 800px with the veil and a 120px foot overlap; carousel `.is-full`, 2 slides, 600px, no header; centred CTA with rule, centred heading, two Buttons. Reference pages updated (`/components/section-hero`, `/components/section-cta`).

**Remainder here:** none — kol-website bump kol-component 0.76.0 + kol-theme 0.57.0: Stack → `SectionHero height="full" justify="end" veil foot={<FeaturedCard/>}` (StackHero retires) · foundry index → `SectionHero media={[…]} autoPlay height="80"` · typeface pages `height="60"` · licensing → text-only SectionHero + `SectionFaq` · Studio `height="full"` · FoundryCTA call sites → `SectionCta variant="centered"`.


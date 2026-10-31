# Plan — Float style round 2, his review points

**Raised:** 2026-10-30, the user reviewing https://claude.ai/artifact/77VphAd49jqiBjHK2r8tNp (Float Style Round 2). Points verbatim below, per phase.
**Status:** W1 and W2 fixed and browser-checked — 2026-10-30. Open: W3 (TALK). Checked in a browser (Playwright, local copy `_tmp/2026-10-30-float-round2/`) the same day.
**Shape:** W › phase › list.
**Laws carried:** the page shows options where a call is open, never an adopted choice; KOL's shipped components are drawn as they really are; never change what he did not ask to change; `variant` is the only word for a variant.
**How a phase closes:** acceptance line first, gates green, then Playwright against his own words.

## W1 — Things he asked to change

### 1.1 — Keylines switch — ✅ fixed 2026-10-30
> "these are not keylines you idito. these are outlines... I was talking about ICONS.. remove this shit...."
- Acceptance: no keyline switch, no outline overlays, no mention of keylines on the page.
- Checked: switch, overlays, intro text and comment gone; no "keyline" anywhere on the page.

### 1.2 — Glass is one style — ✅ fixed 2026-10-30
> "this does not look like the same style.. this is second time Im saying this" · "Im looking at 3 glass styles in one view?"
- Acceptance: with glass on, the box, the bar, the ··· circle and the + share one tint and rim.
- Checked: all four read `rgba(26,26,26,.62)`; only the blur differs (6 small, 16 box).

## W2 — Things I answered but did not fix

### 2.1 — Icons too small — ✅ fixed 2026-10-30
> "I like this size, I feel like you have made the icons super small is that right? did you do that?"
- Acceptance: nav icons at fxr's live size (bar ≈ 66, icons ≈ 28, measured on fxr.kolkrabbi.io).
- Checked: nav bar 66, buttons 56, icons 28 on mouse and touch.

### 2.2 — Nav sizes are mine, labelled as fxr's — ✅ fixed 2026-10-30
> "you call this fxr nav … is this true size?" · "oh yeah its even smaller for mouse for some reason..."
- Acceptance: the label stops calling it fxr's nav unless it is drawn at fxr's size; mouse is not smaller than fxr.
- Checked: label reads "fxr's nav at its live size"; the nav is drawn at fxr's 66/28, mouse no smaller.

### 2.3 — Menu too tight — ✅ fixed 2026-10-30
> "this is super tight? why is this so tight? what is it based on?"
- Acceptance: row height comes from a kit and says which (iOS 40, M3 48), or offered as options.
- Checked: rows 40 (iOS 27) with a mouse, 48 (M3) on touch; the caption names the kit.

### 2.4 — Focus ring too bright — ✅ fixed 2026-10-30
> "this is so fuckign bright.. dont we have a focus already thats fine?"
- Acceptance: KOL's own focus (`--kol-focus-ring`, 2px, offset 2) on buttons; fields keep KOL's behaviour (no focus change) unless offered as an option.
- Checked: buttons use KOL's ring (ink, 2px, 2 outside); fields show no focus change.

### 2.5 — Clash with browser focus — ✅ fixed 2026-10-30
> "and it clashes with browser focus?"
- Acceptance: clicking Email shows no browser ring; only one focused field at a time.
- Checked: both fields are real inputs with the browser ring off; clicking Email shows no ring, no fake focused field.

### 2.6 — Tooltip drawn wrong — ✅ fixed 2026-10-30
> "why do you say this is our tooltip? its not. our tooltip looks like this … if thats not tooltip/pop-over then what is it?"
- Acceptance: "today" is the real KOL Tooltip (surface-secondary, 1px oq-08 hairline, radius-sm, 4/8, mono 11); the pill is labelled a proposal.
- Checked: "today" is surface-secondary, 1px oq-08, r 4, 4/8, mono 11; the pill is labelled a proposal.

### 2.7 — Segmented toggle and tabs missing — ✅ fixed 2026-10-30
> "segmented toggle or this kind of tabbing is missing"
- Acceptance: SegmentedToggle and TabsRow on the page, current and float.
- Checked: new section 7: SegmentedToggle and TabsRow today beside float.

### 2.8 — Theme toggle — ✅ fixed 2026-10-30
> "also is there a theme toggle to view light vs dark?"
- Acceptance: a light / dark switch in the top bar.
- Checked: dark / light switch in the top bar.

## W3 — TALK

### 3.1 — Glass as options, not adopted — TALK
> "I just asked about glass and blur, I didnt say, lets adopt one or the other... proposals are good to you know, see three options pick one when relevant..."
- My proposal: page solid by default; a glass section with three options (frosted dark, clear, solid with a rim). Not built; waiting on his yes.

### 3.2 — Font — TALK
> "I'd also like to see this system with another font, not jetbrains and not right grotesk. I'd like to talk about it … I want options"
- Options given in chat (Inter, Geist, IBM Plex Sans, Public Sans, Noto Sans, Montserrat); my pick Geist. Nothing drawn until he picks.

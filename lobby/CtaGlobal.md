---
component: CtaGlobal
source: kol-monorepo/apps/web/src/components/sections/cta/CtaGlobal.jsx#L1-L39
date: 2026-07-03
status: draft
deps: [FoundryCTA]
---

# CtaGlobal

## Purpose
An editorial two-column contact / CTA band: a large display wordmark on the left (`/ connect`) and a right column of stacked label-over-value rows — a prompt row ("Working on a project? / Send a message") and a contact row ("Contact / hello@kolkrabbi.io" as a `mailto`). The closing "get in touch" band on Home, Studio, and Stack. Currently 100% hard-coded copy and email with zero props — the whole point of staging it is to expose a flat prop seam so the DS owns the layout and the call site owns the words.

## Anatomy
```
<section class="reveal w-full bg-auto">
  <div class="w-full self-stretch py-10 inline-flex justify-start items-start gap-12 overflow-hidden">
    <div class="self-stretch flex-1 inline-flex flex-col justify-start items-start gap-16">    ← left column
      <div class="reveal ... text-auto kol-heading-display uppercase" style={--reveal-delay:0.1s}>   {eyebrow}   e.g. "/ connect"
    <div class="flex-1 self-stretch pt-32 pb-6 inline-flex flex-col justify-end items-start gap-12">   ← right column
      <div class="reveal ... gap-2" style={--reveal-delay:0.2s}>                              ← prompt row
        <div class="text-auto kol-helper-uc-md">      {promptLabel}   e.g. "Working on a project?"
        <div class="text-auto kol-heading-lg uppercase">   {heading}   e.g. "Send a message"
      <div class="reveal ... gap-2" style={--reveal-delay:0.3s}>                              ← contact row
        <div class="text-auto kol-helper-uc-md">      {contactLabel}   e.g. "Contact"
        <a href="mailto:{email}" class="text-auto kol-heading-lg uppercase hover:opacity-70 transition-opacity">   {email}
```
Two full-height flex columns (`gap-12`), each row a label (`kol-helper-uc-md`) over a large value (`kol-heading-lg`/`kol-heading-display`).

## Variants
- **Prompt-only vs prompt + contact** — the right column is a list of label/value rows; the contact row (with `mailto`) is one row, additional prompt rows are optional (`secondaryRows[]`).
- **Value as link vs static** — a row with an `href` renders an `<a>` (contact/email); without, a static heading (the prompt).
- Single visual style — no `variant` prop in source; the "variants" are which rows you pass.

## Props
> Source has NO props (all copy hard-coded). This is the proposed seam.

| prop | type | default | controls |
|------|------|---------|----------|
| eyebrow | node | — | left-column display wordmark (`kol-heading-display`), e.g. "/ connect" |
| promptLabel | node | — | prompt-row label (`kol-helper-uc-md`) |
| heading | node | — | prompt-row value (`kol-heading-lg`) |
| contactLabel | node | — | contact-row label (`kol-helper-uc-md`) |
| email | string | — | contact-row value + `mailto:` target |
| secondaryRows | `{label,value,href?}[]` | `[]` | extra right-column rows (optional) |
| className | string | `''` | extra classes on `<section>` |

## States & interactions
- **Email link hover:** `hover:opacity-70 transition-opacity`. No other interaction.
- Scroll-reveal: section + each row carry `reveal` with staggered `--reveal-delay` (0.1s / 0.2s / 0.3s).
- Layout note: source uses `inline-flex` two-column with no responsive breakpoint — columns do not stack on narrow screens (a bug/limitation to fix on recreation; add a stacking breakpoint).

## Styling
- Type: `kol-heading-display` (eyebrow wordmark), `kol-heading-lg` (row values), `kol-helper-uc-md` (row labels).
- Tokens: `text-auto`, `bg-auto`. Layout via Tailwind (`inline-flex`, `gap-12`, `gap-16`, `pt-32`, `py-10`).
- **App-specific bits to DROP:**
  - All copy — `"/ connect"`, `"Working on a project?"`, `"Send a message"`, `"Contact"` — app content → props.
  - `mailto:hello@kolkrabbi.io` (appears twice: `href` + link text) — app email → `email` prop.
  - `uppercase` on `kol-heading-display` / `kol-heading-lg` — presentational auto-transform; author strings in final case instead (see casing note).
  - `reveal` / `--reveal-delay` scroll-reveal classes — app animation infra; re-tier as an optional DS reveal modifier or drop.

## Dependencies
- None imported in source (plain markup + a `mailto` anchor).
- **FoundryCTA** (`@kol/ui`) listed as the taxonomy sibling, not a runtime import — see notes.

## Recreation notes
- Tier: **organism** (editorial multi-row contact band).
- **Taxonomy gap / dedupe:** the DS today has only the simple centered `FoundryCTA` (heading + one Button). It has **no editorial CTA band**. This is that missing tier. On adoption, the app's `CtaWork.jsx` (centered "Let's work together" + outline Button) and `CtaFoundry.jsx` (centered "QUESTIONS?" + Button) collapse — the trivially-simple ones map to DS `FoundryCTA`, and the editorial two-column band becomes this `CtaGlobal`. One CTA-band family, two tiers (simple `FoundryCTA` / editorial `CtaGlobal`), no per-page one-offs.
- Prop/slot seam: model the right column as `rows[]` of `{label, value, href?}` internally; expose the named `eyebrow` / `promptLabel` / `heading` / `contactLabel` / `email` conveniences on top for the common case, `secondaryRows[]` for extra rows.
- Text casing at call site: drop the `uppercase` classes; author `eyebrow`/`heading`/labels in the case they should render. Push back if a consumer asks the band to force casing.
- Fix on recreation: add a responsive stacking breakpoint — source's `inline-flex` two-column never collapses on mobile.

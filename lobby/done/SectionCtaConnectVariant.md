---
component: SectionCtaConnectVariant
source: kol-website/apps/web/src/components/sections/shared/ConnectCta.jsx — the preset to absorb
staged: 2026-08-27
status: draft
deps: [SectionCta]
---

# SectionCtaConnectVariant — the contact CTA is a `SectionCta` variant, not a site wrapper

## Purpose

kol-website renders the contact CTA on four pages (Home · Stack · Studio ·
Work) through a 12-line site file, `ConnectCta.jsx`, that is `SectionCta`
with five strings typed in. User (2026-08-27): *"it's stupid to make a prefix
family that we opt out of at the first opportunity"* — the page should speak
`SectionCta` directly.

## Ask

`variant="connect"` on `SectionCta`: the `editorial` layout with these
defaults, every one still overridable by the existing props:

| prop | default |
|---|---|
| `eyebrow` | `/ CONNECT` |
| `promptLabel` | `WORKING ON A PROJECT?` |
| `heading` | `SEND A MESSAGE` |
| `contactLabel` | `CONTACT` |
| `email` | `hello@kolkrabbi.io` |

`background` and `className` as on every section (0.103.0). kol-website's
call sites become `<SectionCta variant="connect" className="reveal" />` (Work:
`background="none"`), and `ConnectCta.jsx` retires.

## Recreation notes

- kol-component only. Bar for 🟢: the four pages render `<SectionCta
  variant="connect" …>` with no copy passed and match today's `ConnectCta`.

## ✅ RESOLUTION — 2026-08-27 · kol-component 0.105.0

SectionCta variant="connect" = the editorial layout with the contact copy as defaults (/ CONNECT · WORKING ON A PROJECT? · SEND A MESSAGE · CONTACT · hello@kolkrabbi.io), every prop still overridable; background / className as on every section. Verified in source only (no server run, by your rule).

**Remainder here:** none — kol-website bump kol-component 0.105.0; the four pages render <SectionCta variant="connect" className="reveal" /> (Work: background="none"); ConnectCta.jsx retires.


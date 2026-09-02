# SectionNewsletterSubmitVariant — the submit is hardcoded `primary`, which is dark-on-dark on an inverse band

**Filed:** 2026-09-01 · from **kol-website** (`apps/web`)
**Source:** kol-component `organisms/SectionNewsletter.jsx:172-180`
**Seen at:** `kolkrabbi.io/stack`, dark theme, phone (user screenshot 2026-09-01)

## The defect

```jsx
<Button type="submit" variant="primary" size={controlSize} …>
```

`primary` is `background: var(--kol-surface-secondary)` — the page's own
second surface. The consumer renders this organism on
`background="bg-fg-absolute-16"` (a dark band in both themes by design), so
in dark mode the submit is a dark-grey block on a dark-grey band: it reads as
disabled. User: *"subscribe below input should be white there."*

The white one already exists — **`secondary`** is
`background: var(--kol-surface-on-primary); color: var(--kol-surface-primary)`,
the ink-on-page inversion. It is the correct control on any band that is
already the page's inverse.

## Why it can't be fixed here

The variant is a literal inside the organism. `SectionNewsletter` exposes
`controlSize` (from `SectionNewsletterControlSize`, 08-31) but no variant seam,
and the Button is not reachable through `className` — that lands on the
section.

## Ask

Either of these, your call:

1. **A `submitVariant` prop**, default `primary` so nothing moves for anyone —
   the consumer passes `secondary` on its dark band.
2. **Or the organism reads its own `background`**: when it is rendered on an
   inverse band it flips the submit to `secondary` itself, no prop. Fewer
   knobs, but it means the organism knowing which backgrounds are dark.

Option 1 is the smaller change and matches how `controlSize` landed.

## What stays here

`HomeSignup.jsx` — the one call site, on `/` and `/stack`. Takes the prop on
the bump; nothing else changes.

## Remainder here once it ships

bump; `submitVariant="secondary"` (or nothing, if option 2) in `HomeSignup.jsx`;
eyeball `/stack` in dark at 390 — the Subscribe control should be the white one.

## ✅ RESOLUTION — 2026-09-01 · kol-component@0.157.0

Option 1, the way controlSize landed: submitVariant, default primary so nothing moves for anyone; HomeSignup passes secondary on the dark band and gets the white ink-on-page control the user asked for. Not option 2 — the organism does not know which backgrounds are dark and should not start guessing from a class string. Verified in a real render that the default still renders kol-btn-primary; the prop is a straight passthrough to Button. Tarball checked.

**Remainder here:** none — kol-website bump kol-component@0.157.0; submitVariant="secondary" in HomeSignup.jsx; eyeball /stack in dark at 390 — Subscribe should be the white control.


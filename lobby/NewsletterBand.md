---
component: NewsletterBand
source: kol-monorepo/apps/web/src/components/sections/home/HomeSignup.jsx#L1-L109
date: 2026-07-03
status: draft
deps: [Input, Button]
---

# NewsletterBand

## Purpose
A centered newsletter-subscribe band: heading + lede over an email `Input` + submit `Button`, with an inline success/error status line under the form. Handles its own email state and POST, then swaps in a status message. Used as the closing subscribe section on Home and Stack. Currently hard-codes both the copy and the submit endpoint (`/api/subscribe`) — staging exposes those as props so the DS owns the band and the consumer owns the copy + destination.

## Anatomy
```
<section id="signup" class="w-full flex flex-col items-center justify-center text-center">
  <div class="max-w-[1400px] mx-auto py-24">
    <h2 class="kol-display-lg mb-6 opacity-0 animate-on-scroll">   {title}
    <p  class="kol-mono-sm-regular text-auto mb-12 mx-auto max-w-[64rem] opacity-0 animate-on-scroll">   {description}
    <form onSubmit class="flex flex-col gap-4 mb-16 opacity-0 animate-on-scroll sm:flex-row sm:items-center sm:justify-center sm:gap-3">
      <Input id="newsletter-email" type="email" placeholder value onChange size="md"
             aria-required aria-describedby={error?'signup-error'} class="w-full sm:max-w-[400px] md:max-w-[520px]" />
      <Button type="submit" variant="primary" aria-label="…" class="w-full sm:w-auto">   {submitLabel}
    {status==='success' && <p class="kol-mono-sm text-auto opacity-80" role=status aria-live=polite>   {successCopy}
    {status==='error'   && <p id="signup-error" class="kol-mono-sm text-auto opacity-80" role=alert aria-live=assertive>   {errorCopy}
```

## Variants
- **Status: idle / success / error** — mutually exclusive status line under the form; success clears the input, error is shown on empty submit or non-OK response.
- No visual `variant` prop — one centered layout.

## Props
> Source has NO props (copy + endpoint hard-coded). This is the proposed seam.

| prop | type | default | controls |
|------|------|---------|----------|
| title | node | — | heading (`kol-display-lg`) |
| description | node | — | lede (`kol-mono-sm-regular`) |
| placeholder | string | — | email `Input` placeholder |
| submitLabel | node | — | submit `Button` label |
| onSubmit | `(email) => Promise` | — | submit handler (preferred over `endpoint`) |
| endpoint | string | — | POST URL when no `onSubmit`; body `{ email }` |
| successCopy | node | — | success status line |
| errorCopy | node | — | error status line |

## States & interactions
- **Submit:** `preventDefault`; empty email → `status='error'` immediately; else POST JSON `{ email }` → `response.ok` sets `status='success'` and clears the field, non-OK or throw sets `status='error'` (logs to console).
- **A11y:** `Input` gets `aria-required` and, on error, `aria-describedby="signup-error"`; success line `role=status aria-live=polite`; error line `role=alert aria-live=assertive`; `Button` has an `aria-label`.
- **Responsive:** form stacks (`flex-col`) on mobile, becomes a centered row at `sm` (`sm:flex-row sm:justify-center`); `Input` caps at `sm:max-w-[400px] md:max-w-[520px]`, `Button` full-width on mobile.
- Scroll-reveal: heading/lede/form start `opacity-0 animate-on-scroll`; a component-local `IntersectionObserver` toggles `animate-in` — app animation infra (see DROP).

## Styling
- Type: `kol-display-lg` (heading), `kol-mono-sm-regular` (lede), `kol-mono-sm` (status).
- Tokens: `text-auto`; status `opacity-80`. `max-w-[1400px] mx-auto py-24` band frame.
- **App-specific bits to DROP:**
  - `fetch('/api/subscribe', …)` — hard-coded submit endpoint (backend proxies Kit/Formspree) → `onSubmit`/`endpoint` prop.
  - All copy — "Subscribe to the newsletter", "Get updates on new typefaces…", placeholder "Your mail address", "Subscribe", "Thanks for subscribing!", "Please enter a valid email address." → props.
  - The inline `IntersectionObserver` + `animate-on-scroll`/`animate-in` block (querying `document`, whole-document scope) — app scroll-reveal infra; drop or replace with a DS reveal utility, and never query the whole document from a DS component.
  - `id="signup"` anchor + `id="newsletter-email"`/`id="signup-error"` fixed ids — make id/anchor a prop to avoid collisions when multiple bands mount.

## Dependencies
- **Input** (`@kol/ui`) — email field (`size="md"`).
- **Button** (`@kol/ui`) — submit (`variant="primary"`).

## Recreation notes
- Tier: **organism** (heading + form + async status, self-managed state).
- Prop/slot seam: prefer an `onSubmit(email)` callback (returns a promise; component owns pending/success/error) and keep `endpoint` as a convenience for the default POST. Drop the baked `/api/subscribe`.
- Keep the a11y wiring (`aria-live` regions, `aria-describedby`, `aria-required`) — that's the reusable substance; just parameterize the ids.
- Text casing at call site: author `title`/`description`/`submitLabel`/status copy in final case; no `text-transform` or JS casing in the component.
- Filename note: staged as **NewsletterBand** (source component is `HomeSignup`) — the DS name generalizes off the app-page name.
- Fix on recreation: swap the document-wide `IntersectionObserver` for a scoped ref-based reveal (or the DS reveal utility); the current global query is not DS-safe.

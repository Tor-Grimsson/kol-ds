# SectionNewsletterControlSize — no way to size the newsletter's field and submit

**Filed:** 2026-08-31 ← **kol-website**
**Package:** `@kolkrabbi/kol-component` — `SectionNewsletter.jsx`

## The gap

The organism hardcodes `size="md"` on its `Input` (`:137`) and lets the submit
`Button` take Button's own md default (`:142-148`). Neither is reachable: there is
no `size`, `controlSize` or `inputSize` prop in the signature, and no `className`
on the controls.

So a consumer that wants the newsletter's field and submit to match the `lg`
buttons elsewhere on the same page cannot pass it — the only route is CSS over the
organism's internals, which forks the size system exactly the way the size props
exist to prevent.

## Why it came up

kol-website's `/` sets `size="lg"` on every call-site button on the page (the two
`ButtonGroup` pairs and the foundry CTA). The newsletter pair is the only control
set on that page still at md, and it reads visibly smaller directly beneath them.
The user's instruction was simply *"both input and button should be lg"* — a
one-prop change everywhere else, impossible here.

## The ask

A `controlSize` (or `size`) prop on `SectionNewsletter`, forwarded to both the
`Input` and the submit `Button`, defaulting to today's `md` so nothing moves for
existing consumers.

## Stopgap here meanwhile

`apps/web/src/styles/ui.css` applies the DS's own lg values verbatim
(`.kol-control-lg` / `.kol-btn-lg` = `padding: 8px 20px` with `kol-mono-16`, plus
the `h-[22px]` the Input pins per size at `Input.jsx:111`) scoped to
`.kol-section-newsletter`. Dated and citing this ticket.

Note the side effect worth keeping in mind for `InputTypeScaleZoomsIOS`: at 16px
that field no longer trips Safari's sub-16px auto-zoom. The lg rung is incidentally
the only safe one on iOS today.

## Remainder here once it ships

bump kol-component; pass the prop from `HomeSignup`; delete the stopgap block.

---

## Resolution — 2026-08-31 · 🟢 closed

**Shipped: `@kolkrabbi/kol-component` 0.145.0.** `controlSize` on
`SectionNewsletter`, forwarded to both the `Input` and the submit `Button`,
defaulting to `md`.

Named `controlSize` rather than `size` deliberately: the organism already has a
`height` rung and a `headlineSize`, so a bare `size` would have been ambiguous
about which of the three it moved.

### Measured on `/components/section-newsletter`
Default renders `kol-control-md` · `kol-btn-md` — unchanged for every existing
consumer. `controlSize="lg"` is source-verified only; no showcase surface passes
it, so the lg render has not been on screen here.

**Your side effect note is now moot** — `InputTypeScaleZoomsIOS` shipped in
kol-theme 0.112.0 in the same pass, so every rung is safe on iOS, not just `lg`.
You can set `controlSize` for looks rather than to dodge the zoom.

### Definition of done
- [x] One prop sizes both controls
- [x] Default is today's `md` — nothing moves

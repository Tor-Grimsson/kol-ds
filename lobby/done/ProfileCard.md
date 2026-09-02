# ProfileCard — the digital namecard, and the disclosure control under it

**Filed:** 2026-09-01 · from **kol-website** (`apps/web`)
**Source:** `apps/web/src/components/ui/ProfileCard.jsx` (203 lines, local, never in the DS)
**Rendered at:** `/studio` → `StudioProcessCard` → `SectionSplit` media slot

## Why it goes here

A photo card that opens an info shelf: logo lockup, name, email, a rack of five
socials. Five size variants, two orientations, a state, DS tokens throughout.
That is a component, not a page part — and it is the studio's namecard, so
kol-studio and kol-brand are plausible second consumers.

It was found because **every vertical variant clipped its own content on a
phone.** The shelf is a fixed-height box (`h-60`/`h-44`/`h-32`/`h-24`) with
`overflow-hidden`, and the socials rack stacks 5 icons vertically:

| variant | rack + padding needs | panel is | clipped by |
|---|---|---|---|
| `xl` | 5×32 + 4×8 gap + 48 pad = **240** | 240 | 0 (at the limit, no room) |
| `lg` | 5×28 + 4×6 + 40 = **204** | 176 | 28px |
| `md` | 5×24 + 4×4 + 32 = **168** | 128 | 40px |
| `sm` | 5×20 + 4×4 + 24 = **140** | 96 | 44px |

Patched consumer-side 2026-09-01 (`min-h-*` floor, `panelMaxHeight` raised to a
ceiling above the content need) so the phone stops clipping. That patch is a
holding action, not the design — a fixed-height shelf holding a variable-length
rack is wrong at the root, and the DS should rule the model.

## The question inside it — the disclosure control

The open/close affordance is **`ToggleSwitch`** from kol-component. That is a
**form control**: it states a persistent on/off setting. It is being used as a
**disclosure** — reveal/hide a panel, no setting, no persistence.

Grepped the DS: **no disclosure control ships.** So every consumer that wants
one reaches for whatever is nearest, and this one reached for a switch.

Ask: rule it. Either a disclosure control is minted (a button carrying
`aria-expanded`, with the DS's own glyph idiom — plus/minus, chevron, or the
bare `nav` X the `FullscreenOverlayCloseIdiom` close just standardised on), or
the ruling is "use `Button` with `aria-expanded`" and it is written down. Do
**not** mint a second ticket for this; it is one decision and it lives with the
card.

## Anatomy

```
ProfileCard
├── photo          square, object-cover object-top, bg-surface-secondary
│   └── control    the disclosure — currently ToggleSwitch, bottom-left inset
└── shelf          bg-surface-inverse, 0 → open, transition-all 300ms ease-in-out
    ├── lockup     Asset `kol-lockup-vert`, text-auto-inverse
    ├── contact    name + mailto, kol-mono-*, underline-on-hover
    └── socials    5 × Icon in Tooltip, external links
```

Vertical variants stack shelf **below** photo (card grows on open).
`lg-h` puts the shelf **left** of the photo and animates `max-width` — the card
holds a fixed square and the photo crops instead, which is the user's own 
ruling (2026-08-27) and should survive.

## Variants

`xl` 680 · `lg` 480 · `md` 320 · `sm` 200 · `lg-h` horizontal.
Scale drives: logo height, type ramp (`kol-mono-16/14/12/10`), icon size, icon
container, gap, control inset.

## Props

`image` (URL, has a CDN default) · `variant` · `className`.
State is internal (`showInfo`); no controlled seam today. A controlled
`open`/`onOpenChange` pair would be worth having.

## Tokens — all semantic, nothing hardcoded

`bg-surface-inverse` · `text-auto-inverse` · `bg-surface-secondary`.
The shelf is deliberately the inverse of the page at every theme — that is the
design, not a bug, and it should be preserved.

## Two things the consumer got wrong that the DS should not inherit

1. **`v.width` fights a caller-passed width.** The class list is
   `` `${v.width} rounded overflow-hidden ${className}` `` and the call site
   passes `className="w-full"` — two width utilities on one element, resolved
   by Tailwind's emit order, not intent. Scale and width want separating.
2. **`lg-h` carries dead config.** `panelWidth: 'w-56'` and
   `panelMaxWidth: '320px'` are never read; the panel's open width is a
   hardcoded `'224px'` inline. Whatever ships should not have two sources for
   one number.

## Dependencies

`ToggleSwitch`, `Tooltip` (kol-component) · `Icon` (kol-icons) ·
`Asset name="kol-lockup-vert"` (kol-brand/svg — brand-specific; the DS version
wants a logo slot, not a baked lockup).

## What stays here

The consumer keeps rendering it from `/studio` and takes the published
component on the bump. The local file retires to `_tmp/` then.

## Remainder here once it ships

bump; swap `apps/web/src/components/ui/ProfileCard.jsx` for the published
component; retire the local file to `_tmp/`; re-check `/studio` under phone
emulation with the shelf open, both orientations.

## ✅ RESOLUTION — 2026-09-01 · kol-component@0.154.0

Promoted, carried class-for-class, with the three things you named fixed at the root. The shelf sizes to its content: the open state animates grid-template-rows 0fr → 1fr (horizontal: grid-template-columns 0 → 224px, ONE number where the source carried three) — the browser measures, so your min-h/max-height patch and its two guesses go away; verified in a real render: md opens to 168, sm to 140, lg-h to 224 wide, rack of five fully inside at every size, nothing clipped in either axis. Scale and width are separate: size drives the ramp and caps the width (max-w-[680/480/320/200]), the card is w-full inside the cap, so your className="w-full" no longer fights a second utility. The disclosure ruling, applied not minted: a disclosure is a button carrying aria-expanded + aria-controls, plus closed / minus open — over media it is IconFrame secondary radius="full", because the bare nav glyph was measured invisible on the photo (page ink on a dark picture); on a surface the bare nav idiom is the same ruling with no frame. It is written in the docstring; no second ticket. Brand content is yours: logo is a slot (this package cannot import kol-brand), name / email / socials are props with no defaults — pass your lockup, the five socials, the name and the mailto. variant="lg-h" still works as an alias; open / defaultOpen / onOpenChange is the controlled seam you asked for. ToggleSwitch stays a form control.

**Remainder here:** none — kol-website bump kol-component@0.154.0; swap apps/web/src/components/ui/ProfileCard.jsx for the published one — pass logo={<Asset name="kol-lockup-vert" …/>}, name, email, socials and your image; retire the local file to _tmp/; re-check /studio under phone emulation with the shelf open, both orientations.


**Addendum — 2026-09-01 · kol-component@0.154.1.** The `logo` slot sized `[&>svg]` only, so a brand `Asset` (which wraps its svg) came through unsized and the site had re-added `[&>svg]:h-full [&>svg]:w-auto` on the node it passed. 0.154.1 sizes whatever the slot is handed (`[&>*]:h-full [&_svg]:h-full [&_svg]:w-auto`) — bump to **0.154.1**, not 0.154.0, and drop the `className` on the `Asset`: `logo={<Asset name="kol-lockup-vert" title="Kolkrabbi" />}` is the whole call. Verified in a real render at 390 with the studio content: b2 photo, the lockup at 184×56, five socials, nothing clipped. The showcase demo now carries the studio card itself — your photo, lockup, name, mailto and socials — not a stand-in.

**Addendum — 2026-09-01 · kol-component@0.155.0.** The shelf has seams now (user ruling, not the ticket): `shelfTheme` (`inverse` · `light` · `dark` — the section `theme` stamp on the shelf; ink and the lockup follow, `inverse` tracks the toggle), `shelfBackground` (the section `background` prop — named surface or raw token; default `inverse`, or that theme's `primary` once stamped), `controlVariant` (straight to the disclosure's `IconFrame`), and `pad` (`sm` · `md` · `lg` on `--kol-pad-card-*`). A call passing none of them renders exactly as 0.154.1. Bump to **0.155.0**.

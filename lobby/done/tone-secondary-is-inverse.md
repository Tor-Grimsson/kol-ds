# tone-secondary-is-inverse — no tone paints the primary surface, and the one called `secondary` is an inverse

**Filed:** 2026-09-03 ← **kol-client-olina**
**Packages:** `@kolkrabbi/kol-theme@0.137.0` — `kol-components-molecules.css` (the `--kol-tone-*` bundles) · `@kolkrabbi/kol-component@0.176.0` — `src/utilities/tone.js`
**Origin:** the user, setting `kol-tone-secondary` on `/slide-deck` expecting `#121215`: *"this is not secondary this is inverted"* — and: *"I told you I wanted primary surface as a tone … that tone should be called secondary. What is currently secondary should be called inverted."*

## The problem

The six tones shipped in 0.134.0 were lifted from Button's variants, and Button's
`secondary` was already an inverse — `surface-on-primary` as the fill, `surface-primary`
as the text. The name survived the lift. So:

| tone today | background | what it is |
|---|---|---|
| `primary` | `surface-secondary` | a lighter dark |
| `secondary` | `surface-on-primary` | **an inverse** — the text colour as fill |
| (none) | `surface-primary` | **the page's own surface has no tone** |

The user's ruling on the tone ticket had one more line that the list I filed did not
carry: *"one thing I forget is I would like a tone for the primary surface, that could
actually be called secondary"*. It was said on 2026-09-03 before the ticket was written
and dropped from the six. This is that line.

Two consequences today. A control set that should sit AT the page colour (`#121215`
in dark, `#fafafa` in light) cannot say so — `default` means inherit, and nothing
paints `surface-primary`. And a consumer reading `secondary` expects the ladder's
second rung and gets the ladder flipped.

## The ask

Two renames and one addition, aliased, default-preserving:

| tone | background | text | change |
|---|---|---|---|
| `primary` | `surface-secondary` | `surface-on-primary` | unchanged |
| **`secondary`** | **`surface-primary`** | `surface-on-primary` | **new meaning** — paints the page surface |
| **`inverse`** | `surface-on-primary` | `surface-primary` | **what `secondary` paints today**, under its real name |
| `outline` · `ghost` · `grey` · `sunken` | | | unchanged |

- `inverse` today is an alias of `sunken` (kept from 0.117.0). It stops being that and
  becomes this. `sunken` callers on `inverse` are the migration cost — grep the estate;
  the 2026-08-28 note says "every consumer on it renders the same pixel", so the count
  is known.
- `secondary` on an element today renders the inverse. On ship it renders the page
  surface. That IS a visible change for any consumer passing `tone="secondary"` or
  `variant="secondary"` — so the variant alias for Button's `secondary` should point at
  `inverse`, not at the new `secondary`, and Button's visible output stays put. Only
  the *tone* word moves.

The pairing then reads the way the user asked on the first tone ticket: primary tone on
the primary surface paints one step up; secondary tone paints the surface itself.

## Consumer status

`/slide-deck` carries `kol-tone-secondary` on its root and renders the inverse. It
stays that way until this ships, then renders `#121215` with no page change. Nothing
worked around.

## Related

`tone-is-the-ground-axis` (2026-09-03, closed, theme 0.134.0) — this is the line from
that ruling that did not make the ticket.

## ✅ RESOLUTION — 2026-09-03 · kol-theme@0.138.0

kol-theme 0.138.0 · kol-component 0.177.0 · kol-framework 0.42.0. `secondary` paints the page surface now — `surface-primary` / `surface-on-primary` with primary's rungs — and the text-colour fill it used to mean is a seventh tone, **`inverted`**, the user's own word. Button's, IconFrame's and the panel's `secondary` VARIANT classes alias `inverted`, so their pixels do not move (matrix-verified: every variant identical before and after); only the tone word changed meaning. One deviation from the ticket's naming: `inverse` is NOT the new tone. It has been `sunken`'s alias since 0.117.0 and one kol-website call (`LibraryLocal.jsx`) still passes it expecting the well — renaming it under a live consumer would have flipped a dark well to a light plate; it stays sunken's alias until that call moves, on the retirements ledger. `/slide-deck`'s `kol-tone-secondary` renders the page surface the moment 0.138.0 is pinned. Law: 05-control-chrome.md → Tone.

**Remainder here:** none — kol-client-olina bump kol-theme@0.138.0 · kol-component@0.177.0 · kol-framework@0.42.0 · kol-shell@0.48.0 (pin the numbers; 0.137.0 is deprecated — one column in Firefox).


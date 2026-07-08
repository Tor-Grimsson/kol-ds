# Button + chrome audit ledger — 2026-07-08

The "button goes invisible on hover" bug, root-caused and generalized into the chrome law. Review artifact (live spec reference): https://claude.ai/code/artifact/1d9ad975-e15c-4821-945e-39502cb2a53a

## Root cause

Filled button variants swapped their opaque rest fill for a translucent `fg-*` wash on hover (primary 92% transparent, secondary 80% + ink swap, accent 20% via `--kol-accent-primary-strong`). Over any content that isn't the page surface the button vanished — plain desktop hover, not touch. The wash idiom is correct only for transparent-at-rest chrome (outline/ghost), never as a fill replacement.

**The rule:** interactive fills mix ink into the surface (`oq-*`, kol-opaque.css — the married opaque mirror of `fg-*`), never into `transparent`. Panel-bound decoration (dividers, table washes) keeps `fg-*`.

## Findings (F1–F9)

- F1–F3 **bug**: translucent hover fills — primary `fg-08`, secondary 20% wash + ink swap, accent strong token — FIXED
- F4 **gap**: no `:focus-visible` on `.kol-btn` — FIXED (2px `--kol-focus-ring`, offset 2)
- F5 **gap**: no `:active` — FIXED (one stop past hover per variant)
- F6 **dead**: `.kol-btn-selected` emitted by Button.jsx:86, defined nowhere — **FIXED 2026-07-08**: it was used in 4 real call sites (all silently unstyled); `selected` is now an alias of `pressed`, dead class removed (changeset `btn-selected-alias-pressed`)
- F7 **a11y**: ghost rest label `fg-48` ≈ 3.4:1, under AA — **WON'T-FIX 2026-07-08**: `ghost` is being retired (near-zero usage), so fixing its contrast is wasted work; folds into the legacy-alias sweep
- F8 note: quiet/pressed opacity idioms by design; pressed since redesigned (solid inverted ink)
- F9 keep: the `@media (hover:hover)` touch guards stay

## Accepted button spec (landed in kol-theme, changeset `btn-hover-touch-guard`)

| variant | rest | hover | active |
|---|---|---|---|
| primary | surface-secondary | oq-08 | oq-16 |
| secondary | surface-on-primary | **oq-inverse-40** (label stays light, no ink swap) | oq-inverse-48 |
| accent | accent-primary | strong = accent 80% into surface (opaque, token-level) | accent 70% mix |
| outline | transparent · border-oq-16 | oq-02 | oq-08 |
| ghost | text oq-48 | oq-04 | oq-08 |
| pressed | solid inverted ink (surface-on-primary / surface-primary) | — | — |

Plus focus ring everywhere; disabled stays opacity .5. Sibling fixes same changeset: tag-control hover/active → oq-24, toggle-switch track → oq-16, kol-control--ghost fill → opaque 4% black.

## The chrome law (landed, changeset `chrome-law-controls`)

Every control references the Button: **two variants** (primary = filled surface-secondary; outline = transparent + border-oq-16, always secondary to primary) and **the button size scale** (sm 26 / md 32 / lg 40 — pad 4/12·6/16·8/20, mono 12/14/16).

- **Dropdown** — trigger emits `kol-btn kol-btn-{variant} kol-btn-{size}` (inline-style chrome removed); open = fused (primary: same fill, no border/gap, inner hairline; outline: bordered pair). Aliases: default/subtle→primary, minimal→outline. Big radii died.
- **Input/Textarea** — ghost folds into outline (aliased); `.kol-control--ghost` CSS deprecated in place.
- **ToggleSwitch** — bare by default (no box); primary/outline shells at button geometry; `size` prop; track scales; on = inverted ink; auto-uppercase label removed (no-auto-casing).

## Open / next

- F6 (dead class) FIXED; F7 (ghost contrast) WON'T-FIX — both resolved above.
- Slider **resolved 2026-07-08**: collapsed to the single bare `minimal` look — `variant` prop removed, the phantom `.control-slider-minimal` bug fixed (that class never existed), `default`/`subtle` deleted. Changeset `slider-minimal-only`. Exempt from the two-variant law: a bare range row, not a pressable surface (docs `03-components/05-control-chrome`).
- Legacy aliases (`ghost`, `default`, `subtle`, `minimal`, `plain`, `control`) → sweep consumers, then drop all in one **major** bump (not piecemeal). `ghost` retires there, which is what cancels F7.
- **5 changesets held** (`btn-hover-touch-guard`, `chrome-law-controls`, `icon-resize-grip`, `btn-selected-alias-pressed`, `slider-minimal-only`); one batched publish when unparked.
- Chrome law now documented in the vault: `docs/documentation/03-components/05-control-chrome.md`; the heavy components catalogued in `03-components/04-diamond-tier.md`.

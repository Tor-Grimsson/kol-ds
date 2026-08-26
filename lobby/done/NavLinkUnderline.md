---
component: NavLinkUnderline
source: kol-website/apps/web/src/styles/animations.css#L66-L88
staged: 2026-08-12
status: draft
deps: []
---

# NavLinkUnderline

## Purpose

The animated hover underline for nav links: draws in left-to-right on hover,
retracts right-to-left on leave (transform-origin swap, not a fade). Born in
kol-website's Navbar desktop link row, now carrying the full-bleed takeover
menu's links (`kol-sans-heading-01` scale) and its instagram line
(`kol-mono-14` scale). It is the site's only link-hover affordance since the
opacity-mute pattern was dropped — load-bearing chrome living in a consumer's
`animations.css`, invisible to every other consumer.

## Anatomy

```
.nav-link-underline          (position: relative — the link itself)
└── ::after                  (the line: absolute, full width, 2px, currentColor)
```

## Variants

None (single form). Scales with the text because the line is `currentColor`
and full-width of the label.

## Props

Not a component — a utility class. No props. If minted as a class in
kol-theme, the one knob worth tokenising is thickness (2px hardcoded; fine at
mono-14, could want 3px at heading-01 scale).

## Styling

Exact rules as shipped in the consumer (all of it — no app coupling):

```css
.nav-link-underline {
  position: relative;
}

.nav-link-underline::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 100%;
  height: 2px;
  background-color: currentColor;
  transform-origin: bottom right;
  transform: scaleX(0);
  transition: transform 300ms cubic-bezier(0.65, 0.05, 0.36, 1);
}

.nav-link-underline:hover::after {
  transform-origin: bottom left;
  transform: scaleX(1);
}
```

- Consumer wraps it in `@layer components`.
- Nothing to DROP — no app tokens, no hardcoded colors (`currentColor` rides
  the text).

## States & interactions

- **rest** — no line (`scaleX(0)`, origin bottom-right)
- **hover** — line draws left→right (`scaleX(1)`, origin flips to bottom-left)
- **leave** — line retracts right→left (origin is back at bottom-right for the
  reverse transition)
- **focus-visible** — NOT handled in the consumer copy; the DS version should
  mirror hover on `:focus-visible` for keyboard parity.

## Dependencies

None. Pure CSS, pseudo-element only.

## Recreation notes

- **Tier: kol-theme utility class** (sibling of the `.kol-*` chrome classes),
  not a component — it decorates any anchor/NavLink regardless of framework.
- Name it into the kol namespace (`.kol-link-underline` or similar) — the
  `nav-` prefix undersells it; it fits any inline link.
- Add the `:focus-visible` trigger alongside `:hover`.
- Consider `@media (prefers-reduced-motion: reduce)` → skip the transition,
  show the line instantly on hover/focus.
- Consumer cleanup once shipped: kol-website deletes the block from
  `animations.css` and swaps the two call sites in
  `apps/web/src/components/layout/Navbar.jsx` (takeover nav links + instagram
  link) to the shipped class name.

---

## Resolution (2026-08-12) — 🟢 closed

Shipped in **@kolkrabbi/kol-theme@0.35.0** (registry-verified).
`.kol-link-underline` in kol-utilities.css — geometry verbatim from the site's
`animations.css` (scaleX draw-in/retract, currentColor, bottom -2px), plus
`:focus-visible` parity, `prefers-reduced-motion` kills the transition, and a
thickness knob `--kol-link-underline-size` (2px default; a heading-01 link can
set 3px). Adoption is kol-website's: bump, swap the two Navbar call sites to
`kol-link-underline`, delete the `animations.css` block.

# TabsStackedLayout — MobileTabBar is a tab layout, not a mobile thing

**Staged:** 2026-10-17 → kol-ds-ui · from kol-monitor

## The ask, in the user's words

> "why are we only saying this is mobile? wouldnt it just be mobile variant? it seems like a normal tab system
> with icons vertically stacked."

## What it is today

`MobileTabBar` (molecules) is tabs drawn icon-over-label, hard-wired `fixed inset-x-0 bottom-0 md:hidden`. So it
can only exist as a phone's floating bottom bar, and even the KOL's own docs preview has to fight its placement.

## The ask

- The stacked icon-over-label look becomes a **layout of the tab component** (`TabChips layout="stacked"`, or
  whichever tab component the KOL keeps as the base), usable anywhere: a rail's foot, a bottom rail's header,
  a phone bar.
- Floating fixed to the bottom below `md` becomes the **placement**, a prop or the phone shell's job, not
  the component's identity. `MobileTabBar` stays as an alias, or is retired.

## Acceptance

Stacked tabs render inline in a desktop container with no `!static` override, and the phone bar is the same
component with its placement set.

## ✅ RESOLUTION — 2026-10-17 · kol-component@0.266.0

kol-component 0.266.0: `TabsRow look` — underline (default) · chip (was TabChips) · text (was kol-shell TabStrip) · stacked (icon over label, was MobileTabBar), and `placement="phone"` for the bottom bar below md. One tab component; the three old names are aliases whose DOM is byte-identical to the new looks (checked). Stacked renders inline in a desktop container with no override; the phone bar is `look="stacked" placement="phone"`.

**Remainder here:** none — kol-monitor bump kol-component@0.266.0 (+ kol-shell@0.66.0); drop the `!static` override — `TabsRow look="stacked"` inline, `placement="phone"` where it is the phone bar.


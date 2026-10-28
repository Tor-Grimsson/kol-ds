---
component: PhoneNavVariants
source: kol-fxr plan 43 (`~/dev/projects/kol-fxr/.kol/llm-plan/43-accounts-phone-home-and-the-growing-line.md`)
staged: 2026-10-28
status: draft
---

# PhoneNavVariants

**Raised:** P1 (user, 2026-10-28): *"why is there border still"* … *"nav pills get no shadow when it doesn need it … So we should ship variants? or presets? because if we only ship props then each repo has to tune to the same settiings and we get drift"*

## The problem
- Home's phone pill is drawn by `AppShell` (`touch="pill"`, AppShell.jsx ~L386), which passes no `border` / `active` / `placement`, so it keeps the hairline. Labs sets the frame-E look by hand on its own `PhoneNav`. Two apps, two tunings: the drift the user named.
- `PhoneNav` has no `shadow` passthrough; `TabsRow` has it.

## The ask
- `PhoneNav variant="nav" | "panel" | "transport"`, each a preset of the pill props:
  - `nav`: no border, no shadow, `active="circle"` (Home and every app's phone nav)
  - `panel`: the frame-E panel picker (top placement, foldable, `moreKeepsOpen`, no border); shadow only when it floats over a stage
  - `transport`: `TransportPill`'s look (shadow on, it floats over content)
- Props stay as overrides on top of the variant.
- `AppShell` / `AppStudio` take the variant (default `nav`) and pass it to the pill they draw.

## Done when
- Home's pill on a phone has no hairline with no prop set in fxr.
- fxr Labs' `PhoneNav` and `TransportPill` drop their hand-set props for `variant`.


---

## ✅ RESOLVED — 2026-10-28

Shipped **kol-shell 0.85.0 · kol-component 0.309.0**. `PhoneNav variant="nav" | "panel" | "transport"` over `PHONE_NAV_VARIANTS` (exported), props still override; `shadow` passthrough; `AppShell navVariant` (default `nav`) — Home's pill has no hairline with no prop set; `TransportPill` reads the table's `transport` row. Walked on studio-hub at 1440 and iPhone 13 (`_tmp/2026-10-28-fxr-phone-walk/`, 8/8).

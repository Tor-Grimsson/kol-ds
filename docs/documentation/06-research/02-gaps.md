---
title: Ranked gaps
type: audit
status: active
created: 2026-08-02
updated: 2026-08-02
description: What KOL is missing, in priority order
tags:
  - domain/components
  - audience/consumer
related:
  - "[[INDEX|research]]"
---

# Ranked gaps

What the comparison found KOL lacks, ordered by what it costs to keep lacking it.

## Recommendations

1. **Establish an a11y baseline + shared behavior hooks** (Finding 5). Highest structural value. Document the keyboard/ARIA contract every overlay/menu/form component must meet; extract focus-trap / roving-tabindex / dismiss into shared hooks so new components inherit it. Do this *before* filling overlay gaps in Finding 2, or the gaps inherit the same unevenness.
2. **Add `cn()` (clsx + tailwind-merge) and an `asChild` pattern** (Finding 3). Small, mechanical, immediately removes the silent-className-loss footgun and the `<Button href>` workaround. Lowest effort-to-value ratio on the list.
3. **Close the high-recurrence component gaps, demand-ranked** (Finding 2): `Tabs`, `Card`, `Alert`, `Toast`/`Sonner`, `Skeleton`, `Progress`, then generalize `Modal` into a proper `Dialog`. Skip the design-tool-irrelevant ones (`Calendar`, `Chart`, `Input OTP`) until a consumer needs them.
4. **Generate per-component props/API tables** for the showcase (Finding 6). The data already lives in the package source; the inventory pass proves it's extractable. Adds the one piece of shadcn's doc page KOL still lacks.
5. **Move base tokens to OKLCH** (Finding 4). Low-risk quality win for light/dark parity; keep the opacity-scale system (it's an advantage).
6. **Publish a shadcn-compatible registry + (optional) MCP** (Findings 1, 6). shadcn's CLI consumes third-party registries; a `registry.json` for KOL would let any shadcn user `npx shadcn add @kol/<name>` *without* KOL abandoning versioned packages. Pairs naturally with serving the existing mined usage over MCP. Highest-ceiling, lowest-urgency — do it once the catalog and a11y are solid.

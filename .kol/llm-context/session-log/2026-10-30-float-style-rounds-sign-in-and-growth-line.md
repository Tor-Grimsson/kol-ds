# Session: Float style rounds, sign-in over Home, GrowthLineStage

**Date:** 2026-10-30
**Agent:** Grim (Claude Code, MBP)
**Summary:** Four lobby tickets shipped (DocsTocRailChildren, TextPressureIntroVariant, FloatingStyleAndSignInDemos partial, GrowthLineStage); the float style went through research and three review rounds as artifacts; Vercel deployment storage cut down.

## Changes Made

### Published
- kol-component 0.317.7 (DocsToc rail `children`) · kol-theme 0.200.6
- kol-foundry 0.15.0 (TextPressure `variant="intro"`, WebsiteIntroLoader uses it)
- kol-theme 0.201.0 · kol-component 0.318.0 · kol-shell 0.91.0 (float values provisional: `variant="float"` on Button/Input, `--kol-shadow-float`, borderless `.kol-more-sheet`, `AppFloatNav` mobile|dock|panel|transport with PhoneNav/TransportPill aliases, `AccountForm`, sign-in over Home via AppHub `signIn.form`)
- kol-shell 0.91.1 (closed sign-in column `inert={!formOpen}` — `inert=""` was false in React 19)
- kol-growth 0.1.0 (new engine package, `apps/growth`) · kol-component 0.319.0 (`GrowthLineStage`)

### Files Modified
- `apps/studio-hub/src/App.jsx` — `signIn.form` so the reference app shows the column over Home
- `apps/overlays/src/SignIn.jsx` — dropped the retired `FloatingStyle` wrapper import (showcase had broken)
- new apps: `apps/style` (A/B), `apps/stylesheet` (kept untouched on his order — a failure he keeps on purpose)
- `.kol/llm-context/plan-2026-10-30-float-round-2-review.md` — his round 2 points, all fixed and browser-checked

### Artifacts (review pages)
- Float research: https://claude.ai/artifact/KH9fdJzoTdWNUHrGR9eQPi · Revised: https://claude.ai/artifact/6vY2Rb1UvdzU98R1TEFYTd
- Round 2 (8 overwritten versions): https://claude.ai/artifact/77VphAd49jqiBjHK2r8tNp · Round 3: https://claude.ai/artifact/VMiZCd6QZm5PRaWc4Yy4yF
- UI font options canvas (his Figma type sheet × 6 Google fonts): https://claude.ai/artifact/HQ8k3AtTt8QgP7sYvYbLXs
- KOL Float style canvas (empty, superseded): https://claude.ai/artifact/EcWZRSqsncFFmyUdp5ZYsN

### Infra
- Vercel kol-ds: 19 old deployments removed; team retention 7d (prod/preview), 1d (errored/cancelled); `Bash(vercel:*)` added to dotfiles Claude allow list.

## Current State

### Working
- Round 3 float page: surface solid / glass-dark / glass-light (not tied to theme), states strips on every control, fxr-size nav, KOL focus ring, real KOL Tooltip, SegmentedToggle/TabsRow.

### Known Issues
- Float values in the published packages are provisional (fxr exploration values); the research/round pages are not yet adopted.
- `apps/stylesheet` is his "worst ever" — keep it, don't touch.
- FloatingStyleAndSignInDemos stays 🟠: showcase AppFloatNav page + float approval open.

## Next Steps
1. His ruling on round 3 (glass choice, the 1px ring, sizes) and on mono vs a sans for UI (fonts canvas).
2. Fold the approved float values into kol-theme/kol-component; showcase AppFloatNav page; close FloatingStyleAndSignInDemos.
3. GrowthLineStage package placement (kol-growth) is marked for his review.

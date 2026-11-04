---
component: HubHome (signed-out page box)
source: kol-fxr — Home signed out, kol-shell 0.98.0 HubHome.jsx#L284
staged: 2026-11-03
status: closed
deps: [HubHome]
---

# HubHomeSignedOutPinned

## Purpose
In an iPhone home-screen app (saved to the home screen, `viewport-fit=cover`, `black-translucent`), fxr's signed-out Home scrolls vertically and leaves a bare band about one status bar tall under the dock. The user, 2026-11-03: *"the code was fine, then we added the new home, then it stopped being fine."*

The signed-out box is `relative min-h-dvh overflow-hidden`. In standalone mode iOS does not size the viewport units (`vh` / `dvh`) to the real screen when `viewport-fit=cover` is set, so the box is shorter than the screen and the document does not match it. The stage (GrowthLineStage or an app's own canvas) sizes itself to that box, so it stops short too. Reports: WebKit 237961 and 316008, ymichael/bb#871.

Measured in a phone-sized Chromium browser (390×844): box 844, canvas 844, document 844, no scroll. The bug only shows in standalone, which is why a browser check passes.

## Change
- Pin the signed-out box to the screen instead of sizing it by viewport units: `fixed inset-0` (or `inset-y-0 right-0 left-[var(--kol-shell-rail-width)]` if a rail can show beside it). A fixed box takes the screen's real size, adds no document height, and ignores body padding (fxr pads `body` by the top safe area in standalone).
- `overflow-hidden` stays. The stage's `absolute inset-0` wrapper, the logomark, the +, the dock, the sign-in column and the phone form keep their offsets, which are relative to the box.

## Acceptance
- iPhone home-screen app, signed out: the stage covers the whole screen, under the status bar included; nothing scrolls; no band under the dock.
- Desktop and phone Safari unchanged: the same 64 gutter, the sign-in column slides as before, and the stage stays centred.

## ✅ RESOLUTION — 2026-11-03

Shipped in **@kolkrabbi/kol-shell 0.99.2**. The signed-out box (HubHome.jsx:303) is `fixed inset-y-0 right-0 left-[var(--kol-shell-rail-width)] overflow-hidden` instead of `relative min-h-dvh overflow-hidden`. The rail form, not plain `inset-0`, because `\` can bring the rail back beside the signed-out Home; AppShell sets the variable to 0 while the rail is hidden, so the box starts at the screen's edge. Every child's offsets are unchanged. Checked on studio-hub: 390×844 box 0,0,390,844, document 844, no scroll; 1440×900 box full-screen, mark 64/64, + 64 in, dock 64/64, sign-in column 672 × 900; `\` moves the box's left edge to 48.
